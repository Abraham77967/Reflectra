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

// Timer functionality
let timerInterval;
let timeLeft = 0; // Will be set when a duration is selected
let isTimerRunning = false;
let selectedDuration = 0;
let currentIntensity = '';
let lastUpdateTime = 0;

// Initialize timer control button as visible but disabled
document.addEventListener('DOMContentLoaded', function() {
    const timerControl = document.getElementById('timer-control');
    if (timerControl) {
        timerControl.classList.remove('hidden');
        timerControl.classList.add('disabled');
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTimerColor(intensity) {
    document.documentElement.style.setProperty('--timer-color', `var(--${intensity}-color)`);
    
    // Update the timer control button class
    const timerControl = document.getElementById('timer-control');
    if (timerControl) {
        timerControl.className = 'action-btn ' + intensity;
    }
    
    // Update all progress markers' color
    document.querySelectorAll('.progress-marker').forEach(marker => {
        marker.style.color = `var(--${intensity}-color)`;
    });
}

function updateProgressBar(progress) {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${Math.min(progress * 100, 100)}%`;
    }
}

function selectDuration(seconds, intensity) {
    // Reset any previous timer
    clearInterval(timerInterval);
    isTimerRunning = false;
    
    // Update selected button state
    document.querySelectorAll('.timer-option').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.seconds) === seconds) {
            btn.classList.add('selected');
        }
    });
    
    // Set new duration
    selectedDuration = seconds;
    timeLeft = seconds;
    currentIntensity = intensity;
    
    // Update display
    const timerDisplay = document.querySelector('.timer-display');
    timerDisplay.textContent = formatTime(timeLeft);
    
    // Update colors
    updateTimerColor(intensity);
    
    // Update markers
    const peakTime = Math.floor(seconds / 2);
    document.querySelector('.progress-marker.peak').textContent = 
        `Peak (${formatTime(peakTime)})`;
    document.querySelector('.progress-marker.end').textContent = 
        `End (${formatTime(seconds)})`;
    
    // Show and enable control button
    const timerControl = document.getElementById('timer-control');
    timerControl.classList.remove('hidden');
    timerControl.classList.remove('disabled');
    timerControl.innerHTML = '<i class="fas fa-play"></i> Start Timer';
    
    // Reset progress bar
    updateProgressBar(0);
}

function updateTimer() {
    if (!isTimerRunning) return;

    const now = Date.now();
    const deltaTime = (now - lastUpdateTime) / 1000;
    lastUpdateTime = now;

    timeLeft = Math.max(0, timeLeft - deltaTime);

    // Update display every second
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(Math.ceil(timeLeft));
    }
    
    // Calculate and update progress bar
    const progress = 1 - (timeLeft / selectedDuration);
    updateProgressBar(progress);

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        updateProgressBar(1); // Ensure we reach 100%
        document.getElementById('timer-control').innerHTML = '<i class="fas fa-play"></i> Start Timer';
        showTimerComplete();
    }
}

function toggleTimer() {
    // Get the timer control button
    const timerControl = document.getElementById('timer-control');
    
    // Check if button is disabled
    if (timerControl.classList.contains('disabled')) return;
    
    // Check if duration is selected
    if (!selectedDuration) return;

    if (!isTimerRunning) {
        lastUpdateTime = Date.now();
        timerInterval = setInterval(updateTimer, 16); // ~60fps for smooth animation
        isTimerRunning = true;
        timerControl.innerHTML = '<i class="fas fa-pause"></i> Pause Timer';
    } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerControl.innerHTML = '<i class="fas fa-play"></i> Resume Timer';
    }
}

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

function getRandomDistraction() {
    const distractionElement = document.getElementById('current-distraction');
    const currentDistraction = distractionElement.textContent.trim();
    
    // Start fade out animation
    distractionElement.classList.add('fade-out');
    
    // Wait for the fade out to complete, then update text and fade in
    setTimeout(() => {
        // Get a new distraction (making sure it's different from the current one)
        let newDistraction;
        do {
            newDistraction = distractions[Math.floor(Math.random() * distractions.length)];
        } while (newDistraction === currentDistraction && distractions.length > 1);
        
        // Remove fade out class
        distractionElement.classList.remove('fade-out');
        
        // Apply the blur text animation
        createBlurTextAnimation(distractionElement, newDistraction);
    }, 500); // Match with the CSS animation duration
    
    return distractionElement.textContent;
}

function showTimerComplete() {
    const distractionElement = document.getElementById('current-distraction');
    
    // Start fade out animation
    distractionElement.classList.add('fade-out');
    
    // Wait for the fade out to complete, then update with a suggestion
    setTimeout(() => {
        // Get a distraction suggestion
        let suggestion;
        do {
            suggestion = distractions[Math.floor(Math.random() * distractions.length)];
        } while (suggestion === distractionElement.textContent && distractions.length > 1);
        
        // Remove fade out class
        distractionElement.classList.remove('fade-out');
        
        // Apply the blur text animation with congratulatory message
        createBlurTextAnimation(distractionElement, `Great job! Try this distraction: ${suggestion}`);
    }, 500);
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize timer options
    document.querySelectorAll('.timer-option').forEach(option => {
        option.addEventListener('click', function() {
            const seconds = parseInt(this.dataset.seconds);
            const intensity = this.classList[1]; // mild, moderate, intense, severe
            selectDuration(seconds, intensity);
        });
    });
    
    // Timer control
    document.getElementById('timer-control').addEventListener('click', toggleTimer);
    
    // Initialize with random distraction
    getRandomDistraction();
    
    // Initialize progress tracking
    updateTimeProgress();
    setInterval(updateTimeProgress, 60000); // Update every minute
    
    // Initialize journal entries display
    updateJournalDisplay();
    
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

// Distraction Generator functionality
const distractions = [
    "Take 5 deep breaths",
    "Drink a glass of water",
    "Do 10 jumping jacks",
    "Write down 3 things you're grateful for",
    "Stretch for 1 minute",
    "Listen to your favorite song",
    "Take a short walk",
    "Call or text a friend",
    "Organize your desk",
    "Do a quick meditation"
];

// Journal functionality
let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
let currentEntryIndex = -1;

function saveJournalEntry() {
    const entryText = document.getElementById('journal-entry').value.trim();
    if (!entryText) {
        alert('Please write something before saving.');
        return;
    }
    
    // Create new entry object
    const newEntry = {
        id: Date.now(), // Unique ID based on timestamp
        date: new Date().toLocaleString(),
        content: entryText
    };
    
    // Add to beginning of array for reverse chronological order
    journalEntries.unshift(newEntry);
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    
    // Clear the form
    clearJournalForm();
    
    // Update the display
    currentEntryIndex = 0;
    updateJournalDisplay();
    
    // Show confirmation
    alert('Journal entry saved!');
}

function clearJournalForm() {
    document.getElementById('journal-entry').value = '';
}

function updateJournalDisplay() {
    const entriesDisplay = document.getElementById('journal-entries-display');
    const entryCounter = document.getElementById('entry-counter');
    const prevBtn = document.getElementById('prev-entry-btn');
    const nextBtn = document.getElementById('next-entry-btn');
    const deleteBtn = document.getElementById('delete-entry-btn');
    
    // If no entries
    if (journalEntries.length === 0) {
        entriesDisplay.innerHTML = '<p class="empty-state">Your saved journal entries will appear here</p>';
        entryCounter.textContent = 'No entries yet';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        deleteBtn.disabled = true;
        currentEntryIndex = -1;
        return;
    }
    
    // Enable delete button since we have entries
    deleteBtn.disabled = false;
    
    // Set current index to 0 if it's invalid
    if (currentEntryIndex < 0 || currentEntryIndex >= journalEntries.length) {
        currentEntryIndex = 0;
    }
    
    // Get current entry
    const entry = journalEntries[currentEntryIndex];
    
    // Update counter text
    entryCounter.textContent = `Entry ${currentEntryIndex + 1} of ${journalEntries.length}`;
    
    // Update navigation buttons
    prevBtn.disabled = currentEntryIndex <= 0;
    nextBtn.disabled = currentEntryIndex >= journalEntries.length - 1;
    
    // Apply flipping animation
    entriesDisplay.classList.add('flipping');
    
    // Update display after a short delay for animation
    setTimeout(() => {
        // Update entry display
        entriesDisplay.innerHTML = `
            <div class="entry-date">${entry.date}</div>
            <div class="entry-content">${entry.content}</div>
        `;
        
        // Remove flipping class
        entriesDisplay.classList.remove('flipping');
    }, 300);
}

function showPreviousEntry() {
    if (currentEntryIndex > 0) {
        currentEntryIndex--;
        updateJournalDisplay();
    }
}

function showNextEntry() {
    if (currentEntryIndex < journalEntries.length - 1) {
        currentEntryIndex++;
        updateJournalDisplay();
    }
}

function deleteCurrentEntry() {
    if (currentEntryIndex < 0 || journalEntries.length === 0) return;
    
    if (confirm('Are you sure you want to delete this journal entry?')) {
        // Remove the current entry
        journalEntries.splice(currentEntryIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        
        // Update display
        if (currentEntryIndex >= journalEntries.length) {
            currentEntryIndex = Math.max(0, journalEntries.length - 1);
        }
        
        updateJournalDisplay();
    }
}

// Progress Tracker functionality (renamed to avoid conflicts)
let startTime = localStorage.getItem('startTime') || new Date().getTime();

function updateTimeProgress() {
    const now = new Date().getTime();
    const diff = now - parseInt(startTime);
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes-progress').textContent = minutes;
}

function resetProgress() {
    if (confirm('Are you sure you want to reset your progress?')) {
        startTime = new Date().getTime();
        localStorage.setItem('startTime', startTime);
        updateTimeProgress();
    }
}

// Initialize progress tracker
setInterval(updateTimeProgress, 60000); // Update every minute
updateTimeProgress(); // Initial update

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