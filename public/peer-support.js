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
        let peerSupportContent = document.getElementById('peer-support-section');
        if (!peerSupportContent) {
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
                
                // Add event listeners for the peer support functionality
                document.getElementById('peer-application-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    showNotification('Your application has been submitted! We\'ll review it shortly.', 'success');
                    hideBecomePeerForm();
                });
                
                // Initialize with sample peers and groups
                loadSamplePeers();
                loadSampleGroups();
            } catch (error) {
                console.error('Error loading peer support template:', error);
                showNotification('Failed to load peer support content.', 'error');
            }
        } else {
            // Template is already loaded, just display it
            peerSupportContent.style.display = 'block';
        }
        
        // Load the peer support CSS if it's not already loaded
        if (!document.querySelector('link[href="css/peer-support.css"]')) {
            const linkElem = document.createElement('link');
            linkElem.rel = 'stylesheet';
            linkElem.href = 'css/peer-support.css';
            document.head.appendChild(linkElem);
        }
    } else {
        // Fallback - redirect if necessary
        window.location.href = "peer.html";
    }
}

// Sample data loader functions
function loadSamplePeers() {
    const peers = [
        {
            initial: 'JD',
            name: 'Jane Doe',
            topics: ['Anxiety', 'Stress Management'],
            availability: 'Available Now',
            sessions: 24,
            rating: 4.8
        },
        {
            initial: 'MS',
            name: 'Michael Smith',
            topics: ['Depression', 'Wellness'],
            availability: 'Available Today',
            sessions: 18,
            rating: 4.7
        },
        {
            initial: 'AK',
            name: 'Aisha Khan',
            topics: ['Relationships', 'Self-esteem'],
            availability: 'Available Now',
            sessions: 35,
            rating: 4.9
        },
        {
            initial: 'RL',
            name: 'Robert Lee',
            topics: ['Grief', 'Life Transitions'],
            availability: 'Available This Week',
            sessions: 12,
            rating: 4.5
        }
    ];
    
    const peersContainer = document.getElementById('peers-container');
    peersContainer.innerHTML = '';
    
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
            <button class="connect-btn" onclick="connectWithPeer('${peer.name}')">Connect</button>
        `;
        peersContainer.appendChild(peerCard);
    });
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
    document.getElementById('become-peer-form').style.display = 'flex';
}

function hideBecomePeerForm() {
    document.getElementById('become-peer-form').style.display = 'none';
}

function connectWithPeer(peerName) {
    showNotification(`Request sent to ${peerName}! They will contact you shortly.`, 'success');
}

function joinGroup(groupName) {
    showNotification(`You have joined ${groupName}! Check your email for details about the next meeting.`, 'success');
}

// Export the showPeerSupport function for use in script.js
window.showPeerSupport = showPeerSupport;
window.connectWithPeer = connectWithPeer;
window.joinGroup = joinGroup;
window.showBecomePeerForm = showBecomePeerForm;
window.hideBecomePeerForm = hideBecomePeerForm;