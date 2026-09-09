from unittest.mock import AsyncMock, patch, MagicMock

import pytest
from sqlalchemy.exc import IntegrityError, OperationalError

from app.workers.cost import _calculate_span_cost, calculate_cost, _calculate_cost_async

def test_calculate_span_cost_known_model():
    cost = _calculate_span_cost("gpt-4", None, None, 1000)
    assert cost == 0.03 # 1000 tokens * 0.03/1000

def test_calculate_span_cost_unknown_model():
    cost = _calculate_span_cost("unknown-model", None, None, 1000)
    assert cost is None

def test_calculate_span_cost_zero_tokens():
    cost = _calculate_span_cost("gpt-4", None, None, 0)
    assert cost == 0.0

def test_calculate_span_cost_negative_tokens():
    cost = _calculate_span_cost("gpt-4", None, None, -100)
    assert cost is None

@pytest.mark.asyncio
@patch("app.workers.cost.AsyncSessionLocal")
@patch("app.workers.cost.aggregate_metrics.delay")
async def test_calculate_cost_async_success(mock_delay, mock_session):
    mock_db = AsyncMock()
    mock_session.return_value.__aenter__.return_value = mock_db
    
    # Mock traces and spans
    mock_trace = MagicMock()
    mock_trace.id = "trace-1"
    mock_trace.project_id = "proj-1"
    mock_trace.model = "gpt-4"
    mock_trace.total_tokens = 2000
    from datetime import datetime
    mock_trace.start_time = datetime(2023, 1, 1, 12, 30)
    
    mock_span = MagicMock()
    mock_span.span_type = "llm"
    mock_span.name = "gpt-4"
    mock_span.tokens = 1000
    
    mock_spans_result = MagicMock()
    mock_spans_result.scalars.return_value.all.return_value = [mock_span]
    
    mock_trace_result = MagicMock()
    mock_trace_result.scalars.return_value.first.return_value = mock_trace
    
    # db.execute is called twice: once for spans, once for trace
    mock_db.execute.side_effect = [mock_spans_result, mock_trace_result]
    
    await _calculate_cost_async("trace-1")
    
    assert mock_span.cost == 0.03
    assert mock_span.cost_calculated == 1
    assert mock_trace.cost == 0.03
    assert mock_trace.cost_calculated == 1
    
    mock_db.commit.assert_called_once()
    mock_delay.assert_called_once_with("proj-1", "2023-01-01T12:00:00")

@pytest.mark.asyncio
@patch("app.workers.cost.AsyncSessionLocal")
async def test_calculate_cost_async_operational_error(mock_session):
    mock_db = AsyncMock()
    mock_session.return_value.__aenter__.return_value = mock_db
    
    mock_db.execute.side_effect = OperationalError("statement", "params", "orig")
    
    with pytest.raises(OperationalError):
        await _calculate_cost_async("trace-1")
        
    mock_db.rollback.assert_called_once()

@pytest.mark.asyncio
@patch("app.workers.cost.AsyncSessionLocal")
async def test_calculate_cost_async_integrity_error(mock_session):
    mock_db = AsyncMock()
    mock_session.return_value.__aenter__.return_value = mock_db
    
    mock_db.execute.side_effect = IntegrityError("statement", "params", "orig")
    
    with pytest.raises(IntegrityError):
        await _calculate_cost_async("trace-1")
        
    mock_db.rollback.assert_called_once()
