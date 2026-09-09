from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from app.shared.models.users import Role


class OrganizationCreate(BaseModel):
    name: str

class OrganizationResponse(BaseModel):
    id: str
    name: str

    model_config = ConfigDict(from_attributes=True)

class MembershipResponse(BaseModel):
    id: str
    user_id: str
    organization_id: str
    role: Role

    model_config = ConfigDict(from_attributes=True)
