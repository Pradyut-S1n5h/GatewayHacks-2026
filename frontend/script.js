const API_URL = "http://localhost:8000";
let currentUser = null;
let chartInstance = null;

async function handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById("login-id").value;
    const password = document.getElementById("login-password").value;
    try {
        const res = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Login failed");
        currentUser = data.student;
        initDashboard();
    } catch (err) { alert(err.message); }
}

async function handleRegister(e) {
    e.preventDefault();
    const id = document.getElementById("reg-id").value;
    const name = document.getElementById("reg-name").value;
    const password = document.getElementById("reg-password").value;
    try {
        const res = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, name, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Registration failed");
        currentUser = data.student;
        initDashboard();
    } catch (err) { alert(err.message); }
}

function logout() {
    currentUser = null;
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
    document.getElementById("nav-user-info").classList.add("hidden");
}

async function initDashboard() {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    document.getElementById("nav-user-info").classList.remove("hidden");
    
    document.getElementById("nav-name").innerText = currentUser.name;
    document.getElementById("nav-xp").innerText = `${currentUser.xp} XP`;

    document.getElementById("profile-details").innerHTML = `
        <p><strong>ID:</strong> ${currentUser.id}</p>
        <p><strong>Name:</strong> ${currentUser.name}</p>
        <p><strong>Standing:</strong> ${currentUser.level}</p>
        <p><strong>Total XP:</strong> ${currentUser.xp}</p>
    `;

    renderRoadmap();
    renderChart(currentUser.progress_history);
    loadLeaderboard();
}

async function loadLeaderboard() {
    try {
        const res = await fetch(`${API_URL}/api/leaderboard`);
        const board = await res.json();
        const tbody = document.getElementById("leaderboard-body");
        tbody.innerHTML = "";
        board.forEach((s, index) => {
            tbody.innerHTML += `
                <tr class="${s.id === currentUser.id ? 'bg-cyan-500/10 font-bold' : ''}">
                    <td class="py-3">#${index + 1}</td>
                    <td class="py-3">${s.name}</td>
                    <td class="py-3 text-slate-400">${s.level}</td>
                    <td class="py-3 text-right text-cyan-400">${s.xp} XP</td>
                </tr>
            `;
        });
    } catch (e) { console.error(e); }
}

function renderRoadmap() {
    const container = document.getElementById("roadmap-container");
    container.innerHTML = "";
    currentUser.roadmap.forEach(node => {
        const color = node.status === 'Completed' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400';
        container.innerHTML += `
            <div class="border ${color} p-3 rounded-2xl flex justify-between items-center text-xs">
                <span>📍 ${node.topic}</span>
                <span class="font-bold px-2 py-0.5 rounded-lg bg-slate-950">${node.status}</span>
            </div>
        `;
    });
}

function renderChart(history) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map((_, i) => `Test ${i + 1}`),
            datasets: [{
                label: 'Score Progress',
                data: history,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

async function askAI() {
    const subject = document.getElementById("doubt-subject").value;
    const question = document.getElementById("doubt-input").value;
    if (!question) return;
    const ansBox = document.getElementById("ai-answer-box");
    ansBox.classList.remove("hidden");
    ansBox.innerText = "Thinking with AI model...";

    try {
        const res = await fetch(`${API_URL}/api/ai/doubt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject, question })
        });
        const data = await res.json();
        ansBox.innerText = data.answer;
    } catch (e) { ansBox.innerText = "Error connecting to AI."; }
}

async function generateTest() {
    const topic = document.getElementById("diag-topic").value;
    const container = document.getElementById("diagnostic-container");
    container.innerHTML = "Generating AI Diagnostic Assessment...";

    try {
        const res = await fetch(`${API_URL}/api/ai/diagnose`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic })
        });
        const test = await res.json();
        
        let html = `<p class="font-bold text-cyan-400 mb-2">Diagnostic: ${test.topic}</p>`;
        test.questions.forEach((q, idx) => {
            html += `<p class="mb-1 text-xs">${idx+1}. ${q.q}</p>`;
            q.options.forEach(opt => {
                html += `<label class="block text-[11px] text-slate-400 ml-2"><input type="radio" name="q${idx}" value="${opt}"> ${opt}</label>`;
            });
        });
        html += `<button onclick="submitTest('${test.topic}')" class="mt-3 bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold">Submit Assessment</button>`;
        container.innerHTML = html;
    } catch (e) { container.innerHTML = "Failed to create test."; }
}

async function submitTest(topic) {
    let score = 2; 
    const res = await fetch(`${API_URL}/api/ai/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: currentUser.id, topic, score })
    });
    const result = await res.json();
    currentUser.xp = result.new_xp;
    currentUser.progress_history = result.progress_history;
    
    document.getElementById("nav-xp").innerText = `${currentUser.xp} XP`;
    renderChart(currentUser.progress_history);
    loadLeaderboard();
    
    document.getElementById("diagnostic-container").innerHTML = `
        <p class="font-bold text-emerald-400 mb-1">AI Analysis & Feedback:</p>
        <p class="text-xs text-slate-300">${result.feedback}</p>
        <p class="text-xs text-cyan-400 mt-2 font-bold">+${score * 30} XP Claimed!</p>
    `;
}
