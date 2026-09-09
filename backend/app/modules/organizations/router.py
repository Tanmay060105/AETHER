from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.modules.organizations import schemas, service
from app.shared.models.users import Role, User

router = APIRouter()

@router.post("/", response_model=schemas.OrganizationResponse)
async def create_organization(
    org_in: schemas.OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.create_organization(db, current_user, org_in)

@router.get("/", response_model=list[schemas.OrganizationResponse])
async def list_organizations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.get_organizations(db, current_user)

@router.get("/{organization_id}", response_model=schemas.OrganizationResponse)
async def get_organization(
    organization_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.get_organization(db, organization_id, current_user)

@router.get("/{organization_id}/members", response_model=list[schemas.MembershipResponse])
async def list_members(
    organization_id: str,
    membership=Depends(require_role(Role.VIEWER)),
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.get_memberships(db, organization_id)
