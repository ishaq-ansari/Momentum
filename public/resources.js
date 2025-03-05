// Mental Health Resources functionality

// Main function to show mental health resources
async function showResources() {
    // Load resources content into the main content area
    const mainContentArea = document.getElementById('main-content');
    
    if (mainContentArea) {
        // First hide all content
        Array.from(mainContentArea.children).forEach(child => {
            child.style.display = 'none';
        });
        
        // Check if resources content exists, if not create it
        let resourcesContent = document.getElementById('resources-section');
        if (!resourcesContent) {
            resourcesContent = document.createElement('div');
            resourcesContent.id = 'resources-section';
            resourcesContent.innerHTML = `
                <div class="section-header">
                    <h2>Mental Health Resources</h2>
                    <p>Find professional support and services near you.</p>
                </div>
                
                <div class="resource-search-container">
                    <div class="search-box">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search by keyword..." class="search-input" id="resource-search-input">
                    </div>
                    
                    <div class="filter-options">
                        <select id="country-filter" class="filter-select">
                            <option value="">Select Country</option>
                            <option value="us">United States</option>
                            <option value="ca">Canada</option>
                            <option value="uk">United Kingdom</option>
                            <option value="au">Australia</option>
                            <!-- More countries can be added -->
                        </select>
                        
                        <select id="state-filter" class="filter-select" disabled>
                            <option value="">Select State/Province</option>
                            <!-- States will be populated based on country selection -->
                        </select>
                        
                        <select id="resource-type-filter" class="filter-select">
                            <option value="">All Resource Types</option>
                            <option value="crisis">Crisis Support</option>
                            <option value="therapy">Therapy Services</option>
                            <option value="support-group">Support Groups</option>
                            <option value="inpatient">Inpatient Care</option>
                            <option value="community">Community Services</option>
                        </select>
                    </div>
                    
                    <div class="location-finder">
                        <button id="use-my-location" class="secondary-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Use My Location
                        </button>
                    </div>
                </div>
                
                <div class="resources-results-container">
                    <div class="results-header">
                        <h3>Nearest Resources</h3>
                        <div class="results-count">Loading resources...</div>
                    </div>
                    
                    <div class="resources-grid" id="resources-container">
                        <!-- Resource cards will be loaded here -->
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                        </div>
                    </div>
                </div>
                
                <div class="resource-map-container">
                    <h3>Resources Map</h3>
                    <div id="resources-map" class="map-container">
                        <!-- Map will be loaded here -->
                        <div class="map-placeholder">
                            Map loading...
                        </div>
                    </div>
                </div>
                
                <div class="section-divider"></div>
                
                <div class="emergency-resources">
                    <div class="emergency-card">
                        <h3>Need Immediate Help?</h3>
                        <p>If you or someone you know is in crisis, please use these emergency resources:</p>
                        <div class="emergency-contacts">
                            <div class="emergency-contact-item">
                                <strong>National Suicide Prevention Lifeline:</strong> 
                                <a href="tel:988">988</a> or <a href="tel:1-800-273-8255">1-800-273-8255</a>
                            </div>
                            <div class="emergency-contact-item">
                                <strong>Crisis Text Line:</strong> 
                                Text HOME to <a href="sms:741741">741741</a>
                            </div>
                            <div class="emergency-contact-item">
                                <strong>Emergency Services:</strong> 
                                <a href="tel:911">911</a> (US) or local emergency number
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="section-divider"></div>
                
                <div class="resource-submission">
                    <div class="submission-card">
                        <h3>Know a Resource?</h3>
                        <p>Help us build our directory by submitting mental health resources in your area.</p>
                        <button class="primary-btn" onclick="showResourceSubmissionForm()">Submit a Resource</button>
                    </div>
                </div>
                
                <div id="resource-submission-form" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close-btn" onclick="hideResourceSubmissionForm()">&times;</span>
                        <h3>Submit a Mental Health Resource</h3>
                        <form id="resource-submission-form-element">
                            <div class="form-group">
                                <label for="resource-name">Resource Name*</label>
                                <input type="text" id="resource-name" required>
                            </div>
                            <div class="form-group">
                                <label for="resource-type">Resource Type*</label>
                                <select id="resource-type" required>
                                    <option value="">Select Type</option>
                                    <option value="crisis">Crisis Support</option>
                                    <option value="therapy">Therapy Services</option>
                                    <option value="support-group">Support Groups</option>
                                    <option value="inpatient">Inpatient Care</option>
                                    <option value="community">Community Services</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="resource-description">Description*</label>
                                <textarea id="resource-description" rows="3" required placeholder="Briefly describe the services offered..."></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group half-width">
                                    <label for="resource-country">Country*</label>
                                    <select id="resource-country" required>
                                        <option value="">Select Country</option>
                                        <option value="us">United States</option>
                                        <option value="ca">Canada</option>
                                        <option value="uk">United Kingdom</option>
                                        <option value="au">Australia</option>
                                    </select>
                                </div>
                                <div class="form-group half-width">
                                    <label for="resource-state">State/Province*</label>
                                    <select id="resource-state" required disabled>
                                        <option value="">Select State/Province</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="resource-address">Address*</label>
                                <input type="text" id="resource-address" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group half-width">
                                    <label for="resource-phone">Phone Number</label>
                                    <input type="tel" id="resource-phone">
                                </div>
                                <div class="form-group half-width">
                                    <label for="resource-website">Website</label>
                                    <input type="url" id="resource-website" placeholder="https://">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="submitter-email">Your Email*</label>
                                <input type="email" id="submitter-email" required>
                                <small>We may contact you to verify this information.</small>
                            </div>
                            <button type="submit" class="primary-btn">Submit Resource</button>
                        </form>
                    </div>
                </div>
            `;
            mainContentArea.appendChild(resourcesContent);
            
            // Add styles for the resources section
            addResourcesStyles();
            
            // Add event listeners for the resources functionality
            document.getElementById('country-filter').addEventListener('change', function(e) {
                populateStatesDropdown(e.target.value);
            });
            
            document.getElementById('resource-country').addEventListener('change', function(e) {
                populateSubmissionStatesDropdown(e.target.value);
            });
            
            document.getElementById('resource-search-input').addEventListener('input', filterResources);
            document.getElementById('state-filter').addEventListener('change', filterResources);
            document.getElementById('resource-type-filter').addEventListener('change', filterResources);
            
            document.getElementById('use-my-location').addEventListener('click', getUserLocation);
            
            document.getElementById('resource-submission-form-element').addEventListener('submit', function(e) {
                e.preventDefault();
                submitResourceForm();
            });
            
            // Initialize the resources map
            initializeResourcesMap();
            
            // Load sample resources data (in a real app, this would fetch from an API)
            loadResourcesData();
        }
        
        // Show resources content
        resourcesContent.style.display = 'block';
    } else {
        // Fallback - redirect if necessary
        window.location.href = "resources.html";
    }
}

// Function to add resources styles
function addResourcesStyles() {
    // Check if styles already exist
    if (document.getElementById('resources-styles')) return;
    
    const styleSheet = document.createElement("style");
    styleSheet.id = 'resources-styles';
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
        
        .resource-search-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
            align-items: center;
            background-color: #f8f5ff;
            padding: 1.5rem;
            border-radius: 0.5rem;
        }
        
        .search-box {
            position: relative;
            flex: 1;
            min-width: 250px;
        }
        
        .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #8a4fff;
        }
        
        .search-input {
            width: 100%;
            padding: 0.75rem 0.75rem 0.75rem 2.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            outline: none;
            font-size: 0.9rem;
        }
        
        .search-input:focus {
            border-color: #8a4fff;
        }
        
        .filter-options {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            flex: 2;
            min-width: 300px;
        }
        
        .filter-select {
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            outline: none;
            flex: 1;
            min-width: 120px;
            font-size: 0.9rem;
        }
        
        .filter-select:focus {
            border-color: #8a4fff;
        }
        
        .filter-select:disabled {
            background-color: #f5f5f5;
            cursor: not-allowed;
        }
        
        .location-finder {
            display: flex;
            align-items: center;
        }
        
        .secondary-btn {
            background-color: #e6deff;
            color: #8a4fff;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .secondary-btn:hover {
            background-color: #d9caff;
        }
        
        .resources-results-container {
            margin-bottom: 2rem;
        }
        
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .results-header h3 {
            font-size: 1.3rem;
            color: #333;
        }
        
        .results-count {
            color: #666;
            font-size: 0.9rem;
        }
        
        .resources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            position: relative;
            min-height: 200px;
        }
        
        .resource-card {
            background-color: white;
            border-radius: 0.5rem;
            border: 1px solid rgb(229, 231, 235);
            padding: 1.5rem;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
        }
        
        .resource-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .resource-type-tag {
            display: inline-block;
            padding: 0.3rem 0.6rem;
            background-color: #f0f0f0;
            color: #666;
            border-radius: 1rem;
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
        }
        
        .crisis-tag { background-color: #ffecef; color: #d32f2f; }
        .therapy-tag { background-color: #e8f4fd; color: #1976d2; }
        .support-group-tag { background-color: #e8f5e9; color: #388e3c; }
        .inpatient-tag { background-color: #fff3e0; color: #f57c00; }
        .community-tag { background-color: #f3e5f5; color: #7b1fa2; }
        
        .resource-name {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .resource-description {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 1rem;
            flex-grow: 1;
        }
        
        .resource-address {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .resource-address svg, 
        .resource-phone svg,
        .resource-website svg {
            flex-shrink: 0;
            margin-top: 0.2rem;
        }
        
        .resource-phone, .resource-website {
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .resource-phone a, .resource-website a {
            color: #8a4fff;
            text-decoration: none;
        }
        
        .resource-phone a:hover, .resource-website a:hover {
            text-decoration: underline;
        }
        
        .resource-distance {
            font-size: 0.8rem;
            color: #8a4fff;
            margin-bottom: 1rem;
        }
        
        .resource-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .view-on-map-btn {
            background-color: #e6deff;
            color: #8a4fff;
            border: none;
            flex: 1;
            border-radius: 0.25rem;
            padding: 0.5rem;
            font-size: 0.85rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .view-on-map-btn:hover {
            background-color: #d9caff;
        }
        
        .get-directions-btn {
            background-color: #8a4fff;
            color: white;
            border: none;
            flex: 1;
            border-radius: 0.25rem;
            padding: 0.5rem;
            font-size: 0.85rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .get-directions-btn:hover {
            background-color: #7b45e0;
        }
        
        .loading-spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(138, 79, 255, 0.2);
            border-radius: 50%;
            border-top-color: #8a4fff;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .resource-map-container {
            margin-bottom: 2rem;
        }
        
        .resource-map-container h3 {
            font-size: 1.3rem;
            color: #333;
            margin-bottom: 1rem;
        }
        
        .map-container {
            height: 400px;
            background-color: #f0f0f0;
            border-radius: 0.5rem;
            position: relative;
            overflow: hidden;
        }
        
        .map-placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #666;
            font-size: 1.2rem;
        }
        
        .section-divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 2rem 0;
        }
        
        .emergency-resources {
            margin-bottom: 2rem;
        }
        
        .emergency-card {
            background-color: #fff5f5;
            border: 1px solid #ffcccc;
            border-left: 4px solid #d32f2f;
            border-radius: 0.5rem;
            padding: 1.5rem;
        }
        
        .emergency-card h3 {
            color: #d32f2f;
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
        }
        
        .emergency-contacts {
            margin-top: 1rem;
        }
        
        .emergency-contact-item {
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
        }
        
        .emergency-contact-item a {
            color: #d32f2f;
            text-decoration: none;
            font-weight: 600;
        }
        
        .emergency-contact-item a:hover {
            text-decoration: underline;
        }
        
        .submission-card {
            background-color: #f5f0ff;
            border: 1px solid #e6d8ff;
            border-radius: 0.5rem;
            padding: 2rem;
            text-align: center;
        }
        
        .submission-card h3 {
            color: #8a4fff;
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
        }
        
        .primary-btn {
            background-color: #8a4fff;
            color: white;
            border: none;
            border-radius: 0.25rem;
            padding: 0.75rem 1.5rem;
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
        
        .form-row {
            display: flex;
            gap: 1rem;
            margin-bottom: 0;
        }
        
        .half-width {
            flex: 1;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input, 
        .form-group textarea, 
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 0.25rem;
            font-size: 0.9rem;
        }
        
        .form-group input:focus, 
        .form-group textarea:focus, 
        .form-group select:focus {
            border-color: #8a4fff;
            outline: none;
        }
        
        .form-group small {
            display: block;
            margin-top: 0.25rem;
            color: #666;
            font-size: 0.8rem;
        }
        
        /* No results message */
        .no-results {
            grid-column: 1 / -1;
            padding: 2rem;
            text-align: center;
            background-color: #f5f5f5;
            border-radius: 0.5rem;
            color: #666;
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
            .resource-search-container {
                flex-direction: column;
                align-items: stretch;
            }
            
            .filter-options {
                flex-direction: column;
            }
            
            .form-row {
                flex-direction: column;
                gap: 1.5rem;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// Function to populate states dropdown based on country selection
function populateStatesDropdown(country) {
    const statesDropdown = document.getElementById('state-filter');
    statesDropdown.innerHTML = '<option value="">Select State/Province</option>';
    statesDropdown.disabled = true;
    
    if (country) {
        // Get states based on country
        const states = getStatesByCountry(country);
        
        if (states && states.length > 0) {
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.code;
                option.textContent = state.name;
                statesDropdown.appendChild(option);
            });
            statesDropdown.disabled = false;
        }
    }
    
    // Trigger resource filtering
    filterResources();
}

// Function to populate states dropdown in submission form
function populateSubmissionStatesDropdown(country) {
    const statesDropdown = document.getElementById('resource-state');
    statesDropdown.innerHTML = '<option value="">Select State/Province</option>';
    statesDropdown.disabled = true;
    
    if (country) {
        // Get states based on country
        const states = getStatesByCountry(country);
        
        if (states && states.length > 0) {
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.code;
                option.textContent = state.name;
                statesDropdown.appendChild(option);
            });
            statesDropdown.disabled = false;
        }
    }
}

// Helper function to get states by country
function getStatesByCountry(country) {
    // This would typically come from an API or a larger dataset
    // For now, just returning sample data for US
    const statesByCountry = {
        'us': [
            { code: 'al', name: 'Alabama' },
            { code: 'ak', name: 'Alaska' },
            { code: 'az', name: 'Arizona' },
            { code: 'ar', name: 'Arkansas' },
            { code: 'ca', name: 'California' },
            { code: 'co', name: 'Colorado' },
            { code: 'ct', name: 'Connecticut' },
            // Add more US states...
        ],
        'ca': [
            { code: 'ab', name: 'Alberta' },
            { code: 'bc', name: 'British Columbia' },
            { code: 'mb', name: 'Manitoba' },
            // Add more Canadian provinces...
        ],
        'uk': [
            { code: 'eng', name: 'England' },
            { code: 'sct', name: 'Scotland' },
            { code: 'wls', name: 'Wales' },
            { code: 'nir', name: 'Northern Ireland' }
        ],
        'au': [
            { code: 'nsw', name: 'New South Wales' },
            { code: 'qld', name: 'Queensland' },
            { code: 'sa', name: 'South Australia' },
            // Add more Australian states...
        ]
    };
    
    return statesByCountry[country] || [];
}

// Function to initialize the resources map
function initializeResourcesMap() {
    // In a real application, this would initialize a map service like Google Maps or Leaflet
    // For now, we'll just display a placeholder
    console.log('Map would be initialized here with API integration');
    
    // Simulate map loading delay
    setTimeout(() => {
        const mapContainer = document.getElementById('resources-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <p>Map API would be integrated here to show resource locations.</p>
                    <p>In a production app, this would use Google Maps, Mapbox, or similar service.</p>
                </div>
            `;
        }
    }, 1500);
}

// Function to get user's location
function getUserLocation() {
    const locationButton = document.getElementById('use-my-location');
    locationButton.disabled = true;
    locationButton.innerHTML = `
        <div class="spinner" style="width: 16px; height: 16px;"></div>
        Getting location...
    `;
    
    // In a real application, this would use the browser's Geolocation API
    // For demo purposes, we'll simulate a location fetch
    setTimeout(() => {
        // Simulate successful location fetch
        const userLocation = {
            latitude: 37.7749,
            longitude: -122.4194,
            address: 'San Francisco, CA'
        };
        
        // Update the UI to show we're using the location
        locationButton.disabled = false;
        locationButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Using: ${userLocation.address}
        `;
        
        // In a real app, you would update the map to center on this location
        // and sort resources by proximity to this location
        loadResourcesByLocation(userLocation);
        
        // Show a notification
        showNotification('Using your current location to find nearby resources.', 'success');
    }, 1500);
}

// Function to load resources data
function loadResourcesData() {
    // In a real application, this would fetch data from an API
    // For now, let's simulate an API call with sample data
    const resourcesContainer = document.getElementById('resources-container');
    const resultsCount = document.querySelector('.results-count');
    
    if (resourcesContainer) {
        // Show loading spinner
        resourcesContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
        `;
        resultsCount.textContent = 'Loading resources...';
        
        // Simulate API delay
        setTimeout(() => {
            // Get sample data
            const resources = getSampleResources();
            
            // Update results count
            resultsCount.textContent = `${resources.length} resources found`;
            
            // Display the resources
            displayResources(resources);
            
            // Initialize the map with these locations
            // In a real app, you would pass these locations to your map API
        }, 1500);
    }
}

// Function to load resources by user location
// Function to load resources by user location
function loadResourcesByLocation(location) {
    // In a real application, this would fetch data from an API based on coordinates
    // For now, let's simulate an API call with sample data
    const resourcesContainer = document.getElementById('resources-container');
    const resultsCount = document.querySelector('.results-count');
    
    if (resourcesContainer) {
        // Show loading spinner
        resourcesContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
        `;
        resultsCount.textContent = 'Finding resources near you...';
        
        // Simulate API delay
        setTimeout(() => {
            // Get sample data
            const resources = getSampleResources();
            
            // Sort resources by distance from user location
            // In a real app, this would calculate actual distances
            resources.forEach(resource => {
                // Simulate distance calculation (random for demo)
                const distance = Math.random() * 20;
                resource.distance = parseFloat(distance.toFixed(1));
            });
            
            // Sort by distance
            resources.sort((a, b) => a.distance - b.distance);
            
            // Update results count
            resultsCount.textContent = `${resources.length} resources found near you`;
            
            // Display the resources
            displayResources(resources);
            
            // Update map to center on user location
            // In a real app, you would update your map API
            updateMapWithUserLocation(location);
            
            // Show a success notification
            showNotification('Resources sorted by distance from your location.', 'success');
        }, 1500);
    }
}

// Function to display resources in the container
function displayResources(resources) {
    const resourcesContainer = document.getElementById('resources-container');
    
    if (resourcesContainer) {
        if (resources.length === 0) {
            resourcesContainer.innerHTML = `
                <div class="no-results">
                    <p>No resources found that match your criteria.</p>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }
        
        // Clear the container
        resourcesContainer.innerHTML = '';
        
        // Add each resource as a card
        resources.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.dataset.id = resource.id;
            
            // Determine tag class based on resource type
            const tagClass = `${resource.type}-tag`;
            
            // Format type label for display
            const typeLabel = formatTypeLabel(resource.type);
            
            // Create card HTML
            card.innerHTML = `
                <div class="resource-type-tag ${tagClass}">${typeLabel}</div>
                <h3 class="resource-name">${resource.name}</h3>
                <p class="resource-description">${resource.description}</p>
                
                ${resource.distance ? `<div class="resource-distance">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a4fff" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    ${resource.distance} miles away
                </div>` : ''}
                
                <div class="resource-address">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                        <path d="M12 2 C8 2 4 5 4 10 C4 15 12 22 12 22 C12 22 20 15 20 10 C20 5 16 2 12 2 Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${resource.address}, ${resource.city}, ${resource.state} ${resource.zip}</span>
                </div>
                
                ${resource.phone ? `<div class="resource-phone">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <a href="tel:${resource.phone}">${formatPhoneNumber(resource.phone)}</a>
                </div>` : ''}
                
                ${resource.website ? `<div class="resource-website">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <a href="${resource.website}" target="_blank" rel="noopener">Visit Website</a>
                </div>` : ''}
                
                <div class="resource-actions">
                    <button class="view-on-map-btn" onclick="viewResourceOnMap('${resource.id}')">View on Map</button>
                    <button class="get-directions-btn" onclick="getDirectionsToResource('${resource.id}')">Get Directions</button>
                </div>
            `;
            
            resourcesContainer.appendChild(card);
        });
    }
}

// Function to format type labels
function formatTypeLabel(type) {
    const typeLabels = {
        'crisis': 'Crisis Support',
        'therapy': 'Therapy Services',
        'support-group': 'Support Group',
        'inpatient': 'Inpatient Care',
        'community': 'Community Services'
    };
    
    return typeLabels[type] || type;
}

// Function to format phone numbers
function formatPhoneNumber(phone) {
    // Simple formatting for US phone numbers
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Function to filter resources based on search input and filters
function filterResources() {
    const searchInput = document.getElementById('resource-search-input').value.toLowerCase();
    const countryFilter = document.getElementById('country-filter').value;
    const stateFilter = document.getElementById('state-filter').value;
    const typeFilter = document.getElementById('resource-type-filter').value;
    
    const resourcesContainer = document.getElementById('resources-container');
    const resultsCount = document.querySelector('.results-count');
    
    if (resourcesContainer) {
        // Show loading spinner
        resourcesContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
        `;
        resultsCount.textContent = 'Filtering resources...';
        
        // Simulate API delay
        setTimeout(() => {
            // Get sample data
            let resources = getSampleResources();
            
            // Apply filters
            if (countryFilter) {
                resources = resources.filter(resource => resource.country === countryFilter);
            }
            
            if (stateFilter) {
                resources = resources.filter(resource => resource.state.toLowerCase() === stateFilter);
            }
            
            if (typeFilter) {
                resources = resources.filter(resource => resource.type === typeFilter);
            }
            
            if (searchInput) {
                resources = resources.filter(resource => 
                    resource.name.toLowerCase().includes(searchInput) ||
                    resource.description.toLowerCase().includes(searchInput) ||
                    resource.address.toLowerCase().includes(searchInput) ||
                    resource.city.toLowerCase().includes(searchInput)
                );
            }
            
            // Update results count
            resultsCount.textContent = `${resources.length} resources found`;
            
            // Display the resources
            displayResources(resources);
        }, 500);
    }
}

// Function to update map with user location
function updateMapWithUserLocation(location) {
    // In a real app, this would use a map API to center on the user's location
    console.log(`Map would center on lat: ${location.latitude}, lng: ${location.longitude}`);
    
    // Update the map placeholder for demo purposes
    const mapContainer = document.getElementById('resources-map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <p>Map showing resources near: ${location.address}</p>
                <p>In a production app, this would display an interactive map.</p>
            </div>
        `;
    }
}

// Function to view a resource on the map
function viewResourceOnMap(resourceId) {
    // In a real app, this would pan and zoom the map to the resource
    console.log(`Showing resource ${resourceId} on map`);
    
    // Get the resource data
    const resources = getSampleResources();
    const resource = resources.find(r => r.id === resourceId);
    
    if (resource) {
        // Show a notification
        showNotification(`Showing ${resource.name} on map`, 'info');
        
        // Scroll to map
        document.getElementById('resources-map').scrollIntoView({ behavior: 'smooth' });
        
        // Update map placeholder for demo
        const mapContainer = document.getElementById('resources-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <h4>${resource.name}</h4>
                    <p>${resource.address}, ${resource.city}, ${resource.state}</p>
                    <p>In a production app, this location would be highlighted on an interactive map.</p>
                </div>
            `;
        }
    }
}

// Function to get directions to a resource
function getDirectionsToResource(resourceId) {
    // In a real app, this would open a maps application or provide directions
    const resources = getSampleResources();
    const resource = resources.find(r => r.id === resourceId);
    
    if (resource) {
        // Create a maps URL (Google Maps in this example)
        const address = encodeURIComponent(`${resource.address}, ${resource.city}, ${resource.state} ${resource.zip}`);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
        
        // Open in a new tab
        window.open(mapsUrl, '_blank');
        
        // Show a notification
        showNotification(`Opening directions to ${resource.name}`, 'success');
    }
}

// Function to show the resource submission form
function showResourceSubmissionForm() {
    const modal = document.getElementById('resource-submission-form');
    if (modal) {
        modal.style.display = 'flex';
        
        // Add event listener to close when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideResourceSubmissionForm();
            }
        });
    }
}

// Function to hide the resource submission form
function hideResourceSubmissionForm() {
    const modal = document.getElementById('resource-submission-form');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to submit the resource form
function submitResourceForm() {
    // Get form values
    const name = document.getElementById('resource-name').value;
    const type = document.getElementById('resource-type').value;
    const description = document.getElementById('resource-description').value;
    const country = document.getElementById('resource-country').value;
    const state = document.getElementById('resource-state').value;
    const address = document.getElementById('resource-address').value;
    const phone = document.getElementById('resource-phone').value;
    const website = document.getElementById('resource-website').value;
    const email = document.getElementById('submitter-email').value;
    
    // In a real app, this would send the data to an API
    console.log('Submitting resource:', {
        name,
        type,
        description,
        country,
        state,
        address,
        phone,
        website,
        submitterEmail: email
    });
    
    // Show a success notification
    showNotification('Thank you! Your resource submission is being reviewed.', 'success');
    
    // Clear the form
    document.getElementById('resource-submission-form-element').reset();
    
    // Close the modal
    hideResourceSubmissionForm();
}

// Function to show a notification
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}-notification`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    notification.style.cssText = `
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        overflow: hidden;
        width: 300px;
        opacity: 0;
        transform: translateX(20px);
        transition: opacity 0.3s, transform 0.3s;
    `;
    
    // Add type-specific styling
    if (type === 'success') {
        notification.style.borderLeft = '4px solid #4CAF50';
    } else if (type === 'error') {
        notification.style.borderLeft = '4px solid #F44336';
    } else if (type === 'warning') {
        notification.style.borderLeft = '4px solid #FF9800';
    } else {
        notification.style.borderLeft = '4px solid #2196F3';
    }
    
    // Style notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;
    
    // Style close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Add event listener to close button
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

// Helper function to close a notification
function closeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Function to get sample resources data
function getSampleResources() {
    return [
        {
            id: 'res-1',
            name: 'City Mental Health Crisis Center',
            type: 'crisis',
            description: 'A 24/7 crisis intervention center providing emergency mental health services and assessments.',
            country: 'us',
            state: 'CA',
            city: 'San Francisco',
            address: '1234 Market Street',
            zip: '94103',
            phone: '4155551234',
            website: 'https://example.com/crisis-center',
            coordinates: {
                lat: 37.775,
                lng: -122.413
            }
        },
        {
            id: 'res-2',
            name: 'Harmony Therapy Associates',
            type: 'therapy',
            description: 'Group practice offering individual, couples, and family therapy with sliding scale payment options.',
            country: 'us',
            state: 'CA',
            city: 'San Francisco',
            address: '560 Mission Street',
            zip: '94105',
            phone: '4155552345',
            website: 'https://example.com/harmony-therapy',
            coordinates: {
                lat: 37.788,
                lng: -122.399
            }
        },
        {
            id: 'res-3',
            name: 'Recovery Support Network',
            type: 'support-group',
            description: 'Peer-led support groups for anxiety, depression, and substance use recovery. Free to attend.',
            country: 'us',
            state: 'CA',
            city: 'Oakland',
            address: '2501 Broadway',
            zip: '94612',
            phone: '5105551234',
            website: 'https://example.com/recovery-network',
            coordinates: {
                lat: 37.812,
                lng: -122.251
            }
        },
        {
            id: 'res-4',
            name: 'Golden Gate Behavioral Health Hospital',
            type: 'inpatient',
            description: 'Full-service psychiatric hospital providing inpatient and partial hospitalization programs.',
            country: 'us',
            state: 'CA',
            city: 'San Francisco',
            address: '3600 Geary Blvd',
            zip: '94118',
            phone: '4155559876',
            website: 'https://example.com/ggbh',
            coordinates: {
                lat: 37.781,
                lng: -122.453
            }
        },
        {
            id: 'res-5',
            name: 'Community Wellness Collective',
            type: 'community',
            description: 'Neighborhood center offering free mental health workshops, wellness activities, and resource navigation.',
            country: 'us',
            state: 'CA',
            city: 'San Francisco',
            address: '1020 Valencia Street',
            zip: '94110',
            phone: '4155554321',
            website: 'https://example.com/wellness-collective',
            coordinates: {
                lat: 37.756,
                lng: -122.421
            }
        },
        {
            id: 'res-6',
            name: 'East Bay Crisis Response Team',
            type: 'crisis',
            description: 'Mobile crisis unit providing rapid response to mental health emergencies.',
            country: 'us',
            state: 'CA',
            city: 'Berkeley',
            address: '2640 Martin Luther King Jr. Way',
            zip: '94704',
            phone: '5105557890',
            website: 'https://example.com/eb-crisis',
            coordinates: {
                lat: 37.862,
                lng: -122.271
            }
        },
        {
            id: 'res-7',
            name: 'Inner Calm Counseling Center',
            type: 'therapy',
            description: 'Specialized therapy services for trauma, PTSD, and anxiety disorders.',
            country: 'us',
            state: 'CA',
            city: 'San Jose',
            address: '1 North Market Street',
            zip: '95113',
            phone: '4085551234',
            website: 'https://example.com/inner-calm',
            coordinates: {
                lat: 37.337,
                lng: -121.893
            }
        },
        {
            id: 'res-8',
            name: 'Bay Area Grief Support Coalition',
            type: 'support-group',
            description: 'Support groups specifically for those dealing with loss, grief, and bereavement.',
            country: 'us',
            state: 'CA',
            city: 'San Rafael',
            address: '1515 Fourth Street',
            zip: '94901',
            phone: '4155550987',
            website: 'https://example.com/grief-support',
            coordinates: {
                lat: 37.973,
                lng: -122.531
            }
        }
    ];
}

// // Add this function to the main application initialization
// function initMentalHealthResources() {
//     // Add event listener to resources link/button
//     const resourcesLink = document.getElementById('resources-link');
//     if (resourcesLink) {
//         resourcesLink.addEventListener('click', function(e) {
//             e.preventDefault();
//             showResources();
//         });
//     }
    
//     // Check if we should show resources on page load (e.g., based on URL)
//     if (window.location.hash === '#resources') {
//         showResources();
//     }
// }

// // Initialize when the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', initMentalHealthResources);



// Export the resources function for use in script.js
// Note: This would usually use export/import syntax, but for basic HTML script inclusion we make it globally available
window.showResources = showResources;