import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smartcity-ai-service")

settings = get_settings()

app = FastAPI(
    title="SmartCity Resolve — AI Verification Service",
    description=(
        "Standalone AI microservice for the SmartCity Resolve Admin API.\n\n"
        "Provides issue classification, duplicate scoring, resolution "
        "verification, and priority signal generation. Called exclusively "
        "by the trusted NestJS Admin API backend via X-API-Key auth — "
        "never exposed directly to citizens or admins."
    ),
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


# ---------- Global error contract, matching the Admin API's envelope ----------

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail
    if isinstance(detail, dict):
        code = detail.get("code", "ERROR")
        message = detail.get("message", "An error occurred")
    else:
        code = "ERROR"
        message = str(detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"code": code, "message": message}},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request payload",
                "details": exc.errors(),
            },
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {"code": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred"},
        },
    )


@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": "smartcity-resolve-ai-service",
        "docs": "/api/docs",
        "health": "/api/v1/health",
    }
