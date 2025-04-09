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
        
        // Check if resources content exists, if not load it from template
        let resourcesContent = document.getElementById('resources-section');
        if (!resourcesContent) {
            // Load the template HTML
            try {
                const response = await fetch('templates/resources.html');
                const templateHTML = await response.text();
                
                // Create a container and insert the template HTML
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = templateHTML;
                
                // Append the template content to main content area
                while (tempContainer.firstChild) {
                    mainContentArea.appendChild(tempContainer.firstChild);
                }
                
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
            } catch (error) {
                console.error('Error loading resources template:', error);
                showNotification('Failed to load resources content.', 'error');
            }
        } else {
            // Template is already loaded, just display it
            resourcesContent.style.display = 'block';
        }
        
        // Load the resources CSS if it's not already loaded
        if (!document.querySelector('link[href="css/resources.css"]')) {
            const linkElem = document.createElement('link');
            linkElem.rel = 'stylesheet';
            linkElem.href = 'css/resources.css';
            document.head.appendChild(linkElem);
        }
    } else {
        // Fallback - redirect if necessary
        window.location.href = "resources.html";
    }
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

// Export the resources function for use in script.js
window.showResources = showResources;
window.viewResourceOnMap = viewResourceOnMap;
window.getDirectionsToResource = getDirectionsToResource;
window.showResourceSubmissionForm = showResourceSubmissionForm;
window.hideResourceSubmissionForm = hideResourceSubmissionForm;