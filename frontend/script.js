// ===============================
// LEARNNEXT - MAIN JAVASCRIPT
// ===============================

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

    topicElement.textContent = question.topic;

    questionElement.textContent = question.question;

    counterElement.textContent =
        `${currentQuestion + 1} / ${questions.length}`;

    progressElement.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

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

    // If there aren't skill cards, stop safely
    if (!skills.length) {
        return;
    }

    // Calculate percentage
    const percentage =
        Math.round((score / questions.length) * 100);

    console.log("Diagnostic score:", score);
    console.log("Percentage:", percentage);

    // Map each question to a skill card
    answersGiven.forEach((answer, index) => {

        if (!skills[index]) {
            return;
        }

        const skill = skills[index];
        const icon = skill.querySelector(".skill-icon");
        const small = skill.querySelector("small");

        if (answer.isCorrect) {

            skill.classList.remove("needs-work", "locked");
            skill.classList.add("mastered");

            if (icon) {
                icon.textContent = "✓";
            }

            if (small) {
                small.textContent = "Foundation confirmed";
            }

        } else {

            skill.classList.remove("mastered", "locked");
            skill.classList.add("needs-work");

            if (icon) {
                icon.textContent = "!";
            }

            if (small) {
                small.textContent = "Attention recommended";
            }
        }
    });

    // Find first incorrect answer
    const firstWrong = answersGiven.find(answer => !answer.isCorrect);

    const recommendationTitle =
        document.querySelector(".recommendation h3");

    const recommendationText =
        document.querySelector(".recommendation p");

    if (firstWrong) {

        if (recommendationTitle) {
            recommendationTitle.textContent =
                `Strengthen ${firstWrong.topic}`;
        }

        if (recommendationText) {
            recommendationText.textContent =
                `Your diagnostic suggests that ${firstWrong.topic} needs more practice before moving forward. Let's strengthen this concept with a targeted lesson.`;
        }

    } else {

        if (recommendationTitle) {
            recommendationTitle.textContent =
                "Excellent foundation!";
        }

        if (recommendationText) {
            recommendationText.textContent =
                `You answered all ${questions.length} questions correctly. Your current diagnostic shows a strong foundation.`;
        }
    }

    console.log(`Final score: ${score}/${questions.length}`);
}


// ===============================
// START LEARNING
// ===============================

function startLearning() {

    showScreen("learning");

    // Reset practice question
    resetPractice();
}


// ===============================
// PRACTICE QUESTION
// ===============================

function checkPractice(button, isCorrect) {

    const result =
        document.getElementById("practice-result");

    const options =
        document.querySelectorAll(".practice-options button");

    // Disable all options
    options.forEach(btn => {
        btn.disabled = true;
    });

    if (isCorrect) {

        button.style.borderColor = "var(--success)";
        button.style.background = "var(--success-bg)";
        button.style.color = "#34d399";

        result.style.color = "#34d399";

        result.textContent =
            "Correct! (x + 3)² = x² + 6x + 9.";

    } else {

        button.style.borderColor = "var(--error)";
        button.style.background = "var(--error-bg)";
        button.style.color = "#f87171";

        result.style.color = "#f87171";

        result.textContent =
            "Not quite. Remember: (x + a)² = x² + 2ax + a².";
    }
}


// ===============================
// RESET PRACTICE
// ===============================

function resetPractice() {

    const result =
        document.getElementById("practice-result");

    const options =
        document.querySelectorAll(".practice-options button");

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

    // Make sure home is visible when the page opens
    showScreen("home");

});
