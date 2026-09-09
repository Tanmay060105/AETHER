import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.modules.projects.schemas import ProjectCreate
from app.shared.exceptions import NotFoundException
from app.shared.models.projects import Project


async def create_project(db: AsyncSession, organization_id: str, project_in: ProjectCreate) -> Project:
    project = Project(
        id=str(uuid.uuid4()),
        organization_id=organization_id,
        name=project_in.name,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC)
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

async def get_projects(db: AsyncSession, organization_id: str) -> list[Project]:
    result = await db.execute(select(Project).where(Project.organization_id == organization_id))
    return result.scalars().all()

async def get_project(db: AsyncSession, project_id: str) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise NotFoundException("Project not found")
    return project
