from pydantic import BaseModel, ConfigDict


class APIKeyCreate(BaseModel):
    name: str

class APIKeyResponse(BaseModel):
    id: str
    project_id: str
    name: str
    prefix: str

    model_config = ConfigDict(from_attributes=True)

class APIKeyCreatedResponse(BaseModel):
    id: str
    project_id: str
    name: str
    prefix: str
    key: str  # Only returned once!
