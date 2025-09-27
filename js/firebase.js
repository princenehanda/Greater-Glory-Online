// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

// ✅ Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhJGjCQpjHdHC5Lc0b9e7p5of3qBw2lSw",
  authDomain: "greatergloryonline-6176b.firebaseapp.com",
  projectId: "greatergloryonline-6176b",
  storageBucket: "greatergloryonline-6176b.firebasestorage.app",
  messagingSenderId: "311924502734",
  appId: "1:311924502734:web:423e7222cf1c529288e09f",
  };

// Initialize Firebase app once
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);
