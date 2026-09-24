from pydantic import BaseModel
from typing import List, Optional

class StudentProfile(BaseModel):
    student_id: str
    name: str
    skill_level: str
    completed_courses: List[str]
    current_roadmap: Optional[str] = None

class StudentRegister(BaseModel):
    student_id: str
    name: str
    skill_level: str
    completed_courses: str  # Comma-separated string from form
    current_roadmap: Optional[str] = None
