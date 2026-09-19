import logging
from datetime import datetime, timedelta
from typing import Optional, List

from sqlalchemy import select, func, and_, cast, Integer, Float
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.models.telemetry import Trace
from app.modules.projects.schemas import ObserveMetricsResponse, ObserveTimeseriesResponse, TimeseriesBucket, ObserveFiltersResponse

logger = logging.getLogger(__name__)


async def get_metrics(
    db: AsyncSession,
    project_id: str,
    start_time: datetime,
    end_time: datetime,
    model: Optional[str] = None,
    environment: Optional[str] = None
) -> ObserveMetricsResponse:
    query = select(
        func.count(Trace.id).label("request_count"),
        func.sum(cast(Trace.status == "failed", Integer)).label("error_count"),
        func.avg(Trace.latency_ms).label("avg_latency_ms"),
        func.sum(Trace.total_tokens).label("total_tokens"),
        func.sum(Trace.cost).label("total_cost")
    ).where(
        Trace.project_id == project_id,
        Trace.start_time >= start_time,
        Trace.start_time <= end_time
    )

    if model:
        query = query.where(Trace.model == model)
    if environment:
        query = query.where(Trace.environment == environment)

    result = await db.execute(query)
    row = result.first()

    request_count = row.request_count or 0
    error_count = row.error_count or 0
    error_rate = (error_count / request_count) if request_count > 0 else 0.0
    avg_latency_ms = row.avg_latency_ms or 0.0
    total_tokens = row.total_tokens or 0
    total_cost = row.total_cost or 0.0

    return ObserveMetricsResponse(
        request_count=request_count,
        error_count=error_count,
        error_rate=error_rate,
        avg_latency_ms=avg_latency_ms,
        total_tokens=total_tokens,
        total_cost=total_cost
    )


async def get_timeseries(
    db: AsyncSession,
    project_id: str,
    start_time: datetime,
    end_time: datetime,
    interval: str,
    model: Optional[str] = None,
    environment: Optional[str] = None
) -> ObserveTimeseriesResponse:
    # Map frontend intervals to PostgreSQL date_trunc intervals
    interval_map = {"1h": "hour", "1d": "day", "24h": "day", "hour": "hour", "day": "day"}
    pg_interval = interval_map.get(interval)
    if not pg_interval:
        raise ValueError(f"Invalid interval: {interval}")

    # PostgreSQL aggregation
    bucket_expr = func.date_trunc(pg_interval, Trace.start_time)
    
    query = select(
        bucket_expr.label("bucket"),
        func.count(Trace.id).label("request_count"),
        func.sum(cast(Trace.status == "failed", Integer)).label("error_count"),
        func.avg(Trace.latency_ms).label("avg_latency_ms"),
        func.sum(Trace.total_tokens).label("total_tokens"),
        func.sum(Trace.cost).label("total_cost")
    ).where(
        Trace.project_id == project_id,
        Trace.start_time >= start_time,
        Trace.start_time <= end_time
    )

    if model:
        query = query.where(Trace.model == model)
    if environment:
        query = query.where(Trace.environment == environment)

    query = query.group_by(bucket_expr).order_by(bucket_expr)

    result = await db.execute(query)
    rows = result.fetchall()

    db_buckets = {row.bucket.replace(tzinfo=start_time.tzinfo): row for row in rows}

    # Zero-filling logic
    filled_data = []
    
    # Align start_time to bucket boundary
    if pg_interval == "hour":
        current_time = start_time.replace(minute=0, second=0, microsecond=0)
        delta = timedelta(hours=1)
    else: # day
        current_time = start_time.replace(hour=0, minute=0, second=0, microsecond=0)
        delta = timedelta(days=1)

    # Ensure we include the end boundary if needed
    while current_time <= end_time:
        if current_time in db_buckets:
            row = db_buckets[current_time]
            request_count = row.request_count or 0
            error_count = row.error_count or 0
            error_rate = (error_count / request_count) if request_count > 0 else 0.0
            
            bucket = TimeseriesBucket(
                timestamp=current_time,
                request_count=request_count,
                error_count=error_count,
                error_rate=error_rate,
                avg_latency_ms=row.avg_latency_ms or 0.0,
                total_tokens=row.total_tokens or 0,
                total_cost=row.total_cost or 0.0
            )
        else:
            bucket = TimeseriesBucket(
                timestamp=current_time,
                request_count=0,
                error_count=0,
                error_rate=0.0,
                avg_latency_ms=0.0,
                total_tokens=0,
                total_cost=0.0
            )
        filled_data.append(bucket)
        current_time += delta

    return ObserveTimeseriesResponse(
        interval=interval,
        data=filled_data
    )


async def get_filters(
    db: AsyncSession,
    project_id: str
) -> ObserveFiltersResponse:
    # Get distinct models
    models_query = select(Trace.model).where(
        Trace.project_id == project_id,
        Trace.model.is_not(None)
    ).distinct()
    models_result = await db.execute(models_query)
    models = [row[0] for row in models_result.fetchall()]

    # Get distinct environments
    envs_query = select(Trace.environment).where(
        Trace.project_id == project_id,
        Trace.environment.is_not(None)
    ).distinct()
    envs_result = await db.execute(envs_query)
    environments = [row[0] for row in envs_result.fetchall()]

    return ObserveFiltersResponse(
        models=models,
        environments=environments
    )

async def get_recent_traces(
    db: AsyncSession,
    project_id: str
) -> List[Trace]:
    query = select(Trace).where(
        Trace.project_id == project_id
    ).order_by(
        Trace.start_time.desc()
    ).limit(10)

    result = await db.execute(query)
    return list(result.scalars().all())
