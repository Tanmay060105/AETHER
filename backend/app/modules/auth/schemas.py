from pydantic import BaseModel, EmailStr, ConfigDict, model_validator
from typing import Optional


from uuid import UUID

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str
    organization_name: str
    project_name: str

    @model_validator(mode='after')
    def verify_passwords_match(self) -> 'RegisterRequest':
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        if len(self.password) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return self

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    status: str

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str
