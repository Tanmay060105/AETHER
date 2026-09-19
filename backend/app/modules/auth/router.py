from typing import Any

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.auth import schemas, service
from app.shared.models.users import User

router = APIRouter()

@router.post("/register", response_model=schemas.Token)
async def register(
    register_data: schemas.RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
) -> Any:
    token_response = await service.register_user(db, register_data)
    response.set_cookie(
        key="aether_access_token",
        value=token_response.access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7, # 7 days
        path="/"
    )
    return token_response

@router.post("/login", response_model=schemas.Token)
async def login(
    login_data: schemas.LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
) -> Any:
    token_response = await service.authenticate_user(db, login_data)
    response.set_cookie(
        key="aether_access_token",
        value=token_response.access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7, # 7 days
        path="/"
    )
    return token_response

@router.post("/logout")
async def logout(response: Response) -> Any:
    response.delete_cookie(
        key="aether_access_token",
        httponly=True,
        secure=True,
        samesite="lax",
        path="/"
    )
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=schemas.UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    return current_user
