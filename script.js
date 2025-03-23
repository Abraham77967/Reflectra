// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionId) {
            btn.classList.add('active');
        }
    });
}

// Collapsible Sections - Keep for backwards compatibility but make it do nothing
function toggleSection(header) {
    // This function is kept for backward compatibility but does nothing now
    // since we've removed the collapsible section functionality
    return;
}

// Quiz functionality
const quizQuestions = [
    {
        question: "How would you rate your current energy levels?",
        options: ["Very Low", "Low", "Moderate", "High", "Very High"]
    },
    {
        question: "How well are you sleeping?",
        options: ["Poorly", "Fairly", "Well", "Very Well", "Excellent"]
    },
    {
        question: "How would you rate your stress levels?",
        options: ["Very High", "High", "Moderate", "Low", "Very Low"]
    },
    {
        question: "How motivated do you feel about your work/studies?",
        options: ["Not at All", "Slightly", "Moderately", "Very", "Extremely"]
    }
];

let currentQuestion = 0;
let quizAnswers = [];

function startQuiz() {
    currentQuestion = 0;
    quizAnswers = [];
    document.getElementById('quiz-questions').innerHTML = '';
    document.getElementById('quiz-results').classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestion];
    
    // Determine the appropriate color classes based on question type
    let colorClasses;
    if (question.question.includes("stress")) {
        // For stress question, red is bad (high stress)
        colorClasses = ["severe", "intense", "moderate", "mild", "positive"];
    } else {
        // For other questions, green is good (high energy, good sleep, high motivation)
        colorClasses = ["negative", "mild", "moderate", "intense", "positive"];
    }
    
    const questionHTML = `
        <div class="quiz-question question-enter">
            <h3>${question.question}</h3>
            <div class="options">
                ${question.options.map((option, index) => `
                    <button class="action-btn ${colorClasses[index]}" onclick="selectAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('quiz-questions').innerHTML = questionHTML;
    
    // Trigger reflow to ensure the animation plays
    setTimeout(() => {
        const newQuestionEl = document.querySelector('.quiz-question');
        newQuestionEl.classList.remove('question-enter');
    }, 10);
}

function selectAnswer(answerIndex) {
    quizAnswers.push(answerIndex);
    
    // Get the current question element
    const currentQuestionEl = document.querySelector('.quiz-question');
    
    // Add transition-out class for smooth exit
    currentQuestionEl.classList.add('question-exit');
    
    // Wait for the exit animation to complete before showing next question
    setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            showResults();
        }
    }, 300); // Match this timing with the CSS transition
}

function showResults() {
    const averageScore = quizAnswers.reduce((a, b) => a + b, 0) / quizAnswers.length;
    let resultText = '';
    let resultClass = '';
    
    if (averageScore < 2) {
        resultText = "You're showing signs of severe burnout. Please take immediate action to care for yourself and consider seeking professional help.";
        resultClass = 'severe';
    } else if (averageScore < 3) {
        resultText = "You're experiencing moderate burnout. Focus on self-care and consider reducing your workload.";
        resultClass = 'moderate';
    } else if (averageScore < 4) {
        resultText = "You're showing some signs of burnout. Take proactive steps to prevent it from worsening.";
        resultClass = 'mild';
    } else {
        resultText = "You're doing well! Keep up your healthy habits and continue monitoring your well-being.";
        resultClass = 'positive';
    }
    
    // First fade out the questions
    const questionsEl = document.getElementById('quiz-questions');
    questionsEl.classList.add('fadeout');
    
    // Show a loading animation
    const quizContainer = document.querySelector('.quiz-container');
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-animation';
    loadingEl.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Analyzing your responses...</p>
    `;
    quizContainer.appendChild(loadingEl);
    
    // After a delay, prepare the results content
    setTimeout(() => {
        document.getElementById('result-content').innerHTML = `
            <p class="${resultClass}">${resultText}</p>
            <div class="recommendations">
                <h4>Recommended Actions:</h4>
                <ul>
                    <li>Take regular breaks</li>
                    <li>Practice self-care activities</li>
                    <li>Set healthy boundaries</li>
                    <li>Stay hydrated and eat well</li>
                    <li>Get adequate sleep</li>
                </ul>
            </div>
        `;
        
        // Remove loading animation and show results
        quizContainer.removeChild(loadingEl);
        const resultsEl = document.getElementById('quiz-results');
        resultsEl.classList.remove('hidden');
        
        // Allow the DOM to update before adding the transition class
        setTimeout(() => {
            resultsEl.classList.add('visible');
            
            // Animate recommendations list items one by one
            const listItems = resultsEl.querySelectorAll('.recommendations li');
            listItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, 300 + (index * 150)); // Stagger the animations
            });
        }, 50);
    }, 1500); // Show loading for 1.5 seconds
}

function restartQuiz() {
    // Reset both elements
    const questionsEl = document.getElementById('quiz-questions');
    const resultsEl = document.getElementById('quiz-results');
    
    // Hide results first
    resultsEl.classList.remove('visible');
    
    setTimeout(() => {
        // Hide results and remove fadeout from questions
        resultsEl.classList.add('hidden');
        questionsEl.classList.remove('fadeout');
        
        // Start quiz again
        startQuiz();
    }, 500);
}

// Breathing Exercise
let breathingInterval;
let transitionTimeout;

function startBreathingExercise() {
    const orb = document.querySelector('.breathing-orb');
    const button = document.querySelector('.exercise-card.breathing .action-btn');
    
    // Clear any existing timeouts
    if (transitionTimeout) {
        clearTimeout(transitionTimeout);
    }
    
    // Toggle between start and stop
    if (orb.classList.contains('breathing')) {
        // First fade out
        orb.classList.add('transitioning');
        orb.classList.remove('breathing');
        
        // After fade out, resume the idle animation
        transitionTimeout = setTimeout(() => {
            orb.style.animation = 'float-rotate 12s infinite alternate-reverse ease-in-out';
            orb.classList.remove('transitioning');
        }, 800); // Match this to the transition duration
        
        button.innerHTML = '<i class="fas fa-play"></i> Start Exercise';
        
        // Clear the interval
        if (breathingInterval) {
            clearTimeout(breathingInterval);
            breathingInterval = null;
        }
    } else {
        // First fade out
        orb.classList.add('transitioning');
        
        // After fade out, start the breathing animation
        transitionTimeout = setTimeout(() => {
            orb.classList.add('breathing');
            orb.style.animation = 'breathe-orb 4s infinite ease-in-out';
            orb.classList.remove('transitioning');
        }, 800); // Match this to the transition duration
        
        button.innerHTML = '<i class="fas fa-stop"></i> Stop Exercise';
        
        // Automatically stop after 2 minutes
        breathingInterval = setTimeout(() => {
            // First fade out
            orb.classList.add('transitioning');
            orb.classList.remove('breathing');
            
            // After fade out, resume the idle animation
            transitionTimeout = setTimeout(() => {
                orb.style.animation = 'float-rotate 12s infinite alternate-reverse ease-in-out';
                orb.classList.remove('transitioning');
            }, 800); // Match this to the transition duration
            
            button.innerHTML = '<i class="fas fa-play"></i> Start Exercise';
        }, 120000);
    }
}

// Journaling Prompts
const journalPrompts = [
    "What's one thing that made you smile today?",
    "What's a challenge you're facing, and how can you approach it differently?",
    "What are three things you're grateful for right now?",
    "How are you feeling in this moment?",
    "What's one small step you can take today to improve your well-being?"
];

function newJournalPrompt() {
    const promptElement = document.getElementById('journal-prompt');
    const currentPrompt = promptElement.textContent;
    
    // Add wiggle animation class
    promptElement.classList.add('wiggle');
    
    // Start fade out animation
    promptElement.classList.add('fade-out');
    
    // Wait for the fade out to complete, then update text and fade in
    setTimeout(() => {
        // Get a new prompt (making sure it's different from the current one)
        let newPrompt;
        do {
            newPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
        } while (newPrompt === currentPrompt && journalPrompts.length > 1);
        
        // Update the text
        promptElement.textContent = newPrompt;
        
        // Remove fade out and add fade in
        promptElement.classList.remove('fade-out');
        promptElement.classList.add('fade-in');
        
        // Remove the fade-in class after animation completes
        setTimeout(() => {
            promptElement.classList.remove('fade-in');
            setTimeout(() => {
                promptElement.classList.remove('wiggle');
            }, 500);
        }, 500);
    }, 500); // Match with the CSS animation duration
}

// Mini Goals
const miniGoals = [
    "Take a 5-minute break to stretch",
    "Drink a glass of water",
    "Take 3 deep breaths",
    "Go for a short walk",
    "Do a quick mindfulness exercise",
    "Write down one positive thing about your day",
    "Practice gratitude for 1 minute"
];

function newMiniGoal() {
    const goalElement = document.getElementById('mini-goal');
    const currentGoal = goalElement.textContent;
    
    // Add wiggle animation class
    goalElement.classList.add('wiggle');
    
    // Start fade out animation
    goalElement.classList.add('fade-out');
    
    // Wait for the fade out to complete, then update text and fade in
    setTimeout(() => {
        // Get a new goal (making sure it's different from the current one)
        let newGoal;
        do {
            newGoal = miniGoals[Math.floor(Math.random() * miniGoals.length)];
        } while (newGoal === currentGoal && miniGoals.length > 1);
        
        // Update the text
        goalElement.textContent = newGoal;
        
        // Remove fade out and add fade in
        goalElement.classList.remove('fade-out');
        goalElement.classList.add('fade-in');
        
        // Remove the fade-in class after animation completes
        setTimeout(() => {
            goalElement.classList.remove('fade-in');
            setTimeout(() => {
                goalElement.classList.remove('wiggle');
            }, 500);
        }, 500);
    }, 500); // Match with the CSS animation duration
}

// Self-Care Activity Randomizer
const selfCareActivities = [
    "Take a warm bath or shower",
    "Listen to calming music",
    "Do some gentle stretching",
    "Write in your journal",
    "Take a short walk outside",
    "Practice deep breathing",
    "Do a quick meditation",
    "Call a friend or loved one",
    "Read a book for 10 minutes",
    "Do a small act of kindness"
];

// Function to create animated blur text effect
function createBlurTextAnimation(container, text) {
    // Clear the container
    container.innerHTML = '';
    
    // Create a flex container for the words
    const textContainer = document.createElement('div');
    textContainer.className = 'blur-text-container';
    container.appendChild(textContainer);
    
    // Split text into words
    const words = text.split(' ');
    
    // Create a span for each word with staggered delay
    words.forEach((word, index) => {
        if (word) { // Only create spans for non-empty words
            // Create span for the word
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.className = 'blur-text-word';
            wordSpan.style.animationDelay = `${index * 0.1}s`; // Stagger the animation
            textContainer.appendChild(wordSpan);
        }
    });
}

function getRandomActivity() {
    const activityElement = document.getElementById('current-activity');
    const currentActivity = activityElement.textContent.trim();
    
    // Start fade out animation
    activityElement.classList.add('fade-out');
    
    // Wait for the fade out to complete, then update text and fade in
    setTimeout(() => {
        // Get a new activity (making sure it's different from the current one)
        let newActivity;
        do {
            newActivity = selfCareActivities[Math.floor(Math.random() * selfCareActivities.length)];
        } while (newActivity === currentActivity && selfCareActivities.length > 1);
        
        // Remove fade out class
        activityElement.classList.remove('fade-out');
        
        // Apply the blur text animation
        createBlurTextAnimation(activityElement, newActivity);
    }, 500); // Match with the CSS animation duration
}

// Meditation Sounds
const sounds = {
    rain: new Audio('rain.mp3'),
    ocean: new Audio('ocean.mp3'),
    forest: new Audio('forest.mp3')
};

// Audio fade settings
const FADE_DURATION = 1500; // Fade duration in milliseconds (1.5 seconds)
const FADE_INTERVAL = 25; // Interval between volume changes in milliseconds (smaller intervals = smoother fade)
const FADE_STEP = 0.05; // Smaller step for smoother transition

// Function to fade audio in
function fadeIn(audio, callback) {
    let volume = 0;
    audio.volume = volume;
    
    const interval = setInterval(() => {
        volume += FADE_STEP;
        if (volume >= 1) {
            volume = 1;
            clearInterval(interval);
            if (callback) callback();
        }
        audio.volume = volume;
    }, FADE_INTERVAL);
}

// Function to fade audio out
function fadeOut(audio, callback) {
    let volume = audio.volume;
    
    const interval = setInterval(() => {
        volume -= FADE_STEP;
        if (volume <= 0) {
            volume = 0;
            clearInterval(interval);
            if (callback) callback();
        }
        audio.volume = volume;
    }, FADE_INTERVAL);
}

function toggleSound(soundType, event) {
    if (event) {
        event.stopPropagation(); // Prevent event bubbling
    }
    
    // Get the selected sound and elements
    const sound = sounds[soundType];
    const circle = document.getElementById(`${soundType}-circle`);
    const playIndicator = circle ? circle.querySelector('.play-indicator i') : null;
    
    // If the sound is paused, we'll start it with fade in
    if (sound.paused) {
        // First fade out any playing sounds
        Object.keys(sounds).forEach(type => {
            if (type !== soundType && !sounds[type].paused) {
                const otherCircle = document.getElementById(`${type}-circle`);
                const otherIndicator = otherCircle?.querySelector('.play-indicator i');
                
                // Update UI immediately
                if (otherCircle) otherCircle.classList.remove('active');
                if (otherIndicator) otherIndicator.className = 'fas fa-play';
                
                // Fade out this sound
                fadeOut(sounds[type], () => {
                    sounds[type].pause();
                    sounds[type].currentTime = 0;
                });
            }
        });
        
        // Set up the sound
        sound.volume = 0;
        sound.loop = true;
        
        // Start playing
        sound.play()
            .then(() => {
                // Update UI
                if (circle) circle.classList.add('active');
                if (playIndicator) playIndicator.className = 'fas fa-pause';
                
                // Fade in the sound
                fadeIn(sound);
            })
            .catch(error => {
                console.error("Audio playback error:", error);
                if (playIndicator) playIndicator.className = 'fas fa-play';
            });
    } else {
        // Fade out the sound
        fadeOut(sound, () => {
            sound.pause();
            sound.currentTime = 0;
        });
        
        // Update UI immediately
        if (circle) circle.classList.remove('active');
        if (playIndicator) playIndicator.className = 'fas fa-play';
    }
}

// Page Transition Functions
function startPageTransition(event) {
    if (event) {
        event.preventDefault();
        
        const target = event.currentTarget.getAttribute('href');
        const transition = document.querySelector('.page-transition');
        
        // Fade out current content first
        document.body.classList.remove('loaded');
        
        // After content starts fading, show the transition overlay
        setTimeout(() => {
            // Activate the transition overlay
            transition.classList.add('active');
            
            // Wait for the animation to complete before navigating
            setTimeout(() => {
                window.location.href = target;
            }, 400); // Increased to ensure overlay is fully visible before navigation
        }, 200); // Short delay to allow content to start fading
    }
}

// On page load, trigger entrance animation
document.addEventListener('DOMContentLoaded', function() {
    // Set initial states
    newJournalPrompt();
    newMiniGoal();
    startQuiz();
    
    // Initialize sounds
    Object.keys(sounds).forEach(type => {
        const circle = document.getElementById(`${type}-circle`);
        const playIndicator = circle ? circle.querySelector('.play-indicator i') : null;
        if (playIndicator) {
            playIndicator.className = 'fas fa-play';
        }
    });
    
    // Add loaded class after a short delay to trigger animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// If coming from another page, handle page loading animation
window.addEventListener('pageshow', function(event) {
    // Reset the transition overlay state
    const transition = document.querySelector('.page-transition');
    if (transition) {
        transition.classList.remove('active');
    }
    
    // When page is shown (whether from cache or not)
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Quick Navigation - Smooth Scrolling
function scrollToSection(sectionId) {
    console.log("Scrolling to section:", sectionId);
    const section = document.getElementById(sectionId);
    
    if (!section) {
        console.warn("Section not found with ID:", sectionId);
        return;
    }
    
    console.log("Found section:", section);
    
    // Calculate offset to account for fixed header if present
    const headerOffset = 70; // Adjust this value based on your header height
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    // Scroll to the section with smooth behavior
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
    
    // Update active state of quick nav items
    document.querySelectorAll('.quick-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find the nav item that corresponds to this section ID
    const navItem = document.querySelector(`.quick-nav-item[onclick*="${sectionId}"]`);
    if (navItem) {
        console.log("Setting active nav item:", navItem);
        navItem.classList.add('active');
    } else {
        console.log("Could not find nav item for section:", sectionId);
    }
}

// Update active nav item on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 100)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    if (currentSection) {
        document.querySelectorAll('.quick-nav-item').forEach(item => {
            item.classList.remove('active');
            
            // Check if the onclick attribute contains the current section ID
            if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(currentSection)) {
                item.classList.add('active');
            }
        });
    }
}); 