from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserResponse(BaseModel):
    id: str
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
