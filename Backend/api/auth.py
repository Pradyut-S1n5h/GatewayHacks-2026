from fastapi import APIRouter, HTTPException
from models import StudentRegister, StudentLogin
from database import DATABASE
from passlib.context import CryptContext

router = APIRouter(prefix="/api", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
def register_student(data: StudentRegister):
    if data.id in DATABASE["students"]:
        raise HTTPException(status_code=400, detail="Student ID already exists.")
    
    hashed_pw = pwd_context.hash(data.password)
    DATABASE["students"][data.id] = {
        "id": data.id,
        "name": data.name,
        "password_hash": hashed_pw,
        "level": "Level 1 Novice",
        "xp": 100,
        "roadmap": [{"topic": "STEM Fundamentals", "status": "In Progress"}],
        "progress_history": [50]
    }
    return {"message": "Account created successfully", "student": DATABASE["students"][data.id]}

@router.post("/login")
def login_student(data: StudentLogin):
    student = DATABASE["students"].get(data.id)
    if not student or not pwd_context.verify(data.password, student["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid Student ID or Password.")
    return {"message": "Login successful", "student": student}
