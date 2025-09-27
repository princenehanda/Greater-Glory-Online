// script.js
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

    // --- Mobile Navigation & Dropdowns ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');

            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('mobile-show');
            });

            console.log('Hamburger clicked, nav active:', navLinks.classList.contains('active'));
        });

        hamburger.addEventListener('touchstart', (e) => {
             e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // --- Card Flip Functionality ---
    document.addEventListener('click', function(e) {
        const flipTrigger = e.target.closest('[data-flip-trigger]');

        if (flipTrigger) {
            const card = flipTrigger.closest('[data-flip-card]');

            if (card) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Flip trigger clicked');
                card.classList.toggle('flipped');
                return;
            }
        }

        if (e.target.tagName === 'A' || e.target.closest('a')) {
            const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
            console.log('Link clicked:', link.href);
            return;
        }
    });

    // --- Firebase Authentication Handling (New) ---

    // Handle registration
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

    // Handle login
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

    // Monitor auth state changes
    monitorAuth(user => {
        if (user) {
            console.log("👤 User is logged in:", user.email);
        } else {
            console.log("🚪 No user logged in");
        }
    });

    // Handle logout
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        logoutUser()
            .then(() => console.log("✅ User logged out"))
            .catch(error => console.error("❌ Logout error:", error.message));
    });
});
