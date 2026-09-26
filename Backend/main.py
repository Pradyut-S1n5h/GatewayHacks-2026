from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, student, ai, leaderboard

app = FastAPI(title="GatewayHacks STEM Intelligence Hub", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(student.router)
app.include_router(ai.router)
app.include_router(leaderboard.router)

@app.get("/")
def root():
    return {"status": "GatewayHacks Backend v3.0 modular system is live!"}
