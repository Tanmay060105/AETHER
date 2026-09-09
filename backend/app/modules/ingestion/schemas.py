from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, constr, model_validator
from datetime import datetime

class IngestSpanData(BaseModel):
    id: str = Field(..., max_length=36)
    trace_id: str = Field(..., max_length=36)
    parent_span_id: Optional[str] = Field(None, max_length=36)
    span_type: str = Field(default="custom", max_length=50)
    name: str = Field(..., max_length=255)
    status: str = Field(default="success", max_length=50)
    start_time: str
    end_time: Optional[str] = None
    input_data: Optional[Any] = None
    output_data: Optional[Any] = None
    tokens: int = Field(default=0, ge=0)
    error_message: Optional[str] = Field(None, max_length=2000)

class IngestTraceData(BaseModel):
    id: str = Field(..., max_length=36)
    project_id: str = Field(..., max_length=36)
    status: str = Field(default="success", max_length=50)
    model: Optional[str] = Field(None, max_length=255)
    start_time: str
    end_time: Optional[str] = None
    error_message: Optional[str] = Field(None, max_length=2000)
    spans: List[IngestSpanData] = Field(default_factory=list, max_length=1000)

class IngestBatch(BaseModel):
    traces: List[IngestTraceData] = Field(..., max_length=100)
