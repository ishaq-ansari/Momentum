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
        
        // Check if peer support content exists, if not create it
        let peerSupportContent = document.getElementById('peer-support-section');
        if (!peerSupportContent) {
            peerSupportContent = document.createElement('div');
            peerSupportContent.id = 'peer-support-section';
            peerSupportContent.innerHTML = `
                <div class="section-header">
                    <h2>Peer Support Network</h2>
                    <p>Connect with others who understand what you're going through.</p>
                </div>
                
                <div class="filter-container">
                    <div class="search-box">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search peers by name or interest..." class="search-input" id="peer-search-input">
                    </div>
                    <div class="filter-options">
                        <select id="topic-filter" class="filter-select">
                            <option value="">All Topics</option>
                            <option value="anxiety">Anxiety</option>
                            <option value="depression">Depression</option>
                            <option value="stress">Stress Management</option>
                            <option value="wellness">General Wellness</option>
                            <option value="relationships">Relationships</option>
                        </select>
                        <select id="availability-filter" class="filter-select">
                            <option value="">Any Availability</option>
                            <option value="available-now">Available Now</option>
                            <option value="today">Today</option>
                            <option value="this-week">This Week</option>
                        </select>
                    </div>
                </div>
                
                <div class="peers-grid" id="peers-container">
                    <!-- Peer cards will be loaded here -->
                </div>
                
                <div class="section-divider"></div>
                
                <div class="support-groups-section">
                    <h3>Support Groups</h3>
                    <p>Join a group discussion led by peers with similar experiences.</p>
                    
                    <div class="groups-grid" id="groups-container">
                        <!-- Group cards will be loaded here -->
                    </div>
                </div>
                
                <div class="section-divider"></div>
                
                <div class="become-peer-section">
                    <div class="become-peer-card">
                        <h3>Become a Peer Supporter</h3>
                        <p>Share your experiences and help others on their journey.</p>
                        <button class="primary-btn" onclick="showBecomePeerForm()">Learn More</button>
                    </div>
                </div>
                
                <div id="become-peer-form" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close-btn" onclick="hideBecomePeerForm()">&times;</span>
                        <h3>Become a Peer Supporter</h3>
                        <form id="peer-application-form">
                            <div class="form-group">
                                <label for="peer-experience">What experiences would you like to share with others?</label>
                                <textarea id="peer-experience" rows="4" placeholder="Tell us about your journey..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="peer-topics">What topics are you comfortable discussing?</label>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" name="topics" value="anxiety"> Anxiety</label>
                                    <label><input type="checkbox" name="topics" value="depression"> Depression</label>
                                    <label><input type="checkbox" name="topics" value="stress"> Stress Management</label>
                                    <label><input type="checkbox" name="topics" value="relationships"> Relationships</label>
                                    <label><input type="checkbox" name="topics" value="wellness"> General Wellness</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="peer-availability">Your typical availability</label>
                                <select id="peer-availability">
                                    <option value="">Select availability</option>
                                    <option value="weekday-mornings">Weekday Mornings</option>
                                    <option value="weekday-evenings">Weekday Evenings</option>
                                    <option value="weekends">Weekends</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                            <button type="submit" class="primary-btn">Submit Application</button>
                        </form>
                    </div>
                </div>
            `;
            mainContentArea.appendChild(peerSupportContent);
            
            // Add styles for the peer support section
            addPeerSupportStyles();
            
            // Add event listeners for the peer support functionality
            document.getElementById('peer-application-form').addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Your application has been submitted! We\'ll review it shortly.', 'success');
                hideBecomePeerForm();
            });
            
            // Initialize with sample peers and groups
            loadSamplePeers();
            loadSampleGroups();
        }
        
        // Show peer support content
        peerSupportContent.style.display = 'block';
    } else {
        // Fallback - redirect if necessary
        window.location.href = "peer.html";
    }
}

// Function to add peer support styles
function addPeerSupportStyles() {
    // Check if styles already exist
    if (document.getElementById('peer-support-styles')) return;
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'peer-support-styles';
    styleSheet.textContent = `
        .section-header {
            margin-bottom: 2rem;
        }
        
        .section-header h2 {
            color: #1a1a1a;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        
        .section-header p {
            color: #666;
            font-size: 1rem;
        }
        
        .filter-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
            align-items: center;
        }
        
        .filter-options {
            display: flex;
            gap: 1rem;
        }
        
        .filter-select {
            padding: 0.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            outline: none;
        }
        
        .filter-select:focus {
            border-color: #8a4fff;
        }
        
        .peers-grid, .groups-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .peer-card, .group-card {
            background-color: white;
            border-radius: 0.5rem;
            border: 1px solid rgb(229, 231, 235);
            padding: 1.5rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .peer-card:hover, .group-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .peer-avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #8a4fff;
            margin: 0 auto 1rem;
        }
        
        .peer-name, .group-name {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            text-align: center;
        }
        
        .peer-topics, .group-description {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .peer-availability {
            font-size: 0.8rem;
            color: #4CAF50;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .peer-stats {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.8rem;
            color: #666;
        }
        
        .connect-btn {
            background-color: #8a4fff;
            color: white;
            border: none;
            border-radius: 0.25rem;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s;
        }
        
        .connect-btn:hover {
            background-color: #7b45e0;
        }
        
        .section-divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 2rem 0;
        }
        
        .support-groups-section h3, .become-peer-section h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .support-groups-section p, .become-peer-section p {
            color: #666;
            margin-bottom: 1.5rem;
        }
        
        .become-peer-card {
            background-color: #f5f0ff;
            border: 1px solid #e6d8ff;
            border-radius: 0.5rem;
            padding: 2rem;
            text-align: center;
        }
        
        .become-peer-card h3 {
            color: #8a4fff;
        }
        
        .primary-btn {
            background-color: #8a4fff;
            color: white;
            border: none;
            border-radius: 0.25rem;
            padding: 0.5rem 1.5rem;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .primary-btn:hover {
            background-color: #7b45e0;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 0.5rem;
            padding: 2rem;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            color: #666;
            cursor: pointer;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group textarea, .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 0.25rem;
        }
        
        .form-group textarea:focus, .form-group select:focus {
            border-color: #8a4fff;
            outline: none;
        }
        
        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }
        
        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: normal;
        }
    `;
    document.head.appendChild(styleSheet);
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
// Note: This would usually use export/import syntax, but for basic HTML script inclusion we make it globally available
window.showPeerSupport = showPeerSupport;
window.connectWithPeer = connectWithPeer;
window.joinGroup = joinGroup;
window.showBecomePeerForm = showBecomePeerForm;
window.hideBecomePeerForm = hideBecomePeerForm;