import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.modules.organizations.schemas import OrganizationCreate
from app.shared.exceptions import NotFoundException
from app.shared.models.users import Membership, Organization, Role, User


async def create_organization(db: AsyncSession, user: User, org_in: OrganizationCreate) -> Organization:
    org_id = str(uuid.uuid4())
    now = datetime.now(UTC)
    org = Organization(
        id=org_id,
        name=org_in.name,
        created_at=now,
        updated_at=now
    )
    db.add(org)
    
    membership = Membership(
        id=str(uuid.uuid4()),
        user_id=user.id,
        organization_id=org_id,
        role=Role.OWNER,
        created_at=now,
        updated_at=now
    )
    db.add(membership)
    
    await db.commit()
    await db.refresh(org)
    return org

async def get_organizations(db: AsyncSession, user: User):
    result = await db.execute(
        select(Organization)
        .join(Membership, Membership.organization_id == Organization.id)
        .where(Membership.user_id == user.id)
    )
    return result.scalars().all()

async def get_organization(db: AsyncSession, org_id: str, user: User) -> Organization:
    result = await db.execute(
        select(Organization)
        .join(Membership, Membership.organization_id == Organization.id)
        .where(Membership.user_id == user.id)
        .where(Organization.id == org_id)
    )
    org = result.scalars().first()
    if not org:
        raise NotFoundException("Organization not found")
    return org

async def get_memberships(db: AsyncSession, org_id: str) -> list[Membership]:
    result = await db.execute(select(Membership).where(Membership.organization_id == org_id))
    return result.scalars().all()
