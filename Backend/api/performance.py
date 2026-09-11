from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.student import students
from services.ai import generate_response
from services.personalization import build_student_context

router = APIRouter(
    prefix="/api/performance",
    tags=["Performance Analysis"]
)

class PerformanceRequest(BaseModel):
    student_id: str

@router.post("/")
def analyze_performance(request: PerformanceRequest):
    student = students.get(request.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    context = build_student_context(student)
    
    system_prompt = """
    You are an AI learning performance analyst.
    Review the student's profile, streak, XP, rank, weaknesses, and strengths.
    Provide a watchable, highly encouraging, structured performance review:
    1. Overall Mastery Level
    2. Strengths & Gamification Milestones
    3. Active Learning Gaps to Address
    4. Next Actionable Step
    """
    
    user_prompt = f"""
    {context}
    Streak: {student.streak} days | XP: {student.xp} | Rank: {student.rank}
    Analyze this student's learning trajectory.
    """
    
    result = generate_response(system_prompt, user_prompt)
    
    return {
        "success": True,
        "student_id": student.student_id,
        "streak": student.streak,
        "xp": student.xp,
        "rank": student.rank,
        "performance_analysis": result
    }
