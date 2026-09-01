from pydantic import BaseModel, Field
from typing import List, Optional


class Student(BaseModel):
    student_id: str
    name: Optional[str] = None
    grade: int = Field(ge=1, le=12)
    subjects: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    learning_level: str = "beginner"


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[int] = Field(default=None, ge=1, le=12)
    subjects: Optional[List[str]] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    learning_level: Optional[str] = None
