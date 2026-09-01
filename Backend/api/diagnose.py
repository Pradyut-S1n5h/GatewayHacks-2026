from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from api.student import students
from services.ai import generate_response
from services.personalization import build_student_context

router = APIRouter(
    prefix="/api/diagnose",
    tags=["Diagnosis"]
)


class DiagnoseRequest(BaseModel):
    student_id: str
    question: str


@router.post("/")
def diagnose(request: DiagnoseRequest):

    student = students.get(request.student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    context = build_student_context(student)

    system_prompt = """
You are an educational diagnostic AI.

Your job is to identify what a student understands
and where they are struggling.

Do not simply give the answer.

Return:
1. Topic
2. Estimated learning level
3. Likely misconception
4. Recommended next step

Keep the language appropriate for the student's grade.
"""

    user_prompt = f"""
{context}

Student's question:

{request.question}
"""

    result = generate_response(
        system_prompt,
        user_prompt
    )

    return {
        "success": True,
        "diagnosis": result
    }
