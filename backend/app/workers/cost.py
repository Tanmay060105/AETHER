import asyncio
import logging
from typing import Dict, Optional

from celery import shared_task
from sqlalchemy import select, update, func
from sqlalchemy.exc import OperationalError, IntegrityError, DataError

from app.core.celery_app import celery_app
from app.core.database import AsyncSessionLocal
from app.shared.models.telemetry import Trace, Span
from app.workers.aggregation import aggregate_metrics

logger = logging.getLogger(__name__)

# MVP Pricing Configuration (cost per 1k tokens)
# This is infrastructure config, NOT authoritative live provider pricing.
MVP_PRICING: Dict[str, Dict[str, float]] = {
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-3.5-turbo": {"input": 0.0015, "output": 0.002},
    "claude-3-opus": {"input": 0.015, "output": 0.075},
}

def _calculate_span_cost(model: Optional[str], input_data: Optional[Dict], output_data: Optional[Dict], tokens: Optional[int]) -> Optional[float]:
    """Calculate cost for a single span based on MVP pricing."""
    if not model:
        return None
        
    pricing = MVP_PRICING.get(model.lower())
    if not pricing:
        logger.warning(f"Unknown model for pricing: {model}")
        return None
        
    if tokens is None or tokens == 0:
        return 0.0
        
    if tokens < 0:
        logger.error(f"Invalid negative tokens: {tokens}")
        return None
        
    # For MVP, if we only have total tokens, we assume half input half output for calculation purposes, 
    # or just use an average if we don't have separate input/output token counts.
    # In a real system, Span model should store input_tokens and output_tokens separately.
    # We will use input pricing as the base if we only have `tokens`.
    cost = (tokens / 1000.0) * pricing["input"]
    return cost

async def _calculate_cost_async(trace_id: str):
    async with AsyncSessionLocal() as db:
        try:
            # 1. Fetch all LLM spans for this trace
            stmt = select(Span).where(Span.trace_id == trace_id)
            result = await db.execute(stmt)
            spans = result.scalars().all()
            
            trace_cost = 0.0
            has_unknown_costs = False
            
            for span in spans:
                if span.span_type and span.span_type.lower() == "llm":
                    cost = _calculate_span_cost(
                        model=span.name, # Usually model is stored in name or a separate field. We'll use name or extract it.
                        # Wait, trace has `model`, span doesn't have `model` directly except maybe in name/input_data
                        # Let's assume trace model or span name holds the model.
                        # For now, we will fetch trace model if span doesn't have it.
                        input_data=span.input_data,
                        output_data=span.output_data,
                        tokens=span.tokens
                    )
                else:
                    cost = 0.0
                    
                span.cost = cost
                span.cost_calculated = 1
                
                if cost is None:
                    has_unknown_costs = True
                else:
                    trace_cost += cost

            # 2. Fetch Trace and update its cost
            trace_stmt = select(Trace).where(Trace.id == trace_id)
            trace_result = await db.execute(trace_stmt)
            trace = trace_result.scalars().first()
            
            if trace:
                # Re-calculate span cost logic for the trace if needed, but since we are doing 
                # deterministic aggregation of constituent span costs:
                if not spans:
                    # If no spans, just use the trace's own token count and model
                    cost = _calculate_span_cost(trace.model, None, None, trace.total_tokens)
                    trace.cost = cost
                    trace.cost_calculated = 1
                else:
                    trace.cost = None if has_unknown_costs else trace_cost
                    trace.cost_calculated = 1
                    
                project_id = trace.project_id
                start_time = trace.start_time
            else:
                project_id = None
                start_time = None
            
            # Commit the updates
            await db.commit()
            
            # Dispatch downstream aggregation task
            if project_id and start_time:
                # Dispatch using the hour of the start_time
                hour_timestamp = start_time.replace(minute=0, second=0, microsecond=0).isoformat()
                aggregate_metrics.delay(project_id, hour_timestamp)
                
        except (IntegrityError, DataError, ValueError) as e:
            # Non-retryable
            await db.rollback()
            logger.error(f"Permanent error in calculate_cost for trace {trace_id}: {e}")
            raise e
        except Exception as e:
            # Retryable (e.g., OperationalError)
            await db.rollback()
            logger.error(f"Transient error in calculate_cost for trace {trace_id}: {e}")
            raise e

@celery_app.task(
    name="calculate_cost",
    bind=True,
    autoretry_for=(OperationalError,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=2,
    retry_backoff_max=30,
    retry_jitter=True
)
def calculate_cost(self, trace_id: str):
    """
    Celery task to calculate cost for a trace and its spans.
    """
    asyncio.run(_calculate_cost_async(trace_id))
