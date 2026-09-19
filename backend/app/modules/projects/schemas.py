from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class ProjectCreate(BaseModel):
    name: str

class ProjectResponse(BaseModel):
    id: UUID
    organization_id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)

class ObserveMetricsResponse(BaseModel):
    request_count: int
    error_count: int
    error_rate: float
    avg_latency_ms: float
    total_tokens: int
    total_cost: float

class TimeseriesBucket(BaseModel):
    timestamp: datetime
    request_count: int
    error_count: int
    error_rate: float
    avg_latency_ms: float
    total_tokens: int
    total_cost: float

class ObserveTimeseriesResponse(BaseModel):
    interval: str
    data: List[TimeseriesBucket]

class ObserveFiltersResponse(BaseModel):
    models: List[str]
    environments: List[str]

class ObserveRecentTrace(BaseModel):
    timestamp: datetime
    trace_id: UUID
    status: str
    latency_ms: float
    model: str | None = None

class ObserveRecentTracesResponse(BaseModel):
    traces: List[ObserveRecentTrace]
