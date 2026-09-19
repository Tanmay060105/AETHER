from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from app.shared.models.users import Role
from typing import Optional, List
from app.shared.models.users import Role


class OrganizationCreate(BaseModel):
    name: str

class OrganizationResponse(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)

class MembershipResponse(BaseModel):
    id: UUID
    user_id: UUID
    organization_id: UUID
    role: Role

    model_config = ConfigDict(from_attributes=True)
