//public/script.js

// Global Variables
const API_URL = window.location.origin + '/api';
let token = localStorage.getItem('token');

// Function to apply home.css dynamically
function applyHomeCSS() {
    document.getElementById("cssLink").setAttribute("href", "home.css");
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("app-container").style.display = "flex";
}

// Function to remove home.css
function removeHomeCSS() {
    document.getElementById("cssLink").setAttribute("href", "style.css");
}

// Notification Functions
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // Remove any existing classes
    notification.classList.remove('success', 'error', 'info');
    
    // Add the appropriate class
    notification.classList.add(type);
    
    // Set the message
    notificationMessage.textContent = message;
    
    // Show the notification
    notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Form Switch Functions
function switchForm() {
    document.querySelector('.form-container').classList.toggle('active');
    document.querySelector('.form-container').classList.remove('forgot');
}

function showForgotPasswordForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.classList.remove('active');
    formContainer.classList.add('forgot');
}

function showLoginForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.classList.remove('active');
    formContainer.classList.remove('forgot');
}

//calling the Function to handle login
document.addEventListener("DOMContentLoaded", async function () {
    // Setup login button handler
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", handleLogin);
    }
    
    // Add Enter key functionality for login
    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");
    if (loginUsername && loginPassword) {
        loginUsername.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                loginPassword.focus();
            }
        });
        
        loginPassword.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                handleLogin();
            }
        });
    }
    
    // Add Enter key functionality for signup
    const signupUsername = document.getElementById("signup-username");
    const signupEmail = document.getElementById("signup-email");
    const signupPassword = document.getElementById("signup-password");
    
    if (signupUsername && signupEmail && signupPassword) {
        signupUsername.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                signupEmail.focus();
            }
        });
        
        signupEmail.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                signupPassword.focus();
            }
        });
        
        signupPassword.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                handleRegister(event);
            }
        });
    }

    // Add Enter key functionality for forgot password
    const forgotEmail = document.getElementById("forgot-email");
    if (forgotEmail) {
        forgotEmail.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                handlePasswordReset(event);
            }
        });
    }
    
    // Add click handlers for navigation that only update the main content area
    setupNavigationHandlers();
    
    // Check if user is already logged in
    if (token) {
        applyHomeCSS();
        setTimeout(() => {
            showHomeFeed();
            fetchPosts();
        }, 500);
    }
});

function setupNavigationHandlers() {
    // Get all navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    // Add click event to each navigation item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

function showResources() {
    // Hide home content
    const mainContent = document.getElementById("main-content");
    const resourcesSection = document.getElementById("resources-section");
    
    // Show only resources section in main content area
    if (mainContent && resourcesSection) {
        // Hide all direct children of main-content except resources-section
        Array.from(mainContent.children).forEach(child => {
            if (child !== resourcesSection) {
                child.style.display = 'none';
            }
        });
        
        // Show resources section
        resourcesSection.style.display = "block";
    }
}

// Auth Functions
async function handleLogin() {
    const identifier = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!identifier || !password) {
        showNotification('Please enter both username/email and password', 'error');
        return;
    }
    
    try {
        // Determine if the input is an email or username
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const payload = isEmail 
            ? { email: identifier, password } 
            : { username: identifier, password };
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.token) {
            token = data.token;
            localStorage.setItem('token', token);
            
            // Add null checks before accessing elements
            const authContainer = document.getElementById('auth-container');
            const appContainer = document.getElementById('app-container');
            
            if (authContainer) authContainer.style.display = 'none';
            if (appContainer) appContainer.style.display = 'flex'; // Changed to flex
            
            // Hide notification close button (the "x" at the top left)
            const notificationClose = document.querySelector('.notification-close');
            if (notificationClose) notificationClose.style.display = 'none';
            
            applyHomeCSS(); // Apply home.css
            showHomeFeed(); // Show the home feed after login
            await fetchPosts();
        } else {
            showNotification(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Error logging in. Please try again.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault(); // Always prevent default form submission
    
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Clear previous error messages
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    
    let valid = true;
    
    // Validate username (non-empty)
    if (!username) {
        document.getElementById('username-error').textContent = 'Username is required.';
        valid = false;
    }
    
    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address.';
        valid = false;
    }
    
    // Validate password
    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required.';
        valid = false;
    } else if (password.length < 8) {
        document.getElementById('password-error').textContent = 'Password must be at least 8 characters long.';
        valid = false;
    }
    
    if (!valid) {
        return; // Stop here if validation fails
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('Registration successful! Please login.', 'success');
            switchForm(); // Switch to login form
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showNotification('Error registering. Please try again.', 'error');
    }
}

async function handlePasswordReset(event) {
    event.preventDefault(); // Prevent default form submission
    
    const email = document.getElementById('forgot-email').value;
    
    // Clear previous error messages
    document.getElementById('forgot-email-error').textContent = '';
    
    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
        document.getElementById('forgot-email-error').textContent = 'Please enter a valid email address.';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showNotification('Password reset link sent to your email.', 'success');
            showLoginForm(); // Return to login form
        } else {
            const data = await response.json();
            showNotification(data.message || 'Password reset failed', 'error');
        }
    } catch (error) {
        showNotification('Error processing password reset. Please try again.', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    location.reload();
}

// App Functions
async function showHomeFeed() {
    // Get main content area
    const mainContent = document.getElementById('main-content');
    
    // Reset main content to show home feed
    if (mainContent) {
        // First hide all sections
        const sections = mainContent.querySelectorAll('div[id$="-section"]');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the home feed components
        const postsContainer = document.getElementById('posts-container');
        const createPost = document.querySelector('.create-post');
        const searchContainer = document.querySelector('.search-container');
        
        if (postsContainer) postsContainer.style.display = 'flex';
        if (createPost) createPost.style.display = 'flex';
        if (searchContainer) searchContainer.style.display = 'block';
    }
    
    await fetchPosts();
}

// Rest of show functions remain the same
async function showChatRooms() {
    // Instead of redirecting, load chat room content into the main content area
    const mainContentArea = document.getElementById('main-content');
    
    if (mainContentArea) {
        // First hide all content
        Array.from(mainContentArea.children).forEach(child => {
            child.style.display = 'none';
        });
        
        // Check if chat room content exists, if not create it
        let chatRoomContent = document.getElementById('chat-rooms-section');
        if (!chatRoomContent) {
            chatRoomContent = document.createElement('div');
            chatRoomContent.id = 'chat-rooms-section';
            chatRoomContent.innerHTML = `
                <h2>Chat Rooms</h2>
                <div id="chat-room-list" class="chat-room-list"></div>
                <div id="chat-room-container" class="chat-room-container" style="display: none;">
                    <div id="chat-messages" class="chat-messages"></div>
                    <div class="chat-input">
                        <input type="text" id="chat-input-text" placeholder="Type your message...">
                        <button onclick="sendChatMessage()">Send</button>
                    </div>
                </div>
            `;
            mainContentArea.appendChild(chatRoomContent);
        }
        
        // Show chat room content
        chatRoomContent.style.display = 'block';
        
        // Fetch and display chat rooms
        await fetchChatRooms();
    } else {
        // Fallback - redirect if necessary
        window.location.href = "chatroom.html";
    }
}

// Import peer support functions
// import { showPeerSupport, connectWithPeer, joinGroup, showBecomePeerForm, hideBecomePeerForm } from './peer-support.js';

// Add event listeners for peer support
const peerSupportBtn = document.getElementById('peer-support-btn');
if (peerSupportBtn) {
    peerSupportBtn.addEventListener('click', showPeerSupport);
}

//Imported professional functions
// import { showProfessionals, hideAppointmentModal } from './professionals.js';

// Add event listeners for professionals
const professionalsBtn = document.getElementById('professionals-btn');
if (professionalsBtn) {
    professionalsBtn.addEventListener('click', showProfessionals);
}

// Add event listeners for resources
const resourcesBtn = document.getElementById('resources-btn');
if (resourcesBtn) {
    resourcesBtn.addEventListener('click', showResources);
}

// Add event listeners for chat system
const chatBtn = document.getElementById('chat-btn');
if (chatBtn) {
    chatBtn.addEventListener('click', showChatSystem);
}

// Post and content functions with notification support
async function createPost() {
    const postText = document.getElementById('post-text').value.trim();
    const postAnonymous = document.getElementById('post-anonymous').checked;

    if (!postText) {
        showNotification('Please enter some text for your post.', 'error');
        return;
    }

    try {
        await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: postText, anonymous: postAnonymous })
        });
        document.getElementById('post-text').value = '';
        showNotification('Post created successfully!', 'success');
        await fetchPosts();
    } catch (error) {
        showNotification('Error creating post. Please try again.', 'error');
    }
}

async function fetchPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        showNotification('Error fetching posts. Please try again.', 'error');
    }
}

// Rest of the functions remain similar but with notification support instead of alerts

function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">No posts yet. Be the first to share!</div>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-author">
                ${post.anonymous ? 'Anonymous' : 'Posted by'} ${post.anonymous ? '' : 'User'}
            </div>
            <div class="post-content">${post.text}</div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function searchPosts() {
    let query = document.getElementById("search-input").value.toLowerCase();
    let posts = document.querySelectorAll(".post");
    let found = false;

    posts.forEach(post => {
        let postText = post.textContent.toLowerCase();
        let author = post.querySelector(".post-author")?.textContent.toLowerCase() || "";
        
        if (postText.includes(query) || author.includes(query)) {
            post.style.display = "block";
            found = true;
        } else {
            post.style.display = "none";
        }
    });

    let noResultsMessage = document.getElementById("no-results");
    if (!found) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement("div");
            noResultsMessage.id = "no-results";
            noResultsMessage.textContent = "No posts found.";
            noResultsMessage.style.textAlign = "center";
            document.getElementById("posts-container").appendChild(noResultsMessage);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

// Continue with other functions in the same way, replacing alerts with the notification system

async function fetchChatRooms() {
    try {
        const response = await fetch(`${API_URL}/chatrooms`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const chatRooms = await response.json();
        renderChatRooms(chatRooms);
    } catch (error) {
        showNotification('Error fetching chat rooms. Please try again.', 'error');
    }
}

// Continue with the remaining original functions but replace alerts with notifications
function renderChatRooms(chatRooms) {
    const chatRoomList = document.getElementById('chat-room-list');
    chatRoomList.innerHTML = '';

    chatRooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'chat-room';
        roomElement.innerHTML = `
            <h3>${room.name}</h3>
            <p>${room.description}</p>
            <button onclick="joinChatRoom('${room._id}')">Join</button>
        `;
        chatRoomList.appendChild(roomElement);
    });
}

async function joinChatRoom(roomId) {
    try {
        await fetch(`${API_URL}/chatrooms/${roomId}/join`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        document.getElementById('chat-room-list').style.display = 'none';
        document.getElementById('chat-room-container').style.display = 'block';
        await fetchChatMessages(roomId);
    } catch (error) {
        showNotification('Error joining chat room. Please try again.', 'error');
    }
}

async function fetchChatMessages(roomId) {
    try {
        const response = await fetch(`${API_URL}/chatrooms/${roomId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const messages = await response.json();
        renderChatMessages(messages);
    } catch (error) {
        showNotification('Error fetching chat messages. Please try again.', 'error');
    }
}

function renderChatMessages(messages) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <div class="message-header">
                ${message.userId.username}
            </div>
            <div class="message-content">${message.text}</div>
        `;
        chatMessages.appendChild(messageElement);
    });
}

async function sendChatMessage() {
    const chatInputText = document.getElementById('chat-input-text').value.trim();

    if (!chatInputText) return;

    try {
        const response = await fetch(`${API_URL}/chatrooms/${currentChatRoomId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: chatInputText })
        });
        const newMessage = await response.json();
        renderChatMessages([newMessage]);
        document.getElementById('chat-input-text').value = '';
    } catch (error) {
        showNotification('Error sending chat message. Please try again.', 'error');
    }
}

async function fetchProfessionals() {
    try {
        const response = await fetch(`${API_URL}/professionals`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const professionals = await response.json();
        renderProfessionals(professionals);
    } catch (error) {
        showNotification('Error fetching professionals. Please try again.', 'error');
    }
}

function renderProfessionals(professionals) {
    const professionalList = document.getElementById('professional-list');
    professionalList.innerHTML = '';

    professionals.forEach(professional => {
        const professionalElement = document.createElement('div');
        professionalElement.className = 'professional';
        professionalElement.innerHTML = `
            <h3>${professional.name}</h3>
            <p>Specialty: ${professional.specialty}</p>
            <p>${professional.description}</p>
            <p>Rating: ${professional.rating}</p>
            <button onclick="showAppointmentForm('${professional._id}')">Book Appointment</button>
        `;
        professionalList.appendChild(professionalElement);
    });
}

async function showAppointmentForm(professionalId) {
    document.getElementById('professionals').style.display = 'none';
    document.getElementById('appointment-form').style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/professionals/${professionalId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const professional = await response.json();
        renderAppointmentForm(professional);
    } catch (error) {
        showNotification('Error fetching professional information. Please try again.', 'error');
    }
}

function renderAppointmentForm(professional) {
    const appointmentForm = document.getElementById('appointment-form');
    appointmentForm.innerHTML = `
        <h3>Book Appointment with ${professional.name}</h3>
        <form onsubmit="bookAppointment('${professional._id}'); return false;">
            <label for="appointment-datetime">Select a date and time:</label>
            <input type="datetime-local" id="appointment-datetime" required>
            <button type="submit">Book Appointment</button>
        </form>
    `;
}

async function bookAppointment(professionalId) {
    const appointmentDatetime = document.getElementById('appointment-datetime').value;

    try {
        await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ professionalId, datetime: appointmentDatetime })
        });
        showNotification('Appointment booked successfully!', 'success');
        document.getElementById('appointment-form').style.display = 'none';
        document.getElementById('professionals').style.display = 'block';
    } catch (error) {
        showNotification('Error booking appointment. Please try again.', 'error');
    }
}

// Check if user is already logged in
if (token) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex'; // Changed to flex
    applyHomeCSS();
    showHomeFeed();
}