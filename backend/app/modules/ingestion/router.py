import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.api_keys.service import verify_api_key
from app.modules.ingestion import schemas
from app.modules.ingestion.rate_limiter import check_rate_limit
from app.workers.telemetry import process_telemetry_batch

router = APIRouter()

async def get_project_id_from_api_key(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    raw_key = authorization.split(" ")[1]
    project_id = await verify_api_key(db, raw_key)
    if not project_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return project_id

@router.post("/ingest", status_code=status.HTTP_202_ACCEPTED)
async def ingest_telemetry(
    batch: schemas.IngestBatch,
    project_id: str = Depends(get_project_id_from_api_key)
) -> Any:
    # 1. Check Rate Limit (e.g. 1000 requests per minute)
    await check_rate_limit(project_id, limit=1000, window_seconds=60)
    
    # 2. Generate Ingestion ID
    ingestion_id = str(uuid.uuid4())
    
    # 3. Enqueue to Celery (serialize Pydantic to dict)
    process_telemetry_batch.delay(project_id, batch.model_dump(), ingestion_id)
    
    # 4. Return immediately (<500ms synchronous work)
    return {
        "status": "accepted",
        "ingestion_id": ingestion_id
    }
