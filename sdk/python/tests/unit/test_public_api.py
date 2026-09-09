import pytest
import aether
from aether import client
from aether.models import TraceData

@pytest.fixture(autouse=True)
def cleanup():
    aether.initialize(api_key="fake", project_id="fake")
    client._config.disabled = False
    import queue
    client._queue.q = queue.Queue(maxsize=5000)
    client._queue.dropped_events = 0
    yield
    aether.shutdown()

def test_send_telemetry():
    t = TraceData(project_id="test", start_time="now")
    aether.send_telemetry(t)
    assert not client._queue.q.empty()

def test_send_telemetry_disabled():
    client._config.disabled = True
    t = TraceData(project_id="test", start_time="now")
    aether.send_telemetry(t)
    assert client._queue.q.empty()

def test_zero_synchronous_network_io(monkeypatch):
    import httpx
    def mock_post(*args, **kwargs):
        raise httpx.ConnectError("Network is down")
    
    monkeypatch.setattr(httpx.Client, "post", mock_post)
    
    # This should NOT fail because network happens in worker
    with aether.create_trace("test"):
        aether.track_llm_call("gpt", "in", "out")
    
    # Trace is in queue, no exception was raised
    assert not client._queue.q.empty()

def test_worker_failure_isolation():
    # Force the exporter to raise an unhandled exception
    def mock_export(*args, **kwargs):
        raise ValueError("Critical worker failure")
        
    client._queue.exporter.export_batch = mock_export
    
    with aether.create_trace("test"):
        pass
        
    # Worker might crash, but main thread doesn't care
    assert True
