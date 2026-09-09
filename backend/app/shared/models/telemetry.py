from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.shared.models.base import BaseModel


class Trace(BaseModel):
    __tablename__ = "traces"

    project_id = Column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(String, index=True)
    status = Column(String, default="success", index=True)
    model = Column(String, index=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    latency_ms = Column(Float)
    total_tokens = Column(Integer, default=0)
    cost = Column(Float, nullable=True)
    cost_calculated = Column(Integer, default=0) # 0=False, 1=True
    error_message = Column(String)

    project = relationship("Project", back_populates="traces")
    spans = relationship("Span", back_populates="trace", cascade="all, delete-orphan")

class Span(BaseModel):
    __tablename__ = "spans"

    trace_id = Column(ForeignKey("traces.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_span_id = Column(ForeignKey("spans.id", ondelete="CASCADE"), nullable=True, index=True)
    span_type = Column(String, nullable=False, index=True) # LLM, Tool, Retrieval
    name = Column(String, nullable=False)
    status = Column(String, default="success")
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    latency_ms = Column(Float)
    input_data = Column(JSON)
    output_data = Column(JSON)
    tokens = Column(Integer, default=0)
    cost = Column(Float, nullable=True)
    cost_calculated = Column(Integer, default=0) # 0=False, 1=True
    error_message = Column(String)

    trace = relationship("Trace", back_populates="spans")
    parent_span = relationship("Span", remote_side="Span.id", backref="child_spans")

class UsageRecord(BaseModel):
    __tablename__ = "usage_records"

    project_id = Column(ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(DateTime(timezone=True), nullable=False, index=True)
    model = Column(String, index=True) # Note: If aggregating at project level across models, this might be left null, or we group by model too. For MVP, keeping it flexible.
    total_tokens = Column(Integer, default=0)
    total_cost = Column(Float, default=0.0)

    __table_args__ = (
        UniqueConstraint("project_id", "date", name="uix_project_date"),
    )
