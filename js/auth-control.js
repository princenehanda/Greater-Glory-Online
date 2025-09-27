// auth-control.js
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

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
        } else {
            isAuthenticated = false;
            userRole = null;
            currentUser = null;
        }
        if (callback) {
            callback(user);
        }
    });
}

/**
 * Show a floating notification
 * @param {string} message The message to display
 * @param {string} type The type of notification (e.g., 'success', 'error', 'info')
 */
export function showNotification(message, type = 'info') {
    // ... [Your original showNotification function code here] ...
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

console.log('Production...');
