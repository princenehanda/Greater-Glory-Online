// standalone-script.js - No module imports for testing
console.log('Script loaded successfully');

// Conference dates - Update these as needed
const CONFERENCE_START = new Date('2025-10-03T17:30:00+02:00'); // Friday 5:30 PM CAT
const CONFERENCE_END = new Date('2025-10-05T12:59:59+02:00'); // Sunday midday CAT

let miniCountdownInterval;
let upcomingCountdownInterval;

console.log('Conference dates set:');
console.log('Start:', CONFERENCE_START.toString());
console.log('End:', CONFERENCE_END.toString());
console.log('Current time:', new Date().toString());

/**
 * Helper function to calculate and display the countdown (Days, Hours, Minutes) for index.html.
 */
function displayMiniCountdown(timeDiff) {
    console.log('displayMiniCountdown called with timeDiff:', timeDiff);
    
    if (timeDiff <= 0) {
        console.log('Time difference is negative or zero');
        return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    console.log('Calculated mini countdown:', { days, hours, minutes });

    const daysElement = document.getElementById('miniDays');
    const hoursElement = document.getElementById('miniHours');
    const minutesElement = document.getElementById('miniMinutes');

    console.log('Mini countdown elements found:', {
        days: !!daysElement,
        hours: !!hoursElement,
        minutes: !!minutesElement
    });

    if (daysElement) {
        daysElement.textContent = String(days).padStart(2, '0');
        console.log('Updated days element to:', days);
    }
    if (hoursElement) {
        hoursElement.textContent = String(hours).padStart(2, '0');
        console.log('Updated hours element to:', hours);
    }
    if (minutesElement) {
        minutesElement.textContent = String(minutes).padStart(2, '0');
        console.log('Updated minutes element to:', minutes);
    }
}

/**
 * Helper function to calculate and display the full countdown (D, H, M, S) for upcoming.html.
 */
function displayUpcomingCountdown(timeDiff) {
    console.log('displayUpcomingCountdown called with timeDiff:', timeDiff);
    
    if (timeDiff <= 0) {
        console.log('Time difference is negative or zero');
        return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    console.log('Calculated full countdown:', { days, hours, minutes, seconds });

    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    console.log('Full countdown elements found:', {
        days: !!daysElement,
        hours: !!hoursElement,
        minutes: !!minutesElement,
        seconds: !!secondsElement
    });

    if (daysElement) {
        daysElement.textContent = String(days).padStart(2, '0');
        console.log('Updated days element to:', days);
    }
    if (hoursElement) {
        hoursElement.textContent = String(hours).padStart(2, '0');
        console.log('Updated hours element to:', hours);
    }
    if (minutesElement) {
        minutesElement.textContent = String(minutes).padStart(2, '0');
        console.log('Updated minutes element to:', minutes);
    }
    if (secondsElement) {
        secondsElement.textContent = String(seconds).padStart(2, '0');
        console.log('Updated seconds element to:', seconds);
    }
}

/**
 * Logic for the index.html featured event section.
 */
function updateVideoHighlight() {
    console.log('updateVideoHighlight called');
    const now = new Date();
    
    console.log('Current time:', now.toString());
    console.log('Conference start:', CONFERENCE_START.toString());
    console.log('Conference end:', CONFERENCE_END.toString());
    
    const elements = {
        videoPlaceholder: document.getElementById('videoPlaceholder'),
        conferenceVideo: document.getElementById('conferenceVideo'),
        liveBadge: document.getElementById('liveBadge'),
        comingSoonBadge: document.getElementById('comingSoonBadge'),
        countdownMini: document.getElementById('miniCountdown'),
        eventBadge: document.getElementById('eventBadge'),
        eventTitle: document.getElementById('eventTitle'),
        eventDescription: document.getElementById('eventDescription'),
        primaryAction: document.getElementById('primaryAction'),
        secondaryAction: document.getElementById('secondaryAction'),
    };
    
    console.log('Video highlight elements found:', {
        videoPlaceholder: !!elements.videoPlaceholder,
        conferenceVideo: !!elements.conferenceVideo,
        liveBadge: !!elements.liveBadge,
        comingSoonBadge: !!elements.comingSoonBadge,
        countdownMini: !!elements.countdownMini,
        eventBadge: !!elements.eventBadge,
        eventTitle: !!elements.eventTitle,
        eventDescription: !!elements.eventDescription,
        primaryAction: !!elements.primaryAction,
        secondaryAction: !!elements.secondaryAction
    });
    
    // Check if the page is index.html
    if (!elements.countdownMini) {
        console.log('Mini countdown element not found - not on index page');
        return;
    }

    if (now < CONFERENCE_START) {
        // --- Before conference ---
        console.log('Status: Before conference');
        if (elements.eventBadge) elements.eventBadge.textContent = 'Upcoming Event';
        if (elements.eventTitle) elements.eventTitle.textContent = 'Ladies Aflame Conference 2025';
        if (elements.eventDescription) elements.eventDescription.textContent = 'A 3-day encounter of power, prayer, and transformation for women.';
        if (elements.countdownMini) elements.countdownMini.style.display = 'flex';
        if (elements.liveBadge) elements.liveBadge.style.display = 'none';
        if (elements.comingSoonBadge) elements.comingSoonBadge.style.display = 'block';
        if (elements.videoPlaceholder) elements.videoPlaceholder.style.display = 'none';
        if (elements.conferenceVideo) elements.conferenceVideo.style.display = 'block';
        if (elements.primaryAction) elements.primaryAction.innerHTML = '<i class="fas fa-calendar-plus"></i> Register Now';
        if (elements.secondaryAction) elements.secondaryAction.innerHTML = '<i class="fas fa-info-circle"></i> Learn More';
        
        const timeUntilStart = CONFERENCE_START.getTime() - now.getTime();
        console.log('Time until start (ms):', timeUntilStart);
        displayMiniCountdown(timeUntilStart);
        
    } else if (now >= CONFERENCE_START && now <= CONFERENCE_END) {
        // --- During conference ---
        console.log('Status: During conference');
        if (elements.eventBadge) elements.eventBadge.textContent = 'Live Event';
        if (elements.eventTitle) elements.eventTitle.innerHTML = 'Ladies Aflame 2025 <span style="color: #ff4444;">LIVE NOW</span>';
        if (elements.eventDescription) elements.eventDescription.textContent = 'The conference is live! Click the button below to join the stream.';
        if (elements.countdownMini) elements.countdownMini.style.display = 'none';
        if (elements.liveBadge) elements.liveBadge.style.display = 'block';
        if (elements.comingSoonBadge) elements.comingSoonBadge.style.display = 'none';
        if (elements.videoPlaceholder) elements.videoPlaceholder.style.display = 'block';
        if (elements.conferenceVideo) elements.conferenceVideo.style.display = 'none';
        if (elements.primaryAction) elements.primaryAction.innerHTML = '<i class="fas fa-video"></i> Join Now';
        if (elements.secondaryAction) elements.secondaryAction.innerHTML = '<i class="fas fa-phone"></i> Get Support';
        
    } else {
        // --- After conference ---
        console.log('Status: After conference');
        if (elements.eventBadge) elements.eventBadge.textContent = 'Recent Event';
        if (elements.eventTitle) elements.eventTitle.textContent = 'Ladies Aflame 2025 Highlights';
        if (elements.eventDescription) elements.eventDescription.textContent = 'Missed the conference? Watch highlights and testimonies from this powerful 3-day event.';
        if (elements.countdownMini) elements.countdownMini.style.display = 'none';
        if (elements.liveBadge) elements.liveBadge.style.display = 'none';
        if (elements.comingSoonBadge) {
            elements.comingSoonBadge.textContent = 'Highlights Available';
            elements.comingSoonBadge.style.display = 'block';
        }
        if (elements.videoPlaceholder) elements.videoPlaceholder.style.display = 'none';
        if (elements.conferenceVideo) elements.conferenceVideo.style.display = 'block';
        if (elements.primaryAction) elements.primaryAction.innerHTML = '<i class="fas fa-play"></i> Watch Highlights';
        if (elements.secondaryAction) elements.secondaryAction.innerHTML = '<i class="fas fa-calendar"></i> Next Events';
        
        if (miniCountdownInterval) {
            clearInterval(miniCountdownInterval);
            miniCountdownInterval = null;
        }
    }
}

/**
 * Logic for the upcoming.html page featured event section.
 */
function updateUpcomingCountdown() {
    console.log('updateUpcomingCountdown called');
    const now = new Date();
    
    console.log('Upcoming page - Current time:', now.toString());
    console.log('Upcoming page - Conference start:', CONFERENCE_START.toString());
    
    const elements = {
        eventCountdown: document.getElementById('eventCountdown'),
        liveStatus: document.getElementById('liveStatus'),
        joinButton: document.getElementById('joinButton'),
        featuredEvent: document.getElementById('featuredEvent'),
        upcomingVideo: document.getElementById('upcomingVideo'),
    };

    console.log('Upcoming countdown elements found:', {
        eventCountdown: !!elements.eventCountdown,
        liveStatus: !!elements.liveStatus,
        joinButton: !!elements.joinButton,
        featuredEvent: !!elements.featuredEvent,
        upcomingVideo: !!elements.upcomingVideo
    });

    // Check if the page is upcoming.html
    if (!elements.eventCountdown) {
        console.log('Event countdown element not found - not on upcoming page');
        return;
    }
    
    // Reset button animation
    if (elements.joinButton) elements.joinButton.style.animation = 'none';

    if (now < CONFERENCE_START) {
        // --- Before conference ---
        console.log('Upcoming Status: Before conference');
        if (elements.eventCountdown) elements.eventCountdown.style.display = 'flex';
        if (elements.liveStatus) elements.liveStatus.style.display = 'none';
        if (elements.upcomingVideo) elements.upcomingVideo.style.display = 'block';
        if (elements.joinButton) elements.joinButton.innerHTML = '<i class="fas fa-calendar-plus"></i> Register Now';
        
        const timeUntilStart = CONFERENCE_START.getTime() - now.getTime();
        console.log('Time until start (ms):', timeUntilStart);
        displayUpcomingCountdown(timeUntilStart);
        
    } else if (now >= CONFERENCE_START && now <= CONFERENCE_END) {
        // --- During conference ---
        console.log('Upcoming Status: During conference');
        if (elements.eventCountdown) elements.eventCountdown.style.display = 'none';
        if (elements.liveStatus) elements.liveStatus.style.display = 'flex';
        if (elements.upcomingVideo) elements.upcomingVideo.style.display = 'none';
        if (elements.joinButton) {
            elements.joinButton.innerHTML = '<i class="fas fa-video"></i> Join Live Now';
            elements.joinButton.style.animation = 'titlePulse 1s ease-in-out infinite';
        }
        
    } else {
        // --- After conference ---
        console.log('Upcoming Status: After conference');
        if (elements.featuredEvent) elements.featuredEvent.style.display = 'none';
        if (upcomingCountdownInterval) {
            clearInterval(upcomingCountdownInterval);
            upcomingCountdownInterval = null;
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing countdown');
    
    // Test if we can find the countdown elements
    const miniCountdown = document.getElementById('miniCountdown');
    const eventCountdown = document.getElementById('eventCountdown');
    
    console.log('Found countdown elements:', {
        miniCountdown: !!miniCountdown,
        eventCountdown: !!eventCountdown
    });
    
    // --- Hero Slideshow logic ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        console.log('Initializing hero slideshow with', slides.length, 'slides');
        let currentSlide = 0;
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        setInterval(nextSlide, 5000);
        showSlide(currentSlide);
    }

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        console.log('Initializing mobile navigation');
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Countdown Initialization ---
    if (miniCountdown) {
        console.log('Initializing mini countdown for index page');
        updateVideoHighlight(); // Run once immediately
        miniCountdownInterval = setInterval(updateVideoHighlight, 1000);
    }

    if (eventCountdown) {
        console.log('Initializing full countdown for upcoming page');
        updateUpcomingCountdown(); // Run once immediately
        upcomingCountdownInterval = setInterval(updateUpcomingCountdown, 1000);
    }
    
    // Test the countdown functions manually
    console.log('=== MANUAL TEST ===');
    const now = new Date();
    const testDiff = CONFERENCE_START.getTime() - now.getTime();
    console.log('Test time difference:', testDiff);
    console.log('Test days:', Math.floor(testDiff / (1000 * 60 * 60 * 24)));
    console.log('Test hours:', Math.floor((testDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    console.log('Test minutes:', Math.floor((testDiff % (1000 * 60 * 60)) / (1000 * 60)));
});

// Cleanup intervals when page unloads
window.addEventListener('beforeunload', function() {
    console.log('Page unloading - cleaning up intervals');
    if (miniCountdownInterval) {
        clearInterval(miniCountdownInterval);
    }
    if (upcomingCountdownInterval) {
        clearInterval(upcomingCountdownInterval);
    }
});
