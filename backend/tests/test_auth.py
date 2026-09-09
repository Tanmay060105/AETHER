from datetime import UTC, datetime

import pytest
from httpx import AsyncClient

from app.shared.models.users import User


@pytest.mark.asyncio
async def test_register_user(async_client: AsyncClient, mocker):
    # Mock the auth service to return a dummy user without hitting DB logic
    mock_user = User(
        id="test-uuid",
        email="test@example.com",
        name="Test User",
        status="active",
        password_hash="fakehash",
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    mocker.patch("app.modules.auth.service.register_user", return_value=mock_user)

    response = await async_client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "strongpassword123",
        "name": "Test User"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data
