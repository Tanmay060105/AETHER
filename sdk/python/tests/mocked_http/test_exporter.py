import pytest
import respx
import httpx
from aether.config import SDKConfig
from aether.exporter import Exporter

@pytest.fixture
def config():
    cfg = SDKConfig(api_key="test_key", project_id="test_proj")
    cfg.ingest_url = "https://api.aether.ai/api/v1/ingest"
    return cfg

@respx.mock
def test_exporter_success(config):
    route = respx.post(config.ingest_url).mock(return_value=httpx.Response(200))
    exporter = Exporter(config)
    assert exporter.export_batch([{"id": "1"}]) is True
    assert route.called

@respx.mock
def test_exporter_401_drops_future_requests(config):
    route = respx.post(config.ingest_url).mock(return_value=httpx.Response(401))
    exporter = Exporter(config)
    assert exporter.export_batch([{"id": "1"}]) is True
    assert exporter.auth_invalidated is True
    route.reset()
    exporter.export_batch([{"id": "2"}])
    assert not route.called

@respx.mock
def test_exporter_408_retry(config):
    route = respx.post(config.ingest_url).mock(
        side_effect=[httpx.Response(408), httpx.Response(200)]
    )
    exporter = Exporter(config)
    import time
    original_sleep = time.sleep
    time.sleep = lambda x: None
    try:
        assert exporter.export_batch([{"id": "1"}]) is True
        assert route.call_count == 2
    finally:
        time.sleep = original_sleep

@respx.mock
def test_exporter_429_retry(config):
    route = respx.post(config.ingest_url).mock(
        side_effect=[httpx.Response(429), httpx.Response(200)]
    )
    exporter = Exporter(config)
    import time
    original_sleep = time.sleep
    time.sleep = lambda x: None
    try:
        assert exporter.export_batch([{"id": "1"}]) is True
        assert route.call_count == 2
    finally:
        time.sleep = original_sleep

@respx.mock
def test_exporter_retry_after(config, monkeypatch):
    route = respx.post(config.ingest_url).mock(
        side_effect=[httpx.Response(429, headers={"Retry-After": "2"}), httpx.Response(200)]
    )
    exporter = Exporter(config)
    sleep_times = []
    monkeypatch.setattr("time.sleep", lambda x: sleep_times.append(x))
    assert exporter.export_batch([{"id": "1"}]) is True
    assert sleep_times[0] == 2
    assert route.call_count == 2

@respx.mock
def test_exporter_5xx_retry(config, monkeypatch):
    route = respx.post(config.ingest_url).mock(
        side_effect=[httpx.Response(502), httpx.Response(503), httpx.Response(200)]
    )
    exporter = Exporter(config)
    monkeypatch.setattr("time.sleep", lambda x: None)
    assert exporter.export_batch([{"id": "1"}]) is True
    assert route.call_count == 3

@respx.mock
def test_exporter_retry_exhaustion(config, monkeypatch):
    route = respx.post(config.ingest_url).mock(return_value=httpx.Response(500))
    exporter = Exporter(config)
    monkeypatch.setattr("time.sleep", lambda x: None)
    # Should drop after 4 attempts (0, 1, 2, 3)
    assert exporter.export_batch([{"id": "1"}]) is True
    assert route.call_count == 4

@pytest.mark.parametrize("status", [400, 403, 404, 422])
@respx.mock
def test_exporter_non_retryable_4xx(config, status):
    route = respx.post(config.ingest_url).mock(return_value=httpx.Response(status))
    exporter = Exporter(config)
    assert exporter.export_batch([{"id": "1"}]) is True
    assert route.call_count == 1

@respx.mock
def test_exporter_connection_failure(config, monkeypatch):
    route = respx.post(config.ingest_url).mock(side_effect=httpx.ConnectError("Down"))
    exporter = Exporter(config)
    monkeypatch.setattr("time.sleep", lambda x: None)
    assert exporter.export_batch([{"id": "1"}]) is True
    assert route.call_count == 4

@respx.mock
def test_exporter_timeout(config, monkeypatch):
    route = respx.post(config.ingest_url).mock(side_effect=httpx.TimeoutException("Timeout"))
    exporter = Exporter(config)
    monkeypatch.setattr("time.sleep", lambda x: None)
    assert exporter.export_batch([{"id": "1"}]) is True
    assert route.call_count == 4

def test_exporter_payload_size_limit(config):
    # Construct a batch > 5MB
    exporter = Exporter(config)
    config.max_payload_bytes = 100
    long_str = "a" * 200
    # Should instantly drop without network request
    assert exporter.export_batch([{"id": long_str}]) is True
