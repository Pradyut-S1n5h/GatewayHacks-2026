from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.student import students
from services.ai import generate_response
from services.personalization import build_student_context
from services.skill_graph import get_prerequisites

router = APIRouter(
    prefix="/api/roadmap",
    tags=["Personalized Study Roadmap"]
)

class RoadmapRequest(BaseModel):
    student_id: str

@router.post("/")
def generate_roadmap(request: RoadmapRequest):
    student = students.get(request.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    context = build_student_context(student)
    
    # Gather prerequisites for all known weaknesses
    prerequisite_targets = []
    for weakness in student.weaknesses:
        prereqs = get_prerequisites(weakness)
        prerequisite_targets.extend(prereqs)
    
    unique_targets = list(set(prerequisite_targets + student.weaknesses))
    targets_str = ", ".join(unique_targets) if unique_targets else "General foundational mastery"

    lang_instruction = "Provide the roadmap in Hindi or Hinglish if the student's language preference is set to 'hi'." if student.language == "hi" else "Provide the roadmap in clear English."

    system_prompt = f"""
    You are an expert AI curriculum planner and educational strategist.
    Based on the student's profile, current rank, XP, and identified learning gaps/prerequisites, 
    generate a tailored, 3-phase milestone study roadmap.
    {lang_instruction}
    
    Structure the response clearly:
    - Phase 1: Immediate Foundation Patch (Targeting root prerequisite gaps)
    - Phase 2: Core Concept Mastery & Practice Drills
    - Phase 3: Advanced Challenge & Rank Up
    """
    
    user_prompt = f"""
    {context}
    Identified Gaps & Target Prerequisite Nodes: {targets_str}
    Current Rank: {student.rank} | XP: {student.xp}
    
    Generate the masterclass roadmap.
    """
    
    roadmap_result = generate_response(system_prompt, user_prompt)
    
    return {
        "success": True,
        "student_id": student.student_id,
        "target_gaps": unique_targets,
        "roadmap": roadmap_result
    }
