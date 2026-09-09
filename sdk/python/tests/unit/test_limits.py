import pytest
import aether
from aether import client
from aether.models import SpanData

@pytest.fixture(autouse=True)
def cleanup():
    aether.initialize(api_key="fake", project_id="fake")
    client._config.disabled = False
    yield
    aether.shutdown()

def test_metadata_keys_limit():
    data = {f"k{i}": i for i in range(30)}
    with aether.create_trace("test"):
        with aether.create_span("test") as span:
            aether.track_tool_call("tool", data)
            
    # Trace was sent to queue
    t = client._queue.q.get(timeout=1.0)
    span_data = t["spans"][1] # first is 'test', second is 'tool'
    assert len(span_data["input_data"]) == client._config.max_meta_keys

def test_metadata_string_limit():
    long_str = "a" * 2000
    with aether.create_trace("test"):
        with aether.create_span("test") as span:
            aether.track_tool_call("tool", long_str)
            
    t = client._queue.q.get(timeout=1.0)
    span_data = t["spans"][1]
    assert len(span_data["input_data"]) == client._config.max_meta_string_len + len("... [truncated]")

def test_llm_string_limit():
    client._config.max_event_bytes = 2_000_000 # Prevent drop due to total event size
    long_str = "a" * 600_000
    with aether.create_trace("test"):
        aether.track_llm_call("gpt", input_data=long_str, output_data=long_str)
            
    t = client._queue.q.get(timeout=1.0)
    span_data = t["spans"][0]
    assert len(span_data["input_data"]) == client._config.max_string_len + len("... [truncated]")
    assert len(span_data["output_data"]) == client._config.max_string_len + len("... [truncated]")

def test_traceback_truncation():
    try:
        raise Exception("a" * 20_000)
    except Exception as e:
        with aether.create_trace("test"):
            aether.record_error(e)
            
    t = client._queue.q.get(timeout=1.0)
    assert len(t["error_message"]) == client._config.max_traceback_len

def test_event_size_limit():
    client._config.max_event_bytes = 100
    long_str = "a" * 200
    # Bypass serialization limit by injecting directly to trace
    with aether.create_trace("test") as trace:
        from aether.models import SpanData
        trace.spans.append(SpanData(trace_id=trace.id, name="huge", input_data=long_str, start_time="now"))
        
    # Queue should drop it
    import queue
    with pytest.raises(queue.Empty):
        client._queue.q.get(timeout=0.1)
    assert client._queue.dropped_events >= 1
