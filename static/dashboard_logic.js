// --- Function to fetch user data and update the page ---
async function loadUserData() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = '/'; // Not logged in
        return;
    }

    // References to the elements we added in dashboard.html
    const welcomeMsgHeader = document.getElementById('welcome-msg-header');
    const welcomeMsgHero = document.getElementById('welcome-msg-hero');
    const scoreDisplay = document.getElementById('score');
    const userAvatarHeader = document.getElementById('user-avatar-header');
    const userAvatarHero = document.getElementById('user-avatar-hero');
    
    try {
        const response = await fetch('/get-user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        });
        const data = await response.json();

        if (data.success) {
            // Update the welcome messages
            if (welcomeMsgHeader) welcomeMsgHeader.textContent = `Welcome, ${data.username}!`;
            if (welcomeMsgHero) welcomeMsgHero.textContent = `Welcome back, ${data.username}!`;
            
            // Update the score display
            if (scoreDisplay) scoreDisplay.textContent = `${data.score}`;
            
            // Update both avatar images
            const avatarUrl = `https://api.dicebear.com/8.x/${data.avatar_style}/svg?seed=${data.username}`;
            if (userAvatarHeader && data.avatar_style) {
                userAvatarHeader.src = avatarUrl;
            }
            if (userAvatarHero && data.avatar_style) {
                userAvatarHero.src = avatarUrl;
            }
        } else {
            console.error("Failed to load user data:", data.message);
            if (welcomeMsgHeader) welcomeMsgHeader.textContent = 'Welcome!';
            if (welcomeMsgHero) welcomeMsgHero.textContent = 'Welcome!';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (welcomeMsgHeader) welcomeMsgHeader.textContent = 'Welcome!';
        if (welcomeMsgHero) welcomeMsgHero.textContent = 'Welcome!';
    }
}

// --- Function to set up dashboard buttons ---
function setupDashboardButtons() {
    const username = localStorage.getItem('currentUser');
    if (!username) return; // Should not happen if already on dashboard

    const logoutBtn = document.getElementById('logout-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn'); 
    const challengeBtn = document.getElementById('challenge-btn'); 
    const scoreDisplay = document.getElementById('score'); // Reference needed for updating score

    // Logout Button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = '/';
        });
    }
    
    // Start Quiz Button (using the ID from the HTML)
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
             window.location.href = '/quiz'; // Redirect to quiz page
        });
    }

    // Complete Challenge Button
    if (challengeBtn) {
        challengeBtn.addEventListener('click', async () => {
             try {
                const response = await fetch('/complete-challenge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username })
                });
                const data = await response.json();
                if (data.success) {
                    if (scoreDisplay) scoreDisplay.textContent = `${data.new_score}`; // Update score display
                    alert('Challenge Complete! +10 Points!');
                } else {
                     alert('Error completing challenge.');
                }
            } catch (error) {
                 console.error('Challenge error:', error);
                 alert('Could not complete challenge.');
            }
        });
    }
}

// --- Main execution when the page is loaded ---
document.addEventListener("DOMContentLoaded", () => {

    // --- Load user data and set up essential buttons FIRST ---
    loadUserData(); 
    setupDashboardButtons();

    // ======================
    // ✅ 2. SLIDER FUNCTIONALITY (FIXED)
    // ======================
    const sliders = document.querySelectorAll(".slider-container");

    sliders.forEach((slider) => {
        const slides = slider.querySelectorAll(".slide");
        const prevBtn = slider.querySelector(".prevBtn");
        const nextBtn = slider.querySelector(".nextBtn");

        if (slides.length === 0) return; // Skip if no slides

        let currentIndex = 0;

        // Corrected showSlide function
        function showSlide(index) {
            // Remove 'active' class from all slides
            slides.forEach((slide) => {
                slide.classList.remove("active");
            });
            // Add 'active' class only to the current slide
            if (slides[index]) {
                slides[index].classList.add("active");
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            });
        }
        // Initial slide is shown via HTML's active class, no need to call showSlide here
    });

    // ======================
    // ✅ 3. "SEE MORE" FUNCTIONALITY
    // ======================
    
    // Code for the main "Quality Education (SDG 4)" section text expander
    const expandableText = document.getElementById("expandable-text");
    const seeMoreBtn = document.getElementById("see-more-btn");
    const fadeOverlay = document.getElementById("fade-overlay");

    if (seeMoreBtn && expandableText && fadeOverlay) {
        // Check initial height to see if button is needed
        if (expandableText.scrollHeight <= 128) { // 128px is roughly max-h-32
             seeMoreBtn.style.display = 'none';
             fadeOverlay.style.display = 'none';
        } else {
             seeMoreBtn.addEventListener("click", () => {
                 if (expandableText.classList.contains("max-h-32")) {
                     // Expand
                     expandableText.classList.remove("max-h-32");
                     expandableText.style.maxHeight = expandableText.scrollHeight + "px"; // Expand fully
                     seeMoreBtn.textContent = "See Less";
                     fadeOverlay.classList.add("hidden"); // Hide fade effect
                 } else {
                     // Collapse
                     expandableText.classList.add("max-h-32");
                     expandableText.style.maxHeight = null; // Return to Tailwind class height
                     seeMoreBtn.textContent = "See More";
                     fadeOverlay.classList.remove("hidden"); // Show fade effect
                 }
             });
         }
    }
  
    // Code for the text expander under the sliders
    const articles = document.querySelectorAll(".mt-4.p-4"); // Selects the text boxes under sliders

    articles.forEach((article) => {
        // Skip the main SDG 4 text box as it has its own button
        if (article.querySelector("#expandable-text")) return; 
        
        const textBox = article.querySelector(".text-gray-700, .dark\\:text-gray-300"); // Find the paragraph box
        if (!textBox) return; // Skip if no text box found

        // Remove any old buttons if they exist
        const oldBtn = article.querySelector(".see-more-btn");
        if (oldBtn) oldBtn.remove();
        
        const initialHeight = 100; // Set initial visible height in pixels
        
        // Only add 'See More' if the text is actually taller than the initial height
        if (textBox.scrollHeight > initialHeight) {
            textBox.style.maxHeight = initialHeight + "px";
            textBox.style.overflow = "hidden";
            textBox.style.transition = "max-height 0.5s ease";
            textBox.style.position = "relative"; // Needed for the fade effect

            // Add the fade overlay at the bottom
            const fadeDiv = document.createElement("div");
            fadeDiv.className = "absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"; // Tailwind classes for gradient
            textBox.appendChild(fadeDiv); // Add overlay inside the text box

            // Add the 'See More' button below the text box
            const btn = document.createElement("button");
            btn.textContent = "See More";
            btn.className = "see-more-btn mt-3 text-blue-600 dark:text-blue-400 hover:underline font-medium"; // Tailwind classes

            let isExpanded = false;

            btn.addEventListener("click", () => {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    textBox.style.maxHeight = textBox.scrollHeight + "px"; // Expand fully
                    btn.textContent = "See Less";
                    fadeDiv.style.opacity = "0"; // Hide fade when expanded
                } else {
                    textBox.style.maxHeight = initialHeight + "px"; // Collapse
                    btn.textContent = "See More";
                    fadeDiv.style.opacity = "1"; // Show fade when collapsed
                }
            });
            
            article.appendChild(btn); // Add button after the text box
        }
    });

}); // --- END OF MAIN DOMContentLoaded LISTENER ---