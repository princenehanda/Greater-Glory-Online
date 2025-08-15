import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase Config — Replace with your own values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authButton = document.getElementById("authButton");
const toggleForm = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const cellSelect = document.getElementById("cell");
const deptSelect = document.getElementById("department");

let isRegistering = false;

// Toggle between login/register
toggleForm.addEventListener("click", (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    formTitle.textContent = isRegistering ? "Register" : "Sign In";
    authButton.textContent = isRegistering ? "Register" : "Sign In";
    toggleForm.textContent = isRegistering
        ? "Already have an account? Sign In"
        : "Don't have an account? Register";

    cellSelect.parentElement.style.display = isRegistering ? "block" : "none";
    deptSelect.parentElement.style.display = isRegistering ? "block" : "none";
});

// Auth action
authButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const cell = cellSelect.value;
    const department = deptSelect.value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        if (isRegistering) {
            if (!cell || !department || cell === "none" || department === "none") {
                alert("Please select a cell and department");
                return;
            }
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCred.user.uid), {
                role: "member",
                cell,
                department,
                createdAt: new Date()
            });
            alert("Registration successful! You are logged in as a Member.");
            window.location.href = "../index.html";
        } else {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                switch (role) {
                    case "pastor":
                        window.location.href = "Pastor-dashboard.html";
                        break;
                    case "admin":
                        window.location.href = "admin-dashboard.html";
                        break;
                    case "leader":
                        window.location.href = "leader-dashboard.html";
                        break;
                    default:
                        window.location.href = "../index.html";
                        break;
                }
            } else {
                alert("No role found for this account. You will be redirected to the homepage.");
                window.location.href = "../index.html";
            }
        }
    } catch (error) {
        alert(error.message);
    }
});
