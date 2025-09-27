// auth.js
import { auth } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

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
    // Check if user is authenticated
    const mockAuth = localStorage.getItem('mockAuth');
    if (mockAuth) {
        const user = JSON.parse(mockAuth);
        console.log('Mock user found:', user);
        updateNavForUser(user);
    }
}

// Utility function to create mock account selector
function createMockAccountSelector() {
    const mockAccounts = {
        'member@ggm.local': { role: 'member', name: 'John Member' },
        'leader@ggm.local': { role: 'leader', name: 'Jane Leader' },
        'admin@ggm.local': { role: 'admin', name: 'Samuel Admin' },
        'pastor@ggm.local': { role: 'pastor', name: 'Pastor Michael' }
    };

    const selector = document.createElement('div');
    selector.style.cssText = `
        position: fixed; top: 10px; right: 10px; z-index: 10000;
        background: white; padding: 10px; border: 2px solid #ccc;
        border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    selector.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold;">Mock Login (Dev Only)</div>
        <select id="mockAccountSelect" style="width: 200px; margin-bottom: 10px;">
            <option value="">Select Account</option>
            ${Object.entries(mockAccounts).map(([email, data]) =>
                `<option value="${email}">${data.name} (${data.role})</option>`
            ).join('')}
        </select>
        <br>
        <button id="mockLoginBtn" style="margin-right: 5px;">Login</button>
        <button id="mockLogoutBtn">Logout</button>
    `;

    document.body.appendChild(selector);

    // Add event listeners
    document.getElementById('mockLoginBtn').addEventListener('click', () => {
        const selectedEmail = document.getElementById('mockAccountSelect').value;
        if (selectedEmail) {
            const userData = mockAccounts[selectedEmail];
            localStorage.setItem('mockAuth', JSON.stringify({
                email: selectedEmail,
                ...userData
            }));
            location.reload();
        }
    });

    document.getElementById('mockLogoutBtn').addEventListener('click', () => {
        localStorage.removeItem('mockAuth');
        location.reload();
    });
}

// Function to update navigation based on user role
function updateNavForUser(user) {
    // Show/hide navigation items based on user role
    const memberOnlyItems = document.querySelectorAll('.member-only');
    const leaderOnlyItems = document.querySelectorAll('.leader-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    const pastorOnlyItems = document.querySelectorAll('.pastor-only');
    const authActions = document.querySelectorAll('.auth-action');

    // Hide all role-specific items first
    [memberOnlyItems, leaderOnlyItems, adminOnlyItems, pastorOnlyItems].forEach(items => {
        items.forEach(item => item.style.display = 'none');
    });

    // Show items based on user role
    if (user.role === 'member' || user.role === 'leader' || user.role === 'admin' || user.role === 'pastor') {
        memberOnlyItems.forEach(item => item.style.display = 'block');
    }
    if (user.role === 'leader' || user.role === 'admin' || user.role === 'pastor') {
        leaderOnlyItems.forEach(item => item.style.display = 'block');
    }
    if (user.role === 'admin' || user.role === 'pastor') {
        adminOnlyItems.forEach(item => item.style.display = 'block');
    }
    if (user.role === 'pastor') {
        pastorOnlyItems.forEach(item => item.style.display = 'block');
    }

    // Update auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.parentElement.style.display = 'none';
    if (logoutBtn) {
        logoutBtn.parentElement.style.display = 'block';
        logoutBtn.textContent = `Logout (${user.name})`;
    }
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
