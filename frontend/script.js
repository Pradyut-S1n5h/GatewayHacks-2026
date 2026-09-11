// ===============================
// LEARNNEXT - MAIN JAVASCRIPT
// ===============================

// Backend API Base URL (Change if hosting on a public domain/Codespace URL)
const API_BASE = "http://localhost:7860"; 

let currentStudentId = "student_123"; // Default student profile

const questions = [
    {
        topic: "Algebra",
        question: "If x = 3, what is the value of 2x + 5?",
        answers: ["8", "11", "13", "15"],
        correct: 1
    },
    {
        topic: "Algebraic Identities",
        question: "Which expression is equal to (a + b)²?",
        answers: [
            "a² + b²",
            "a² + 2ab + b²",
            "a² - 2ab + b²",
            "2a + 2b"
        ],
        correct: 1
    },
    {
        topic: "Factorisation",
        question: "What is the factorised form of x² + 5x + 6?",
        answers: [
            "(x + 2)(x + 3)",
            "(x + 1)(x + 6)",
            "(x - 2)(x - 3)",
            "(x + 5)(x + 1)"
        ],
        correct: 0
    },
    {
        topic: "Linear Equations",
        question: "If 2x + 4 = 10, what is x?",
        answers: ["2", "3", "4", "5"],
        correct: 1
    },
    {
        topic: "Quadratics",
        question: "Which of these is a standard quadratic equation format?",
        answers: [
            "2x + 5 = 0",
            "x² + 3x + 2 = 0",
            "5x - 2 = 0",
            "x + 1 = 4"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let answersGiven = [];


// ===============================
// SCREEN NAVIGATION
// ===============================

function showScreen(screenId) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const targetScreen = document.getElementById(screenId);

    if (!targetScreen) {
        console.error("Screen not found:", screenId);
        return;
    }

    targetScreen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// START DIAGNOSTIC
// ===============================

function startDiagnostic() {

    currentQuestion = 0;
    score = 0;
    answersGiven = [];

    showScreen("diagnostic");

    loadQuestion();
}


// ===============================
// LOAD QUESTION
// ===============================

function loadQuestion() {

    const question = questions[currentQuestion];

    if (!question) {
        showResults();
        return;
    }

    const topicElement = document.getElementById("question-topic");
    const questionElement = document.getElementById("question");
    const counterElement = document.getElementById("question-counter");
    const progressElement = document.getElementById("progress");
    const answersContainer = document.getElementById("answers");

    if (topicElement) topicElement.textContent = question.topic;
    if (questionElement) questionElement.textContent = question.question;

    if (counterElement) {
        counterElement.textContent = `${currentQuestion + 1} / ${questions.length}`;
    }

    if (progressElement) {
        progressElement.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    }

    if (!answersContainer) return;

    answersContainer.innerHTML = "";

    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = answer;

        button.addEventListener("click", function () {
            selectAnswer(index, button);
        });

        answersContainer.appendChild(button);
    });
}


// ===============================
// SELECT ANSWER
// ===============================

function selectAnswer(selectedIndex, selectedButton) {

    const question = questions[currentQuestion];

    // Prevent double-clicking
    const buttons = document.querySelectorAll(".answer-button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    // Store answer
    answersGiven.push({
        topic: question.topic,
        selected: selectedIndex,
        correct: question.correct,
        isCorrect: selectedIndex === question.correct
    });

    // Correct answer
    if (selectedIndex === question.correct) {

        selectedButton.classList.add("correct");
        score++;

    } else {

        // Wrong answer
        selectedButton.classList.add("incorrect");

        // Show correct answer
        if (buttons[question.correct]) {
            buttons[question.correct].classList.add("correct");
        }
    }

    // Move to next question
    setTimeout(function () {

        currentQuestion++;

        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }

    }, 900);
}


// ===============================
// SHOW RESULTS
// ===============================

function showResults() {
    showScreen("results");
    updateResults();
}


// ===============================
// UPDATE RESULT SCREEN
// ===============================

function updateResults() {

    const skills = document.querySelectorAll(".skill");

    if (!skills.length) {
        return;
    }

    const percentage = Math.round((score / questions.length) * 100);
    console.log("Diagnostic score:", score, "Percentage:", percentage);

    answersGiven.forEach((answer, index) => {

        if (!skills[index]) return;

        const skill = skills[index];
        const icon = skill.querySelector(".skill-icon");
        const small = skill.querySelector("small");

        if (answer.isCorrect) {
            skill.classList.remove("needs-work", "locked");
            skill.classList.add("mastered");

            if (icon) icon.textContent = "✓";
            if (small) small.textContent = "Foundation confirmed";
        } else {
            skill.classList.remove("mastered", "locked");
            skill.classList.add("needs-work");

            if (icon) icon.textContent = "!";
            if (small) small.textContent = "Attention recommended";
        }
    });

    const firstWrong = answersGiven.find(answer => !answer.isCorrect);
    const recommendationTitle = document.querySelector(".recommendation h3");
    const recommendationText = document.querySelector(".recommendation p");

    if (firstWrong) {
        if (recommendationTitle) {
            recommendationTitle.textContent = `Strengthen ${firstWrong.topic}`;
        }
        if (recommendationText) {
            recommendationText.textContent = `Your diagnostic suggests that ${firstWrong.topic} needs more practice. Let's fetch a targeted AI lesson for this topic.`;
        }
        // Automatically trigger AI lesson preparation for the weak topic
        fetchAILesson(firstWrong.topic);
    } else {
        if (recommendationTitle) {
            recommendationTitle.textContent = "Excellent foundation!";
        }
        if (recommendationText) {
            recommendationText.textContent = `You answered all ${questions.length} questions correctly. Your current diagnostic shows a strong foundation.`;
        }
    }
}


// ===============================
// AI BACKEND INTEGRATION (NEW)
// ===============================

// 1. Fetch AI Lesson from FastAPI /api/learn
async function fetchAILesson(topic) {
    try {
        const response = await fetch(`${API_BASE}/api/learn/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student_id: currentStudentId,
                topic: topic
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log("AI Lesson loaded:", data.lesson);
            const lessonContainer = document.querySelector("#learning .lesson-content"); // adjust selector based on HTML
            if (lessonContainer) {
                lessonContainer.textContent = data.lesson;
            }
        }
    } catch (error) {
        console.error("Error connecting to backend AI lesson endpoint:", error);
    }
}

// 2. Fetch AI Practice Questions from FastAPI /api/practice
async function fetchAIPractice(topic, count = 3) {
    try {
        const response = await fetch(`${API_BASE}/api/practice/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student_id: currentStudentId,
                topic: topic,
                number_of_questions: count
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log("AI Practice generated:", data.practice);
        }
    } catch (error) {
        console.error("Error connecting to backend AI practice endpoint:", error);
    }
}


// ===============================
// START LEARNING
// ===============================

function startLearning() {
    showScreen("learning");
    resetPractice();
}


// ===============================
// PRACTICE QUESTION
// ===============================

function checkPractice(button, isCorrect) {

    const result = document.getElementById("practice-result");
    const options = document.querySelectorAll(".practice-options button");

    options.forEach(btn => {
        btn.disabled = true;
    });

    if (isCorrect) {
        button.style.borderColor = "var(--success)";
        button.style.background = "var(--success-bg)";
        button.style.color = "#34d399";

        if (result) {
            result.style.color = "#34d399";
            result.textContent = "Correct! (x + 3)² = x² + 6x + 9.";
        }
    } else {
        button.style.borderColor = "var(--error)";
        button.style.background = "var(--error-bg)";
        button.style.color = "#f87171";

        if (result) {
            result.style.color = "#f87171";
            result.textContent = "Not quite. Remember: (x + a)² = x² + 2ax + a².";
        }
    }
}


// ===============================
// RESET PRACTICE
// ===============================

function resetPractice() {

    const result = document.getElementById("practice-result");
    const options = document.querySelectorAll(".practice-options button");

    options.forEach(button => {
        button.disabled = false;
        button.style.borderColor = "";
        button.style.background = "";
        button.style.color = "";
    });

    if (result) {
        result.textContent = "";
    }
}


// ===============================
// INITIAL SETUP
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    console.log("LearnNext JavaScript loaded successfully.");
    showScreen("home");
});
