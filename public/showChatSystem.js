// Chat System functionality

// Main function to show chat interface
async function showChatSystem(peerName = 'Peer') {
    const mainContentArea = document.getElementById('main-content');
    
    if (mainContentArea) {
        // First hide all content
        Array.from(mainContentArea.children).forEach(child => {
            child.style.display = 'none';
        });
        
        // Check if chat content exists, if not create it
        let chatContent = document.getElementById('chat-section');
        if (!chatContent) {
            chatContent = document.createElement('div');
            chatContent.id = 'chat-section';
            chatContent.innerHTML = `  

                <div class="chat-container">
                    <div class="contacts-section" id="contacts-section">
                        <div class="contacts-header">
                            <h3>Contacts</h3>
                            <input type="text" id="search-contacts" placeholder="Search contacts...">
                        </div>
                        <div class="contacts-list" id="contacts-list">
                            <!-- Contacts will be loaded here -->
                        </div>
                    </div>
                    <div class="chat-messages" id="chat-messages">
                        <!-- Chat messages will be loaded here -->
                    </div>
                </div>
                
                <div class="chat-input-area">
                    <textarea id="chat-input" placeholder="Type your message..."></textarea>
                    <button class="send-btn" onclick="sendMessage()">Send</button>
                </div>
            `;
            mainContentArea.appendChild(chatContent);
            
            // Add styles for the chat system
            addChatStyles();
            
            // Initialize with sample messages
            loadSampleMessages();
            
            // Load contacts
            loadContacts();
        }
        
        // Show chat content
        chatContent.style.display = 'block';
    } else {
        // Fallback - redirect if necessary
        window.location.href = "chat.html";
    }
}

// Function to add chat system styles
function addChatStyles() {
    // Check if styles already exist
    if (document.getElementById('chat-styles')) return;
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'chat-styles';
    styleSheet.textContent = `
        .chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .chat-header h2 {
            color: #1a1a1a;
            font-size: 1.8rem;
            margin: 0;
        }
        
        .chat-container {
            display: flex;
            height: 80vh; /* Increased height */
            border: 1px solid #e0e0e0;
            border-radius: 0.5rem;
            overflow: hidden;
        }
        
        .contacts-section {
            width: 25%;
            border-right: 1px solid #e0e0e0;
            overflow-y: auto;
        }
        
        .contacts-header {
            padding: 1rem;
            border-bottom: 1px solid #e0e0e0;
            background-color: #f9f9f9;
        }
        
        .contacts-header h3 {
            margin: 0 0 0.5rem 0;
        }
        
        .contacts-header input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 0.25rem;
        }
        
        .contacts-list {
            padding: 1rem;
        }
        
        .contact {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .contact:hover {
            background-color: #f0f0f0;
        }
        
        .contact.active {
            background-color: #e0e0e0;
        }
        
        .contact-avatar {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background-color: #8a4fff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.75rem;
        }
        
        .contact-info {
            flex: 1;
        }
        
        .contact-name {
            font-weight: bold;
        }
        
        .contact-status {
            font-size: 0.875rem;
            color: #666;
        }
        
        .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            background-color: #f9f9f9;
        }
        
        .message {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
        }
        
        .message.sent {
            align-items: flex-end;
        }
        
        .message.received {
            align-items: flex-start;
        }
        
        .message-content {
            max-width: 70%;
            padding: 0.75rem;
            border-radius: 0.75rem;
            position: relative;
        }
        
        .message.sent .message-content {
            background-color: #8a4fff;
            color: white;
        }
        
        .message.received .message-content {
            background-color: #e0e0e0;
            color: #1a1a1a;
        }
        
        .message-timestamp {
            font-size: 0.75rem;
            color: #666;
            margin-top: 0.25rem;
        }
        
        .chat-input-area {
            display: flex;
            border-top: 1px solid #e0e0e0;
            padding: 0.75rem;
            background-color: white;
            align-items: flex-end; /* Align items to the bottom */
        }
        
        #chat-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 0.5rem;
            resize: none;
            margin-right: 0.75rem;
        }
        
        #chat-input:focus {
            border-color: #8a4fff;
            outline: none;
        }
        
        .send-btn {
            background-color: #8a4fff;
            color: white;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem; /* Thicker button */
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .send-btn:hover {
            background-color: #7b45e0;
        }
    `;
    document.head.appendChild(styleSheet);
}

// Sample data loader functions
function loadSampleMessages() {
    const messages = [
        {
            sender: 'peer',
            content: 'Hi there! How can I help you today?',
            timestamp: '10:00 AM'
        },
        {
            sender: 'user',
            content: 'Hi! I\'ve been feeling really anxious lately.',
            timestamp: '10:01 AM'
        },
        {
            sender: 'peer',
            content: 'I\'m sorry to hear that. Can you tell me more about what\'s been going on?',
            timestamp: '10:02 AM'
        }
    ];
    
    const chatMessagesContainer = document.getElementById('chat-messages');
    chatMessagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender === 'user' ? 'sent' : 'received'}`;
        messageElement.innerHTML = `
            <div class="message-content">${message.content}</div>
            <div class="message-timestamp">${message.timestamp}</div>
        `;
        chatMessagesContainer.appendChild(messageElement);
    });
    
    // Scroll to the bottom of the chat
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Event handler functions
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const messageContent = chatInput.value.trim();
    
    if (messageContent) {
        const chatMessagesContainer = document.getElementById('chat-messages');
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.innerHTML = `
            <div class="message-content">${messageContent}</div>
            <div class="message-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatMessagesContainer.appendChild(messageElement);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to the bottom of the chat
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        
        // Simulate a response from the peer
        setTimeout(() => {
            const responseElement = document.createElement('div');
            responseElement.className = 'message received';
            responseElement.innerHTML = `
                <div class="message-content">Thanks for sharing. Let's talk more about this.</div>
                <div class="message-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            chatMessagesContainer.appendChild(responseElement);
            
            // Scroll to the bottom of the chat
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }, 1000);
    }
}

// Global variables
let currentUserId = "current-user"; // Replace with actual user ID when available
let currentContact = { id: "ishaq", name: "Ishaq", avatar: "I" }; // Default contact
let contacts = [
    { id: "ishaq", name: "Ishaq", avatar: "I", status: "online", lastMessage: "I understand. It's just a phase. LMK if you need anything" },
    { id: "hrizu", name: "Hrizu", avatar: "H", status: "offline", lastMessage: "I'm doing much better, thanks for asking!" },
    { id: "prince", name: "Prince", avatar: "P", status: "online", lastMessage: "Yes, they were really helpful. Thank you!" },
    { id: "eyad", name: "Eyad", avatar: "E", status: "online", lastMessage: "When is our next session?" },
    { id: "vex", name: "Prof Vex", avatar: "P", status: "offline", lastMessage: "Did you do your homework?" }
];

// Commonly used emoji
const commonEmojis = ["😊", "😂", "❤️", "👍", "😍", "🙏", "😭", "😁", "😔", "🤔", "😉", "🥰"];

// Initialize the chat interface
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Load contacts
    loadContacts();
    
    // Load emoji picker
    loadEmojiPicker();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial messages
    loadMessages();
    
    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
});

// Load contacts into the sidebar
function loadContacts() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = `contact ${contact.id === currentContact.id ? 'active' : ''}`;
        contactElement.setAttribute('data-id', contact.id);
        
        contactElement.innerHTML = `
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-status">
                    <span class="status-dot ${contact.status}"></span>${contact.lastMessage}
                </div>
            </div>
        `;
        
        contactElement.addEventListener('click', function() {
            changeContact(contact);
        });
        
        contactsList.appendChild(contactElement);
    });
}

// Change the current contact
function changeContact(contact) {
    currentContact = contact;
    
    // Update the active contact in the sidebar
    document.querySelectorAll('.contact').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('data-id') === contact.id) {
            el.classList.add('active');
        }
    });
    
    // Update the chat header
    const currentContactEl = document.getElementById('current-contact');
    currentContactEl.innerHTML = `
        <div class="contact-avatar">${contact.avatar}</div>
        <div class="chat-name">${contact.name}</div>
    `;
    
    // Clear messages and load new ones
    document.getElementById('chat-messages').innerHTML = '<div class="message-day">Today</div>';
    loadMessages();
}

// Load messages for the current contact
function loadMessages() {
    // In a real app, you would fetch messages from an API
    // For this demo, we'll just add some sample messages
    
    if (currentContact.id === "ishaq") {
        addMessage("Hey bro, how are you today?", "incoming", "Ishaq", "I", "10:05 AM");
        addMessage("I've been feeling anxious lately and need someone to talk to.", "outgoing", "You", "A", "10:07 AM");
        addMessage("I understand. It's just a phase. LMK if you need anything", "incoming", "Ishaq", "I", "10:08 AM");
    } else if (currentContact.id === "hrizu") {
        addMessage("Hi there! Just checking in to see how you're doing today.", "incoming", "Hrizu", "H", "9:30 AM");
        addMessage("I'm doing much better, thanks for asking!", "outgoing", "You", "A", "9:45 AM");
    } else if (currentContact.id === "prince") {
        addMessage("Did you check out the new resources I sent you?", "incoming", "Prince", "P", "Yesterday");
        addMessage("Yes, they were really helpful. Thank you!", "outgoing", "You", "A", "Yesterday");
    }
}

// Add a message to the chat
function addMessage(text, type, sender, avatar, time) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.setAttribute('data-id', Date.now().toString()); // Add unique ID for context menu functionality
    
    messageElement.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-bubble">${text}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Set up event listeners
function setupEventListeners() {
    console.log("Setting up event listeners");
    
    // Send message button - Make sure this exists and is working
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        console.log("Send button found - adding event listener");
        sendBtn.addEventListener('click', function() {
            console.log("Send button clicked");
            sendMessage();
        });
    } else {
        console.error("Send button not found in the DOM");
    }
    
    // Enter key to send message
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log("Enter key pressed - sending message");
                sendMessage();
            }
        });
    } else {
        console.error("Message input not found in the DOM");
    }
    
    // Emoji button
    document.getElementById('emoji-btn').addEventListener('click', function() {
        document.getElementById('emoji-picker').classList.toggle('active');
    });
    
    // Attachment button
    document.getElementById('attachment-btn').addEventListener('click', function() {
        showNotification('Attachment feature coming soon!');
    });
    
    // Call and video buttons
    document.getElementById('call-btn').addEventListener('click', function() {
        showNotification('Call feature coming soon!');
    });
    
    document.getElementById('video-btn').addEventListener('click', function() {
        showNotification('Video call feature coming soon!');
    });
    
    // Search contacts
    document.getElementById('search-contacts').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        
        document.querySelectorAll('.contact').forEach(contact => {
            const name = contact.querySelector('.contact-name').textContent.toLowerCase();
            if (name.includes(query)) {
                contact.style.display = 'flex';
            } else {
                contact.style.display = 'none';
            }
        });
    });
    
    // Hide emoji picker when clicking outside
    document.addEventListener('click', function(e) {
        const emojiPicker = document.getElementById('emoji-picker');
        const emojiBtn = document.getElementById('emoji-btn');
        
        if (emojiPicker && emojiBtn && !emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
            emojiPicker.classList.remove('active');
        }
    });
    
    // Context menu for messages
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.message-bubble')) {
            e.preventDefault();
            
            const contextMenu = document.getElementById('context-menu');
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.classList.add('active');
            
            // Store the message element for later use
            contextMenu.dataset.messageId = e.target.closest('.message').dataset.id;
        }
    });
    
    // Hide context menu when clicking elsewhere
    document.addEventListener('click', function() {
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.classList.remove('active');
        }
    });
    
    // Context menu actions
    document.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            const messageId = document.getElementById('context-menu').dataset.messageId;
            
            switch (action) {
                case 'copy':
                    const text = document.querySelector(`.message[data-id="${messageId}"] .message-bubble`).textContent;
                    navigator.clipboard.writeText(text);
                    showNotification('Message copied to clipboard');
                    break;
                case 'reply':
                    showNotification('Reply feature coming soon!');
                    break;
                case 'forward':
                    showNotification('Forward feature coming soon!');
                    break;
                case 'delete':
                    showNotification('Delete feature coming soon!');
                    break;
            }
        });
    });
}

// Load emoji picker
function loadEmojiPicker() {
    const emojiPicker = document.getElementById('emoji-picker');
    if (!emojiPicker) {
        console.error("Emoji picker element not found");
        return;
    }
    
    commonEmojis.forEach(emoji => {
        const emojiElement = document.createElement('div');
        emojiElement.className = 'emoji-item';
        emojiElement.textContent = emoji;
        
        emojiElement.addEventListener('click', function() {
            const messageInput = document.getElementById('message-input');
            messageInput.value += emoji;
            document.getElementById('emoji-picker').classList.remove('active');
            messageInput.focus();
        });
        
        emojiPicker.appendChild(emojiElement);
    });
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error("Notification element not found");
        return;
    }
    
    notification.textContent = message;
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Export the showChatSystem function for use in script.js
window.showChatSystem = showChatSystem;
window.sendMessage = sendMessage;
window.showNotification = showNotification;
window.loadContacts = loadContacts;
window.loadMessages = loadMessages;
window.addMessage = addMessage;
window.changeContact = changeContact;
window.setupEventListeners = setupEventListeners;