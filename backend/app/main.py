from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.modules.api_keys.router import router as api_keys_router
from app.modules.auth.router import router as auth_router
from app.modules.health.router import router as health_router
from app.modules.organizations.router import router as org_router
from app.modules.projects.router import router as projects_router
from app.shared.exceptions import AetherHTTPException

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(AetherHTTPException)
async def aether_exception_handler(request, exc: AetherHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

from app.modules.ingestion.router import router as ingestion_router

api_router = FastAPI()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(org_router, prefix="/organizations", tags=["organizations"])
api_router.include_router(projects_router, tags=["projects"])
api_router.include_router(api_keys_router, tags=["api-keys"])
api_router.include_router(ingestion_router, tags=["ingestion"])

app.mount("/api/v1", api_router)
