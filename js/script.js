document.addEventListener('DOMContentLoaded', () => {

    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) { // Check if slides exist
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        setInterval(nextSlide, 5000); // Change slide every 5 seconds
        showSlide(currentSlide); // Show the first slide initially
    }


    document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation & Dropdowns ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        // Toggle the hamburger and nav menu
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Handle mobile dropdowns
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    dropdownToggles.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if on a mobile-sized screen
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent page navigation
                const dropdown = link.nextElementSibling;
                if (dropdown && dropdown.classList.contains('dropdown')) {
                    dropdown.classList.toggle('show');
                }
            }
        });
    });

});
