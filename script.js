/**
 * Graduation Invitation - Frontend Interactive Script
 * Alex Mercer | Class of 2026
 */

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
// REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwujoZASixMk-BULlo__JH3mmcSMq_5U7vawqshw1H2fG9kWVBMrjsTzCYBjuW4Zq4/exec';

document.addEventListener('DOMContentLoaded', () => {

    // Initialize functions
    initNavigation();
    initAudioPlayer();
    initCountdown();
    initScrollAnimations();
    initRSVPForm();
    loadWishes();
});

// -------------------------------------------------------------
// NAVIGATION (Header Scrolled state & Mobile Drawer)
// -------------------------------------------------------------
function initNavigation() {
    const header = document.querySelector('.header-nav');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    menuBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
        const icon = menuBtn.querySelector('i');
        if (drawer.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close drawer when clicking mobile links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('open');
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });
}

// -------------------------------------------------------------
// AMBIENT AUDIO PLAYER
// -------------------------------------------------------------
function initAudioPlayer() {
    const audio = document.getElementById('bg-audio');
    const audioBtn = document.getElementById('audio-toggle');

    if (!audio || !audioBtn) return;

    // Reduce volume to pleasant background level
    audio.volume = 0.25;

    audioBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                audioBtn.classList.add('playing');
                audioBtn.querySelector('i').className = 'fa-solid fa-volume-high';
            }).catch(err => {
                console.error("Audio playback blocked or failed:", err);
            });
        } else {
            audio.pause();
            audioBtn.classList.remove('playing');
            audioBtn.querySelector('i').className = 'fa-solid fa-volume-xmark';
        }
    });
}

// -------------------------------------------------------------
// COUNTDOWN TIMER
// -------------------------------------------------------------
function initCountdown() {
    // Set target date: Saturday, July 25, 2026 at 10:00 AM PST (UTC-7)
    // Using string ISO format or direct milliseconds
    const graduationDate = new Date('2026-07-25T10:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = graduationDate - now;

        if (difference <= 0) {
            // Event has started / passed
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            const countdownTitle = document.querySelector('.countdown-container');
            if (countdownTitle) {
                countdownTitle.innerHTML = `<p style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--accent-gold);">The Celebration Has Begun!</p>`;
            }
            clearInterval(timerInterval);
            return;
        }

        // Calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Render with leading zero padding
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Run immediately and start interval
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}

// -------------------------------------------------------------
// SCROLL ANIMATIONS (Intersection Observer)
// -------------------------------------------------------------
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.scroll-fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('is-visible'));
    }
}

// -------------------------------------------------------------
// RSVP FORM HANDLING & GOOGLE SHEET INTEGRATION
// -------------------------------------------------------------
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const attendanceSelect = document.getElementById('attendance-status');
    const guestCountGroup = document.getElementById('guest-count-group');
    const submitBtn = document.getElementById('submit-btn');
    const statusMsgContainer = document.getElementById('rsvp-status-message');

    if (!form) return;

    // Toggle guest count visibility based on attendance select
    attendanceSelect.addEventListener('change', () => {
        const value = attendanceSelect.value;
        if (value.startsWith('No')) {
            // Hide guest count input when declining
            guestCountGroup.classList.add('hidden');
            document.getElementById('guest-count').value = '0';
        } else {
            // Show guest count input when attending
            guestCountGroup.classList.remove('hidden');
        }
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form validation passes, start submission visual state
        submitBtn.classList.add('loading');
        statusMsgContainer.innerHTML = ''; // Clear previous messages

        // Gather Form Data
        const formData = {
            name: document.getElementById('guest-name').value.trim(),
            contact: document.getElementById('guest-contact').value.trim(),
            status: attendanceSelect.value,
            guests: parseInt(document.getElementById('guest-count').value) || 0,
            message: document.getElementById('congrats-message').value.trim()
        };

        // If URL is placeholder, use MOCK MODE for easy testing
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL' || GOOGLE_SCRIPT_URL === '') {
            console.warn("Using RSVP Mock Mode: Set a valid GOOGLE_SCRIPT_URL to record to Google Sheets.");

            setTimeout(() => {
                // Mock success
                submitBtn.classList.remove('loading');
                displayStatus('success', 'Thank you! Your RSVP has been recorded (Mock Mode).');

                // Save locally
                saveWishLocally(formData.name, formData.message);
                form.reset();
                guestCountGroup.classList.remove('hidden'); // Reset layout
            }, 1200);

            return;
        }

        // Real Google Apps Script POST request
        // Using cors mode with text/plain body content to bypass CORS preflight redirects
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // standard workaround for Apps Script redirect policies
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(formData)
        })
            .then(() => {
                // Because mode is 'no-cors', we won't get content in the response.
                // But we know it completed without throwing an error (which is standard success behavior).
                submitBtn.classList.remove('loading');
                displayStatus('success', 'Thank you! Your RSVP has been successfully recorded.');

                // Save wish locally so it updates the board in real-time
                if (formData.message) {
                    saveWishLocally(formData.name, formData.message);
                }
                form.reset();
                guestCountGroup.classList.remove('hidden'); // Reset layout
            })
            .catch(error => {
                console.error('Error submitting RSVP:', error);
                submitBtn.classList.remove('loading');
                displayStatus('error', 'Something went wrong. Please check your connection and try again.');
            });
    });

    function displayStatus(type, message) {
        statusMsgContainer.innerHTML = `
            <div class="status-message ${type}">
                <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}
            </div>
        `;
    }
}

// -------------------------------------------------------------
// DYNAMIC WISHES BOARD
// -------------------------------------------------------------
function saveWishLocally(name, message) {
    if (!message) return; // Only save if they left a message

    const newWish = {
        name: name,
        message: message,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    let localWishes = JSON.parse(localStorage.getItem('graduation_wishes')) || [];
    localWishes.unshift(newWish); // Add to the beginning
    localStorage.setItem('graduation_wishes', JSON.stringify(localWishes));

    // Reload wishes board
    loadWishes();
}

function loadWishes() {
    const board = document.getElementById('wishes-board');
    if (!board) return;

    // Check if the URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL' || GOOGLE_SCRIPT_URL === '') {
        renderLocalWishes();
        return;
    }

    // Fetch from Google Sheets Web App GET API
    fetch(GOOGLE_SCRIPT_URL)
    .then(response => {
        if (!response.ok) throw new Error('Network response not ok');
        return response.json();
    })
    .then(data => {
        if (data.status === 'success' && data.wishes) {
            renderWishes(data.wishes);
        } else {
            console.warn("API returned error, falling back to local storage:", data.message);
            renderLocalWishes();
        }
    })
    .catch(error => {
        console.error('Error loading wishes from Google Sheets:', error);
        renderLocalWishes();
    });
}

function renderWishes(wishes) {
    const board = document.getElementById('wishes-board');
    if (!board) return;

    // Clear dynamic cards (keep default static seed cards)
    const existingCards = board.querySelectorAll('.wish-card');
    existingCards.forEach(card => {
        if (card.classList.contains('dynamic-wish')) {
            card.remove();
        }
    });

    // Render wishes (newest first, appended to the top)
    wishes.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-card dynamic-wish';
        card.style.borderColor = 'var(--accent-gold)';
        card.innerHTML = `
            <p class="wish-text">"${escapeHTML(wish.message)}"</p>
            <div class="wish-author">
                <div class="author-info">
                    <span class="author-name">${escapeHTML(wish.name)}</span>
                    <span class="wish-date">${wish.date}</span>
                </div>
            </div>
        `;
        // Prepend to wishes board so newest appears first
        board.insertBefore(card, board.firstChild);
    });
}

function renderLocalWishes() {
    const localWishes = JSON.parse(localStorage.getItem('graduation_wishes')) || [];
    renderWishes(localWishes);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
