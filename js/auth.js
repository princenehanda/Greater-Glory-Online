// auth.js
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Register a new user with Firebase
export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login an existing user with Firebase
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// The following code is from your original auth.js file
// It handles mock authentication for development mode

// Utility function to check if offline mode is active
function isOfflineMode() {
    return localStorage.getItem('offlineMode') === 'true';
}

// Utility function to check auth status
function checkAuthStatus() {
    // ... [Your original checkAuthStatus function code here] ...
}

// Utility function to create mock account selector
function createMockAccountSelector() {
    // ... [Your original createMockAccountSelector function code here] ...
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add mock account selector if in offline mode or if specifically requested
    if (isOfflineMode() || localStorage.getItem('showMockAccounts') === 'true') {
        createMockAccountSelector();
    }

    checkAuthStatus();

    // Add offline mode indicator
    if (isOfflineMode()) {
        document.body.insertAdjacentHTML('afterbegin', `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; text-align: center; font-size: 0.9em;">
                🔌 Offline Mode: Using mock authentication for testing
            </div>
        `);
    }
});

// Utility function to toggle offline mode (for testing)
window.toggleOfflineMode = function() {
    const current = localStorage.getItem('offlineMode') === 'true';
    localStorage.setItem('offlineMode', (!current).toString());
    window.location.reload();
};

// Utility function to clear mock auth
window.clearMockAuth = function() {
    localStorage.removeItem('mockAuth');
    localStorage.removeItem('offlineMode');
    alert('Mock authentication cleared. Page will reload.');
    window.location.reload();
};
