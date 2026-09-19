import pytest
from httpx import AsyncClient

from app.modules.auth.schemas import Token, RegisterRequest
from app.shared.exceptions import ConflictException


@pytest.mark.asyncio
async def test_register_user_success(async_client: AsyncClient, mocker):
    mock_token = Token(access_token="fake_jwt_token", token_type="bearer")
    mocker.patch("app.modules.auth.service.register_user", return_value=mock_token)

    response = await async_client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "strongpassword123",
        "confirm_password": "strongpassword123",
        "organization_name": "Test Org",
        "project_name": "Test Project"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"] == "fake_jwt_token"
    assert "aether_access_token" in response.cookies


@pytest.mark.asyncio
async def test_register_user_password_mismatch(async_client: AsyncClient):
    response = await async_client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "strongpassword123",
        "confirm_password": "wrongpassword456",
        "organization_name": "Test Org",
        "project_name": "Test Project"
    })
    
    assert response.status_code == 422
    data = response.json()
    assert "Passwords do not match" in data["detail"][0]["msg"]


@pytest.mark.asyncio
async def test_register_user_weak_password(async_client: AsyncClient):
    response = await async_client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "weak",
        "confirm_password": "weak",
        "organization_name": "Test Org",
        "project_name": "Test Project"
    })
    
    assert response.status_code == 422
    data = response.json()
    assert "Password must be at least 8 characters long" in data["detail"][0]["msg"]


@pytest.mark.asyncio
async def test_register_user_duplicate_email(async_client: AsyncClient, mocker):
    mocker.patch(
        "app.modules.auth.service.register_user",
        side_effect=ConflictException("Email already registered")
    )

    response = await async_client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "email": "duplicate@example.com",
        "password": "strongpassword123",
        "confirm_password": "strongpassword123",
        "organization_name": "Test Org",
        "project_name": "Test Project"
    })
    
    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"

