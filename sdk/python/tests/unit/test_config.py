import pytest
import aether
from aether.exceptions import InitializationError

def test_config_missing_api_key():
    aether.shutdown()
    with pytest.raises(InitializationError):
        aether.initialize(api_key=None, project_id="proj")

def test_config_blank_api_key():
    aether.shutdown()
    with pytest.raises(InitializationError):
        aether.initialize(api_key="", project_id="proj")

def test_config_missing_project_id():
    aether.shutdown()
    with pytest.raises(InitializationError):
        aether.initialize(api_key="key", project_id=None)

def test_config_valid():
    aether.shutdown()
    aether.initialize(api_key="key", project_id="proj")
    assert aether.client._initialized is True
    assert aether.client._config.api_key == "key"

def test_config_disabled(monkeypatch):
    aether.shutdown()
    monkeypatch.setenv("AETHER_SDK_DISABLED", "1")
    aether.initialize(api_key=None, project_id=None)
    assert aether.client._initialized is True
    assert aether.client._config.disabled is True
    assert aether.client._queue is None
