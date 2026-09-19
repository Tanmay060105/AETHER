from unittest.mock import AsyncMock, patch, MagicMock

import pytest
from sqlalchemy.exc import OperationalError

from app.workers.sweeper import _sweep_unprocessed_telemetry_async

@pytest.mark.asyncio
@patch("app.workers.sweeper.async_sessionmaker")
@patch("app.workers.sweeper.create_async_engine")
@patch("app.workers.sweeper.celery_app.send_task")
async def test_sweep_unprocessed_telemetry_async_success(mock_send_task, mock_create_engine, mock_sessionmaker):
    mock_db = AsyncMock()
    mock_sessionmaker.return_value.return_value.__aenter__.return_value = mock_db
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = ["trace-1", "trace-2"]
    
    mock_db.execute.return_value = mock_result
    
    await _sweep_unprocessed_telemetry_async()
    
    assert mock_send_task.call_count == 2
    mock_send_task.assert_any_call("calculate_cost", args=["trace-1"])
    mock_send_task.assert_any_call("calculate_cost", args=["trace-2"])

@pytest.mark.asyncio
@patch("app.workers.sweeper.async_sessionmaker")
@patch("app.workers.sweeper.create_async_engine")
@patch("app.workers.sweeper.celery_app.send_task")
async def test_sweep_unprocessed_telemetry_async_no_data(mock_send_task, mock_create_engine, mock_sessionmaker):
    mock_db = AsyncMock()
    mock_sessionmaker.return_value.return_value.__aenter__.return_value = mock_db
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = []
    
    mock_db.execute.return_value = mock_result
    
    await _sweep_unprocessed_telemetry_async()
    
    assert mock_send_task.call_count == 0

@pytest.mark.asyncio
@patch("app.workers.sweeper.async_sessionmaker")
@patch("app.workers.sweeper.create_async_engine")
async def test_sweep_unprocessed_telemetry_async_operational_error(mock_create_engine, mock_sessionmaker):
    mock_db = AsyncMock()
    mock_sessionmaker.return_value.return_value.__aenter__.return_value = mock_db
    
    mock_db.execute.side_effect = OperationalError("statement", "params", "orig")
    
    with pytest.raises(OperationalError):
        await _sweep_unprocessed_telemetry_async()
