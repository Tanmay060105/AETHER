import pytest
import time
import aether
from aether import client
from aether.queue import BackgroundQueue
from aether.config import SDKConfig

@pytest.fixture(autouse=True)
def cleanup():
    aether.initialize(api_key="fake", project_id="fake")
    client._config.disabled = False
    yield
    aether.shutdown()

def test_batch_size_limit():
    client._config.max_batch_size = 10
    
    batches_sent = []
    def mock_export(batch):
        batches_sent.append(len(batch))
        return True
        
    client._queue.exporter.export_batch = mock_export
    
    for i in range(15):
        with aether.create_trace(f"t{i}"): pass
            
    time.sleep(1.1)
    
    # It should have sent at least one batch of 10
    assert 10 in batches_sent
    # And maybe a batch of 5
    assert sum(batches_sent) == 15

def test_shutdown_deadline():
    def mock_export(batch):
        time.sleep(10)
        return True
        
    client._queue.exporter.export_batch = mock_export
    client._config.flush_timeout_sec = 0.5
    
    with aether.create_trace("test"): pass
        
    start = time.time()
    aether.shutdown()
    duration = time.time() - start
    
    assert duration < 1.0 # Should be ~0.5s, well within 1.0s
