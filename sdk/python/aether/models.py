import json
import uuid
import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from aether.config import SDKConfig

config = SDKConfig()

def safe_truncate(val: str, max_len: int) -> str:
    """Truncates string to max_len bytes safely."""
    if not isinstance(val, str):
        val = str(val)
    if len(val) > max_len:
        return val[:max_len] + "... [truncated]"
    return val

def safe_serialize_metadata(data: Any, max_string_len: int = 1000) -> Any:
    """Recursively serializes and truncates metadata dicts."""
    if isinstance(data, dict):
        result = {}
        for k, v in list(data.items())[:config.max_meta_keys]:
            result[k] = safe_serialize_metadata(v, max_string_len)
        return result
    elif isinstance(data, list):
        return [safe_serialize_metadata(item, max_string_len) for item in data[:config.max_meta_keys]]
    elif isinstance(data, (int, float, bool, type(None))):
        return data
    else:
        return safe_truncate(str(data), max_string_len)

class SpanData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trace_id: str
    parent_span_id: Optional[str] = None
    span_type: str = "custom"
    name: str
    status: str = "success"
    start_time: str
    end_time: Optional[str] = None
    input_data: Optional[Any] = None
    output_data: Optional[Any] = None
    tokens: int = 0
    error_message: Optional[str] = None

    def serialize(self) -> Dict[str, Any]:
        d = self.model_dump(exclude_none=True)
        max_len = config.max_string_len if self.span_type == "LLM" else config.max_meta_string_len
        if 'input_data' in d:
            d['input_data'] = safe_serialize_metadata(d['input_data'], max_len)
        if 'output_data' in d:
            d['output_data'] = safe_serialize_metadata(d['output_data'], max_len)
        return d

class TraceData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    status: str = "success"
    model: Optional[str] = None
    start_time: str
    end_time: Optional[str] = None
    error_message: Optional[str] = None
    spans: List[SpanData] = Field(default_factory=list)

    def serialize(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "project_id": self.project_id,
            "status": self.status,
            "model": self.model,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "error_message": self.error_message,
            "spans": [s.serialize() for s in self.spans]
        }
