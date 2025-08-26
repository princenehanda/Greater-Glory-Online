// Enhanced auth.js with mock accounts for offline testing
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

// Firebase Config – Replace with your own values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Mock accounts for offline testing
const MOCK_ACCOUNTS = {
    'member@ggm.local': { password: 'member123', role: 'member', name: 'John Member', cell: 'Cell Alpha', department: 'Choir' },
    'leader@ggm.local': { password: 'leader123', role: 'leader', name: 'Jane Leader', cell: 'Cell Alpha', department: 'Ushering' },
    'admin@ggm.local': { password: 'admin123', role: 'admin', name: 'Admin Smith', cell: 'Cell Beta', department: 'Media' },
    'pastor@ggm.local': { password: 'pastor123', role: 'pastor', name: 'Pastor Johnson', cell: 'Leadership', department: 'Ministry' }
};

// Check if we're in offline mode (Firebase not available)
function isOfflineMode() {
    return !navigator.onLine || localStorage.getItem('offlineMode') === 'true';
}

// Initialize Firebase (only if online)
let app, auth, db;
if (!isOfflineMode()) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.log('Firebase initialization failed, switching to offline mode');
        localStorage.setItem('offlineMode', 'true');
    }
}

// DOM Elements
const authButton = document.getElementById("authButton");
const toggleForm = document.getElementById("toggleForm");
const formTitle = document.getElementById("formTitle");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const cellSelect = document.getElementById("cell");
const deptSelect = document.getElementById("department");

let isRegistering = false;

// Create mock account selector for testing
function createMockAccountSelector() {
    const mockSelector = document.createElement('div');
    mockSelector.id = 'mockAccountSelector';
    mockSelector.innerHTML = `
        <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: #495057;">🧪 Test Accounts (Offline Mode)</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                <button type="button" class="mock-btn member-btn" onclick="fillMockAccount('member@ggm.local')">
                    👤 Member Account
                </button>
                <button type="button" class="mock-btn leader-btn" onclick="fillMockAccount('leader@ggm.local')">
                    👥 Leader Account  
                </button>
                <button type="button" class="mock-btn admin-btn" onclick="fillMockAccount('admin@ggm.local')">
                    🛡️ Admin Account
                </button>
                <button type="button" class="mock-btn pastor-btn" onclick="fillMockAccount('pastor@ggm.local')">
                    ⛪ Pastor Account
                </button>
            </div>
            <p style="margin-bottom: 0; font-size: 0.8em; color: #6c757d;">
                Click any button to auto-fill credentials for testing. All passwords are: role + "123"
            </p>
        </div>
    `;
    
    const form = document.getElementById("authForm");
    form.parentNode.insertBefore(mockSelector, form);
    
    // Add CSS for mock buttons
    const style = document.createElement('style');
    style.textContent = `
        .mock-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.2s;
        }
        .member-btn { background: #28a745; color: white; }
        .member-btn:hover { background: #218838; }
        .leader-btn { background: #ffc107; color: #212529; }
        .leader-btn:hover { background: #e0a800; }
        .admin-btn { background: #dc3545; color: white; }
        .admin-btn:hover { background: #c82333; }
        .pastor-btn { background: #6f42c1; color: white; }
        .pastor-btn:hover { background: #5a32a3; }
    `;
    document.head.appendChild(style);
}

// Fill form with mock account data
function fillMockAccount(email) {
    const account = MOCK_ACCOUNTS[email];
    if (account) {
        emailInput.value = email;
        passwordInput.value = account.password;
        
        // Auto-fill registration fields if in registration mode
        if (isRegistering) {
            cellSelect.value = account.cell;
            deptSelect.value = account.department;
        }
    }
}

// Make fillMockAccount global for onclick handlers
window.fillMockAccount = fillMockAccount;

// Mock authentication function
function mockAuthenticate(email, password) {
    const account = MOCK_ACCOUNTS[email];
    if (!account || account.password !== password) {
        throw new Error('Invalid email or password');
    }
    
    const mockUser = {
        uid: 'mock-' + account.role + '-' + Date.now(),
        email: email,
        role: account.role,
        name: account.name,
        cell: account.cell,
        department: account.department,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('mockAuth', JSON.stringify(mockUser));
    return mockUser;
}

// Mock registration function
function mockRegister(email, password, cell, department) {
    if (MOCK_ACCOUNTS[email]) {
        throw new Error('Account already exists');
    }
    
    // For demo purposes, allow registration but with member role
    const mockUser = {
        uid: 'mock-member-' + Date.now(),
        email: email,
        role: 'member',
        name: 'New Member',
        cell: cell,
        department: department,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('mockAuth', JSON.stringify(mockUser));
    return mockUser;
}

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
    
    // Hide mock selector during registration for cleaner UI
    const mockSelector = document.getElementById('mockAccountSelector');
    if (mockSelector) {
        mockSelector.style.display = isRegistering ? 'none' : 'block';
    }
});

// Enhanced auth action with offline support
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
        if (isOfflineMode()) {
            // Use mock authentication
            if (isRegistering) {
                if (!cell || !department || cell === "none" || department === "none") {
                    alert("Please select a cell and department");
                    return;
                }
                const user = mockRegister(email, password, cell, department);
                alert("Registration successful! You are logged in as a Member.");
                redirectBasedOnRole('member');
            } else {
                const user = mockAuthenticate(email, password);
                alert(`Welcome back, ${user.name}! Logged in as ${user.role}.`);
                redirectBasedOnRole(user.role);
            }
        } else {
            // Use Firebase authentication
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
                redirectBasedOnRole('member');
            } else {
                const userCred = await signInWithEmailAndPassword(auth, email, password);
                const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
                const role = userDoc.exists() ? userDoc.data().role : 'member';
                redirectBasedOnRole(role);
            }
        }
    } catch (error) {
        alert(error.message);
    }
});

// Redirect based on user role
function redirectBasedOnRole(role) {
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
        case "member":
        default:
            window.location.href = "member-dashboard.html";
            break;
    }
}

// Check authentication status on page load
function checkAuthStatus() {
    const mockAuth = localStorage.getItem('mockAuth');
    if (mockAuth) {
        const user = JSON.parse(mockAuth);
        // Auto-redirect if already logged in
        if (window.location.pathname.includes('auth.html')) {
            redirectBasedOnRole(user.role);
        }
        return user;
    }
    
    // Check Firebase auth if online
    if (!isOfflineMode() && auth) {
        auth.onAuthStateChanged(user => {
            if (user && window.location.pathname.includes('auth.html')) {
                // Redirect authenticated users away from auth page
                window.location.href = "../index.html";
            }
        });
    }
    
    return null;
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
function toggleOfflineMode() {
    const current = localStorage.getItem('offlineMode') === 'true';
    localStorage.setItem('offlineMode', (!current).toString());
    window.location.reload();
}

// Utility function to clear mock auth
function clearMockAuth() {
    localStorage.removeItem('mockAuth');
    localStorage.removeItem('offlineMode');
    alert('Mock authentication cleared. Page will reload.');
    window.location.reload();
}

// Make utility functions available globally for console testing
window.toggleOfflineMode = toggleOfflineMode;
window.clearMockAuth = clearMockAuth;
window.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

