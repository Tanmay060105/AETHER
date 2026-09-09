from sqlalchemy import JSON, Column, Float, ForeignKey, String
from sqlalchemy.orm import relationship

from app.shared.models.base import BaseModel


class Dataset(BaseModel):
    __tablename__ = "datasets"

    project_id = Column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(String)

    project = relationship("Project", back_populates="datasets")
    cases = relationship("EvaluationCase", back_populates="dataset", cascade="all, delete-orphan")
    runs = relationship("EvaluationRun", back_populates="dataset", cascade="all, delete-orphan")

class EvaluationCase(BaseModel):
    __tablename__ = "evaluation_cases"

    dataset_id = Column(ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    input_data = Column(JSON, nullable=False)
    expected_output = Column(JSON)

    dataset = relationship("Dataset", back_populates="cases")
    results = relationship("EvaluationResult", back_populates="case", cascade="all, delete-orphan")

class EvaluationRun(BaseModel):
    __tablename__ = "evaluation_runs"

    dataset_id = Column(ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="running")
    configuration = Column(JSON)
    pass_rate = Column(Float)

    dataset = relationship("Dataset", back_populates="runs")
    results = relationship("EvaluationResult", back_populates="run", cascade="all, delete-orphan")

class EvaluationResult(BaseModel):
    __tablename__ = "evaluation_results"

    run_id = Column(ForeignKey("evaluation_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    case_id = Column(ForeignKey("evaluation_cases.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float)
    passed = Column(String)
    metrics = Column(JSON)

    run = relationship("EvaluationRun", back_populates="results")
    case = relationship("EvaluationCase", back_populates="results")
