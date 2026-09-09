from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.modules.api_keys import schemas, service
from app.modules.projects.service import get_project
from app.shared.models.users import User, Role
from app.shared.models.projects import Project

router = APIRouter()

async def verify_project_access(project_id: str, current_user: User, db: AsyncSession, required_role: Role):
    project = await get_project(db, project_id)
    check_role = require_role(required_role)
    await check_role(organization_id=project.organization_id, current_user=current_user, db=db)
    return project

@router.post("/projects/{project_id}/api-keys", response_model=schemas.APIKeyCreatedResponse)
async def create_api_key(
    project_id: str,
    api_key_in: schemas.APIKeyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await verify_project_access(project_id, current_user, db, Role.OWNER)
    api_key, raw_key = await service.create_api_key(db, project_id, api_key_in)
    
    return schemas.APIKeyCreatedResponse(
        id=api_key.id,
        project_id=api_key.project_id,
        name=api_key.name,
        prefix=api_key.prefix,
        key=raw_key
    )

@router.get("/projects/{project_id}/api-keys", response_model=list[schemas.APIKeyResponse])
async def list_api_keys(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    await verify_project_access(project_id, current_user, db, Role.ENGINEER)
    return await service.get_api_keys(db, project_id)
