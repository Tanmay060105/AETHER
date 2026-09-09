from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.main import app


# Override the DB dependency with a mock
async def override_get_db():
    mock_session = AsyncMock()
    yield mock_session

app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture
async def async_client() -> AsyncGenerator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client

@pytest.fixture
def mock_db_session():
    return AsyncMock()
