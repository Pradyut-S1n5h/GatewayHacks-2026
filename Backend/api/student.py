from fastapi import APIRouter, HTTPException
from database import DATABASE

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.get("/{student_id}")
def get_student(student_id: str):
    student = DATABASE["students"].get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    return student
