from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.student import students
from services.ai import generate_response
from services.personalization import build_student_context

router = APIRouter(
    prefix="/api/practice",
    tags=["Practice"]
)


class PracticeRequest(BaseModel):
    student_id: str
    topic: str
    number_of_questions: int = 5


@router.post("/")
def practice(request: PracticeRequest):

    student = students.get(request.student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    context = build_student_context(student)

    system_prompt = """
You are a personalized educational assessment AI.

Generate practice questions appropriate for
the student's grade and current learning level.

Start from easier questions and gradually increase
difficulty.

Return numbered questions followed by an answer key.
"""

    user_prompt = f"""
{context}

Topic:
{request.topic}

Number of questions:
{request.number_of_questions}
"""

    result = generate_response(
        system_prompt,
        user_prompt
    )

    return {
        "success": True,
        "topic": request.topic,
        "practice": result
    }
