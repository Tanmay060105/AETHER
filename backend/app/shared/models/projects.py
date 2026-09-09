from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.shared.models.base import BaseModel


class Project(BaseModel):
    __tablename__ = "projects"

    organization_id = Column(ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    environment = Column(String, nullable=False, default="production")
    status = Column(String, default="active")

    organization = relationship("Organization", back_populates="projects")
    api_keys = relationship("APIKey", back_populates="project", cascade="all, delete-orphan")
    traces = relationship("Trace", back_populates="project", cascade="all, delete-orphan")
    datasets = relationship("Dataset", back_populates="project", cascade="all, delete-orphan")
    experiments = relationship("Experiment", back_populates="project", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="project", cascade="all, delete-orphan")
    health_snapshots = relationship("HealthSnapshot", back_populates="project", cascade="all, delete-orphan")

class APIKey(BaseModel):
    __tablename__ = "api_keys"

    project_id = Column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    key_hash = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    status = Column(String, default="active")

    project = relationship("Project", back_populates="api_keys")
