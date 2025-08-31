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
    
    // Hamburger menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Close all dropdowns when hamburger is toggled
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('mobile-show');
            });
            
            console.log('Hamburger clicked, nav active:', navLinks.classList.contains('active'));
        });
        
        // Add touch support for mobile devices
        hamburger.addEventListener('touchstart', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Handle dropdown toggles for mobile
    const dropdownParents = document.querySelectorAll('.has-dropdown');
    
    dropdownParents.forEach((parent) => {
        const link = parent.querySelector('a');
        const dropdown = parent.querySelector('.dropdown');
        
        if (link && dropdown) {
            // Create a toggle indicator for mobile
            const toggleIndicator = document.createElement('span');
            toggleIndicator.className = 'dropdown-toggle';
            toggleIndicator.innerHTML = '▼';
            toggleIndicator.style.marginLeft = '8px';
            toggleIndicator.style.fontSize = '0.8em';
            
            // Add indicator only on mobile
            function updateIndicator() {
                if (window.innerWidth <= 768) {
                    if (!link.querySelector('.dropdown-toggle')) {
                        link.appendChild(toggleIndicator);
                    }
                } else {
                    const existingIndicator = link.querySelector('.dropdown-toggle');
                    if (existingIndicator) {
                        existingIndicator.remove();
                    }
                }
            }
            
            updateIndicator();
            window.addEventListener('resize', updateIndicator);
            
            // Handle click on mobile
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Prevent navigation on mobile
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown').forEach((otherDropdown) => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('mobile-show');
                            const otherParent = otherDropdown.closest('.has-dropdown');
                            const otherIndicator = otherParent?.querySelector('.dropdown-toggle');
                            if (otherIndicator) {
                                otherIndicator.innerHTML = '▼';
                                otherIndicator.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('mobile-show');
                    
                    // Update indicator
                    if (dropdown.classList.contains('mobile-show')) {
                        toggleIndicator.innerHTML = '▲';
                        toggleIndicator.style.transform = 'rotate(180deg)';
                    } else {
                        toggleIndicator.innerHTML = '▼';
                        toggleIndicator.style.transform = 'rotate(0deg)';
                    }
                    
                    console.log('Mobile dropdown toggled:', dropdown.classList.contains('mobile-show'));
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            
            // Close all mobile dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('mobile-show');
            });
            
            // Reset all indicators
            document.querySelectorAll('.dropdown-toggle').forEach(indicator => {
                indicator.innerHTML = '▼';
                indicator.style.transform = 'rotate(0deg)';
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Desktop view - clean up mobile states
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('mobile-show');
            });
        }
    });
});
