from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai import query_ai_doubt

router = APIRouter(prefix="/learn", tags=["learn"])

class DoubtRequest(BaseModel):
    subject: str
    question: str

NCERT_RESOURCES = {
    "math": {
        "title": "NCERT Mathematics Learning Hub",
        "description": "Official curriculum chapters, practice problem sets, and theorem proofs.",
        "reference_link": "https://ncert.nic.in/textbook.php"
    },
    "science": {
        "title": "NCERT Science Learning Hub",
        "description": "Physics, Chemistry, and Biology chapters with interactive experiments and summaries.",
        "reference_link": "https://ncert.nic.in/textbook.php"
    }
}

@router.get("/materials/{subject}")
def get_study_materials(subject: str):
    sub = subject.lower()
    if sub not in NCERT_RESOURCES:
        raise HTTPException(status_code=404, detail="Subject material not found. Choose 'math' or 'science'.")
    return NCERT_RESOURCES[sub]

@router.post("/ai-doubt")
def ask_ai_doubt(payload: DoubtRequest):
    answer = query_ai_doubt(payload.subject, payload.question)
    return {"subject": payload.subject, "question": payload.question, "ai_response": answer}
