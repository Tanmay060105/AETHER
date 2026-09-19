import pytest
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch, MagicMock

from app.modules.projects.observe_service import get_metrics, get_timeseries, get_filters
from app.modules.projects.schemas import ObserveMetricsResponse, ObserveTimeseriesResponse, ObserveFiltersResponse

@pytest.fixture
def mock_db_session():
    return AsyncMock()

@pytest.mark.asyncio
async def test_get_metrics(mock_db_session):
    # Mocking SQLAlchemy execution result
    mock_row = MagicMock()
    mock_row.request_count = 100
    mock_row.error_count = 5
    mock_row.avg_latency_ms = 150.5
    mock_row.total_tokens = 50000
    mock_row.total_cost = 0.50

    mock_result = MagicMock()
    mock_result.first.return_value = mock_row
    mock_db_session.execute.return_value = mock_result

    start_time = datetime(2023, 1, 1, tzinfo=timezone.utc)
    end_time = datetime(2023, 1, 2, tzinfo=timezone.utc)

    metrics = await get_metrics(
        db=mock_db_session,
        project_id="proj_1",
        start_time=start_time,
        end_time=end_time
    )

    assert metrics.request_count == 100
    assert metrics.error_count == 5
    assert metrics.error_rate == 0.05
    assert metrics.avg_latency_ms == 150.5
    assert metrics.total_tokens == 50000
    assert metrics.total_cost == 0.50

@pytest.mark.asyncio
async def test_get_metrics_empty(mock_db_session):
    # Mocking empty result (no matching traces)
    mock_row = MagicMock()
    mock_row.request_count = 0
    mock_row.error_count = None
    mock_row.avg_latency_ms = None
    mock_row.total_tokens = None
    mock_row.total_cost = None

    mock_result = MagicMock()
    mock_result.first.return_value = mock_row
    mock_db_session.execute.return_value = mock_result

    start_time = datetime(2023, 1, 1, tzinfo=timezone.utc)
    end_time = datetime(2023, 1, 2, tzinfo=timezone.utc)

    metrics = await get_metrics(
        db=mock_db_session,
        project_id="proj_1",
        start_time=start_time,
        end_time=end_time
    )

    assert metrics.request_count == 0
    assert metrics.error_count == 0
    assert metrics.error_rate == 0.0
    assert metrics.avg_latency_ms == 0.0
    assert metrics.total_tokens == 0
    assert metrics.total_cost == 0.0

@pytest.mark.asyncio
async def test_get_timeseries_zero_filling(mock_db_session):
    start_time = datetime(2023, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
    end_time = datetime(2023, 1, 1, 14, 0, 0, tzinfo=timezone.utc)

    # Database only has data for 10:00 and 13:00
    row_10 = MagicMock()
    row_10.bucket = datetime(2023, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
    row_10.request_count = 10
    row_10.error_count = 1
    row_10.avg_latency_ms = 100.0
    row_10.total_tokens = 1000
    row_10.total_cost = 0.01

    row_13 = MagicMock()
    row_13.bucket = datetime(2023, 1, 1, 13, 0, 0, tzinfo=timezone.utc)
    row_13.request_count = 5
    row_13.error_count = 0
    row_13.avg_latency_ms = 80.0
    row_13.total_tokens = 500
    row_13.total_cost = 0.005

    mock_result = MagicMock()
    mock_result.fetchall.return_value = [row_10, row_13]
    mock_db_session.execute.return_value = mock_result

    timeseries = await get_timeseries(
        db=mock_db_session,
        project_id="proj_1",
        start_time=start_time,
        end_time=end_time,
        interval="hour"
    )

    assert len(timeseries.data) == 5 # 10, 11, 12, 13, 14

    # 10:00 -> actual
    assert timeseries.data[0].timestamp == datetime(2023, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
    assert timeseries.data[0].request_count == 10

    # 11:00 -> zero
    assert timeseries.data[1].timestamp == datetime(2023, 1, 1, 11, 0, 0, tzinfo=timezone.utc)
    assert timeseries.data[1].request_count == 0
    assert timeseries.data[1].error_rate == 0.0

    # 12:00 -> zero
    assert timeseries.data[2].timestamp == datetime(2023, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
    assert timeseries.data[2].request_count == 0

    # 13:00 -> actual
    assert timeseries.data[3].timestamp == datetime(2023, 1, 1, 13, 0, 0, tzinfo=timezone.utc)
    assert timeseries.data[3].request_count == 5

    # 14:00 -> zero
    assert timeseries.data[4].timestamp == datetime(2023, 1, 1, 14, 0, 0, tzinfo=timezone.utc)
    assert timeseries.data[4].request_count == 0

@pytest.mark.asyncio
async def test_get_filters(mock_db_session):
    # Mock models result
    models_result = MagicMock()
    models_result.fetchall.return_value = [("gpt-4",), ("claude-3",)]

    # Mock environments result
    envs_result = MagicMock()
    envs_result.fetchall.return_value = [("production",), ("staging",)]

    # We use side_effect to return different mocks for successive db.execute calls
    mock_db_session.execute.side_effect = [models_result, envs_result]

    filters = await get_filters(
        db=mock_db_session,
        project_id="proj_1"
    )

    assert filters.models == ["gpt-4", "claude-3"]
    assert filters.environments == ["production", "staging"]

