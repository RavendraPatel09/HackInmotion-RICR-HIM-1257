from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, reports, notifications, transparency, feedback, health, map

app = FastAPI(
    title="NagarSathi API",
    description="India-Wide Civic Issue Reporting & Resolution Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(transparency.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(map.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "app": "NagarSathi Civic Platform API",
        "version": "1.0.0",
        "documentation": "/docs"
    }
