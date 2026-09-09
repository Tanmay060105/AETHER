import asyncio
import logging

from celery import shared_task
from sqlalchemy import select
from sqlalchemy.exc import OperationalError

from app.core.celery_app import celery_app
from app.core.database import AsyncSessionLocal
from app.shared.models.telemetry import Trace

logger = logging.getLogger(__name__)

async def _sweep_unprocessed_telemetry_async():
    async with AsyncSessionLocal() as db:
        try:
            # We want to find traces that:
            # 1. Have end_time NOT NULL (meaning they are completed, not just a placeholder)
            # 2. Have cost_calculated == 0 (meaning calculate_cost never succeeded)
            stmt = select(Trace.id).where(
                Trace.end_time.is_not(None),
                Trace.cost_calculated == 0
            ).limit(1000) # Process in batches
            
            result = await db.execute(stmt)
            trace_ids = result.scalars().all()
            
            for trace_id in trace_ids:
                # Dispatch downstream to processing queue via celery_app.send_task to avoid circular imports
                celery_app.send_task("calculate_cost", args=[trace_id])
                
            if trace_ids:
                logger.info(f"Swept {len(trace_ids)} unprocessed traces and dispatched for processing.")
                
        except Exception as e:
            logger.error(f"Transient error in sweeper task: {e}")
            raise e

@celery_app.task(
    name="sweep_unprocessed_telemetry",
    bind=True,
    autoretry_for=(OperationalError,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=2,
    retry_backoff_max=30,
    retry_jitter=True
)
def sweep_unprocessed_telemetry(self):
    """
    Celery Beat task to sweep and dispatch traces that were inserted but never processed for cost/aggregation.
    """
    asyncio.run(_sweep_unprocessed_telemetry_async())
