from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import get_settings
from app.database import engine, Base
from app.routers import twins, prevention, credits, dashboard

# Import A's routers — will fail gracefully if not yet created
try:
    from app.routers import grading, routing, marketplace
    HAS_AI_ROUTERS = True
except ImportError:
    HAS_AI_ROUTERS = False

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ReLoop API", 
    description="Second Life Commerce — AI-Powered Returns Ecosystem", 
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# C's routers (always available)
app.include_router(twins.router)
app.include_router(prevention.router)
app.include_router(credits.router)
app.include_router(dashboard.router)

# A's routers (available after merge)
if HAS_AI_ROUTERS:
    app.include_router(grading.router)
    app.include_router(routing.router)
    app.include_router(marketplace.router)

@app.get("/")
async def root():
    return {"name": "ReLoop API", "status": "running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
