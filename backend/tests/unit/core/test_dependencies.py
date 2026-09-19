import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import Request
from app.core.dependencies import get_current_user
from app.shared.exceptions import UnauthorizedException
from app.shared.models.users import User
from app.core.security import create_access_token

@pytest.mark.asyncio
async def test_get_current_user_with_bearer_token():
    # Arrange
    user_id = "test-user-id"
    token = create_access_token({"sub": user_id})
    request = MagicMock(spec=Request)
    request.cookies = {} # No cookie
    
    db = AsyncMock()
    user_mock = User(id=user_id, email="test@example.com")
    
    class MockResult:
        def scalars(self):
            class MockScalars:
                def first(self):
                    return user_mock
            return MockScalars()
            
    db.execute.return_value = MockResult()
    
    # Act
    user = await get_current_user(request=request, token=token, db=db)
    
    # Assert
    assert user.id == user_id

@pytest.mark.asyncio
async def test_get_current_user_with_cookie():
    # Arrange
    user_id = "test-user-id"
    token = create_access_token({"sub": user_id})
    request = MagicMock(spec=Request)
    request.cookies = {"aether_access_token": token}
    
    db = AsyncMock()
    user_mock = User(id=user_id, email="test@example.com")
    
    class MockResult:
        def scalars(self):
            class MockScalars:
                def first(self):
                    return user_mock
            return MockScalars()
            
    db.execute.return_value = MockResult()
    
    # Act
    # token parameter is None (no Bearer header)
    user = await get_current_user(request=request, token=None, db=db)
    
    # Assert
    assert user.id == user_id

@pytest.mark.asyncio
async def test_get_current_user_no_credentials():
    # Arrange
    request = MagicMock(spec=Request)
    request.cookies = {}
    db = AsyncMock()
    
    # Act & Assert
    with pytest.raises(UnauthorizedException):
        await get_current_user(request=request, token=None, db=db)
