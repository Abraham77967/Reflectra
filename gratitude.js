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
            }, 400);
        }, 200);
    }
}

// Gratitude Journal functionality
let gratitudeEntries = JSON.parse(localStorage.getItem('gratitudeEntries')) || [];
let currentEntryIndex = -1;

function saveGratitudeEntry() {
    const entryText = document.getElementById('gratitude-entry').value.trim();
    const recipient = document.getElementById('note-recipient').value.trim();
    const subject = document.getElementById('note-subject').value.trim() || 'A note of gratitude';
    
    if (!entryText) {
        alert('Please write something before saving.');
        return;
    }
    
    // Create new entry object
    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        recipient: recipient,
        subject: subject,
        content: entryText,
        sent: false
    };
    
    // Add to beginning of array for reverse chronological order
    gratitudeEntries.unshift(newEntry);
    
    // Save to localStorage
    localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
    
    // Update the display
    currentEntryIndex = 0;
    updateGratitudeDisplay();
    
    // Show confirmation
    alert('Gratitude entry saved!');
    
    // Clear form if sent successfully
    clearGratitudeForm();
}

function sendGratitudeEmail() {
    const entryText = document.getElementById('gratitude-entry').value.trim();
    const recipient = document.getElementById('note-recipient').value.trim();
    const subject = document.getElementById('note-subject').value.trim() || 'A note of gratitude';
    
    if (!entryText) {
        alert('Please write something before sending.');
        return;
    }
    
    if (!recipient) {
        alert('Please enter a recipient email address.');
        return;
    }
    
    // Create a mailto link
    const mailtoLink = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(entryText)}`;
    
    // Open the mailto link
    window.open(mailtoLink);
    
    // Save entry with sent flag
    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        recipient: recipient,
        subject: subject,
        content: entryText,
        sent: true
    };
    
    // Add to beginning of array
    gratitudeEntries.unshift(newEntry);
    
    // Save to localStorage
    localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
    
    // Update display
    currentEntryIndex = 0;
    updateGratitudeDisplay();
}

function clearGratitudeForm() {
    document.getElementById('gratitude-entry').value = '';
    document.getElementById('note-recipient').value = '';
    document.getElementById('note-subject').value = '';
}

function updateGratitudeDisplay() {
    const entriesDisplay = document.getElementById('gratitude-entries-display');
    const entryCounter = document.getElementById('gratitude-counter');
    const prevBtn = document.getElementById('prev-gratitude-btn');
    const nextBtn = document.getElementById('next-gratitude-btn');
    const deleteBtn = document.getElementById('delete-gratitude-btn');
    const resendBtn = document.getElementById('resend-gratitude-btn');
    
    // If no entries
    if (gratitudeEntries.length === 0) {
        entriesDisplay.innerHTML = '<p class="empty-state">Your saved gratitude entries will appear here</p>';
        entryCounter.textContent = 'No entries yet';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        deleteBtn.disabled = true;
        resendBtn.disabled = true;
        currentEntryIndex = -1;
        return;
    }
    
    // Enable delete button since we have entries
    deleteBtn.disabled = false;
    
    // Set current index to 0 if it's invalid
    if (currentEntryIndex < 0 || currentEntryIndex >= gratitudeEntries.length) {
        currentEntryIndex = 0;
    }
    
    // Get current entry
    const entry = gratitudeEntries[currentEntryIndex];
    
    // Update counter text
    entryCounter.textContent = `Entry ${currentEntryIndex + 1} of ${gratitudeEntries.length}`;
    
    // Update navigation buttons
    prevBtn.disabled = currentEntryIndex <= 0;
    nextBtn.disabled = currentEntryIndex >= gratitudeEntries.length - 1;
    
    // Enable/disable resend button based on whether entry has recipient
    resendBtn.disabled = !entry.recipient;
    
    // Apply flipping animation
    entriesDisplay.classList.add('flipping');
    
    // Update display after a short delay for animation
    setTimeout(() => {
        // Build the HTML for the entry
        let entryHTML = `<div class="entry-date">${entry.date}</div>`;
        
        if (entry.recipient) {
            entryHTML += `<div class="entry-recipient">To: ${entry.recipient}</div>`;
            entryHTML += `<div class="entry-subject">Subject: ${entry.subject}</div>`;
        }
        
        entryHTML += `<div class="entry-content">${entry.content}</div>`;
        
        if (entry.sent) {
            entryHTML += `<div class="entry-sent"><i class="fas fa-paper-plane"></i> Sent</div>`;
        }
        
        // Update entry display
        entriesDisplay.innerHTML = entryHTML;
        
        // Remove flipping class
        entriesDisplay.classList.remove('flipping');
    }, 300);
}

function showPreviousGratitude() {
    if (currentEntryIndex > 0) {
        currentEntryIndex--;
        updateGratitudeDisplay();
    }
}

function showNextGratitude() {
    if (currentEntryIndex < gratitudeEntries.length - 1) {
        currentEntryIndex++;
        updateGratitudeDisplay();
    }
}

function deleteCurrentGratitude() {
    if (currentEntryIndex < 0 || gratitudeEntries.length === 0) return;
    
    if (confirm('Are you sure you want to delete this gratitude entry?')) {
        // Remove the current entry
        gratitudeEntries.splice(currentEntryIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
        
        // Update display
        if (currentEntryIndex >= gratitudeEntries.length) {
            currentEntryIndex = Math.max(0, gratitudeEntries.length - 1);
        }
        
        updateGratitudeDisplay();
    }
}

function resendCurrentGratitude() {
    if (currentEntryIndex < 0 || gratitudeEntries.length === 0) return;
    
    const entry = gratitudeEntries[currentEntryIndex];
    
    if (!entry.recipient) {
        alert('This entry does not have a recipient email.');
        return;
    }
    
    // Create a mailto link
    const mailtoLink = `mailto:${encodeURIComponent(entry.recipient)}?subject=${encodeURIComponent(entry.subject)}&body=${encodeURIComponent(entry.content)}`;
    
    // Open the mailto link
    window.open(mailtoLink);
    
    // Mark as sent
    entry.sent = true;
    
    // Save to localStorage
    localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
    
    // Update display
    updateGratitudeDisplay();
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with saved entries
    updateGratitudeDisplay();
    
    // Add prompt card click functionality
    document.querySelectorAll('.prompt-card').forEach(card => {
        card.addEventListener('click', function() {
            const promptText = this.querySelector('p').textContent;
            const textarea = document.getElementById('gratitude-entry');
            
            // Append the prompt to the textarea if it's empty
            // or add a newline if there's already content
            if (textarea.value.trim() === '') {
                textarea.value = promptText + '\n\n';
            } else {
                textarea.value += '\n\n' + promptText + '\n\n';
            }
            
            // Focus the textarea and scroll to the end
            textarea.focus();
            textarea.scrollTop = textarea.scrollHeight;
        });
    });
    
    // Add animation classes for cloud words
    document.querySelectorAll('.cloud-word').forEach((word, index) => {
        // Add a small random rotation
        const rotation = Math.random() * 10 - 5; // -5 to 5 degrees
        word.style.transform = `rotate(${rotation}deg)`;
        
        // Add hover event to make other words react
        word.addEventListener('mouseenter', () => {
            document.querySelectorAll('.cloud-word').forEach((otherWord, otherIndex) => {
                if (otherIndex !== index) {
                    // Apply subtle movement to other words
                    const distance = Math.random() * 10 + 5;
                    const angle = Math.random() * 360;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    otherWord.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                }
            });
        });
        
        // Reset on mouse leave
        word.addEventListener('mouseleave', () => {
            document.querySelectorAll('.cloud-word').forEach((otherWord, otherIndex) => {
                if (otherIndex !== index) {
                    // Reset to original position with only rotation
                    const otherRotation = Math.random() * 10 - 5;
                    otherWord.style.transform = `rotate(${otherRotation}deg)`;
                }
            });
        });
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