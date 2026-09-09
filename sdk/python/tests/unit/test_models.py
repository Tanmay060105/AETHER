import pytest
import datetime
from aether.models import TraceData, SpanData, safe_serialize_metadata

class UnserializableObject:
    def __str__(self):
        return "Unserializable!"

def test_safe_serialize_metadata():
    data = {
        "ok": "string",
        "nested": {"key": 123},
        "bad": UnserializableObject(),
        "long": "a" * 2000
    }
    serialized = safe_serialize_metadata(data)
    
    assert serialized["ok"] == "string"
    assert serialized["nested"]["key"] == 123
    assert serialized["bad"] == "Unserializable!"
    assert len(serialized["long"]) == 1000 + len("... [truncated]")

def test_span_serialization():
    span = SpanData(
        trace_id="123",
        name="test_span",
        start_time=datetime.datetime.now().isoformat(),
        input_data={"test": UnserializableObject()}
    )
    d = span.serialize()
    assert d["input_data"]["test"] == "Unserializable!"
    assert d["id"] is not None
    assert "parent_span_id" not in d # excluded none
