import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.security import create_access_token, get_password_hash, verify_password
from app.modules.auth.schemas import LoginRequest, Token, RegisterRequest
from app.shared.exceptions import BadRequestException, UnauthorizedException, ConflictException
from app.shared.models.users import User, Organization, Membership, Role
from app.shared.models.projects import Project


async def register_user(db: AsyncSession, register_data: RegisterRequest) -> Token:
    result = await db.execute(select(User).where(User.email == register_data.email))
    if result.scalars().first():
        raise ConflictException("Email already registered")
    
    try:
        hashed_password = get_password_hash(register_data.password)
        user = User(
            email=register_data.email.lower(),
            password_hash=hashed_password,
            name=register_data.name,
        )
        db.add(user)
        await db.flush()

        org = Organization(name=register_data.organization_name)
        db.add(org)
        await db.flush()

        mem = Membership(
            user_id=user.id,
            organization_id=org.id,
            role=Role.OWNER
        )
        db.add(mem)

        proj = Project(
            organization_id=org.id,
            name=register_data.project_name,
            environment="production"
        )
        db.add(proj)

        await db.commit()
    except Exception as e:
        await db.rollback()
        raise BadRequestException("Registration failed") from e
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token, token_type="bearer")

async def authenticate_user(db: AsyncSession, login_data: LoginRequest) -> Token:
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalars().first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise UnauthorizedException("Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token, token_type="bearer")
