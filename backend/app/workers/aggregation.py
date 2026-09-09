import asyncio
import logging
from datetime import datetime

from celery import shared_task
from sqlalchemy import select, func
from sqlalchemy.exc import OperationalError, IntegrityError, DataError
from sqlalchemy.dialects.postgresql import insert

from app.core.celery_app import celery_app
from app.core.database import AsyncSessionLocal
from app.shared.models.telemetry import Trace, UsageRecord

logger = logging.getLogger(__name__)

async def _aggregate_metrics_async(project_id: str, hour_timestamp: str):
    async with AsyncSessionLocal() as db:
        try:
            target_hour = datetime.fromisoformat(hour_timestamp)
            next_hour = target_hour.replace(hour=target_hour.hour + 1) if target_hour.hour < 23 else target_hour.replace(day=target_hour.day + 1, hour=0)
            
            # Deterministic Aggregation Query
            # We sum cost and tokens, and count traces for the given hour.
            # We use Postgres safe aggregation to avoid double-counting on retry.
            stmt = select(
                func.count(Trace.id).label("total_requests"),
                func.sum(Trace.total_tokens).label("total_tokens"),
                func.sum(Trace.cost).label("total_cost")
            ).where(
                Trace.project_id == project_id,
                Trace.start_time >= target_hour,
                Trace.start_time < next_hour
            )
            
            result = await db.execute(stmt)
            row = result.first()
            
            if row and row.total_requests > 0:
                total_tokens = int(row.total_tokens) if row.total_tokens else 0
                total_cost = float(row.total_cost) if row.total_cost else 0.0
                
                # UPSERT UsageRecord
                upsert_stmt = insert(UsageRecord).values(
                    project_id=project_id,
                    date=target_hour,
                    total_tokens=total_tokens,
                    total_cost=total_cost
                ).on_conflict_do_update(
                    index_elements=["project_id", "date"],
                    set_={
                        "total_tokens": total_tokens,
                        "total_cost": total_cost
                    }
                )
                
                await db.execute(upsert_stmt)
                await db.commit()
            
        except (IntegrityError, DataError, ValueError) as e:
            # Non-retryable
            await db.rollback()
            logger.error(f"Permanent error in aggregate_metrics for project {project_id}: {e}")
            raise e
        except Exception as e:
            # Retryable (e.g., OperationalError)
            await db.rollback()
            logger.error(f"Transient error in aggregate_metrics for project {project_id}: {e}")
            raise e

@celery_app.task(
    name="aggregate_metrics",
    bind=True,
    autoretry_for=(OperationalError,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=2,
    retry_backoff_max=30,
    retry_jitter=True
)
def aggregate_metrics(self, project_id: str, hour_timestamp: str):
    """
    Celery task to deterministically aggregate metrics for a project in a specific hour window.
    """
    asyncio.run(_aggregate_metrics_async(project_id, hour_timestamp))
