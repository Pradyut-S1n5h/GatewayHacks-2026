from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from api.student import students
from services.ai import generate_response
from services.personalization import build_student_context
from services.skill_graph import get_prerequisites, diagnose_learning_gap

router = APIRouter(
    prefix="/api/test",
    tags=["Multiple Test Assessment & Skill Mapping"]
)

class TestSubmission(BaseModel):
    student_id: str
    topic: str
    questions: List[str]
    student_answers: List[str]

@router.post("/evaluate")
def evaluate_test(submission: TestSubmission):
    student = students.get(submission.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if len(submission.questions) != len(submission.student_answers):
        raise HTTPException(status_code=400, detail="Mismatch between question count and answer count.")

    context = build_student_context(student)
    
    qa_pairs = "\n".join([
        f"Q{i+1}: {q}\nStudent Answer: {a}" 
        for i, (q, a) in enumerate(zip(submission.questions, submission.student_answers))
    ])

    lang_instruction = "Respond in Hindi or Hinglish if the student's language is set to 'hi'." if student.language == "hi" else "Respond in clear English."

    system_prompt = f"""
    You are an advanced AI educational diagnostic engine and misconception profiler.
    Analyze the student's answers. {lang_instruction}
    Provide:
    1. Score breakdown.
    2. Specific misconceptions identified (e.g., sign error, conceptual gap).
    3. Recommended remediation steps.
    """
    
    user_prompt = f"""
    {context}
    Topic: {submission.topic}
    
    Questions & Submissions:
    {qa_pairs}
    """
    
    evaluation = generate_response(system_prompt, user_prompt)
    
    # Gamification rewards: XP and streak updates
    earned_xp = len(submission.questions) * 15
    student.xp += earned_xp
    student.streak += 1
    
    if student.xp > 200:
        student.rank = "Gold"
    elif student.xp > 100:
        student.rank = "Silver"

    # Prerequisite Skill Graph Routing
    suggested_remediation_topic = submission.topic
    if "fail" in evaluation.lower() or "incorrect" in evaluation.lower() or "misconception" in evaluation.lower():
        prereqs = get_prerequisites(submission.topic)
        if prereqs:
            suggested_remediation_topic = diagnose_learning_gap(submission.topic)
            if suggested_remediation_topic not in student.weaknesses:
                student.weaknesses.append(suggested_remediation_topic)

    return {
        "success": True,
        "student_id": student.student_id,
        "topic": submission.topic,
        "xp_earned": earned_xp,
        "total_xp": student.xp,
        "streak": student.streak,
        "rank": student.rank,
        "root_prerequisite_gap": suggested_remediation_topic,
        "evaluation": evaluation
    }
