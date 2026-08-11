import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.config import HOST, PORT, CORS_ORIGINS
from backend.api.routes import router as api_router

app = FastAPI(
    title="Silent Co-Driver Backend API",
    description="Formula 1 Driver Cognitive Telemetry & AI Race Engineer Backend",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend connectivity - keep open
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Standardized global exception handler for production error responses.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "Internal Server Telemetry Error",
            "detail": str(exc),
            "path": request.url.path
        }
    )


# Include API Router at /api/v1 and /api
app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "title": "Silent Co-Driver Backend API",
        "status": "online",
        "version": "2.0.0",
        "documentation": "/docs",
        "endpoints": {
            "health": "/api/v1/health",
            "upload_audio": "/api/v1/upload-audio",
            "stt": "/api/v1/stt",
            "emotion_analysis": "/api/v1/emotion-analysis",
            "correlate_laps": "/api/v1/correlate-laps",
            "race_engineer_insights": "/api/v1/race-engineer-insights",
            "cognitive_load": "/api/v1/cognitive-load",
            "race_dna": "/api/v1/race-dna",
            "explainability": "/api/v1/explainability",
            "session_summary": "/api/v1/session-summary",
            "main_analysis": "/api/v1/analyze"
        }
    }


if __name__ == "__main__":
    print(f"[START] Starting Silent Co-Driver Backend on http://{HOST}:{PORT}")
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
