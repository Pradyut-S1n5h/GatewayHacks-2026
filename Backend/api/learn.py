from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.student import students
from services.ai import generate_response
from services.personalization import build_student_context

router = APIRouter(
    prefix="/api/learn",
    tags=["Learning"]
)


class LearnRequest(BaseModel):
    student_id: str
    topic: str


@router.post("/")
def learn(request: LearnRequest):

    student = students.get(request.student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    context = build_student_context(student)

    system_prompt = """
You are a personalized AI tutor.

Teach the requested topic according to the
student's grade and learning level.

Use:
- simple explanations
- examples
- step-by-step reasoning
- a short check-for-understanding question

Do not overwhelm the student.
"""

    user_prompt = f"""
{context}

Teach this topic:

{request.topic}
"""

    result = generate_response(
        system_prompt,
        user_prompt
    )

    return {
        "success": True,
        "topic": request.topic,
        "lesson": result
    }
