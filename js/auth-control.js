// auth-control.js
import { auth } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

// Environment detection
const isDevelopment = () => {
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('localhost') ||
           window.location.protocol === 'file:' ||
           localStorage.getItem('dev_mode') === 'true';
};

// Mock accounts - ONLY for development
const MOCK_ACCOUNTS = isDevelopment() ? {
    'member@ggm.local': {
        password: 'member123',
        role: 'member',
        name: 'John Member',
        firstName: 'John',
        lastName: 'Member',
        cell: 'Cell Alpha',
        department: 'Choir',
        phone: '+263 77 123 4567',
        address: '123 Faith Street, Highlands, Harare',
        joinDate: '2024-01-15',
        baptized: true,
        ministries: ['Choir Ministry'],
        attendance: { cell: 90, sunday: 85 }
    },
    'leader@ggm.local': {
        password: 'leader123',
        role: 'leader',
        name: 'Jane Leader',
        firstName: 'Jane',
        lastName: 'Leader',
        cell: 'Cell Alpha',
        department: 'Ushering',
        phone: '+263 77 234 5678',
        joinDate: '2023-01-15',
        baptized: true,
        ministries: ['Ushering Ministry'],
        attendance: { cell: 95, sunday: 90 }
    },
    'admin@ggm.local': {
        password: 'admin123',
        role: 'admin',
        name: 'Samuel Admin',
        firstName: 'Samuel',
        lastName: 'Admin',
        cell: 'Cell Gamma',
        department: 'Administration',
        phone: '+263 77 345 6789',
        joinDate: '2022-01-15',
        baptized: true,
        ministries: ['Admin Ministry'],
        attendance: { cell: 98, sunday: 95 }
    },
    'pastor@ggm.local': {
        password: 'pastor123',
        role: 'pastor',
        name: 'Pastor Michael',
        firstName: 'Michael',
        lastName: 'Michael',
        cell: 'N/A',
        department: 'N/A',
        phone: '+263 77 456 7890',
        joinDate: '2020-01-15',
        baptized: true,
        ministries: ['Teaching Ministry'],
        attendance: { cell: 100, sunday: 100 }
    },
} : {};

// Global state variables
let isAuthenticated = false;
let userRole = null;
let currentUser = null;

// The Firebase equivalent of your original `handleLogout`
export function logoutUser() {
    return signOut(auth);
}

// Monitor user login/logout state
export function monitorAuth(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            isAuthenticated = true;
            userRole = 'member'; // Assign a default role for Firebase users for simplicity
            currentUser = user;
            updateNavForAuthenticatedUser(user);
        } else {
            isAuthenticated = false;
            userRole = null;
            currentUser = null;
            updateNavForUnauthenticatedUser();
        }
        if (callback) {
            callback(user);
        }
    });
}

// Update navigation for authenticated user
function updateNavForAuthenticatedUser(user) {
    const memberOnlyItems = document.querySelectorAll('.member-only');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Show member-only items
    memberOnlyItems.forEach(item => item.style.display = 'block');

    // Update auth buttons
    if (loginBtn) loginBtn.parentElement.style.display = 'none';
    if (logoutBtn) {
        logoutBtn.parentElement.style.display = 'block';
        logoutBtn.textContent = `Logout (${user.email})`;
    }
}

// Update navigation for unauthenticated user
function updateNavForUnauthenticatedUser() {
    const memberOnlyItems = document.querySelectorAll('.member-only');
    const leaderOnlyItems = document.querySelectorAll('.leader-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    const pastorOnlyItems = document.querySelectorAll('.pastor-only');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Hide all role-specific items
    [memberOnlyItems, leaderOnlyItems, adminOnlyItems, pastorOnlyItems].forEach(items => {
        items.forEach(item => item.style.display = 'none');
    });

    // Update auth buttons
    if (loginBtn) loginBtn.parentElement.style.display = 'block';
    if (logoutBtn) logoutBtn.parentElement.style.display = 'none';
}

// Mock authentication for development (preserved from your original code)
function authenticateWithMockAccount(email) {
    if (!isDevelopment()) {
        console.warn('Mock authentication only available in development mode');
        return false;
    }

    const account = MOCK_ACCOUNTS[email];
    if (!account) {
        console.error('Mock account not found:', email);
        return false;
    }

    // Set mock authentication state
    localStorage.setItem('mockAuth', JSON.stringify({
        email: email,
        ...account
    }));

    // Update global state
    isAuthenticated = true;
    userRole = account.role;
    currentUser = { email: email, ...account };

    showNotification(`Authenticated as ${account.name} (${account.role})`, 'success');

    // Update UI
    updateUIForRole(account.role);

    return true;
}

// Update UI based on user role
function updateUIForRole(role) {
    const memberOnlyItems = document.querySelectorAll('.member-only');
    const leaderOnlyItems = document.querySelectorAll('.leader-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    const pastorOnlyItems = document.querySelectorAll('.pastor-only');

    // Hide all role-specific items first
    [memberOnlyItems, leaderOnlyItems, adminOnlyItems, pastorOnlyItems].forEach(items => {
        items.forEach(item => item.style.display = 'none');
    });

    // Show items based on user role
    if (role === 'member' || role === 'leader' || role === 'admin' || role === 'pastor') {
        memberOnlyItems.forEach(item => item.style.display = 'block');
    }
    if (role === 'leader' || role === 'admin' || role === 'pastor') {
        leaderOnlyItems.forEach(item => item.style.display = 'block');
    }
    if (role === 'admin' || role === 'pastor') {
        adminOnlyItems.forEach(item => item.style.display = 'block');
    }
    if (role === 'pastor') {
        pastorOnlyItems.forEach(item => item.style.display = 'block');
    }

    // Update auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.parentElement.style.display = 'none';
    if (logoutBtn) {
        logoutBtn.parentElement.style.display = 'block';
        logoutBtn.textContent = `Logout (${currentUser.name || currentUser.email})`;
    }
}

/**
 * Show a floating notification
 * @param {string} message The message to display
 * @param {string} type The type of notification (e.g., 'success', 'error', 'info')
 */
export function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'notification';

    const colors = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
    };

    const color = colors[type] || colors.info;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        background-color: ${color.bg};
        border: 1px solid ${color.border};
        color: ${color.text};
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);

    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

/**
 * Validate mock user
 */
function isValidMockUser(user) {
    return user && user.email && user.role && user.name &&
           ['member', 'leader', 'admin', 'pastor'].includes(user.role);
}

// Keep your original global exports for backward compatibility
window.authControl = {
    getCurrentUser: () => currentUser,
    isUserAuthenticated: () => isAuthenticated,
    getUserRole: () => userRole,
    handleLogout: logoutUser,
    showNotification,
    isDevelopment
};

window.handleLogout = logoutUser;

if (isDevelopment()) {
    window.authControl.authenticateWithMockAccount = authenticateWithMockAccount;
    window.authControl.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
    console.log('Development mode - Mock accounts available');
    console.log('Available mock accounts:', Object.keys(MOCK_ACCOUNTS));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for mock authentication in development mode
    if (isDevelopment()) {
        const mockAuth = localStorage.getItem('mockAuth');
        if (mockAuth) {
            try {
                const user = JSON.parse(mockAuth);
                if (isValidMockUser(user)) {
                    isAuthenticated = true;
                    userRole = user.role;
                    currentUser = user;
                    updateUIForRole(user.role);
                    console.log('Mock user restored:', user.name);
                }
            } catch (e) {
                console.error('Error parsing mock auth data:', e);
                localStorage.removeItem('mockAuth');
            }
        }
    }
});

console.log('Auth control initialized in', isDevelopment() ? 'development' : 'production', 'mode');
