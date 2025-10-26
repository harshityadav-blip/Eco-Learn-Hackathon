// Quiz JavaScript - Handles question loading, answer submission, and feedback

let currentQuestion = null;
let selectedAnswer = null;

// DOM elements
const loadingText = document.getElementById('loading-text');
const quizContent = document.getElementById('quiz-content');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const explanationText = document.getElementById('explanation-text');
const nextQuestionBtn = document.getElementById('next-question-btn');
const pointsValue = document.getElementById('points-value');
const questionNumber = document.getElementById('question-number');

// Get username from localStorage
const username = localStorage.getItem('currentUser');

// If not logged in, redirect to home
if (!username) {
    alert('Please log in first!');
    window.location.href = '/';
}

// Load the first question when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestion();
});

// Load a question from the backend
async function loadQuestion() {
    // Hide quiz content and show loading
    if (quizContent) quizContent.style.display = 'none';
    if (loadingText) loadingText.style.display = 'block';
    if (feedback) feedback.style.display = 'none';
    if (nextQuestionBtn) nextQuestionBtn.style.display = 'none';
    
    try {
        const response = await fetch('/get-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        });
        
        const data = await response.json();
        
        if (data.success && data.question) {
            currentQuestion = data.question;
            
            // Update the UI
            loadingText.style.display = 'none';
            quizContent.style.display = 'block';
            
            // Display the question
            questionText.textContent = currentQuestion.text;
            
            // Update points badge
            if (pointsValue) {
                pointsValue.textContent = currentQuestion.points;
            }
            
            // Clear previous options
            optionsContainer.innerHTML = '';
            
            // Create option buttons
            const options = [
                { key: 'a', value: currentQuestion.options.a },
                { key: 'b', value: currentQuestion.options.b },
                { key: 'c', value: currentQuestion.options.c },
                { key: 'd', value: currentQuestion.options.d }
            ];
            
            // Create buttons for each option
            options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = `${option.key.toUpperCase()}. ${option.value}`;
                button.dataset.answer = option.key;
                button.addEventListener('click', () => selectAnswer(option.key));
                optionsContainer.appendChild(button);
            });
            
            // Reset selected answer
            selectedAnswer = null;
        } else {
            alert('Failed to load question. Please try again.');
        }
    } catch (error) {
        console.error('Error loading question:', error);
        loadingText.textContent = 'Error loading question. Please try again.';
    }
}

// Handle answer selection
function selectAnswer(answer) {
    // Reset all buttons
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Highlight selected button
    const selectedButton = optionsContainer.querySelector(`[data-answer="${answer}"]`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
    
    selectedAnswer = answer;
    
    // Submit the answer after a short delay to show the selection
    setTimeout(submitAnswer, 500);
}

// Submit answer to backend
async function submitAnswer() {
    if (!selectedAnswer || !currentQuestion) {
        alert('Please select an answer first!');
        return;
    }
    
    // Disable all options
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    try {
        const response = await fetch('/submit-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                question_id: currentQuestion.id,
                answer: selectedAnswer
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show feedback
            quizContent.style.display = 'none';
            feedback.style.display = 'block';
            
            // Set feedback message
            if (data.correct) {
                feedback.className = 'feedback-container correct';
                feedbackText.innerHTML = `✅ <strong>Correct!</strong> +${currentQuestion.points} points!`;
                if (data.new_score !== -1) {
                    feedbackText.innerHTML += `<br><small style="font-size: 0.9rem; font-weight: 400;">New Total Score: ${data.new_score}</small>`;
                }
            } else {
                feedback.className = 'feedback-container incorrect';
                feedbackText.innerHTML = `❌ <strong>Incorrect!</strong> Try again next time.`;
            }
            
            // Show explanation
            if (data.explanation) {
                explanationText.innerHTML = `<strong>💡 Explanation:</strong> ${data.explanation}`;
            } else {
                explanationText.textContent = '';
            }
            
            // Show the "Next Question" button
            nextQuestionBtn.style.display = 'block';
        } else {
            alert('Failed to submit answer. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        alert('An error occurred. Please try again.');
    }
}

// Handle "Next Question" button click
nextQuestionBtn.addEventListener('click', () => {
    loadQuestion();
});

// Add CSS styles programmatically to enhance the quiz appearance
const style = document.createElement('style');
style.textContent = `
    #options-container button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    #feedback {
        margin-top: 20px;
    }
    
    #feedback-text {
        font-weight: 600;
    }
    
    #explanation-text {
        font-style: italic;
        opacity: 0.9;
        line-height: 1.6;
    }
`;
document.head.appendChild(style);

