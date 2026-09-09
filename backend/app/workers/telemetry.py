import asyncio
from datetime import datetime
from typing import Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert
import logging

from app.core.celery_app import celery_app
from app.core.database import AsyncSessionLocal
from app.shared.models.telemetry import Trace, Span

logger = logging.getLogger(__name__)

from sqlalchemy.exc import OperationalError, IntegrityError, DataError

async def _process_telemetry_batch_async(project_id: str, batch_dict: Dict[str, Any], ingestion_id: str):
    async with AsyncSessionLocal() as db:
        try:
            dispatched_traces = set()
            for trace_data in batch_dict.get("traces", []):
                # Calculate latency
                start_time = datetime.fromisoformat(trace_data["start_time"].replace("Z", "+00:00"))
                end_time = datetime.fromisoformat(trace_data["end_time"].replace("Z", "+00:00")) if trace_data.get("end_time") else None
                latency_ms = (end_time - start_time).total_seconds() * 1000 if end_time else None
                
                # Upsert Trace
                trace_values = {
                    "id": trace_data["id"],
                    "project_id": project_id,
                    "status": trace_data.get("status", "success"),
                    "model": trace_data.get("model"),
                    "start_time": start_time,
                    "end_time": end_time,
                    "latency_ms": latency_ms,
                    "error_message": trace_data.get("error_message")
                }
                
                stmt = insert(Trace).values(**trace_values)
                # On conflict, update the real trace data so placeholder is overwritten
                stmt = stmt.on_conflict_do_update(
                    index_elements=["id"],
                    set_={
                        "project_id": stmt.excluded.project_id,
                        "status": stmt.excluded.status,
                        "model": stmt.excluded.model,
                        "start_time": stmt.excluded.start_time,
                        "end_time": stmt.excluded.end_time,
                        "latency_ms": stmt.excluded.latency_ms,
                        "error_message": stmt.excluded.error_message
                    }
                )
                await db.execute(stmt)
                
                # Upsert Spans
                for span_data in trace_data.get("spans", []):
                    span_start_time = datetime.fromisoformat(span_data["start_time"].replace("Z", "+00:00"))
                    span_end_time = datetime.fromisoformat(span_data["end_time"].replace("Z", "+00:00")) if span_data.get("end_time") else None
                    span_latency_ms = (span_end_time - span_start_time).total_seconds() * 1000 if span_end_time else None
                    
                    # If this span has a parent, ensure the parent placeholder exists
                    if span_data.get("parent_span_id"):
                        parent_stmt = insert(Span).values(
                            id=span_data["parent_span_id"],
                            trace_id=trace_data["id"],
                            span_type="unknown",
                            name="placeholder",
                            status="pending",
                            start_time=span_start_time,
                            end_time=span_start_time
                        ).on_conflict_do_nothing(index_elements=["id"])
                        await db.execute(parent_stmt)

                    span_values = {
                        "id": span_data["id"],
                        "trace_id": trace_data["id"],
                        "parent_span_id": span_data.get("parent_span_id"),
                        "span_type": span_data.get("span_type", "custom"),
                        "name": span_data["name"],
                        "status": span_data.get("status", "success"),
                        "start_time": span_start_time,
                        "end_time": span_end_time,
                        "latency_ms": span_latency_ms,
                        "input_data": span_data.get("input_data"),
                        "output_data": span_data.get("output_data"),
                        "tokens": span_data.get("tokens", 0),
                        "error_message": span_data.get("error_message")
                    }
                    
                    span_stmt = insert(Span).values(**span_values)
                    span_stmt = span_stmt.on_conflict_do_update(
                        index_elements=["id"],
                        set_={
                            "trace_id": span_stmt.excluded.trace_id,
                            "parent_span_id": span_stmt.excluded.parent_span_id,
                            "span_type": span_stmt.excluded.span_type,
                            "name": span_stmt.excluded.name,
                            "status": span_stmt.excluded.status,
                            "start_time": span_stmt.excluded.start_time,
                            "end_time": span_stmt.excluded.end_time,
                            "latency_ms": span_stmt.excluded.latency_ms,
                            "input_data": span_stmt.excluded.input_data,
                            "output_data": span_stmt.excluded.output_data,
                            "tokens": span_stmt.excluded.tokens,
                            "error_message": span_stmt.excluded.error_message
                        }
                    )
                    await db.execute(span_stmt)
                    
                dispatched_traces.add(trace_data["id"])
            
            await db.commit()
            logger.info(f"Successfully processed ingestion batch {ingestion_id}")
            
            # Dispatch downstream processing tasks
            for trace_id in dispatched_traces:
                celery_app.send_task("calculate_cost", args=[trace_id])
                
        except (IntegrityError, DataError, ValueError) as e:
            await db.rollback()
            logger.error(f"Permanent error processing telemetry batch {ingestion_id}: {e}")
            raise e
        except Exception as e:
            await db.rollback()
            logger.error(f"Transient error processing telemetry batch {ingestion_id}: {e}")
            raise e

@celery_app.task(
    name="process_telemetry_batch",
    bind=True,
    autoretry_for=(OperationalError,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=2,
    retry_backoff_max=30,
    retry_jitter=True
)
def process_telemetry_batch(self, project_id: str, batch_dict: Dict[str, Any], ingestion_id: str):
    """
    Celery task to asynchronously process and persist a batch of telemetry data.
    """
    asyncio.run(_process_telemetry_batch_async(project_id, batch_dict, ingestion_id))
