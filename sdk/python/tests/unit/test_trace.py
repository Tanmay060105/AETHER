import pytest
import time
import aether
from aether import client
from aether.config import SDKConfig

@pytest.fixture(autouse=True)
def cleanup_sdk():
    yield
    aether.shutdown()

def test_uninitialized_noop():
    # Should not throw any errors when uninitialized
    with aether.create_trace("test"):
        with aether.create_span("test_span"):
            aether.track_llm_call("gpt-4", {}, {})
            aether.track_tool_call("tool", {})

def test_disabled_sdk():
    aether.initialize(api_key="fake", project_id="fake")
    client._config.disabled = True
    
    # Should no-op
    with aether.create_trace("test") as trace:
        assert trace is None

def test_trace_context():
    aether.initialize(api_key="fake", project_id="fake")
    # Reset queue for testing so we can inspect
    import queue
    client._queue.q = queue.Queue(maxsize=10)
    
    with aether.create_trace("test") as trace:
        assert trace.project_id == "fake"
        
        with aether.create_span("child"):
            pass
            
        assert len(trace.spans) == 1
        assert trace.spans[0].name == "child"
        assert trace.spans[0].trace_id == trace.id
        
    # Queue should have received 1 event
    assert not client._queue.q.empty()
    item = client._queue.q.get_nowait()
    assert item["id"] == trace.id
    
def test_record_error():
    aether.initialize(api_key="fake", project_id="fake")
    
    with aether.create_trace("test") as trace:
        try:
            1/0
        except Exception as e:
            aether.record_error(e)
            
        assert trace.status == "failed"
        assert "ZeroDivisionError" in trace.error_message

def test_queue_overflow():
    aether.initialize(api_key="fake", project_id="fake")
    client._config.max_queue_size = 1
    import queue
    client._queue.q = queue.Queue(maxsize=1)
    
    client._queue.q.put_nowait({"fake": "item"})
    
    with aether.create_trace("test") as trace:
        pass
        
    # Dropped
    assert client._queue.dropped_events == 1

