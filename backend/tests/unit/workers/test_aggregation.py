from unittest.mock import AsyncMock, patch, MagicMock

import pytest
from sqlalchemy.exc import IntegrityError, OperationalError

from app.workers.aggregation import _aggregate_metrics_async

@pytest.mark.asyncio
@patch("app.workers.aggregation.AsyncSessionLocal")
async def test_aggregate_metrics_async_success(mock_session):
    mock_db = AsyncMock()
    mock_session.return_value.__aenter__.return_value = mock_db
    
    mock_row = MagicMock()
    mock_row.total_requests = 10
    mock_row.total_tokens = 5000
    mock_row.total_cost = 0.15
    
    mock_result = MagicMock()
    mock_result.first.return_value = mock_row
    
    # db.execute will be called twice: once for select, once for upsert
    mock_db.execute.side_effect = [mock_result, None]
    
    await _aggregate_metrics_async("proj-1", "2023-01-01T12:00:00")
    
    assert mock_db.execute.call_count == 2
    mock_db.commit.assert_called_once()

@pytest.mark.asyncio
@patch("app.workers.aggregation.AsyncSessionLocal")
async def test_aggregate_metrics_async_no_data(mock_session):
    mock_db = AsyncMock()
    mock_session.return_value.__aenter__.return_value = mock_db
    
    mock_row = MagicMock()
    mock_row.total_requests = 0
    mock_row.total_tokens = None
    mock_row.total_cost = None
    
    mock_result = MagicMock()
    mock_result.first.return_value = mock_row
    
    mock_db.execute.return_value = mock_result
    
    await _aggregate_metrics_async("proj-1", "2023-01-01T12:00:00")
    
    # execute should only be called once (the select), not the upsert
    assert mock_db.execute.call_count == 1
    mock_db.commit.assert_not_called()

@pytest.mark.asyncio
@patch("app.workers.aggregation.AsyncSessionLocal")
async def test_aggregate_metrics_async_operational_error(mock_session):
    mock_db = AsyncMock()
    mock_session.return_value.__aenter__.return_value = mock_db
    
    mock_db.execute.side_effect = OperationalError("statement", "params", "orig")
    
    with pytest.raises(OperationalError):
        await _aggregate_metrics_async("proj-1", "2023-01-01T12:00:00")
        
    mock_db.rollback.assert_called_once()
