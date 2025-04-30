// Profile management functionality

// Main function to show the profile section
async function showProfile() {
    const mainContentArea = document.getElementById('main-content');
    
    if (mainContentArea) {
        // First hide all content
        Array.from(mainContentArea.children).forEach(child => {
            child.style.display = 'none';
        });
        
        // Check if profile content exists, if not load it from template
        let profileContent = document.getElementById('profile-section');
        if (!profileContent) {
            try {
                // Load the profile template
                const response = await fetch('templates/profile.html');
                const templateHTML = await response.text();
                
                // Create a container and insert the template HTML
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = templateHTML;
                
                // Append the template content to main content area
                while (tempContainer.firstChild) {
                    mainContentArea.appendChild(tempContainer.firstChild);
                }
                
                // Ensure the CSS is loaded
                loadProfileCSS();
                
                // Add event listeners for the profile page tabs
                setupProfileTabs();
                
                // Add form submission handlers
                setupFormSubmitHandlers();
                
                // Load the user's profile data
                await loadUserProfile();
                
                profileContent = document.getElementById('profile-section');
            } catch (error) {
                console.error('Error loading profile template:', error);
                showNotification('Failed to load profile content', 'error');
                return;
            }
        } else {
            // If profile section already exists, just refresh the data
            await loadUserProfile();
        }
        
        // Show profile content
        profileContent.style.display = 'block';
    }
}

// Function to load profile CSS if it's not already loaded
function loadProfileCSS() {
    if (!document.querySelector('link[href="css/profile.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/profile.css';
        document.head.appendChild(link);
    }
}

// Function to set up tab switching functionality
function setupProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId + '-tab');
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Function to set up form submission handlers
function setupFormSubmitHandlers() {
    // Personal info form submission
    const personalInfoForm = document.getElementById('personal-info-form');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await updatePersonalInfo();
        });
    }
    
    // Security form submission
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await changePassword();
        });
    }
    
    // Preferences form submission
    const preferencesForm = document.getElementById('preferences-form');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await updatePreferences();
        });
    }
}

// Function to load user profile data
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        const user = data.user;
        
        // Set avatar with user's initials
        const avatarElement = document.getElementById('profile-avatar');
        if (avatarElement) {
            const initials = user.username.charAt(0).toUpperCase();
            avatarElement.textContent = initials;
        }
        
        // Set user profile name
        const profileNameElement = document.getElementById('profile-name');
        if (profileNameElement) {
            profileNameElement.textContent = user.username;
        }
        
        // Set member since date
        const memberSinceElement = document.getElementById('member-since-date');
        if (memberSinceElement) {
            const createdDate = new Date(user.createdAt);
            memberSinceElement.textContent = createdDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }
        
        // Fill in the personal info form
        document.getElementById('profile-username').value = user.username || '';
        document.getElementById('profile-email').value = user.email || '';
        document.getElementById('profile-bio').value = user.bio || '';
        document.getElementById('profile-location').value = user.location || '';
        document.getElementById('profile-occupation').value = user.occupation || '';
        
        // Fill in the preference form
        if (user.preferences) {
            document.getElementById('email-notifications').checked = 
                user.preferences.emailNotifications !== undefined ? user.preferences.emailNotifications : true;
                
            document.getElementById('dark-mode').checked = 
                user.preferences.darkMode !== undefined ? user.preferences.darkMode : false;
                
            const notificationFreq = user.preferences.notificationFrequency || 'immediate';
            document.getElementById('notification-frequency').value = notificationFreq;
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        showNotification('Failed to load profile data.', 'error');
    }
}

// Function to update personal info
async function updatePersonalInfo() {
    try {
        const username = document.getElementById('profile-username').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const bio = document.getElementById('profile-bio').value.trim();
        const location = document.getElementById('profile-location').value.trim();
        const occupation = document.getElementById('profile-occupation').value.trim();
        
        // Simple validation
        if (!username || !email) {
            showNotification('Username and email are required.', 'error');
            return;
        }
        
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username,
                email,
                bio,
                location,
                occupation
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Profile updated successfully!', 'success');
            
            // Update the displayed name in the profile header
            const profileNameElement = document.getElementById('profile-name');
            if (profileNameElement && username) {
                profileNameElement.textContent = username;
            }
            
            // Update avatar initials if username changed
            const avatarElement = document.getElementById('profile-avatar');
            if (avatarElement && username) {
                const initials = username.charAt(0).toUpperCase();
                avatarElement.textContent = initials;
            }
        } else {
            showNotification(data.error || 'Failed to update profile.', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Failed to update profile.', 'error');
    }
}

// Function to change password
async function changePassword() {
    try {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('All password fields are required.', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('New password and confirmation do not match.', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long.', 'error');
            return;
        }
        
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Password changed successfully!', 'success');
            // Clear the form
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            showNotification(data.error || 'Failed to change password.', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Failed to change password.', 'error');
    }
}

// Function to update preferences
async function updatePreferences() {
    try {
        const emailNotifications = document.getElementById('email-notifications').checked;
        const darkMode = document.getElementById('dark-mode').checked;
        const notificationFrequency = document.getElementById('notification-frequency').value;
        
        const response = await fetch(`${API_URL}/auth/preferences`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                preferences: {
                    emailNotifications,
                    darkMode,
                    notificationFrequency
                }
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Preferences updated successfully!', 'success');
            
            // Apply dark mode if toggled
            if (darkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        } else {
            showNotification(data.error || 'Failed to update preferences.', 'error');
        }
    } catch (error) {
        console.error('Error updating preferences:', error);
        showNotification('Failed to update preferences.', 'error');
    }
}

// Export the showProfile function
window.showProfile = showProfile;