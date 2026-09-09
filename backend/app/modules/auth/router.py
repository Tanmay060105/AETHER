from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.auth import schemas, service
from app.shared.models.users import User

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
async def register(
    user_in: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.register_user(db, user_in)

@router.post("/login", response_model=schemas.Token)
async def login(
    login_data: schemas.LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.authenticate_user(db, login_data)

@router.get("/me", response_model=schemas.UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    return current_user
