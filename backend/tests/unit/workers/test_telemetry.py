import pytest
from unittest.mock import AsyncMock, patch
from sqlalchemy.dialects.postgresql import Insert

from app.workers.telemetry import _process_telemetry_batch_async

@pytest.fixture
def mock_db_session(mocker):
    mock_session = AsyncMock()
    # Mock the context manager __aenter__ and __aexit__
    mock_session_maker = mocker.patch("app.workers.telemetry.AsyncSessionLocal")
    mock_session_maker.return_value.__aenter__.return_value = mock_session
    return mock_session

@pytest.mark.asyncio
@patch("app.workers.telemetry.celery_app.send_task")
async def test_process_telemetry_batch_success(mock_send_task, mock_db_session):
    batch_dict = {
        "traces": [
            {
                "id": "trace_1",
                "project_id": "project_123",
                "start_time": "2024-01-01T00:00:00Z",
                "end_time": "2024-01-01T00:00:01Z",
                "spans": [
                    {
                        "id": "span_1",
                        "trace_id": "trace_1",
                        "name": "root_span",
                        "start_time": "2024-01-01T00:00:00Z",
                        "end_time": "2024-01-01T00:00:01Z"
                    }
                ]
            }
        ]
    }
    
    await _process_telemetry_batch_async("project_123", batch_dict, "ingest_1")
    
    # Check that execute was called twice: once for trace, once for span
    assert mock_db_session.execute.call_count == 2
    mock_db_session.commit.assert_called_once()
    mock_send_task.assert_called_once_with("calculate_cost", args=["trace_1"])
    
    # Verify the SQL compile string or just that it was called
    call_args = mock_db_session.execute.call_args_list
    
    trace_stmt = call_args[0][0][0]
    assert isinstance(trace_stmt, Insert)
    assert trace_stmt.table.name == "traces"
    
    span_stmt = call_args[1][0][0]
    assert isinstance(span_stmt, Insert)
    assert span_stmt.table.name == "spans"

@pytest.mark.asyncio
@patch("app.workers.telemetry.celery_app.send_task")
async def test_process_telemetry_batch_out_of_order_parent_span(mock_send_task, mock_db_session):
    batch_dict = {
        "traces": [
            {
                "id": "trace_1",
                "project_id": "project_123",
                "start_time": "2024-01-01T00:00:00Z",
                "spans": [
                    {
                        "id": "span_2",
                        "trace_id": "trace_1",
                        "parent_span_id": "span_1",  # parent_span_id that hasn't been inserted yet
                        "name": "child_span",
                        "start_time": "2024-01-01T00:00:00Z"
                    }
                ]
            }
        ]
    }
    
    await _process_telemetry_batch_async("project_123", batch_dict, "ingest_2")
    
    # Execute called 3 times:
    # 1. trace_1 upsert
    # 2. span_1 (parent) placeholder insert
    # 3. span_2 upsert
    assert mock_db_session.execute.call_count == 3
    mock_send_task.assert_called_once_with("calculate_cost", args=["trace_1"])
    
    call_args = mock_db_session.execute.call_args_list
    
    trace_stmt = call_args[0][0][0]
    assert trace_stmt.table.name == "traces"
    
    parent_span_stmt = call_args[1][0][0]
    assert parent_span_stmt.table.name == "spans"
    # Verify it is an on_conflict_do_nothing
    assert parent_span_stmt._post_values_clause is not None
    
    child_span_stmt = call_args[2][0][0]
    assert child_span_stmt.table.name == "spans"

@pytest.mark.asyncio
@patch("app.workers.telemetry.celery_app.send_task")
async def test_process_telemetry_batch_rollback_on_error(mock_send_task, mock_db_session):
    mock_db_session.execute.side_effect = Exception("DB Error")
    
    batch_dict = {
        "traces": [
            {
                "id": "trace_1",
                "project_id": "project_123",
                "start_time": "2024-01-01T00:00:00Z"
            }
        ]
    }
    
    with pytest.raises(Exception, match="DB Error"):
        await _process_telemetry_batch_async("project_123", batch_dict, "ingest_3")
        
    mock_db_session.rollback.assert_called_once()
    mock_db_session.commit.assert_not_called()
    mock_send_task.assert_not_called()
