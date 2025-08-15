// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhJGjCQpjHdHC5Lc0b9e7p5of3qBw2lSw",
  authDomain: "greatergloryonline-6176b.firebaseapp.com",
  projectId: "greatergloryonline-6176b",
  storageBucket: "greatergloryonline-6176b.firebasestorage.app",
  messagingSenderId: "311924502734",
  appId: "1:311924502734:web:423e7222cf1c529288e09f",
  measurementId: "G-W9Q1J7GF3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const toggleElements = (cls, show) => {
    document.querySelectorAll(`.${cls}`).forEach(el => {
        el.style.display = show ? "inline-block" : "none";
    });
};

const handleMediaLink = (user) => {
    const mediaLink = document.querySelector(".media-link a");
    if (!mediaLink) return;

    if (user) {
        mediaLink.href = "pages/media.html";
        mediaLink.style.cursor = "pointer";
        mediaLink.onclick = null;
    } else {
        mediaLink.href = "#";
        mediaLink.style.cursor = "pointer";
        mediaLink.onclick = (e) => {
            e.preventDefault();
            alert("Please sign in or register to access the Media content.");
            window.location.href = "pages/auth.html";
        };
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await auth.signOut();
                window.location.href = "../index.html"; // Ensure this works for all pages
            } catch (error) {
                console.error("Logout failed:", error);
            }
        });
    }

    auth.onAuthStateChanged(async user => {
        const allRoles = ["member-only", "leader-only", "admin-only", "pastor-only", "auth-action"];
        allRoles.forEach(roleClass => toggleElements(roleClass, false));

        if (user) {
            const loginBtn = document.getElementById("loginBtn");
            const logoutBtn = document.getElementById("logoutBtn");
            if (loginBtn) loginBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";
            
            handleMediaLink(user);

            const docSnap = await db.collection("users").doc(user.uid).get();
            if (docSnap.exists) {
                const userRole = docSnap.data().role;
                switch (userRole) {
                    case "pastor":
                        toggleElements("pastor-only", true);
                    case "admin":
                        toggleElements("admin-only", true);
                    case "leader":
                        toggleElements("leader-only", true);
                    case "member":
                        toggleElements("member-only", true);
                        break;
                }
            }
        } else {
            const loginBtn = document.getElementById("loginBtn");
            const logoutBtn = document.getElementById("logoutBtn");
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (logoutBtn) logoutBtn.style.display = "none";

            handleMediaLink(user);
        }
    });
});
