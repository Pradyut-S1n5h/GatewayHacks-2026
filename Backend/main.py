from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.ai import run_pipeline, MissingTokenError
from api import student, diagnose, learn, practice, performance, test, roadmap  # <--- Import roadmap router

app = FastAPI(title="GatewayHacks AI Pipeline & Educational API")

# Include all feature routers
app.include_router(student.router)
app.include_router(diagnose.router)
app.include_router(learn.router)
app.include_router(practice.router)
app.include_router(performance.router)
app.include_router(test.router)
app.include_router(roadmap.router)  # <--- Register roadmap router

class PipelineRequest(BaseModel):
    idea: str
    num_scenes: int = 5
    tone: str = "Cinematic"

@app.get("/")
def root():
    return {"status": "Backend is running successfully!"}

@app.post("/generate")
def generate_content(req: PipelineRequest):
    try:
        script, scenes, design, storyboard = run_pipeline(
            idea=req.idea,
            num_scenes=req.num_scenes,
            tone=req.tone
        )
        return {
            "script": script,
            "scenes": [s.to_dict() for s in scenes],
            "design": design,
            "storyboard": storyboard
        }
    except MissingTokenError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7860)
