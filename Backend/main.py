from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import student, learn

app = FastAPI(title="GatewayHacks 2026 - STEM Learning Portal", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(student.router)
app.include_router(learn.router)

@app.get("/")
def read_root():
    return {"message": "GatewayHacks Backend API is running live."}
