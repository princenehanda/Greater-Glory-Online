document.addEventListener('DOMContentLoaded', () => {
    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
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

    // --- Mobile Navigation & Dropdowns ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        // Toggle the hamburger and nav menu
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Debug logging
            console.log('Hamburger clicked');
            console.log('Nav links active:', navLinks.classList.contains('active'));
        });
    } else {
        console.log('Hamburger or nav-links not found');
        console.log('Hamburger:', hamburger);
        console.log('Nav links:', navLinks);
    }

    // Handle mobile dropdowns
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    
    dropdownToggles.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            // Check if on a mobile-sized screen
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent page navigation
                
                const dropdown = link.nextElementSibling;
                console.log(`Dropdown ${index} clicked, dropdown found:`, dropdown);
                
                if (dropdown && dropdown.classList.contains('dropdown')) {
                    // Close other dropdowns first
                    dropdownToggles.forEach((otherLink, otherIndex) => {
                        if (otherIndex !== index) {
                            const otherDropdown = otherLink.nextElementSibling;
                            if (otherDropdown && otherDropdown.classList.contains('dropdown')) {
                                otherDropdown.classList.remove('show');
                            }
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('show');
                    console.log('Dropdown show class:', dropdown.classList.contains('show'));
                }
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Close all dropdowns
            document.querySelectorAll('.dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // Handle window resize - close mobile menu if window gets larger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.querySelectorAll('.dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
});
