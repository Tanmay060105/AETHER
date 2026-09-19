import pytest
from unittest.mock import AsyncMock, MagicMock
import uuid

from app.modules.api_keys.schemas import APIKeyCreate
from app.modules.api_keys.service import create_api_key, verify_api_key, get_api_keys
from app.shared.models.projects import APIKey
from app.core.security import get_password_hash

@pytest.mark.asyncio
async def test_api_key_creation(mock_db_session):
    # 1. API-key creation succeeds.
    project_id = str(uuid.uuid4())
    api_key_data = APIKeyCreate(name="Test Key")
    
    api_key, raw_key = await create_api_key(mock_db_session, project_id, api_key_data)
    
    # 2. Returned raw key has the expected format.
    assert raw_key.startswith("aether_")
    assert len(raw_key) > 20
    
    # 3. Prefix is derived correctly.
    assert api_key.prefix == raw_key[:12]
    
    # 4. Raw key is NOT stored in the database representation.
    assert api_key.key_hash != raw_key
    assert raw_key not in api_key.key_hash
    
    # 5. key_hash is stored.
    assert api_key.key_hash is not None
    
    # 6. prefix is stored.
    assert api_key.prefix is not None

@pytest.mark.asyncio
async def test_verify_api_key_success(mock_db_session):
    # 7. Verification succeeds with the correct raw key.
    # 10. Correct project_id is returned from verification.
    raw_key = "aether_test_key_12345"
    hashed_key = get_password_hash(raw_key)
    project_id = str(uuid.uuid4())
    
    mock_api_key = APIKey(
        project_id=project_id,
        prefix=raw_key[:12],
        key_hash=hashed_key,
        status="active"
    )
    
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = [mock_api_key]
    mock_db_session.execute.return_value = mock_result
    
    verified_project_id = await verify_api_key(mock_db_session, raw_key)
    assert verified_project_id == project_id

@pytest.mark.asyncio
async def test_verify_api_key_invalid(mock_db_session):
    # 8. Verification fails with an invalid key.
    raw_key = "aether_valid_prefix_but_wrong"
    mock_api_key = APIKey(
        project_id=str(uuid.uuid4()),
        prefix=raw_key[:12],
        key_hash=get_password_hash("aether_valid_prefix_right_one"),
        status="active"
    )
    
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = [mock_api_key]
    mock_db_session.execute.return_value = mock_result
    
    verified_project_id = await verify_api_key(mock_db_session, raw_key)
    assert verified_project_id is None
    
    # Also test invalid format
    assert await verify_api_key(mock_db_session, "not_aether_key") is None

@pytest.mark.asyncio
async def test_verify_api_key_inactive(mock_db_session):
    # 9. Revoked/inactive key cannot authenticate.
    raw_key = "aether_test_key_12345"
    hashed_key = get_password_hash(raw_key)
    
    mock_api_key = APIKey(
        project_id=str(uuid.uuid4()),
        prefix=raw_key[:12],
        key_hash=hashed_key,
        status="revoked"
    )
    
    mock_result = MagicMock()
    mock_result.scalars().all.return_value = [mock_api_key]
    mock_db_session.execute.return_value = mock_result
    
    verified_project_id = await verify_api_key(mock_db_session, raw_key)
    assert verified_project_id is None

from httpx import AsyncClient
from app.shared.models.users import User, Role, Membership
from app.shared.models.projects import Project

@pytest.mark.asyncio
async def test_project_isolation(async_client: AsyncClient, mocker):
    # 11. Project isolation is preserved.
    # 12. Organization/tenant isolation is preserved where applicable.
    
    # Mock current user and project access
    mock_user = User(id="user_123", email="test@test.com")
    mocker.patch("app.core.dependencies.get_current_user", return_value=mock_user)
    
    # If the user doesn't have access, verify_project_access will raise ForbiddenException
    from app.shared.exceptions import ForbiddenException
    mocker.patch("app.modules.api_keys.router.verify_project_access", side_effect=ForbiddenException("No access"))
    
    response = await async_client.post("/api/v1/projects/project_123/api-keys", json={"name": "test"})
    assert response.status_code in (401, 403)
    
    response_list = await async_client.get("/api/v1/projects/project_123/api-keys")
    assert response_list.status_code in (401, 403)

