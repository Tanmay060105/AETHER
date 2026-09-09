import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.security import create_access_token, get_password_hash, verify_password
from app.modules.auth.schemas import LoginRequest, Token, UserCreate
from app.shared.exceptions import BadRequestException, UnauthorizedException
from app.shared.models.users import User


async def register_user(db: AsyncSession, user_in: UserCreate) -> User:
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise BadRequestException("Email already registered")
    
    hashed_password = get_password_hash(user_in.password)
    user = User(
        id=str(uuid.uuid4()),
        email=user_in.email,
        password_hash=hashed_password,
        name=user_in.name,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def authenticate_user(db: AsyncSession, login_data: LoginRequest) -> Token:
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalars().first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise UnauthorizedException("Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer")
