from collections.abc import Callable

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import decode_access_token
from app.shared.exceptions import ForbiddenException, UnauthorizedException
from app.shared.models.users import Membership, Role, User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise UnauthorizedException()
    except Exception:
        raise UnauthorizedException()

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if user is None:
        raise UnauthorizedException()
    return user

def require_role(min_role: Role) -> Callable:
    # Hierarchy: OWNER > ENGINEER > VIEWER
    role_weights = {
        Role.OWNER: 3,
        Role.ENGINEER: 2,
        Role.VIEWER: 1
    }
    target_weight = role_weights[min_role]

    async def role_checker(
        organization_id: str,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ) -> Membership:
        result = await db.execute(
            select(Membership)
            .where(Membership.user_id == current_user.id)
            .where(Membership.organization_id == organization_id)
        )
        membership = result.scalars().first()
        if not membership:
            raise ForbiddenException("You are not a member of this organization")
        
        user_weight = role_weights.get(membership.role, 0)
        if user_weight < target_weight:
            raise ForbiddenException(f"Requires at least {min_role.value} role")
        
        return membership

    return role_checker
