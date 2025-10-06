import { registerUser, loginUser } from "./auth.js";
import { monitorAuth, logoutUser } from "./auth-control.js";

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

    // --- Header Transparency on Scroll ---
    function handleHeaderOnScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    // Add the event listener to the window
    window.addEventListener('scroll', handleHeaderOnScroll);
    // Check initial state
    handleHeaderOnScroll();

    // --- Mobile Navigation & Dropdowns ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Handle dropdown toggles
    document.querySelectorAll('.has-dropdown > a').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = this.parentElement;
                parentLi.classList.toggle('active');
                // Close other open dropdowns
                document.querySelectorAll('.has-dropdown.active').forEach(otherItem => {
                    if (otherItem !== parentLi) {
                        otherItem.classList.remove('active');
                    }
                });
            }
        });
    });

    // Handle hamburger menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            // Close all dropdowns when opening/closing the menu
            document.querySelectorAll('.has-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
        hamburger.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            // Close all dropdowns
            document.querySelectorAll('.has-dropdown.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // --- Firebase Authentication Handling ---
    document.getElementById("registerBtn")?.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        registerUser(email, password)
            .then(userCredential => {
                console.log("✅ User registered:", userCredential.user);
            })
            .catch(error => {
                console.error("❌ Registration error:", error.message);
            });
    });

    document.getElementById("loginBtn")?.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        loginUser(email, password)
            .then(userCredential => {
                console.log("✅ User logged in:", userCredential.user);
            })
            .catch(error => {
                console.error("❌ Login error:", error.message);
            });
    });
});
