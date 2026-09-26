from pydantic import BaseModel

class StudentRegister(BaseModel):
    id: str
    name: str
    password: str

class StudentLogin(BaseModel):
    id: str
    password: str

class DoubtRequest(BaseModel):
    subject: str
    question: str

class DiagnoseRequest(BaseModel):
    topic: str

class SubmitTestRequest(BaseModel):
    student_id: str
    topic: str
    score: int
