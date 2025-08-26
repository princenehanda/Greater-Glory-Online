// Production-ready auth-control.js
// Removes mock accounts and implements proper environment detection

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
        joinDate: '2023-03-10',
        ministries: ['Ushering', 'Leadership']
    },
    'admin@ggm.local': { 
        password: 'admin123', 
        role: 'admin', 
        name: 'Admin Smith',
        firstName: 'Admin',
        lastName: 'Smith', 
        cell: 'Cell Beta', 
        department: 'Media',
        phone: '+263 77 345 6789',
        joinDate: '2022-06-20',
        ministries: ['Media & Technology', 'Administration']
    },
    'pastor@ggm.local': { 
        password: 'pastor123', 
        role: 'pastor', 
        name: 'Pastor Johnson',
        firstName: 'Pastor',
        lastName: 'Johnson', 
        cell: 'Leadership', 
        department: 'Ministry',
        phone: '+263 77 456 7890',
        joinDate: '2020-01-01',
        ministries: ['Pastoral Ministry', 'Leadership']
    }
} : {}; // Empty object in production

// Global authentication state
let currentUser = null;
let isAuthenticated = false;
let userRole = null;
let authStateInitialized = false;

// Initialize authentication system on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeAuthSystem();
});

/**
 * Initialize the authentication system
 */
function initializeAuthSystem() {
    console.log('Initializing authentication system...');
    console.log('Environment:', isDevelopment() ? 'Development' : 'Production');
    
    // Initialize Firebase authentication
    if (typeof firebase !== 'undefined' && firebase.auth) {
        initializeFirebaseAuth();
    } else if (isDevelopment()) {
        // Only check mock auth in development
        console.log('Firebase not available, using mock auth for development');
        checkMockAuth();
        authStateInitialized = true;
        updateNavigationVisibility();
        setupAuthControls();
        setupAccessControls();
    } else {
        // Production without Firebase - show error
        console.error('Firebase authentication not available in production');
        showNotification('Authentication system unavailable. Please contact support.', 'error');
    }
}

/**
 * Initialize Firebase authentication
 */
function initializeFirebaseAuth() {
    firebase.auth().onAuthStateChanged(async (user) => {
        console.log('Firebase auth state changed:', user ? user.email : 'no user');
        
        if (user) {
            try {
                // Get user data from Firestore
                const userDoc = await firebase.firestore()
                    .collection('users')
                    .doc(user.uid)
                    .get();
                
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const firebaseUser = {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || userData.name || user.email.split('@')[0],
                        firstName: userData.firstName || user.displayName?.split(' ')[0] || '',
                        lastName: userData.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
                        role: userData.role || 'member',
                        cell: userData.cell || 'Not Assigned',
                        department: userData.department || 'Not Assigned',
                        phone: userData.phone || '',
                        address: userData.address || '',
                        joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
                        baptized: userData.baptized || false,
                        ministries: userData.ministries || [],
                        ...userData
                    };
                    
                    setCurrentUser(firebaseUser);
                } else {
                    // New user - create default profile
                    const defaultUserData = {
                        role: 'member',
                        cell: 'Not Assigned',
                        department: 'Not Assigned',
                        joinDate: new Date().toISOString().split('T')[0],
                        baptized: false,
                        ministries: [],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    await firebase.firestore()
                        .collection('users')
                        .doc(user.uid)
                        .set(defaultUserData);
                    
                    const newUser = {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0],
                        ...defaultUserData
                    };
                    
                    setCurrentUser(newUser);
                    showNotification('Welcome! Your account has been created with member access.', 'success');
                }
                
            } catch (error) {
                console.error('Error loading user data:', error);
                showNotification('Error loading user profile. Please try again.', 'error');
            }
        } else {
            clearCurrentUser();
        }
        
        authStateInitialized = true;
        updateNavigationVisibility();
        setupAuthControls();
        setupAccessControls();
        handlePageBasedRedirects();
    });
}

/**
 * Check for mock authentication (development only)
 */
function checkMockAuth() {
    if (!isDevelopment()) {
        localStorage.removeItem('mockAuth'); // Clear any mock auth in production
        return;
    }
    
    const mockAuth = localStorage.getItem('mockAuth');
    if (mockAuth) {
        try {
            const user = JSON.parse(mockAuth);
            if (isValidMockUser(user)) {
                setCurrentUser(user);
                console.log('Mock authentication found:', user.name, '-', user.role);
                return;
            }
        } catch (error) {
            console.error('Invalid mock auth data:', error);
            localStorage.removeItem('mockAuth');
        }
    }
}

/**
 * Mock authentication (development only)
 */
function authenticateWithMockAccount(email, password) {
    if (!isDevelopment()) {
        throw new Error('Mock authentication not available in production');
    }
    
    const account = MOCK_ACCOUNTS[email];
    if (!account || account.password !== password) {
        throw new Error('Invalid email or password');
    }
    
    const mockUser = {
        uid: 'mock-' + account.role + '-' + Date.now(),
        email: email,
        ...account,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('mockAuth', JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    return mockUser;
}

/**
 * Set current user and update UI
 */
function setCurrentUser(user) {
    currentUser = user;
    isAuthenticated = true;
    userRole = user.role;
    
    if (authStateInitialized) {
        updateNavigationVisibility();
        updateUserElements();
    }
}

/**
 * Clear current user and update UI
 */
function clearCurrentUser() {
    currentUser = null;
    isAuthenticated = false;
    userRole = null;
    
    if (authStateInitialized) {
        updateNavigationVisibility();
        clearUserElements();
    }
}

/**
 * Enhanced logout function
 */
async function handleLogout() {
    console.log('Handling logout...');
    
    try {
        // Clear mock authentication (development only)
        if (isDevelopment()) {
            localStorage.removeItem('mockAuth');
        }
        
        // Firebase signout
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            await firebase.auth().signOut();
        }
        
        clearCurrentUser();
        showNotification('You have been successfully logged out.', 'success');
        
        setTimeout(() => {
            const redirectUrl = window.location.pathname.includes('/signin/') ? '../index.html' : 'index.html';
            window.location.href = redirectUrl;
        }, 1500);
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout error: ' + error.message, 'error');
    }
}

/**
 * Update navigation visibility
 */
function updateNavigationVisibility() {
    if (!authStateInitialized) return;
    
    const memberOnlyItems = document.querySelectorAll('.member-only');
    const leaderOnlyItems = document.querySelectorAll('.leader-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    const pastorOnlyItems = document.querySelectorAll('.pastor-only');
    
    // Hide all role-specific items initially
    [...memberOnlyItems, ...leaderOnlyItems, ...adminOnlyItems, ...pastorOnlyItems]
        .forEach(item => item.style.display = 'none');
    
    const loginButtons = document.querySelectorAll('#loginBtn, .login-btn');
    const logoutButtons = document.querySelectorAll('#logoutBtn, .logout-btn, #logoutNavItem');
    
    if (!isAuthenticated) {
        loginButtons.forEach(btn => btn && (btn.style.display = 'block'));
        logoutButtons.forEach(btn => btn && (btn.style.display = 'none'));
        return;
    }
    
    loginButtons.forEach(btn => btn && (btn.style.display = 'none'));
    logoutButtons.forEach(btn => btn && (btn.style.display = 'block'));
    
    // Show items based on role hierarchy
    switch (userRole) {
        case 'pastor':
            pastorOnlyItems.forEach(item => item.style.display = 'block');
        case 'admin':
            adminOnlyItems.forEach(item => item.style.display = 'block');
        case 'leader':
            leaderOnlyItems.forEach(item => item.style.display = 'block');
        case 'member':
            memberOnlyItems.forEach(item => item.style.display = 'block');
            break;
    }
}

/**
 * Update user elements
 */
function updateUserElements() {
    if (!currentUser) return;
    
    const userNameElements = document.querySelectorAll('#userName, #memberName, #leaderName, #adminName, #pastorName');
    userNameElements.forEach(element => {
        if (element) {
            element.textContent = currentUser.name || currentUser.email?.split('@')[0] || 'User';
        }
    });
    
    const cellNameElements = document.querySelectorAll('#cellName');
    cellNameElements.forEach(element => {
        if (element && currentUser.cell) {
            element.textContent = currentUser.cell;
        }
    });
}

/**
 * Clear user elements
 */
function clearUserElements() {
    const userNameElements = document.querySelectorAll('#userName, #memberName, #leaderName, #adminName, #pastorName');
    userNameElements.forEach(element => {
        if (element) element.textContent = 'User';
    });
}

/**
 * Setup authentication controls
 */
function setupAuthControls() {
    const logoutButtons = document.querySelectorAll('#logoutBtn, .logout-btn');
    logoutButtons.forEach(button => {
        if (button) {
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
            newButton.removeAttribute('onclick');
        }
    });
}

/**
 * Setup access controls
 */
function setupAccessControls() {
    // Cell group protection
    const cellCards = document.querySelectorAll('.cell-card, .cell-group-card');
    cellCards.forEach(card => {
        const detailButtons = card.querySelectorAll('.view-details, .join-cell, .cell-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!isAuthenticated) {
                    e.preventDefault();
                    showAuthRequiredModal('cell group details');
                }
            });
        });
    });
    
    // Ministry protection
    const ministryCards = document.querySelectorAll('.ministry-card');
    ministryCards.forEach(card => {
        const detailButtons = card.querySelectorAll('.view-details, .join-ministry, .ministry-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!isAuthenticated) {
                    e.preventDefault();
                    showAuthRequiredModal('ministry details');
                }
            });
        });
    });
    
    // Partnership protection
    if (window.location.pathname.includes('partner.html') && !isAuthenticated) {
        showMemberOnlyPage();
    }
}

/**
 * Handle page redirects
 */
function handlePageBasedRedirects() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('auth.html') && isAuthenticated) {
        redirectToDashboard();
        return;
    }
    
    const dashboardPages = ['member-dashboard.html', 'leader-dashboard.html', 'admin-dashboard.html', 'Pastor-dashboard.html'];
    const isOnDashboard = dashboardPages.some(page => currentPath.includes(page));
    
    if (isOnDashboard && !isAuthenticated) {
        window.location.href = 'auth.html';
        return;
    }
}

/**
 * Redirect to appropriate dashboard
 */
function redirectToDashboard() {
    const dashboardUrls = {
        'member': 'member-dashboard.html',
        'leader': 'leader-dashboard.html',
        'admin': 'admin-dashboard.html',
        'pastor': 'Pastor-dashboard.html'
    };
    
    const targetUrl = dashboardUrls[userRole] || 'member-dashboard.html';
    window.location.href = targetUrl;
}

/**
 * Show auth required modal
 */
function showAuthRequiredModal(contentType) {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
        justify-content: center; z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 15px; text-align: center; max-width: 400px; margin: 20px;">
            <div style="color: #667eea; font-size: 3rem; margin-bottom: 20px;">
                <i class="fas fa-lock"></i>
            </div>
            <h3 style="margin-bottom: 15px;">Sign In Required</h3>
            <p style="margin-bottom: 30px;">Please sign in to view ${contentType}.</p>
            <button onclick="window.location.href='signin/auth.html'" style="
                background: #667eea; color: white; border: none; padding: 12px 24px;
                border-radius: 8px; cursor: pointer; margin-right: 10px;">Sign In</button>
            <button onclick="this.closest('.auth-modal').remove()" style="
                background: transparent; color: #667eea; border: 2px solid #667eea;
                padding: 12px 24px; border-radius: 8px; cursor: pointer;">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    setTimeout(() => modal.remove(), 10000);
}

/**
 * Show member-only page
 */
function showMemberOnlyPage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; color: white; text-align: center;
    `;
    
    overlay.innerHTML = `
        <div style="max-width: 500px; padding: 40px;">
            <h1 style="margin-bottom: 20px; font-size: 2.5rem;">Members Only Area</h1>
            <p style="margin-bottom: 40px; font-size: 1.2rem;">
                Please sign in to access this content.
            </p>
            <button onclick="window.location.href='signin/auth.html'" style="
                background: rgba(255,255,255,0.2); color: white; border: 2px solid white;
                padding: 15px 30px; border-radius: 50px; cursor: pointer; margin-right: 15px;">Sign In</button>
            <button onclick="window.location.href='../index.html'" style="
                background: transparent; color: white; border: 2px solid rgba(255,255,255,0.5);
                padding: 15px 30px; border-radius: 50px; cursor: pointer;">Go Back</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: white;
        border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 15px 20px; z-index: 10000; transform: translateX(100%);
        transition: transform 0.3s ease; max-width: 350px;
    `;
    
    const colors = { success: '#28a745', error: '#dc3545', info: '#17a2b8' };
    const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-${icons[type]}" style="color: ${colors[type]};"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; cursor: pointer; margin-left: auto;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Validate mock user
 */
function isValidMockUser(user) {
    return user && user.email && user.role && user.name &&
           ['member', 'leader', 'admin', 'pastor'].includes(user.role);
}

// Global exports
window.authControl = {
    getCurrentUser: () => currentUser,
    isUserAuthenticated: () => isAuthenticated,
    getUserRole: () => userRole,
    handleLogout,
    showNotification,
    isDevelopment
};

window.handleLogout = handleLogout;

// Development utilities (only available in dev mode)
if (isDevelopment()) {
    window.authControl.authenticateWithMockAccount = authenticateWithMockAccount;
    window.authControl.MOCK_ACCOUNTS = MOCK_ACCOUNTS;
    
    console.log('Development mode - Mock accounts available');
    console.log('Available mock accounts:', Object.keys(MOCK_ACCOUNTS));
}

console.log('Production-ready auth-control.js loaded');
