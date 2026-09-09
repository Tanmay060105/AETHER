import secrets
import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.security import get_password_hash
from app.modules.api_keys.schemas import APIKeyCreate
from app.shared.models.projects import APIKey


async def create_api_key(db: AsyncSession, project_id: str, api_key_in: APIKeyCreate):
    raw_key = "aether_" + secrets.token_urlsafe(32)
    prefix = raw_key[:12]
    hashed_key = get_password_hash(raw_key)

    api_key = APIKey(
        id=str(uuid.uuid4()),
        project_id=project_id,
        name=api_key_in.name,
        prefix=prefix,
        hashed_key=hashed_key,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)
    
    return api_key, raw_key

async def get_api_keys(db: AsyncSession, project_id: str) -> list[APIKey]:
    result = await db.execute(select(APIKey).where(APIKey.project_id == project_id))
    return list(result.scalars().all())

async def verify_api_key(db: AsyncSession, raw_key: str) -> str | None:
    if not raw_key.startswith("aether_"):
        return None
    prefix = raw_key[:12]
    # Fetch API keys matching the prefix
    result = await db.execute(select(APIKey).where(APIKey.prefix == prefix))
    api_keys = result.scalars().all()
    
    from app.core.security import verify_password
    for api_key in api_keys:
        if verify_password(raw_key, api_key.hashed_key):
            return api_key.project_id
            
    return None
