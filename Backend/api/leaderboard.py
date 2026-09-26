from fastapi import APIRouter
from database import DATABASE

router = APIRouter(prefix="/api", tags=["Leaderboard"])

@router.get("/leaderboard")
def get_leaderboard():
    students_list = list(DATABASE["students"].values())
    sorted_students = sorted(students_list, key=lambda x: x["xp"], reverse=True)
    return [{"id": s["id"], "name": s["name"], "level": s["level"], "xp": s["xp"]} for s in sorted_students]
