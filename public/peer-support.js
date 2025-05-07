// Peer Support functionality

// Main function to show peer support content
async function showPeerSupport() {
    // Instead of redirecting, load peer support content into the main content area
    const mainContentArea = document.getElementById('main-content');
    
    if (mainContentArea) {
        // First hide all content
        Array.from(mainContentArea.children).forEach(child => {
            child.style.display = 'none';
        });
        
        // Check if peer support content exists, if not load it from template
        let peerContent = document.getElementById('peer-support-section');
        if (!peerContent) {
            // Load the template HTML
            try {
                const response = await fetch('templates/peer-support.html');
                const templateHTML = await response.text();
                
                // Create a container and insert the template HTML
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = templateHTML;
                
                // Append the template content to main content area
                while (tempContainer.firstChild) {
                    mainContentArea.appendChild(tempContainer.firstChild);
                }
                
                // Add event listeners for the peer support page
                document.getElementById('become-peer-btn')?.addEventListener('click', showBecomePeerForm);
                
                // Load sample peers
                await loadPeers();
                
                // Load sample groups
                loadSampleGroups();
                
                peerContent = document.getElementById('peer-support-section');
            } catch (error) {
                console.error('Error loading peer support template:', error);
                showNotification('Failed to load peer support content.', 'error');
            }
        } else {
            // If peer support section already exists, just refresh the data
            await loadPeers();
            loadSampleGroups();
        }
        
        // Show peer support content
        if (peerContent) {
            peerContent.style.display = 'block';
        }
        
        // Load the peer support CSS if it's not already loaded
        if (!document.querySelector('link[href="css/peer-support.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/peer-support.css';
            document.head.appendChild(link);
        }
    } else {
        // Fallback - redirect if necessary
        window.location.href = "peer-support.html";
    }
}


function populatePeer(name) {
    const topics = ['Anxiety', 'Stress Management', 'Depression', 'Wellness']

    return {
        initial: name.charAt(0).toUpperCase(),
        name: name,
        topics: topics,
        availability: 'Available Now',
        sessions: 24,
        rating: 4.8
    }
}


// Sample data loader functions
async function loadPeers() {
    try {
        const response = await fetch(`${API_URL}/users/peer`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to load peers: ${response.status}`);
        }
        
        const _peers = await response.json();
        console.log("Loaded peers:", _peers); // Debug log to see peer data structure
        
        // Map peer data to display format
        const peers = _peers.map((peer) => {
            const peerData = populatePeer(peer.username);
            // Ensure we store the actual database ID
            peerData._id = peer._id || peer.id;
            return peerData;
        });
        
        const peersContainer = document.getElementById('peers-container');
        if (!peersContainer) return;
        
        peersContainer.innerHTML = '';
        
        // If no peers found
        if (peers.length === 0) {
            peersContainer.innerHTML = `
                <div class="no-peers-message">
                    <p>No peer supporters available at the moment.</p>
                    <p>Consider becoming a peer supporter!</p>
                </div>
            `;
            return;
        }
        
        peers.forEach(peer => {
            const peerCard = document.createElement('div');
            peerCard.className = 'peer-card';
            peerCard.innerHTML = `
                <div class="peer-avatar">${peer.initial}</div>
                <h4 class="peer-name">${peer.name}</h4>
                <p class="peer-topics">${peer.topics.join(', ')}</p>
                <p class="peer-availability">${peer.availability}</p>
                <div class="peer-stats">
                    <span>${peer.sessions} sessions</span>
                    <span>★ ${peer.rating}</span>
                </div>
                <button class="connect-btn" onclick="connectWithPeer('${peer._id}')">Connect</button>
            `;
            peersContainer.appendChild(peerCard);
        });
    } catch (error) {
        console.error('Error loading peers:', error);
        showNotification('Failed to load peer supporters. Please try again.', 'error');
    }
}

function loadSampleGroups() {
    const groups = [
        {
            name: 'Anxiety Support Circle',
            description: 'Weekly discussions about managing anxiety',
            members: 15,
            nextSession: 'Tomorrow, 7 PM'
        },
        {
            name: 'Mindfulness Practice',
            description: 'Daily meditation and mindfulness exercises',
            members: 28,
            nextSession: 'Today, 8 PM'
        },
        {
            name: 'Wellness Journey',
            description: 'Share your wellness goals and progress',
            members: 23,
            nextSession: 'Wednesday, 6 PM'
        }
    ];

    const groupsContainer = document.getElementById('groups-container');
    if (!groupsContainer) return;
    
    groupsContainer.innerHTML = '';

    groups.forEach(group => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        groupCard.innerHTML = `
            <h4 class="group-name">${group.name}</h4>
            <p class="group-description">${group.description}</p>
            <p class="peer-topics">${group.members} members</p>
            <p class="peer-availability">Next: ${group.nextSession}</p>
            <button class="connect-btn" onclick="joinGroup('${group.name}')">Join Group</button>
        `;
        groupsContainer.appendChild(groupCard);
    });
}

// Event handler functions
function showBecomePeerForm() {
    const peerSupportContent = document.getElementById('peer-support-content');
    const peerForm = document.getElementById('become-peer-form');
    
    if (peerSupportContent && peerForm) {
        peerSupportContent.style.display = 'none';
        peerForm.style.display = 'block';
    }
}

function hideBecomePeerForm() {
    const peerSupportContent = document.getElementById('peer-support-content');
    const peerForm = document.getElementById('become-peer-form');
    
    if (peerSupportContent && peerForm) {
        peerSupportContent.style.display = 'block';
        peerForm.style.display = 'none';
    }
}

// Connect with a peer using our custom chat system
function connectWithPeer(peerId) {
    console.log("Connecting with peer ID:", peerId); // Debug log
    
    // Check if peerId is valid
    if (!peerId) {
        showNotification('Invalid peer ID', 'error');
        return;
    }
    
    // Use our custom chat system
    if (typeof showCustomChatSystem === 'function') {
        showCustomChatSystem(peerId);
        showNotification('Creating chat with peer...', 'info');
    } else {
        // If not loaded, load the script and then show chat
        const script = document.createElement('script');
        script.src = 'customChatSystem.js';
        script.onload = () => {
            showCustomChatSystem(peerId);
            showNotification('Creating chat with peer...', 'info');
        };
        document.head.appendChild(script);
    }
}

function joinGroup(groupName) {
    showNotification(`You've joined the ${groupName} group. The next session will appear in your calendar.`, 'success');
}

// Function to submit peer support application
async function submitPeerApplication(event) {
    event.preventDefault();
    
    const experience = document.getElementById('peer-experience').value;
    const topics = Array.from(document.querySelectorAll('input[name="peer-topics"]:checked')).map(cb => cb.value);
    const availability = document.getElementById('peer-availability').value;
    
    if (!experience || topics.length === 0 || !availability) {
        showNotification('Please complete all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/peers/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                experience,
                topics,
                availability
            })
        });
        
        if (response.ok) {
            showNotification('Your peer support application has been submitted!', 'success');
            hideBecomePeerForm();
        } else {
            const data = await response.json();
            showNotification(data.message || 'Error submitting application', 'error');
        }
    } catch (error) {
        console.error('Error submitting peer application:', error);
        showNotification('Error connecting to server', 'error');
    }
}

// Export the showPeerSupport function for use in script.js
window.showPeerSupport = showPeerSupport;
window.connectWithPeer = connectWithPeer;
window.joinGroup = joinGroup;
window.showBecomePeerForm = showBecomePeerForm;
window.hideBecomePeerForm = hideBecomePeerForm;
window.submitPeerApplication = submitPeerApplication;
