from sqlalchemy import JSON, Column, Float, ForeignKey, String
from sqlalchemy.orm import relationship

from app.shared.models.base import BaseModel


class Incident(BaseModel):
    __tablename__ = "incidents"

    project_id = Column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    status = Column(String, default="open", index=True)
    trigger_rule = Column(String)
    context = Column(JSON)

    project = relationship("Project", back_populates="incidents")

class HealthSnapshot(BaseModel):
    __tablename__ = "health_snapshots"

    project_id = Column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, nullable=False)
    signals = Column(JSON)

    project = relationship("Project", back_populates="health_snapshots")
