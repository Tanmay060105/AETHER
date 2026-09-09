from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.modules.projects import schemas, service
from app.shared.models.users import Role, User

router = APIRouter()

# Projects are scoped to an organization
@router.post("/organizations/{organization_id}/projects", response_model=schemas.ProjectResponse)
async def create_project(
    organization_id: str,
    project_in: schemas.ProjectCreate,
    membership=Depends(require_role(Role.ENGINEER)),
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.create_project(db, organization_id, project_in)

@router.get("/organizations/{organization_id}/projects", response_model=list[schemas.ProjectResponse])
async def list_projects(
    organization_id: str,
    membership=Depends(require_role(Role.VIEWER)),
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await service.get_projects(db, organization_id)

@router.get("/projects/{project_id}", response_model=schemas.ProjectResponse)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Here we should verify the user has access to the project's organization
    project = await service.get_project(db, project_id)
    # Re-use the dependency logic to check if they have at least viewer on the org
    check_role = require_role(Role.VIEWER)
    await check_role(organization_id=project.organization_id, current_user=current_user, db=db)
    
    return project
