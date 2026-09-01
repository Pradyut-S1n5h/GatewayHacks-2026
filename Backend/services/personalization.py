from models.student import Student


def build_student_context(student: Student) -> str:

    strengths = ", ".join(student.strengths) or "Not identified"
    weaknesses = ", ".join(student.weaknesses) or "Not identified"
    subjects = ", ".join(student.subjects) or "Not specified"

    return f"""
Student profile:

Name: {student.name or "Student"}
Grade: {student.grade}
Subjects: {subjects}
Learning level: {student.learning_level}
Strengths: {strengths}
Weaknesses: {weaknesses}
"""
