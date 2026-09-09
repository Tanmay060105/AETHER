import enum

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import relationship

from app.shared.models.base import BaseModel


class Role(str, enum.Enum):
    OWNER = "OWNER"
    ENGINEER = "ENGINEER"
    VIEWER = "VIEWER"

class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, default="active")
    
    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan")


class Organization(BaseModel):
    __tablename__ = "organizations"

    name = Column(String, nullable=False)
    
    members = relationship("Membership", back_populates="organization", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="organization", cascade="all, delete-orphan")


class Membership(BaseModel):
    __tablename__ = "memberships"

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(SQLEnum(Role), nullable=False, default=Role.VIEWER)

    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="members")
