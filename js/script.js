document.addEventListener('DOMContentLoaded', () => {

    // Hero Slideshow
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000); // Change slide every 5 seconds

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Dropdown functionality for mobile
    const dropdowns = document.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownMenu = dropdown.querySelector('.dropdown');
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

});

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // This part is for handling dropdowns on mobile.
    // It prevents the dropdown from being "hidden" on hover, which doesn't work on mobile.
    const hasDropdowns = document.querySelectorAll('.has-dropdown > a');
    hasDropdowns.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if the screen is mobile-sized
            if (window.innerWidth <= 768) {
                // Prevent the link from navigating
                e.preventDefault();
                // Find the dropdown and toggle its visibility
                const dropdown = link.nextElementSibling;
                if (dropdown) {
                    // Toggle the 'show' class
                    dropdown.classList.toggle('show');
                }
            }
        });
    });
});
