// Enhanced auth-control.js - Complete authentication and access control system
// Handles mock authentication, role-based access, and navigation control

// Mock accounts for offline testing and development
const MOCK_ACCOUNTS = {
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
        attendance: {
            cell: 90,
            sunday: 85
        }
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
        address: '456 Leadership Ave, Highlands, Harare',
        joinDate: '2023-03-10',
        leaderSince: '2023-08-01',
        baptized: true,
        ministries: ['Ushering', 'Leadership'],
        cellMembers: 15,
        performance: 4.8
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
        address: '789 Admin Plaza, Avondale, Harare',
        joinDate: '2022-06-20',
        adminSince: '2023-01-15',
        baptized: true,
        ministries: ['Media & Technology', 'Administration'],
        areas: ['Highlands Area', 'Avondale Area'],
        systemAccess: ['user_management', 'content_management', 'financial_overview']
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
        address: '321 Pastoral Drive, Borrowdale, Harare',
        joinDate: '2020-01-01',
        ordainedDate: '2020-02-15',
        baptized: true,
        ministries: ['Pastoral Ministry', 'Leadership', 'Teaching'],
        qualification: 'Master of Divinity',
        experience: '15 years',
        fullAccess: true
    }
};

// Global authentication state
let currentUser = null;
let isAuthenticated = false;
let userRole = null;

// Initialize authentication system on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeAuthSystem();
});

/**
 * Initialize the authentication system
 */
function initializeAuthSystem() {
    console.log('Initializing authentication system...');
    
    // Check for existing authentication
    checkExistingAuth();
    
    // Setup navigation visibility
    updateNavigationVisibility();
    
    // Setup authentication controls
    setupAuthControls();
    
    // Setup role-based access controls
    setupAccessControls();
    
    console.log('Authentication system initialized');
}

/**
 * Check for existing authentication (mock or Firebase)
 */
function checkExistingAuth() {
    // Check mock authentication first
    const mockAuth = localStorage.getItem('mockAuth');
    if (mockAuth) {
        try {
                setCurrentUser(user);
                console.log('Mock authentication found:', user.name, '-', user.role);
                return;
            }
        } catch (error) {
            console.error('Invalid mock auth data:', error);
            localStorage.removeItem('mockAuth');
        }
    }
    
    // Check Firebase authentication if available
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                try {
                    // Get user data from Firestore
                    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                    const userData = userDoc.exists ? userDoc.data() : { role: 'member' };
                    
                    const firebaseUser = {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || userData.name || user.email.split('@')[0],
                        role: userData.role || 'member',
                        ...userData
                    };
                    
                    setCurrentUser(firebaseUser);
                    console.log('Firebase authentication found:', firebaseUser.name, '-', firebaseUser.role);
                } catch (error) {
                    console.error('Error loading Firebase user data:', error);
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0],
                        role: 'member'
                    });
                }
            } else {
                clearCurrentUser();
            }
        });
    }
}

/**
 * Validate mock user data
 */
function isValidMockUser(user) {
    return user && 
           user.email && 
           user.role && 
           user.name &&
           ['member', 'leader', 'admin', 'pastor'].includes(user.role);
}

/**
 * Set current user and update UI
 */
function setCurrentUser(user) {
    currentUser = user;
    isAuthenticated = true;
    userRole = user.role;
    
    // Update navigation visibility
    updateNavigationVisibility();
    
    // Update user-specific elements
    updateUserElements();
    
    // Check if user should be redirected from auth page
    checkAuthPageRedirect();
}

/**
 * Clear current user and update UI
 */
function clearCurrentUser() {
    currentUser = null;
    isAuthenticated = false;
    userRole = null;
    
    // Update navigation visibility
    updateNavigationVisibility();
    
    // Clear user-specific elements
    clearUserElements();
}

/**
 * Update navigation visibility based on user role
 */
function updateNavigationVisibility() {
    // Hide all role-specific items initially
    const memberOnlyItems = document.querySelectorAll('.member-only');
    const leaderOnlyItems = document.querySelectorAll('.leader-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    const pastorOnlyItems = document.querySelectorAll('.pastor-only');
    const authActionItems = document.querySelectorAll('.auth-action');
    
    // Hide all items initially
    [...memberOnlyItems, ...leaderOnlyItems, ...adminOnlyItems, ...pastorOnlyItems].forEach(item => {
        item.style.display = 'none';
    });
    
    if (!isAuthenticated) {
        // Show login button, hide logout
        authActionItems.forEach(item => {
            if (item.id === 'loginBtn' || item.querySelector('#loginBtn')) {
                item.style.display = 'block';
            } else if (item.id === 'logoutBtn' || item.querySelector('#logoutBtn')) {
                item.style.display = 'none';
            }
        });
        return;
    }
    
    // Show logout button, hide login
    authActionItems.forEach(item => {
        if (item.id === 'loginBtn' || item.querySelector('#loginBtn')) {
            item.style.display = 'none';
        } else if (item.id === 'logoutBtn' || item.querySelector('#logoutBtn')) {
            item.style.display = 'block';
        }
    });
    
    // Show items based on user role (hierarchical access)
    switch (userRole) {
        case 'pastor':
            // Pastor has access to everything
            pastorOnlyItems.forEach(item => item.style.display = 'block');
            // Fall through to admin
        case 'admin':
            // Admin has access to admin, leader, and member features
            adminOnlyItems.forEach(item => item.style.display = 'block');
            // Fall through to leader
        case 'leader':
            // Leader has access to leader and member features
            leaderOnlyItems.forEach(item => item.style.display = 'block');
            // Fall through to member
        case 'member':
            // Member has access to basic member features
            memberOnlyItems.forEach(item => item.style.display = 'block');
            break;
        default:
            console.warn('Unknown user role:', userRole);
    }
}

/**
 * Update user-specific elements in the UI
 */
function updateUserElements() {
    if (!currentUser) return;
    
    // Update user name displays
    const userNameElements = document.querySelectorAll('#userName, #leaderName, #adminName, #pastorName, #memberName');
    userNameElements.forEach(element => {
        element.textContent = currentUser.name || currentUser.email?.split('@')[0] || 'User';
    });
    
    // Update role-specific elements
    const cellNameElements = document.querySelectorAll('#cellName');
    cellNameElements.forEach(element => {
        if (currentUser.cell) {
            element.textContent = currentUser.cell;
        }
    });
    
    const primaryMinistryElements = document.querySelectorAll('#primaryMinistry');
    primaryMinistryElements.forEach(element => {
        if (currentUser.department) {
            element.textContent = currentUser.department;
        }
    });
}

/**
 * Clear user-specific elements in the UI
 */
function clearUserElements() {
    const userNameElements = document.querySelectorAll('#userName, #leaderName, #adminName, #pastorName, #memberName');
    userNameElements.forEach(element => {
        element.textContent = 'User';
    });
}

/**
 * Check if user should be redirected from auth page
 */
function checkAuthPageRedirect() {
    if (isAuthenticated && window.location.pathname.includes('auth.html')) {
        // Redirect authenticated users away from auth page
        redirectToDashboard();
    }
}

/**
 * Redirect user to appropriate dashboard based on role
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
 * Setup authentication controls (login/logout buttons)
 */
function setupAuthControls() {
    // Setup logout functionality
    const logoutButtons = document.querySelectorAll('#logoutBtn, .logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
    
    // Setup login redirection
    const loginButtons = document.querySelectorAll('#loginBtn, .login-btn');
    loginButtons.forEach(button => {
        if (!button.href && !button.onclick) {
            button.addEventListener('click', () => {
                window.location.href = 'signin/auth.html';
            });
        }
    });
}

/**
 * Setup role-based access controls
 */
function setupAccessControls() {
    // Setup protected content access
    setupProtectedContentAccess();
    
    // Setup dashboard access protection
    setupDashboardProtection();
}

/**
 * Setup protected content access (for cell groups, ministries, etc.)
 */
function setupProtectedContentAccess() {
    // Setup cell group card protection
    setupCellGroupProtection();
    
    // Setup ministry card protection
    setupMinistryProtection();
    
    // Setup partnership page protection
    setupPartnershipProtection();
}

/**
 * Setup cell group card protection
 */
function setupCellGroupProtection() {
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
}

/**
 * Setup ministry card protection
 */
function setupMinistryProtection() {
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
}

/**
 * Setup partnership page protection
 */
function setupPartnershipProtection() {
    // Check if we're on the partner page
    if (window.location.pathname.includes('partner.html')) {
        if (!isAuthenticated) {
            showMemberOnlyPage();
        }
    }
}

/**
 * Setup dashboard access protection
 */
function setupDashboardProtection() {
    const currentPath = window.location.pathname;
    
    // Define required roles for each dashboard
    const dashboardRoles = {
        'member-dashboard.html': ['member', 'leader', 'admin', 'pastor'],
        'leader-dashboard.html': ['leader', 'admin', 'pastor'],
        'admin-dashboard.html': ['admin', 'pastor'],
        'Pastor-dashboard.html': ['pastor']
    };
    
    // Check if current page requires authentication
    for (const [dashboard, allowedRoles] of Object.entries(dashboardRoles)) {
        if (currentPath.includes(dashboard)) {
            if (!isAuthenticated) {
                // Redirect to auth page
                window.location.href = 'auth.html';
                return;
            }
            
            if (!allowedRoles.includes(userRole)) {
                // Redirect to appropriate dashboard
                redirectToDashboard();
                return;
            }
        }
    }
}

/**
 * Show authentication required modal
 */
function showAuthRequiredModal(contentType) {
    const modal = createAuthModal(contentType);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Auto-remove modal after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 10000);
}

/**
 * Create authentication modal
 */
function createAuthModal(contentType) {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="color: #667eea; font-size: 3rem; margin-bottom: 20px;">
            <i class="fas fa-lock"></i>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 15px;">Sign In Required</h3>
        <p style="color: #7f8c8d; margin-bottom: 30px; line-height: 1.5;">
            Please sign in to view ${contentType} and access member-exclusive content.
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button onclick="window.location.href='signin/auth.html'" style="
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </button>
            <button onclick="this.closest('.auth-modal').remove()" style="
                background: transparent;
                color: #667eea;
                border: 2px solid #667eea;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            ">
                Close
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

/**
 * Show member-only page overlay
 */
function showMemberOnlyPage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        text-align: center;
    `;
    
    overlay.innerHTML = `
        <div style="max-width: 500px; padding: 40px;">
            <div style="font-size: 5rem; margin-bottom: 30px; opacity: 0.9;">
                <i class="fas fa-user-shield"></i>
            </div>
            <h1 style="margin-bottom: 20px; font-size: 2.5rem; font-weight: 700;">
                Members Only Area
            </h1>
            <p style="margin-bottom: 40px; font-size: 1.2rem; opacity: 0.9; line-height: 1.6;">
                This section is exclusively for registered members of Greater Glory Ministries. 
                Please sign in to access our partnership opportunities and member-exclusive content.
            </p>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <button onclick="window.location.href='signin/auth.html'" style="
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 2px solid white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1.1rem;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-sign-in-alt"></i> Sign In
                </button>
                <button onclick="window.location.href='../index.html'" style="
                    background: transparent;
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    padding: 15px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-home"></i> Go Back
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

/**
 * Handle user logout
 */
function handleLogout() {
    // Clear mock authentication
    localStorage.removeItem('mockAuth');
    
    // Clear Firebase authentication if available
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().catch(error => {
            console.error('Firebase logout error:', error);
        });
    }
    
    // Clear current user
    clearCurrentUser();
    
    // Show logout success message
    showNotification('You have been successfully logged out. Thank you for visiting!', 'info');
    
    // Redirect to homepage after a short delay
    setTimeout(() => {
        // Determine redirect URL based on current location
        let redirectUrl = '../index.html';
        if (window.location.pathname.includes('signin/')) {
            redirectUrl = '../index.html';
        } else if (window.location.pathname.includes('/pages/')) {
            redirectUrl = '../index.html';
        } else {
            redirectUrl = 'index.html';
        }
        
        window.location.href = redirectUrl;
    }, 1500);
}

/**
 * Mock authentication function for testing
 */
function authenticateWithMockAccount(email, password) {
    const account = MOCK_ACCOUNTS[email];
    
    if (!account || account.password !== password) {
        throw new Error('Invalid email or password');
    }
    
    const mockUser = {
        uid: 'mock-' + account.role + '-' + Date.now(),
        email: email,
        role: account.role,
        name: account.name,
        firstName: account.firstName,
        lastName: account.lastName,
        cell: account.cell,
        department: account.department,
        phone: account.phone,
        address: account.address,
        joinDate: account.joinDate,
        baptized: account.baptized,
        ministries: account.ministries,
        timestamp: new Date().getTime(),
        ...account
    };
    
    // Store in localStorage
    localStorage.setItem('mockAuth', JSON.stringify(mockUser));
    
    // Set as current user
    setCurrentUser(mockUser);
    
    return mockUser;
}

/**
 * Register new mock account
 */
function registerMockAccount(email, password, firstName, lastName, cell, department) {
    // Check if account already exists
    if (MOCK_ACCOUNTS[email]) {
        throw new Error('An account with this email already exists');
    }
    
    const mockUser = {
        uid: 'mock-member-' + Date.now(),
        email: email,
        role: 'member',
        name: `${firstName} ${lastName}`,
        firstName: firstName,
        lastName: lastName,
        cell: cell,
        department: department,
        joinDate: new Date().toISOString().split('T')[0],
        baptized: false,
        ministries: [department],
        timestamp: new Date().getTime()
    };
    
    // Store in localStorage
    localStorage.setItem('mockAuth', JSON.stringify(mockUser));
    
    // Set as current user
    setCurrentUser(mockUser);
    
    return mockUser;
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.auth-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #2c3e50;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 15px 20px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        border-left: 4px solid #667eea;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    const iconColor = type === 'success' ? '#28a745' : 
                     type === 'error' ? '#dc3545' : 
                     '#17a2b8';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${icon}" style="color: ${iconColor}; font-size: 1.2rem;"></i>
            <span style="flex: 1; line-height: 1.4;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 0;
                margin-left: 10px;
            ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Get current user information
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Check if user is authenticated
 */
function isUserAuthenticated() {
    return isAuthenticated;
}

/**
 * Get current user role
 */
function getUserRole() {
    return userRole;
}

/**
 * Check if user has specific role or higher
 */
function hasRole(requiredRole) {
    if (!isAuthenticated) return false;
    
    const roleHierarchy = {
        'member': 1,
        'leader': 2,
        'admin': 3,
        'pastor': 4
    };
    
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
}

/**
 * Require authentication for specific actions
 */
function requireAuth(action, requiredRole = 'member') {
    if (!isAuthenticated) {
        showAuthRequiredModal(action);
        return false;
    }
    
    if (!hasRole(requiredRole)) {
        showNotification(`You need ${requiredRole} access or higher to perform this action.`, 'error');
        return false;
    }
    
    return true;
}

// Export functions for global access
window.authControl = {
    getCurrentUser,
    isUserAuthenticated,
    getUserRole,
    hasRole,
    requireAuth,
    authenticateWithMockAccount,
    registerMockAccount,
    handleLogout,
    showNotification,
    MOCK_ACCOUNTS
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { 
            opacity: 0; 
            transform: translateY(-30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    .auth-modal button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
    }
    
    .auth-notification.success {
        border-left-color: #28a745 !important;
    }
    
    .auth-notification.error {
        border-left-color: #dc3545 !important;
    }
    
    .auth-notification.info {
        border-left-color: #17a2b8 !important;
    }
`;
document.head.appendChild(style);

console.log('Enhanced auth-control.js loaded successfully');
