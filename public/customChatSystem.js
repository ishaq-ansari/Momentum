// Custom Chat System using Socket.io
let socket;
let currentChatRoomId;
let chatInitialized = false;

// Main function to show chat interface
async function showCustomChatSystem(peerId = null) {
    const mainContentArea = document.getElementById('main-content');
    if (!mainContentArea) return;

    // First hide all content except chat section
    Array.from(mainContentArea.children).forEach(child => {
        if (child.id !== 'chat-section') {
            child.style.display = 'none';
        }
    });

    // Check if chat content exists, if not create it
    let chatContent = document.getElementById('chat-section');
    if (!chatContent) {
        chatContent = createChatUI();
        mainContentArea.appendChild(chatContent);

        // Add styles for the chat system
        addChatStyles();
        
        // Initialize Socket.io
        await initializeSocket();
        
        // Set up event listeners
        setupEventListeners();
        
        chatInitialized = true;
    }

    // Show chat content
    chatContent.style.display = 'block';

    // Load chat rooms
    loadChatRooms();
    
    // If peerId is provided, create a chat with this peer
    if (peerId && socket) {
        socket.emit('createPeerChat', peerId);
    }
}

// Function to create chat UI
function createChatUI() {
    const chatContent = document.createElement('div');
    chatContent.id = 'chat-section';
    chatContent.style.display = 'none'; // Initially hidden
    chatContent.innerHTML = `
        <div class="chat-container">
            <div class="contacts-section">
                <div class="contacts-header">
                    <h3>Conversations</h3>
                    <div class="search-container">
                        <input type="text" id="search-contacts" placeholder="Search...">
                    </div>
                </div>
                <div class="contacts-list" id="contacts-list">
                    <!-- Chat rooms will be loaded here -->
                    <div class="loading-spinner">Loading chats...</div>
                </div>
            </div>
            <div class="chat-area">
                <div id="chat-room-header" class="chat-room-header">
                    <div class="chat-room-info">
                        <div class="chat-room-name">Select a conversation</div>
                        <div class="chat-room-status"></div>
                    </div>
                </div>
                <div id="chat-messages" class="chat-messages">
                    <!-- Select a conversation to start chatting -->
                    <div class="no-chat-selected">
                        <div class="no-chat-icon">💬</div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                </div>
                <div class="chat-input-area">
                    <textarea id="chat-input" placeholder="Type a message..." disabled></textarea>
                    <button id="send-message-btn" class="send-btn" disabled>Send</button>
                </div>
            </div>
        </div>
    `;

    return chatContent;
}

// Function to add chat system styles
function addChatStyles() {
    // Check if styles already exist
    if (document.getElementById('chat-styles')) return;

    const styleSheet = document.createElement("style");
    styleSheet.id = 'chat-styles';
    styleSheet.textContent = `
        .chat-container {
            display: flex;
            height: calc(100vh - 80px);
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            margin: 20px;
        }
        
        .contacts-section {
            width: 280px;
            border-right: 1px solid #eee;
            background: white;
            overflow-y: auto;
            height: 100%;
            transition: width 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            background-color: #fcfcfc;
        }
        
        .chat-room-header {
            padding: 15px 20px;
            background-color: white;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .chat-room-info {
            display: flex;
            flex-direction: column;
        }
        
        .chat-room-name {
            font-weight: 600;
            font-size: 16px;
            color: #333;
        }
        
        .chat-room-status {
            font-size: 12px;
            color: #666;
        }
        
        .chat-messages {
            flex: 1;
            padding: 20px;
            background-color: #fcfcfc;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }
        
        .chat-input-area {
            padding: 15px 20px;
            background-color: white;
            border-top: 1px solid #eee;
            display: flex;
            align-items: center;
            min-height: 70px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
        }
        
        .contacts-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            background: linear-gradient(to right, #8a4fff, #9a66ff);
            color: white;
        }
        
        .contacts-header h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: 600;
            color: white;
        }
        
        .search-container input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            font-size: 14px;
            background-color: rgba(255, 255, 255, 0.15);
            color: white;
            transition: all 0.3s ease;
        }
        
        .search-container input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .contacts-list {
            flex: 1;
            overflow-y: auto;
        }
        
        .contact-item {
            display: flex;
            padding: 15px 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
            align-items: center;
        }
        
        .contact-item:hover {
            background-color: #f5f0ff;
        }
        
        .contact-item.active {
            background-color: #f0ebff;
            border-left: 3px solid #8a4fff;
        }
        
        .contact-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8a4fff, #7b45e0);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            margin-right: 12px;
            flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(138, 79, 255, 0.3);
        }
        
        .contact-info {
            flex: 1;
            overflow: hidden;
        }
        
        .contact-name {
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .contact-last-message {
            color: #666;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .contact-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-left: 10px;
        }
        
        .contact-time {
            color: #999;
            font-size: 11px;
            margin-bottom: 5px;
        }
        
        .contact-badge {
            background-color: #8a4fff;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 500;
        }
        
        .message {
            max-width: 70%;
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.3s ease;
        }
        
        .message.sent {
            align-self: flex-end;
        }
        
        .message.received {
            align-self: flex-start;
        }
        
        .message-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .message.sent .message-bubble {
            background: #1e88e5; /* Similar to second screenshot */
            color: white;
            border-bottom-right-radius: 4px;
        }
        
        .message.received .message-bubble {
            background-color: #f0f0f0;
            color: #333;
            border-bottom-left-radius: 4px;
        }
        
        .message-info {
            display: flex;
            align-items: center;
            margin-top: 4px;
            font-size: 12px;
            color: #999;
        }
        
        .message.sent .message-info {
            justify-content: flex-end;
        }
        
        .message-sender {
            font-weight: 500;
            margin-right: 5px;
        }
        
        .message-time {
            flex-shrink: 0;
        }
        
        #chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #eee;
            border-radius: 24px;
            margin-right: 12px;
            font-size: 14px;
            resize: none;
            max-height: 120px;
            min-height: 45px;
            line-height: 20px;
            transition: all 0.3s ease;
        }
        
        #chat-input:focus {
            outline: none;
            border-color: #8a4fff;
            box-shadow: 0 0 0 2px rgba(138, 79, 255, 0.1);
        }
        
        #chat-input:disabled {
            background-color: #f9f9f9;
            cursor: not-allowed;
        }
        
        .send-btn {
            background: linear-gradient(135deg, #8a4fff, #7b45e0);
            color: white;
            border: none;
            border-radius: 24px;
            padding: 12px 24px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(138, 79, 255, 0.3);
            white-space: nowrap;
        }
        
        .send-btn:hover {
            background: linear-gradient(135deg, #7b45e0, #6a35d0);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(138, 79, 255, 0.4);
        }
        
        .send-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(138, 79, 255, 0.3);
        }
        
        .send-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }
        
        .loading-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: #666;
        }
        
        .no-chat-selected {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            color: #999;
            text-align: center;
        }
        
        .no-chat-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .no-messages {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            color: #999;
        }
        
        .user-typing {
            align-self: flex-start;
            color: #999;
            font-size: 12px;
            margin-bottom: 10px;
            font-style: italic;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .chat-container {
                flex-direction: column;
                height: calc(100vh - 60px);
                margin: 10px;
            }
            
            .contacts-section {
                width: 100%;
                height: 250px;
                border-right: none;
                border-bottom: 1px solid #eee;
            }
            
            .chat-area {
                height: calc(100vh - 310px);
            }
            
            .message {
                max-width: 85%;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// Initialize Socket.io connection
async function initializeSocket() {
    // Load Socket.io client from CDN if not already loaded
    if (!window.io) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
            script.integrity = 'sha384-mZLF4UVrpi/QTWPA7BjNPEnkIfRFn4ZEO3Qt/HFklTJBj/gBOV8G3HcKn4NfQblz';
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
            
            script.onload = () => {
                connectSocket();
                resolve();
            };
        });
    } else {
        connectSocket();
    }
}

// Connect to Socket.io server
function connectSocket() {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Authentication required', 'error');
        return;
    }

    // Initialize Socket.io connection with auth token
    socket = io({
        auth: {
            token: token
        }
    });

    // Handle connection events
    socket.on('connect', () => {
        console.log('Connected to chat server');
    });

    socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
        showNotification(`Chat connection error: ${err.message}`, 'error');
    });

    // Handle receiving chat rooms list
    socket.on('chatRoomsList', (chatRooms) => {
        renderChatRooms(chatRooms);
    });

    // Handle new messages
    socket.on('newMessage', (data) => {
        if (data.roomId === currentChatRoomId) {
            addMessageToChat(data.message);
        } else {
            // Update unread count for the chat room
            updateUnreadCount(data.roomId);
        }
    });

    // Handle chat room created
    socket.on('chatCreated', (chatRoom) => {
        console.log('Chat room created:', chatRoom);
        // Select the newly created chat room
        selectChatRoom(chatRoom._id, chatRoom.name);
        // Refresh chat rooms list
        socket.emit('getChatRooms');
    });

    // Handle joining a room confirmation
    socket.on('joinedRoom', (data) => {
        console.log('Joined room:', data.roomId);
    });

    // Handle user typing
    socket.on('userTyping', (data) => {
        showUserTyping(data.username);
    });

    // Handle user stopped typing
    socket.on('userStoppedTyping', () => {
        hideUserTyping();
    });

    // Handle errors
    socket.on('error', (error) => {
        showNotification(error.message, 'error');
    });

    // Handle new chat invitation
    socket.on('newChatInvitation', (data) => {
        showNotification(`New chat from ${data.fromUser.username}`);
        // Refresh chat rooms list
        socket.emit('getChatRooms');
    });

    // Handle user status changes
    socket.on('userStatusChange', (data) => {
        updateUserStatus(data.userId, data.status);
    });
}

// Load chat rooms
function loadChatRooms() {
    if (socket) {
        socket.emit('getChatRooms');
    }
}

// Render chat rooms list
function renderChatRooms(chatRooms) {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList) return;

    if (chatRooms.length === 0) {
        contactsList.innerHTML = `
            <div class="no-chats">
                <p>No conversations yet</p>
                <p>Connect with a peer to start chatting</p>
            </div>
        `;
        return;
    }

    contactsList.innerHTML = chatRooms.map(room => {
        // Find the other user in the chat (not current user)
        const otherUsers = room.users.filter(user => user._id !== getCurrentUserId());
        const otherUser = otherUsers.length ? otherUsers[0] : { username: 'Unknown' };
        
        // Get last message if available
        const lastMessage = room.messages.length ? 
            room.messages[room.messages.length - 1].text : 
            'No messages yet';
        
        // Format last message time
        const lastMessageTime = room.messages.length ? 
            formatTime(new Date(room.messages[room.messages.length - 1].createdAt)) : 
            '';
        
        // Get initials for avatar
        const initials = otherUser.username ? otherUser.username.charAt(0).toUpperCase() : '?';
        
        // Create room element
        return `
            <div class="contact-item" data-room-id="${room._id}" data-room-name="${otherUser.username}" onclick="selectChatRoom('${room._id}', '${otherUser.username}')">
                <div class="contact-avatar">${initials}</div>
                <div class="contact-info">
                    <div class="contact-name">${otherUser.username}</div>
                    <div class="contact-last-message">${lastMessage}</div>
                </div>
                <div class="contact-meta">
                    <div class="contact-time">${lastMessageTime}</div>
                    <div class="contact-badge" style="display: none;">0</div>
                </div>
            </div>
        `;
    }).join('');
}

// Format time for display
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    // If less than 24 hours, show time
    if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If less than a week, show day
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Select a chat room
function selectChatRoom(roomId, roomName) {
    // Update UI to show selected room
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.roomId === roomId) {
            item.classList.add('active');
            // Clear unread badge
            const badge = item.querySelector('.contact-badge');
            if (badge) {
                badge.style.display = 'none';
                badge.textContent = '0';
            }
        }
    });
    
    // Update room header
    const roomHeader = document.getElementById('chat-room-header');
    if (roomHeader) {
        roomHeader.querySelector('.chat-room-name').textContent = roomName;
    }
    
    // Clear messages
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="loading-spinner">Loading messages...</div>
        `;
    }
    
    // Enable chat input
    document.getElementById('chat-input').disabled = false;
    document.getElementById('send-message-btn').disabled = false;
    
    // Join the room
    currentChatRoomId = roomId;
    socket.emit('joinChatRoom', roomId);
    
    // Load messages for this room
    loadChatRoomMessages(roomId);
}

// Load messages for a chat room
function loadChatRoomMessages(roomId) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = `<div class="loading-spinner">Loading messages...</div>`;
    
    // Emit event to get messages for this room
    socket.on('joinedRoom', (data) => {
        if (data.roomId === roomId) {
            // Clear loading spinner
            messagesContainer.innerHTML = '';
            
            // Check if there are messages
            if (!data.messages || data.messages.length === 0) {
                messagesContainer.innerHTML = `
                    <div class="no-messages">No messages yet. Start the conversation!</div>
                `;
                return;
            }
            
            // Render messages
            data.messages.forEach(message => {
                const currentUserId = getCurrentUserId();
                const isCurrentUser = message.userId._id === currentUserId || message.userId === currentUserId;
                
                const messageElement = document.createElement('div');
                messageElement.className = `message ${isCurrentUser ? 'sent' : 'received'}`;
                messageElement.innerHTML = `
                    <div class="message-bubble">
                        ${message.text}
                    </div>
                    <div class="message-info">
                        ${!isCurrentUser ? `<span class="message-sender">${message.userId.username || 'User'}</span>` : ''}
                        <span class="message-time">${formatTime(new Date(message.createdAt))}</span>
                    </div>
                `;
                
                messagesContainer.appendChild(messageElement);
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
}

// Add a message to the current chat
function addMessageToChat(message) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const currentUserId = getCurrentUserId();
    const isCurrentUser = message.userId === currentUserId;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isCurrentUser ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
        <div class="message-bubble">
            ${message.text}
        </div>
        <div class="message-info">
            ${!isCurrentUser ? `<span class="message-sender">${message.username}</span>` : ''}
            <span class="message-time">${formatTime(new Date(message.createdAt))}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a message
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || !currentChatRoomId) return;
    
    // Send message via Socket.io
    socket.emit('sendMessage', {
        roomId: currentChatRoomId,
        message: message
    });
    
    // Clear input
    input.value = '';
    
    // Focus back on input
    input.focus();
}

// Update unread message count for a room
function updateUnreadCount(roomId) {
    const contactItem = document.querySelector(`.contact-item[data-room-id="${roomId}"]`);
    if (!contactItem) return;
    
    const badge = contactItem.querySelector('.contact-badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + 1;
        badge.style.display = 'flex';
    }
}

// Show user typing indicator
function showUserTyping(username) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    // Remove any existing typing indicator
    hideUserTyping();
    
    // Add new typing indicator
    const typingElement = document.createElement('div');
    typingElement.className = 'user-typing';
    typingElement.id = 'user-typing';
    typingElement.textContent = `${username} is typing...`;
    
    messagesContainer.appendChild(typingElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide user typing indicator
function hideUserTyping() {
    const typingElement = document.getElementById('user-typing');
    if (typingElement) {
        typingElement.remove();
    }
}

// Update user online status
function updateUserStatus(userId, status) {
    // This would update the UI to show online/offline status
    console.log(`User ${userId} is ${status}`);
    // In a real app, we'd update the UI accordingly
}

// Get current user ID helper
function getCurrentUserId() {
    // Get the user ID from the JWT token
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // Decode JWT token (without verification as that happens on the server)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        // Return the user ID from the token
        return payload.id || payload.userId || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Send message button click
    const sendButton = document.getElementById('send-message-btn');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Handle typing events
        let typingTimeout;
        chatInput.addEventListener('input', () => {
            if (!currentChatRoomId) return;
            
            // Send typing event
            socket.emit('typing', currentChatRoomId);
            
            // Clear existing timeout
            clearTimeout(typingTimeout);
            
            // Set new timeout to emit stop typing after 2 seconds of inactivity
            typingTimeout = setTimeout(() => {
                socket.emit('stopTyping', currentChatRoomId);
            }, 2000);
        });
    }
    
    // Search contacts
    const searchInput = document.getElementById('search-contacts');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const contacts = document.querySelectorAll('.contact-item');
            
            contacts.forEach(contact => {
                const name = contact.querySelector('.contact-name').textContent.toLowerCase();
                contact.style.display = name.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Use the existing notification system in the app
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        // Fallback if notification system not available
        alert(message);
    }
}

// Function to initialize chat with a specific peer
function connectWithPeer(peerId) {
    showCustomChatSystem(peerId);
}

// Export functions
window.showCustomChatSystem = showCustomChatSystem;
window.selectChatRoom = selectChatRoom;
window.connectWithPeer = connectWithPeer;