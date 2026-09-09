import os
from celery import Celery
from app.core.config import settings

from kombu import Queue, Exchange

celery_app = Celery(
    "aether_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.telemetry", "app.workers.cost", "app.workers.aggregation", "app.workers.sweeper"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    worker_cancel_long_running_tasks_on_connection_loss=True,
    task_queues=[
        Queue("ingestion_queue", Exchange("ingestion_queue"), routing_key="ingestion_queue"),
        Queue("processing_queue", Exchange("processing_queue"), routing_key="processing_queue"),
    ],
    task_routes={
        "process_telemetry_batch": {"queue": "ingestion_queue"},
        "calculate_cost": {"queue": "processing_queue"},
        "aggregate_metrics": {"queue": "processing_queue"},
        "sweep_unprocessed_telemetry": {"queue": "processing_queue"}
    }
)
