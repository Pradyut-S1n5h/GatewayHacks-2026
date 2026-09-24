const API_BASE = "http://localhost:8000";

// 1. Student Profile Lookup
document.getElementById('searchBtn').addEventListener('click', async () => {
    const studentId = document.getElementById('studentIdInput').value.trim();
    const resultBox = document.getElementById('profileResult');
    
    if (!studentId) {
        alert("Please enter a Student ID");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/students/${studentId}`);
        if (!res.ok) throw new Error("Student ID not found.");
        const data = await res.json();

        document.getElementById('resId').textContent = data.student_id;
        document.getElementById('resName').textContent = data.name;
        document.getElementById('resLevel').textContent = data.skill_level;
        document.getElementById('resRoadmap').textContent = data.current_roadmap;
        document.getElementById('resCourses').textContent = data.completed_courses.join(", ");
        
        resultBox.classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
});

// 2. Register Student from Webpage
document.getElementById('registerBtn').addEventListener('click', async () => {
    const student_id = document.getElementById('regId').value.trim();
    const name = document.getElementById('regName').value.trim();
    const skill_level = document.getElementById('regLevel').value;
    const current_roadmap = document.getElementById('regRoadmap').value.trim();
    const completed_courses = document.getElementById('regCourses').value.trim();
    const regResult = document.getElementById('regResult');

    if (!student_id || !name) {
        alert("Student ID and Name are required!");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/students/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, name, skill_level, current_roadmap, completed_courses })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Registration failed.");
        }

        const data = await res.json();
        regResult.textContent = `Success! Student profile created for ${data.name} (ID: ${data.student_id}). You can now look it up above!`;
        regResult.classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
});

// 3. Fetch NCERT Study Materials (Math/Science, No Email required)
async function fetchStudyMaterial(subject) {
    const resultBox = document.getElementById('materialResult');
    try {
        const res = await fetch(`${API_BASE}/learn/materials/${subject}`);
        if (!res.ok) throw new Error("Could not load materials.");
        const data = await res.json();

        document.getElementById('matTitle').textContent = data.title;
        document.getElementById('matDesc').textContent = data.description;
        document.getElementById('matLink').href = data.reference_link;
        
        resultBox.classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
}

// 4. AI Doubt Mechanism
document.getElementById('askAiBtn').addEventListener('click', async () => {
    const subject = document.getElementById('doubtSubject').value;
    const question = document.getElementById('doubtQuestion').value.trim();
    const aiResultBox = document.getElementById('aiResult');

    if (!question) {
        alert("Please type a question.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/learn/ai-doubt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, question })
        });
        
        if (!res.ok) throw new Error("Failed to get AI response.");
        const data = await res.json();

        document.getElementById('aiAnswerText').textContent = data.ai_response;
        aiResultBox.classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
});
