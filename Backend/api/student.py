from fastapi import APIRouter, HTTPException
from models.student import StudentProfile, StudentRegister

router = APIRouter(prefix="/students", tags=["students"])

# Mutable mock database initialized with a sample student
fake_student_db = {
    "STU001": {
        "student_id": "STU001",
        "name": "Alex Johnson",
        "skill_level": "Intermediate",
        "completed_courses": ["Algebra Basics", "Motion & Force"],
        "current_roadmap": "Math & Science Fundamentals"
    }
}

@router.get("/{student_id}", response_model=StudentProfile)
def get_student_profile(student_id: str):
    student = fake_student_db.get(student_id.upper())
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found. Try registering below or use STU001.")
    return student

@router.post("/register", response_model=StudentProfile)
def register_student(payload: StudentRegister):
    s_id = payload.student_id.upper().strip()
    if s_id in fake_student_db:
        raise HTTPException(status_code=400, detail="Student ID already exists!")
    
    # Process comma-separated course list safely
    courses = [c.strip() for c in payload.completed_courses.split(",") if c.strip()]
    
    new_student = {
        "student_id": s_id,
        "name": payload.name.strip(),
        "skill_level": payload.skill_level,
        "completed_courses": courses,
        "current_roadmap": payload.current_roadmap.strip() if payload.current_roadmap else "General STEM"
    }
    
    fake_student_db[s_id] = new_student
    return new_student
