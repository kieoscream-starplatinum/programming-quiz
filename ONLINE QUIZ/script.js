// Quiz Questions Data Structure
const quizQuestions = [
    {
        question: "What does HTML stand for?",
        options: [
            "HyperText Markup Language",
            "High-Level Text Markup Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which of the following is used to style web pages?",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "Python"
        ],
        correct: 1
    },
    {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: [
            "variable x = 5;",
            "var x = 5;",
            "x := 5;",
            "x = 5;"
        ],
        correct: 1
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: [
            "//",
            "<!-- -->",
            "#",
            "/* */"
        ],
        correct: 0
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Colorful Style Sheets"
        ],
        correct: 1
    },
    {
        question: "Which method is used to add an element to the end of an array in JavaScript?",
        options: [
            "push()",
            "pop()",
            "shift()",
            "unshift()"
        ],
        correct: 0
    },
    {
        question: "What is the output of: console.log(typeof null)?",
        options: [
            "null",
            "undefined",
            "object",
            "boolean"
        ],
        correct: 2
    },
    {
        question: "Which HTML tag is used to create a hyperlink?",
        options: [
            "<link>",
            "<a>",
            "<href>",
            "<url>"
        ],
        correct: 1
    },
    {
        question: "What is the purpose of the 'let' keyword in JavaScript?",
        options: [
            "To declare a constant variable",
            "To declare a block-scoped variable",
            "To declare a global variable",
            "To declare a function"
        ],
        correct: 1
    },
    {
        question: "Which CSS property is used to change the text color?",
        options: [
            "font-color",
            "text-color",
            "color",
            "text-style"
        ],
        correct: 2
    }
];

// Quiz State Management
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let timerInterval = null;
let timeRemaining = 60;
let answerSelected = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionNumber = document.getElementById('question-number');
const totalQuestions = document.getElementById('total-questions');
const progressBar = document.getElementById('progress-bar');
const timerSeconds = document.getElementById('timer-seconds');
const timerCircle = document.getElementById('timer-circle');
const scoreValue = document.getElementById('score-value');
const scorePercentage = document.getElementById('score-percentage');
const totalScore = document.getElementById('total-score');
const resultsDetails = document.getElementById('results-details');

// Initialize Quiz
function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    timeRemaining = 60;
    answerSelected = false;
    
    totalQuestions.textContent = `of ${quizQuestions.length}`;
    showScreen('welcome');
}

// Screen Management
function showScreen(screenName) {
    welcomeScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    
    if (screenName === 'welcome') {
        welcomeScreen.classList.add('active');
    } else if (screenName === 'quiz') {
        quizScreen.classList.add('active');
    } else if (screenName === 'results') {
        resultsScreen.classList.add('active');
    }
}

// Start Quiz
function startQuiz() {
    showScreen('quiz');
    loadQuestion();
}

// Load Question
function loadQuestion() {
    // Reset state
    answerSelected = false;
    timeRemaining = 60;
    nextBtn.disabled = true;
    
    // Clear previous timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Update question number and progress
    questionNumber.textContent = `Question ${currentQuestionIndex + 1}`;
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Display question
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    
    // Clear and populate options
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `<span class="option-label">${String.fromCharCode(65 + index)}.</span>${option}`;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionElement);
    });
    
    // Start timer
    startTimer();
}

// Timer Implementation (1 minute per question)
function startTimer() {
    // Reset timer display
    timerSeconds.textContent = timeRemaining;
    updateTimerCircle(100);
    
    // Start countdown
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerSeconds.textContent = timeRemaining;
        
        // Calculate percentage for circle progress
        const percentage = (timeRemaining / 60) * 100;
        updateTimerCircle(percentage);
        
        // Change color based on time remaining
        if (timeRemaining <= 10) {
            timerCircle.classList.add('danger');
            timerCircle.classList.remove('warning');
        } else if (timeRemaining <= 20) {
            timerCircle.classList.add('warning');
            timerCircle.classList.remove('danger');
        } else {
            timerCircle.classList.remove('warning', 'danger');
        }
        
        // Auto-advance when timer reaches zero
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            if (!answerSelected) {
                // No answer selected, mark as incorrect
                userAnswers[currentQuestionIndex] = -1;
                highlightCorrectAnswer();
            }
            setTimeout(() => {
                moveToNextQuestion();
            }, 1000);
        }
    }, 1000);
}

// Update Timer Circle Visual
function updateTimerCircle(percentage) {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percentage / 100) * circumference;
    timerCircle.style.strokeDashoffset = offset;
}

// Select Answer
function selectAnswer(selectedIndex) {
    if (answerSelected) return;
    
    answerSelected = true;
    clearInterval(timerInterval);
    
    // Store user's answer
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add('disabled');
        option.style.pointerEvents = 'none';
    });
    
    // Highlight selected answer
    const selectedOption = options[selectedIndex];
    selectedOption.classList.add('selected');
    
    // Check if correct and highlight
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correct) {
        selectedOption.classList.add('correct');
        score++;
    } else {
        selectedOption.classList.add('incorrect');
        highlightCorrectAnswer();
    }
    
    // Enable next button
    nextBtn.disabled = false;
}

// Highlight Correct Answer
function highlightCorrectAnswer() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    const correctOption = options[currentQuestion.correct];
    correctOption.classList.add('correct');
}

// Move to Next Question
function moveToNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    showScreen('results');
    
    // Calculate and display score
    const percentage = Math.round((score / quizQuestions.length) * 100);
    scoreValue.textContent = score;
    scorePercentage.textContent = `${percentage}%`;
    totalScore.textContent = quizQuestions.length;
    
    // Display detailed results
    resultsDetails.innerHTML = '';
    quizQuestions.forEach((question, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const userAnswerIndex = userAnswers[index];
        const isCorrect = userAnswerIndex === question.correct;
        
        if (isCorrect) {
            resultItem.classList.add('correct');
        } else {
            resultItem.classList.add('incorrect');
        }
        
        const questionText = document.createElement('div');
        questionText.className = 'result-question';
        questionText.textContent = `${index + 1}. ${question.question}`;
        
        const status = document.createElement('div');
        status.className = `result-status ${isCorrect ? 'correct' : 'incorrect'}`;
        
        if (isCorrect) {
            status.textContent = '✓ Correct';
        } else {
            if (userAnswerIndex === -1) {
                status.textContent = '✗ Timeout';
            } else {
                const userAnswer = question.options[userAnswerIndex];
                const correctAnswer = question.options[question.correct];
                status.textContent = `✗ Wrong (Correct: ${correctAnswer})`;
            }
        }
        
        resultItem.appendChild(questionText);
        resultItem.appendChild(status);
        resultsDetails.appendChild(resultItem);
    });
}

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', moveToNextQuestion);
restartBtn.addEventListener('click', () => {
    initQuiz();
});

// Initialize on page load
initQuiz();

