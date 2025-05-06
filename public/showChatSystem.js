// Chat System functionality
let chatInitialized = false;

// Main function to show chat interface
async function showChatSystem(peerName) {
    const mainContentArea = document.getElementById('main-content');

    if (mainContentArea) {
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

            // Setup event listeners
            setupEventListeners();

            // Initialize TalkJS with custom theme
            Talk.ready.then(function() {
                // Custom theme to match project's purple theme
                const customTheme = {
                    name: "momentum-theme",
                    basedOn: "default",
                    settings: {
                        primaryColor: "#8a4fff",
                        secondaryColor: "#7b45e0",
                        backgroundColors: {
                            viewContainer: "#fcfcfc",
                            bubble: {
                                myMessage: "linear-gradient(135deg, #8a4fff, #7b45e0)",
                                otherMessage: "#f0f0f0",
                            },
                        },
                        textColors: {
                            myMessage: "#ffffff",
                            otherMessage: "#333333",
                        },
                        borders: {
                            messageBubble: {
                                myMessage: {
                                    borderRadius: "18px 18px 4px 18px"
                                },
                                otherMessage: {
                                    borderRadius: "18px 18px 18px 4px"
                                }
                            }
                        },
                        headings: {
                            fontWeight: 600,
                        },
                        buttons: {
                            default: {
                                backgroundColor: "#8a4fff",
                                borderColor: "#8a4fff",
                                hoverBackgroundColor: "#7b45e0",
                                hoverBorderColor: "#7b45e0",
                            }
                        },
                        inputBoxes: {
                            default: {
                                borderRadius: "24px",
                                borderColor: "#eee",
                                focusBorderColor: "#8a4fff",
                            }
                        },
                        avatars: {
                            myAvatar: {
                                background: "linear-gradient(135deg, #8a4fff, #7b45e0)",
                            }
                        },
                        shadows: {
                            default: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            hover: "0 6px 16px rgba(0, 0, 0, 0.15)",
                        }
                    }
                };

                const session = new Talk.Session({
                    appId: 'tiCAkQV1',
                    userId: 'sample_user_alice',
                    customTheme: customTheme
                });

                const chatbox = session.createChatbox();
                chatbox.select('sample_conversation');
                chatbox.mount(document.getElementById('talkjs-container'));
            });

            chatInitialized = true;
        }

        // Show chat content
        chatContent.style.display = 'block';

        // If already initialized, just refresh the contacts and messages
        if (chatInitialized) {
            loadContacts();
            loadMessages();
        }
    } else {
        // Fallback - redirect if necessary
        // window.location.href = "chat.html";
    }
}

// Function to create chat UI
function createChatUI() {
    const chatContent = document.createElement('div');
    chatContent.id = 'chat-section';
    chatContent.style.display = 'none'; // Initially hidden
    chatContent.innerHTML = `
            <div id='talkjs-container' style='width: 90%; margin: 30px; height: 500px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);'>
                <i>Loading chat...</i>
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
        }

        .contacts-section {
            width: 280px;
            border-right: 1px solid #eee;
            background: white;
            overflow-y: auto;
            height: 100%;
            transition: width 0.3s ease;
        }

        .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            background-color: #fcfcfc;
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
            padding: 20px;
            background-color: white;
            border-top: 1px solid #eee;
            display: flex;
            align-items: center;
            min-height: 85px;
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

        .contacts-header input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            font-size: 14px;
            background-color: rgba(255, 255, 255, 0.15);
            color: white;
            transition: all 0.3s ease;
        }

        .contacts-header input:focus {
            outline: none;
            background-color: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .contacts-header input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .contacts-list {
            padding: 10px 0;
        }

        .contact {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }

        .contact:hover {
            background-color: #f5f0ff;
        }

        .contact.active {
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
        }

        .contact-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
        }

        .contact-status {
            font-size: 12px;
            color: #666;
            display: flex;
            align-items: center;
        }

        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .status-indicator.online {
            background-color: #4CAF50;
            box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
        }

        .status-indicator.offline {
            background-color: #9e9e9e;
        }

        .message {
            max-width: 70%;
            margin-bottom: 20px;
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

        .message-content {
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            margin-bottom: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message.sent .message-content {
            background: linear-gradient(135deg, #8a4fff, #7b45e0);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .message.received .message-content {
            background-color: #f0f0f0;
            color: #333;
            border-bottom-left-radius: 4px;
        }

        .message-timestamp {
            font-size: 12px;
            color: #999;
            margin-top: 2px;
        }

        .message.sent .message-timestamp {
            align-self: flex-end;
        }

        .message.received .message-timestamp {
            align-self: flex-start;
        }

        #chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #eee;
            border-radius: 24px;
            margin-right: 12px;
            font-size: 14px;
            resize: none;
            height: 45px;
            line-height: 20px;
            transition: all 0.3s ease;
        }

        #chat-input:focus {
            outline: none;
            border-color: #8a4fff;
            box-shadow: 0 0 0 2px rgba(138, 79, 255, 0.1);
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
        
        /* Emoji picker styling */
        .emoji-picker {
            display: none;
            position: absolute;
            bottom: 100px;
            right: 70px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            padding: 10px;
            flex-wrap: wrap;
            width: 240px;
            z-index: 10;
            border: 1px solid #eee;
        }

        .emoji-picker.active {
            display: flex;
        }

        .emoji-item {
            font-size: 20px;
            padding: 5px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .emoji-item:hover {
            transform: scale(1.2);
        }
        
        /* Animations */
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
            }

            .contacts-section {
                width: 100%;
                height: 200px;
                border-right: none;
                border-bottom: 1px solid #eee;
            }

            .chat-area {
                height: calc(100vh - 260px);
            }

            .message {
                max-width: 85%;
            }
        }
        
        /* TalkJS container custom styling */
        #talkjs-container {
            transition: all 0.3s ease;
        }
        
        #talkjs-container:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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

// Function to load contacts
function loadContacts() {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList) return;

    // Sample contacts - replace with actual API call
    const contacts = [
        { id: 1, name: 'John Doe', status: 'Online', avatar: 'JD' },
        { id: 2, name: 'Jane Smith', status: 'Offline', avatar: 'JS' },
        { id: 3, name: 'Mike Johnson', status: 'Online', avatar: 'MJ' }
    ];

    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact" onclick="changeContact(${JSON.stringify(contact)})">
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-status">${contact.status}</div>
            </div>
        </div>
    `).join('');
}

// Function to change active contact
function changeContact(contact) {
    // Remove active class from all contacts
    document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));

    // Add active class to clicked contact
    const contactElement = Array.from(document.querySelectorAll('.contact')).find(
        c => c.querySelector('.contact-name').textContent === contact.name
    );
    if (contactElement) {
        contactElement.classList.add('active');
    }

    // Clear and load messages for the selected contact
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';
    loadMessages(contact.id);
}

// Function to load messages
function loadMessages(contactId) {
    // Sample messages - replace with actual API call
    const messages = [
        {
            sender: 'user',
            content: 'Hi there!',
            timestamp: '10:00 AM'
        },
        {
            sender: 'peer',
            content: 'Hello! How can I help you today?',
            timestamp: '10:01 AM'
        }
    ];

    messages.forEach(message => {
        addMessage(message.content, message.sender === 'user' ? 'sent' : 'received', message.sender, '', message.timestamp);
    });
}

// Function to add a message to the chat
function addMessage(text, type, sender, avatar, time) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-timestamp">${time}</div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to send a message
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message) {
        addMessage(message, 'sent', 'user', '', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        input.value = '';

        // Simulate peer response
        setTimeout(() => {
            addMessage('Thanks for your message! I\'ll get back to you soon.', 'received', 'peer', '',
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
    }
}

// Function to setup event listeners
function setupEventListeners() {
    // Search contacts
    const searchInput = document.getElementById('search-contacts');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const contacts = document.querySelectorAll('.contact');

            contacts.forEach(contact => {
                const name = contact.querySelector('.contact-name').textContent.toLowerCase();
                contact.style.display = name.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }

    // Enter key to send message
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
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
