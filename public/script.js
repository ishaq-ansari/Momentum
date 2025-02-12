// public/script.js

// Global Variables
const API_URL = window.location.origin + '/api';
let token = localStorage.getItem('token');

// Redirect to chatroom.html when clicking "Chat Rooms"
function showChatRooms() {
    window.location.href = "chatroom.html";
}

// Redirect to peersupport.html when clicking "Peer Support"
function showPeerSupport() {
    window.location.href = "peersupport.html";
}

// Redirect to professional.html when clicking "Book Professionals"
function showProfessionals() {
    window.location.href = "professional.html";
}

// Handle Login
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
        console.log('Login Response:', response.status, data);

        if (data.token) {
            token = data.token;
            localStorage.setItem('token', token);
            window.location.href = "home.html"; // Redirect to home page after login
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error logging in');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = "index.html"; // Redirect to login page after logout
}

// Fetch chat rooms (if needed)
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

// Render chat rooms
function renderChatRooms(chatRooms) {
    const chatRoomList = document.getElementById('chat-room-list');
    if (!chatRoomList) return; // Prevent errors if element is missing
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

// Join a chat room
async function joinChatRoom(roomId) {
    try {
        await fetch(`${API_URL}/chatrooms/${roomId}/join`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        window.location.href = `chatroom.html?room=${roomId}`; // Redirect to the chatroom with the room ID
    } catch (error) {
        alert('Error joining chat room');
    }
}

// Fetch and display chat messages
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

// Render chat messages
function renderChatMessages(messages) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return; // Prevent errors if element is missing
    chatMessages.innerHTML = '';

    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <div class="message-header">${message.userId.username}</div>
            <div class="message-content">${message.text}</div>
        `;
        chatMessages.appendChild(messageElement);
    });
}

// Send chat message
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

// Auto Redirect on Page Load
document.addEventListener("DOMContentLoaded", () => {
    if (token && window.location.pathname === "/index.html") {
        window.location.href = "home.html"; // Redirect logged-in users to home
    }
});
