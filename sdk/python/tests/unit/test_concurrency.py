import pytest
import threading
import asyncio
import aether
from aether import client

@pytest.fixture(autouse=True)
def cleanup():
    aether.initialize(api_key="fake", project_id="fake")
    client._config.disabled = False
    yield
    aether.shutdown()

def test_contextvars_propagation():
    with aether.create_trace("root") as trace:
        with aether.create_span("child1") as span1:
            pass
        with aether.create_span("child2") as span2:
            pass
            
        assert len(trace.spans) == 2
        assert trace.spans[0].parent_span_id is None

def test_concurrent_threads():
    results = []
    
    def worker(name):
        with aether.create_trace(name) as trace:
            trace.model = name
            with aether.create_span("span"):
                pass
            results.append(trace.model)
            
    threads = [threading.Thread(target=worker, args=(f"thread-{i}",)) for i in range(5)]
    for t in threads: t.start()
    for t in threads: t.join()
    
    assert len(results) == 5
    assert set(results) == {f"thread-{i}" for i in range(5)}
    
@pytest.mark.asyncio
async def test_async_concurrent_execution():
    async def worker(name):
        with aether.create_trace(name) as trace:
            trace.model = name
            with aether.create_span("span"):
                await asyncio.sleep(0.01)
            return trace.model
            
    results = await asyncio.gather(*(worker(f"async-{i}") for i in range(5)))
    assert set(results) == {f"async-{i}" for i in range(5)}
