from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router
from database.seed_db import seed_database

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="1.0.0"
)

# Parse CORS Origins from environment
origins = [o.strip() for o in settings.BACKEND_ALLOWED_ORIGINS.split(",") if o.strip()]
if not origins:
    origins = ["http://localhost:3000"]

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Seed initial 50+ normalized products into SQLite/Postgres DB
    try:
        seed_database()
        print("[DB Startup] Database seeded successfully.")
    except Exception as e:
        print(f"[DB Startup Warning] {e}")

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }

app.include_router(api_router, prefix=settings.API_V1_STR)
