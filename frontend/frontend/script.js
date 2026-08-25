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
        question: "Which of these is a quadratic equation?",
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


function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function startDiagnostic() {

    currentQuestion = 0;
    score = 0;

    showScreen("diagnostic");

    loadQuestion();
}


function loadQuestion() {

    const question = questions[currentQuestion];

    document.getElementById("question-topic").textContent =
        question.topic;

    document.getElementById("question").textContent =
        question.question;

    document.getElementById("question-counter").textContent =
        `${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("progress").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;


    const answersContainer =
        document.getElementById("answers");

    answersContainer.innerHTML = "";


    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.className = "answer-button";

        button.textContent = answer;

        button.onclick = () => selectAnswer(index, button);

        answersContainer.appendChild(button);
    });
}


function selectAnswer(selectedIndex, selectedButton) {

    const question = questions[currentQuestion];

    const buttons =
        document.querySelectorAll(".answer-button");


    buttons.forEach(button => {
        button.disabled = true;
    });


    if (selectedIndex === question.correct) {

        selectedButton.classList.add("correct");

        score++;

    } else {

        selectedButton.classList.add("incorrect");

        buttons[question.correct].classList.add("correct");
    }


    setTimeout(() => {

        currentQuestion++;

        if (currentQuestion < questions.length) {

            loadQuestion();

        } else {

            showResults();

        }

    }, 700);
}


function showResults() {

    showScreen("results");
}


function startLearning() {

    showScreen("learning");

}


function checkPractice(button, isCorrect) {

    const result =
        document.getElementById("practice-result");


    if (isCorrect) {

        result.textContent =
            "Correct. The identity gives x² + 6x + 9.";

    } else {

        result.textContent =
            "Not quite. Try expanding (x + 3)(x + 3).";
    }
}
