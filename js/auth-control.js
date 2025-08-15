// Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

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
