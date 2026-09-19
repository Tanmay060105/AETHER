import asyncio
from app.core.database import AsyncSessionLocal
from app.shared.models.users import User, Organization, Membership, Role
from app.shared.models.projects import Project
from app.core.security import get_password_hash
from sqlalchemy.future import select

async def seed():
    async with AsyncSessionLocal() as session:
        email = "tanmaytripathi43@gmail.com"
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if not user:
            print("Creating user...")
            user = User(
                email=email,
                name="Tanmay Tripathi",
                password_hash=get_password_hash("devpassword123")
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
        else:
            print("User already exists, updating password to devpassword123...")
            user.password_hash = get_password_hash("devpassword123")
            await session.commit()
        
        # Check org
        result = await session.execute(select(Membership).where(Membership.user_id == user.id))
        membership = result.scalars().first()
        if not membership:
            print("Creating org and membership...")
            org = Organization(name="AETHER Dev Org")
            session.add(org)
            await session.commit()
            await session.refresh(org)
            
            mem = Membership(
                user_id=user.id,
                organization_id=org.id,
                role=Role.OWNER
            )
            session.add(mem)
            await session.commit()
            org_id = org.id
        else:
            print("Membership already exists.")
            org_id = membership.organization_id
            
        # Check project
        result = await session.execute(select(Project).where(Project.organization_id == org_id))
        project = result.scalars().first()
        if not project:
            print("Creating project...")
            project = Project(
                organization_id=org_id,
                name="AETHER Local Dev Project",
                description="Initial project for local development",
                environment="development"
            )
            session.add(project)
            await session.commit()
        else:
            print("Project already exists.")
            
        print("Done.")

if __name__ == "__main__":
    asyncio.run(seed())
