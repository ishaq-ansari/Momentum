//public/script.js

// Global Variables
const API_URL = window.location.origin + '/api';
let token = localStorage.getItem('token');


// Function to apply home.css dynamically
function applyHomeCSS() {
    document.getElementById("cssLink").setAttribute("href", "home.css"); // Switch to home style
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    }

// Function to remove home.css
function removeHomeCSS() {
    document.getElementById("cssLink").setAttribute("href", "style.css"); // Switch back to login style
}

//calling the Function to handle login
document.addEventListener("DOMContentLoaded", async function () {
    // Setup login button handler
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", handleLogin);
    }
});


function showResources() {
    // Hide home section
    document.getElementById("main-content").style.display = "none";
    
    // Show resources section
    document.getElementById("resources-section").style.display = "block";
}

// Auth Functions
async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log('Login Response:', response.status, data); // Add this line for debugging

        if (data.token) {
            token = data.token;
            localStorage.setItem('token', token);
            // Add null checks before accessing elements
            const authContainer = document.getElementById('auth-container');
            const appContainer = document.getElementById('app-container');
            
            if (authContainer) authContainer.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block';
            
            applyHomeCSS(); // Apply home.css
            showHomeFeed(); // Show the home feed after login

            await fetchPosts();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error logging in');
    }
}

async function handleRegister(event) {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Clear previous error messages
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    let valid = true;
    
    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email address.';
        valid = false;
    }
    
    // Validate password
    if (password.length < 8 && password.length > 0) {
        document.getElementById('password-error').textContent = 'At least 8 characters long.';
        valid = false;
    }
    
    if (!valid) {
        event.preventDefault(); // Prevent form submission if validation fails
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            switchForm();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Error registering');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    location.reload();
}

// App Functions
async function showHomeFeed() {
    document.getElementById('home-feed').style.display = 'block';
    document.getElementById('chat-rooms').style.display = 'none';
    document.getElementById('peer-support').style.display = 'none';
    document.getElementById('professionals').style.display = 'none';
    await fetchPosts();
}

async function showChatRooms() {
    document.getElementById('home-feed').style.display = 'none';
    document.getElementById('chat-rooms').style.display = 'block';
    document.getElementById('peer-support').style.display = 'none';
    document.getElementById('professionals').style.display = 'none';
    await fetchChatRooms();
}

async function showPeerSupport() {
    
    window.location.href = "peer.html"; // Redirect to peer-support.html
    // Implement peer support functionality
}

async function showProfessionals() {
    document.getElementById('home-feed').style.display = 'none';
    document.getElementById('chat-rooms').style.display = 'none';
    document.getElementById('peer-support').style.display = 'none';
    document.getElementById('professionals').style.display = 'block';
    await fetchProfessionals();
}

async function createPost() {
    const postText = document.getElementById('post-text').value.trim();
    const postAnonymous = document.getElementById('post-anonymous').checked;

    if (!postText) return;

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
        await fetchPosts();
    } catch (error) {
        alert('Error creating post');
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
        alert('Error fetching posts');
    }
}

function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

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
        let author = post.querySelector(".post-author")?.textContent.toLowerCase() || ""; // Get author name

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


async function fetchChatRooms() {
    try {
        const response = await fetch(`${API_URL}/chatrooms`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const chatRooms = await response.json();
        renderChatRooms(chatRooms);
    } catch (error) {
        alert('Error fetching chat rooms');
    }
}

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
        alert('Error joining chat room');
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
        alert('Error fetching chat messages');
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
        alert('Error sending chat message');
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
        alert('Error fetching professionals');
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

    // Fetch available appointment slots for the selected professional
    try {
        const response = await fetch(`${API_URL}/professionals/${professionalId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const professional = await response.json();
        renderAppointmentForm(professional);
    } catch (error) {
        alert('Error fetching professional information');
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
        alert('Appointment booked successfully!');
        document.getElementById('appointment-form').style.display = 'none';
        document.getElementById('professionals').style.display = 'block';
    } catch (error) {
        alert('Error booking appointment');
    }
}

// UI Functions
function switchForm() {
    document.querySelector('.form-container').classList.toggle('active');
}

// Check if user is already logged in
if (token) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    showHomeFeed();
}