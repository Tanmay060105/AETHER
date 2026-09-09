from sqlalchemy import JSON, Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.shared.models.base import BaseModel


class Experiment(BaseModel):
    __tablename__ = "experiments"

    project_id = Column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, default="active")
    configuration = Column(JSON)

    project = relationship("Project", back_populates="experiments")
    results = relationship("ExperimentResult", back_populates="experiment", cascade="all, delete-orphan")

class ExperimentResult(BaseModel):
    __tablename__ = "experiment_results"

    experiment_id = Column(ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False, index=True)
    variant_name = Column(String, nullable=False)
    metrics = Column(JSON)

    experiment = relationship("Experiment", back_populates="results")
