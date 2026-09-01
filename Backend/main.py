from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.student import router as student_router
from api.diagnose import router as diagnose_router
from api.learn import router as learn_router
from api.practice import router as practice_router


app = FastAPI(
    title="Personalized Learning API",
    description="GatewayHacks MVP Backend",
    version="0.1.0"
)


# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this before production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(student_router)
app.include_router(diagnose_router)
app.include_router(learn_router)
app.include_router(practice_router)


@app.get("/")
def root():

    return {
        "status": "online",
        "message": "Personalized Learning API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }
