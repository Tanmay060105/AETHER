from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    name: str

class ProjectResponse(BaseModel):
    id: str
    organization_id: str
    name: str

    model_config = ConfigDict(from_attributes=True)
