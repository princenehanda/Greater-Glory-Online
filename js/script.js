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
                console.log('Scrolled - class added, scrollY:', window.scrollY);
            } else {
                header.classList.remove('scrolled');
                console.log('Top - class removed, scrollY:', window.scrollY);
            }
        } else {
            console.log('Header element not found!');
        }
    }

    // Add the event listener to the window
    window.addEventListener('scroll', handleHeaderOnScroll);
    
    // Check initial state
    handleHeaderOnScroll();

    // --- Mobile Navigation & Dropdowns ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    document.querySelectorAll('.has-dropdown > a').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = this.parentElement;

                parentLi.classList.toggle('active');

                document.querySelectorAll('.has-dropdown.active').forEach(otherItem => {
                    if (otherItem !== parentLi) {
                        otherItem.classList.remove('active');
                    }
                });
            }
        });
    });

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.querySelectorAll('.has-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
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
