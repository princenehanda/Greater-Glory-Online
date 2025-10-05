// ✅ FIX: Use absolute paths (starting with /) for all module imports.
// This ensures they resolve correctly from any page location (e.g., /pages/about.html)
import { registerUser, loginUser } from "/js/auth.js";
import { monitorAuth, logoutUser } from "/js/auth-control.js";

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

    document.querySelectorAll('.has-dropdown > a').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = this.parentElement;

                // Toggle 'active' class on the parent list item (V3 Dropdown style)
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

    if (hamburger && navLinks) {
        // ✅ FIX 2: Stop propagation to prevent the document-wide listener from immediately closing the menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            console.log('Hamburger clicked, nav active:', navLinks.classList.contains('active'));
        });

        // Prevents the touch event from bubbling up and causing issues
        hamburger.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            // Only close if the click is outside both the menu and the hamburger button
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

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
