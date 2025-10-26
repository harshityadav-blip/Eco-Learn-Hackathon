// Utility function to show messages
function showMessage(message, type = 'error') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
}

// Utility function to hide messages
function hideMessage() {
    const messageElement = document.getElementById('message');
    messageElement.style.display = 'none';
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.closest('.password-container').querySelector('.toggle-password');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}


// ### "STRONG PASSWORD" METER (UPDATED) ###
function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special char

    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    strengthBar.className = 'strength-bar'; // Reset class
    
    switch (score) {
        case 0:
            strengthBar.style.width = '0%';
            strengthText.textContent = ''; // Clear text when there is no password
            break;
        case 1:
        case 2:
            strengthBar.classList.add('weak');
            strengthBar.style.width = '33%';
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#ffffff'; // White text on red bg
            break;
        case 3:
        case 4:
            strengthBar.classList.add('medium');
            strengthBar.style.width = '66%';
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#000000'; // Black text on yellow bg for readability
            break;
        case 5:
            strengthBar.classList.add('strong');
            strengthBar.style.width = '100%';
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#ffffff'; // White text on green bg
            break;
        default:
            strengthBar.style.width = '0%';
            strengthText.textContent = '';
    }
    return score;
}

// ### "SUGGEST PASSWORD" FUNCTION ###
function generateStrongPassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|';
    const all = upper + lower + numbers + symbols;
    
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = 0; i < 8; i++) { // Total length 12
        password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle the generated password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}

// ### "CAPTCHA" FUNCTIONALITY ###
let captchaAnswer = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    document.getElementById('captchaLabel').textContent = `Verification: ${num1} + ${num2} = ?`;
    document.getElementById('captchaInput').value = ''; // Clear old input
}


// ### MAIN SCRIPT ###
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;

    // Check for saved theme in localStorage on page load
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        themeToggleBtn.textContent = '🌙';
    } else {
        themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', () => {
        // Toggle the .light-theme class on the body
        body.classList.toggle('light-theme');

        // Update button icon and save preference to localStorage
        if (body.classList.contains('light-theme')) {
            themeToggleBtn.textContent = '🌙'; // If theme is light, show moon icon
            localStorage.setItem('theme', 'light'); // Save 'light' to localStorage
        } else {
            themeToggleBtn.textContent = '☀️'; // If theme is dark, show sun icon
            localStorage.setItem('theme', 'dark'); // Save 'dark' to localStorage
        }
    });
    // --- End of Theme Toggle Logic ---


    // Tab Elements
    const showLoginBtn = document.getElementById('showLogin');
    const showSignupBtn = document.getElementById('showSignup');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Form Elements
    const signupPasswordInput = document.getElementById('signupPassword');
    const suggestPasswordBtn = document.getElementById('suggestPassword');
    
    // Generate first captcha
    generateCaptcha();

    // --- Tab Switching Logic ---
    showLoginBtn.addEventListener('click', () => {
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        hideMessage();
    });

    showSignupBtn.addEventListener('click', () => {
        showSignupBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        hideMessage();
    });

    // --- Form Handlers ---
    
    // 1. Login Form Handler
    loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMessage();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showMessage('Please fill in all fields');
        return;
    }
    
    console.log('Logging in with:', { username, password });
    
    // ### --- START OF REAL CODE --- ###
    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        // ### THIS IS THE CORRECT LOCATION ###
        if (data.success) {
            showMessage(data.message, 'success');
            
            // Save the logged-in user's name to the browser's memory
            localStorage.setItem('currentUser', username);
            
            setTimeout(() => {
                alert('Login Successful! Redirecting to dashboard...'); 
                window.location.href = '/dashboard'; // This redirects to the new page
            }, 1000);
        } else {
            showMessage(data.message); // Show error from backend
        }
        // ### END OF CORRECT LOCATION ###

    } catch (error) {
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again.');
    }
    // ### --- END OF REAL CODE --- ###
});
    
    // 2. Signup Form Handler
    
    signupPasswordInput.addEventListener('input', () => {
        checkPasswordStrength(signupPasswordInput.value);
    });

    suggestPasswordBtn.addEventListener('click', () => {
        const newPass = generateStrongPassword();
        const passInput = document.getElementById('signupPassword');
        const confirmPassInput = document.getElementById('confirmPassword');
        
        passInput.value = newPass;
        confirmPassInput.value = newPass;
        
        // Trigger the 'input' event to update the password meter
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        passInput.focus();
        confirmPassInput.focus();
        passInput.blur();
    });

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideMessage();
        
        // This MUST match the id you fixed in index.html
        const username = document.getElementById('signupUsername').value; 
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const captchaInput = document.getElementById('captchaInput').value;
        
        if (!username || !password || !confirmPassword || !captchaInput) {
            showMessage('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match');
            return;
        }
        
        if (checkPasswordStrength(password) < 3) {
            showMessage('Password is too weak. Please use a medium or strong password.');
            return;
        }

        if (parseInt(captchaInput, 10) !== captchaAnswer) {
            showMessage('Verification failed. Please try the sum again.');
            generateCaptcha(); // Generate a new challenge
            return;
        }
        
        console.log('Signing up with:', { username, password });
        
        // ### --- START OF REAL CODE --- ###
        try {
            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }) // Send 'username', not 'name'
            });

            const data = await response.json();

            if (data.success) {
                showMessage(data.message, 'success');
                generateCaptcha(); 
                
                setTimeout(() => {
                    showLoginBtn.click(); // Switch to login tab
                    signupForm.reset(); 
                    checkPasswordStrength(''); // Reset the password strength meter
                }, 1500);
            } else {
                showMessage(data.message); // Show error (e.g., "Username already exists")
                generateCaptcha(); 
            }
        } catch (error) {
            console.error('Signup error:', error);
            showMessage('An error occurred. Please try again.');
        }
    });
});