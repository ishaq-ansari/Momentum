// chatroom.js - Functionality for the SocialCare Chat interface

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

// Send a message
function sendMessage() {
    console.log("sendMessage function called");
    const messageInput = document.getElementById('message-input');
    if (!messageInput) {
        console.error("Message input element not found");
        return;
    }
    
    const message = messageInput.value.trim();
    console.log("Message content:", message);
    
    if (message === '') {
        console.log("Message is empty, not sending");
        return;
    }
    
    // Get current time
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add message to chat
    addMessage(message, 'outgoing', 'You', 'A', time);
    
    // Clear input
    messageInput.value = '';
    
    // Focus on input
    messageInput.focus();
    
    // Simulate the other person typing
    showTypingIndicator();
    
    // In a real app, you would send the message to an API
    // For this demo, we'll simulate a reply after a delay
    setTimeout(() => {
        hideTypingIndicator();
        
        // Example response based on message content
        let response;
        const lowercaseMsg = message.toLowerCase();
        
        if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
            response = "Hello! How are you feeling today?";
        } else if (lowercaseMsg.includes('anxiety') || lowercaseMsg.includes('anxious')) {
            response = "I understand anxiety can be challenging. Have you tried any relaxation techniques?";
        } else if (lowercaseMsg.includes('depression') || lowercaseMsg.includes('sad')) {
            response = "I'm sorry to hear you're feeling this way. Would you like to talk more about what's been happening?";
        } else if (lowercaseMsg.includes('thank')) {
            response = "You're welcome! I'm here anytime you need to talk.";
        } else {
            response = "Thank you for sharing. How does that make you feel?";
        }
        
        addMessage(response, 'incoming', currentContact.name, currentContact.avatar, time);
    }, 2000);
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (!typingIndicator) {
        console.error("Typing indicator element not found");
        return;
    }
    
    document.getElementById('typing-avatar').textContent = currentContact.avatar;
    document.getElementById('typing-name').textContent = `${currentContact.name} is typing`;
    typingIndicator.style.display = 'flex';
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
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