# In-memory mock database with Dummy Student configured
DATABASE = {
    "students": {
        "STU002": {
            "id": "STU002",
            "name": "Pradyut Singh",
            "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", # password: password123
            "level": "Level 3 Explorer",
            "roadmap": [
                {"topic": "Calculus & Derivatives", "status": "Completed"},
                {"topic": "Quantum Mechanics Basics", "status": "In Progress"},
                {"topic": "Organic Synthesis", "status": "Locked"}
            ],
            "xp": 1450,
            "progress_history": [40, 55, 70, 82]
        }
    }
}
