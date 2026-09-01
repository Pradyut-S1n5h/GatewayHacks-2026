from fastapi import APIRouter, HTTPException

from models.student import Student, StudentUpdate

router = APIRouter(
    prefix="/api/student",
    tags=["Student"]
)

students = {}


@router.post("/")
def create_student(student: Student):

    if student.student_id in students:
        raise HTTPException(
            status_code=409,
            detail="Student already exists"
        )

    students[student.student_id] = student

    return {
        "success": True,
        "student": student
    }


@router.get("/{student_id}")
def get_student(student_id: str):

    student = students.get(student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "success": True,
        "student": student
    }


@router.patch("/{student_id}")
def update_student(
    student_id: str,
    update: StudentUpdate
):

    student = students.get(student_id)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    updated_data = student.model_dump()

    for key, value in update.model_dump(
        exclude_unset=True
    ).items():

        updated_data[key] = value

    updated_student = Student(**updated_data)

    students[student_id] = updated_student

    return {
        "success": True,
        "student": updated_student
    }
