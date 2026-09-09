import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_ingest_telemetry_missing_auth():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/ingest", json={"traces": []})
    assert response.status_code == 401
    assert "Missing or invalid Authorization header" in response.json()["detail"]

@pytest.mark.asyncio
async def test_ingest_telemetry_invalid_auth(mocker):
    # Mock verify_api_key to return None
    mocker.patch("app.modules.ingestion.router.verify_api_key", return_value=None)
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/ingest", json={"traces": []}, headers={"Authorization": "Bearer invalid_key"})
    assert response.status_code == 401
    assert "Invalid API Key" in response.json()["detail"]

@pytest.mark.asyncio
async def test_ingest_telemetry_invalid_payload(mocker):
    mocker.patch("app.modules.ingestion.router.verify_api_key", return_value="project_123")
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Invalid payload: missing id in trace
        payload = {"traces": [{"project_id": "project_123", "start_time": "2024-01-01T00:00:00Z"}]}
        response = await ac.post("/api/v1/ingest", json=payload, headers={"Authorization": "Bearer valid_key"})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_ingest_telemetry_success(mocker):
    mocker.patch("app.modules.ingestion.router.verify_api_key", return_value="project_123")
    mocker.patch("app.modules.ingestion.router.check_rate_limit", return_value=None)
    mock_delay = mocker.patch("app.workers.telemetry.process_telemetry_batch.delay")
    
    payload = {
        "traces": [
            {
                "id": "trace_1",
                "project_id": "project_123",
                "start_time": "2024-01-01T00:00:00Z"
            }
        ]
    }
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/ingest", json=payload, headers={"Authorization": "Bearer valid_key"})
        
    assert response.status_code == 202
    data = response.json()
    assert data["status"] == "accepted"
    assert "ingestion_id" in data
    
    mock_delay.assert_called_once()
    args = mock_delay.call_args[0]
    assert args[0] == "project_123"
    assert args[1]["traces"][0]["id"] == "trace_1"
    assert args[1]["traces"][0]["project_id"] == "project_123"
    assert args[2] == data["ingestion_id"]
