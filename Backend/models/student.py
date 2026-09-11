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
    language: str = "en"  # Supports India-First multilingual design ("en" or "hi")
    streak: int = 0
    xp: int = 0
    rank: str = "Bronze"

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[int] = Field(default=None, ge=1, le=12)
    subjects: Optional[List[str]] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    learning_level: Optional[str] = None
    language: Optional[str] = None
    streak: Optional[int] = None
    xp: Optional[int] = None
    rank: Optional[str] = None
