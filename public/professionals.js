// Professionals functionality

// Main function to show professionals content
async function showProfessionals() {
    // Instead of redirecting, load professionals content into the main content area
    const mainContentArea = document.getElementById('main-content');
    
    if (mainContentArea) {
        // First hide all content
        Array.from(mainContentArea.children).forEach(child => {
            child.style.display = 'none';
        });
        
        // Check if professionals content exists, if not load it from template
        let professionalsContent = document.getElementById('professionals-section');
        if (!professionalsContent) {
            // Load the template HTML
            try {
                const response = await fetch('templates/professionals.html');
                const templateHTML = await response.text();
                
                // Create a container and insert the template HTML
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = templateHTML;
                
                // Append the template content to main content area
                while (tempContainer.firstChild) {
                    mainContentArea.appendChild(tempContainer.firstChild);
                }
                
                // Add event handlers for the professionals page
                document.getElementById('professional-search-input').addEventListener('input', function(e) {
                    filterProfessionals();
                });
                
                document.getElementById('specialty-filter').addEventListener('change', function() {
                    filterProfessionals();
                });
                
                document.getElementById('availability-filter').addEventListener('change', function() {
                    filterProfessionals();
                });
                
                document.getElementById('session-type-filter').addEventListener('change', function() {
                    filterProfessionals();
                });
                
                // Load sample professionals
                loadSampleProfessionals();
            } catch (error) {
                console.error('Error loading professionals template:', error);
                showNotification('Failed to load professionals content.', 'error');
            }
        } else {
            // Template is already loaded, just display it
            professionalsContent.style.display = 'block';
        }
        
        // Load the professionals CSS if it's not already loaded
        if (!document.querySelector('link[href="css/professionals.css"]')) {
            const linkElem = document.createElement('link');
            linkElem.rel = 'stylesheet';
            linkElem.href = 'css/professionals.css';
            document.head.appendChild(linkElem);
        }
    } else {
        // Fallback - redirect if necessary
        window.location.href = "professional.html";
    }
}

// Sample data loader functions for professionals
function loadSampleProfessionals() {
    const professionals = [
        {
            id: 'prof1',
            name: 'Dr. Sarah Johnson',
            title: 'Clinical Psychologist',
            avatar: 'SJ',
            rating: 4.9,
            reviews: 124,
            experience: '15+ years',
            education: 'Ph.D. in Clinical Psychology, Stanford University',
            license: 'Licensed Psychologist #PSY123456',
            description: 'Specializing in cognitive behavioral therapy (CBT) and helping clients with anxiety, depression, and stress management.',
            specialties: ['Anxiety', 'Depression', 'Stress', 'Trauma'],
            sessionTypes: ['video', 'in-person'],
            price: 150,
            nextAvailable: 'Today'
        },
        {
            id: 'prof2',
            name: 'Dr. Michael Chen',
            title: 'Psychiatrist',
            avatar: 'MC',
            rating: 4.8,
            reviews: 98,
            experience: '10+ years',
            education: 'M.D. in Psychiatry, Johns Hopkins University',
            license: 'Board Certified Psychiatrist #MD987654',
            description: 'Providing medication management and therapeutic support for various mental health conditions including anxiety, depression, and ADHD.',
            specialties: ['Anxiety', 'Depression', 'ADHD', 'Bipolar Disorder'],
            sessionTypes: ['video', 'phone'],
            price: 200,
            nextAvailable: 'Tomorrow'
        },
        {
            id: 'prof3',
            name: 'Maya Rodriguez, LMFT',
            title: 'Licensed Marriage & Family Therapist',
            avatar: 'MR',
            rating: 4.9,
            reviews: 78,
            experience: '8+ years',
            education: 'M.A. in Clinical Psychology, UCLA',
            license: 'LMFT #MFT45678',
            description: 'Helping individuals, couples, and families improve relationships and communication patterns through evidence-based therapeutic approaches.',
            specialties: ['Relationships', 'Couples Therapy', 'Family Therapy', 'Communication'],
            sessionTypes: ['video', 'in-person', 'phone'],
            price: 130,
            nextAvailable: 'This Week'
        },
        {
            id: 'prof4',
            name: 'James Williams, LCSW',
            title: 'Licensed Clinical Social Worker',
            avatar: 'JW',
            rating: 4.7,
            reviews: 56,
            experience: '12+ years',
            education: 'MSW, University of Michigan',
            license: 'LCSW #SW56789',
            description: 'Specializing in trauma-informed care and helping clients process difficult life experiences.',
            specialties: ['Trauma', 'PTSD', 'Grief', 'Life Transitions'],
            sessionTypes: ['video', 'in-person'],
            price: 120,
            nextAvailable: 'Next Week'
        }
    ];
    
    const professionalsContainer = document.getElementById('professionals-container');
    professionalsContainer.innerHTML = '';
    
    professionals.forEach(prof => {
        const profCard = document.createElement('div');
        profCard.className = 'professional-card';
        profCard.dataset.id = prof.id;
        profCard.dataset.specialties = prof.specialties.join(',').toLowerCase();
        profCard.dataset.sessionTypes = prof.sessionTypes.join(',');
        profCard.dataset.availability = prof.nextAvailable.toLowerCase();
        
        profCard.innerHTML = `
            <div class="professional-header">
                <div class="professional-avatar">${prof.avatar}</div>
                <div class="professional-info">
                    <h4 class="professional-name">${prof.name}</h4>
                    <div class="professional-title">${prof.title}</div>
                    <div class="professional-rating">
                        <span>★ ${prof.rating}</span>
                        <span>(${prof.reviews} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div class="professional-credentials">
                <div class="credential-item">
                    <svg class="credential-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                    </svg>
                    <span>${prof.experience} experience</span>
                </div>
                <div class="credential-item">
                    <svg class="credential-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.169 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                    </svg>
                    <span>${prof.education}</span>
                </div>
                <div class="credential-item">
                    <svg class="credential-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <span>${prof.license}</span>
                </div>
            </div>
            
            <div class="professional-description">${prof.description}</div>
            
            <div class="professional-specialties">
                ${prof.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
            </div>
            
            <div class="professional-footer">
                <div class="session-info">
                    <div>Next available: <span class="text-green-500">${prof.nextAvailable}</span></div>
                    <div class="session-price">$${prof.price} / session</div>
                </div>
                <button class="book-btn" onclick="showAppointmentModal('${prof.id}')">Book Now</button>
            </div>
        `;
        
        professionalsContainer.appendChild(profCard);
    });
}

// Filter professionals based on search and filter options
function filterProfessionals() {
    const searchText = document.getElementById('professional-search-input').value.toLowerCase();
    const specialty = document.getElementById('specialty-filter').value.toLowerCase();
    const availability = document.getElementById('availability-filter').value.toLowerCase();
    const sessionType = document.getElementById('session-type-filter').value.toLowerCase();
    
    const professionals = document.querySelectorAll('.professional-card');
    
    professionals.forEach(prof => {
        const name = prof.querySelector('.professional-name').textContent.toLowerCase();
        const title = prof.querySelector('.professional-title').textContent.toLowerCase();
        const specialties = prof.dataset.specialties;
        const sessionTypes = prof.dataset.sessionTypes;
        const availabilityText = prof.dataset.availability;
        
        const matchesSearch = !searchText || 
            name.includes(searchText) || 
            title.includes(searchText) ||
            specialties.includes(searchText);
            
        const matchesSpecialty = !specialty || specialties.includes(specialty);
        const matchesAvailability = !availability || availabilityText.includes(availability);
        const matchesSessionType = !sessionType || sessionTypes.includes(sessionType);
        
        if (matchesSearch && matchesSpecialty && matchesAvailability && matchesSessionType) {
            prof.style.display = 'flex';
        } else {
            prof.style.display = 'none';
        }
    });
}

// Show the appointment booking modal
function showAppointmentModal(profId) {
    const modal = document.getElementById('appointment-modal');
    const formContent = document.getElementById('appointment-form-content');
    
    // Find the professional data (in a real app, this would come from an API)
    const professionals = [
        {
            id: 'prof1',
            name: 'Dr. Sarah Johnson',
            title: 'Clinical Psychologist',
            price: 150,
            avatar: 'SJ'
        },
        {
            id: 'prof2',
            name: 'Dr. Michael Chen',
            title: 'Psychiatrist',
            price: 200,
            avatar: 'MC'
        },
        {
            id: 'prof3',
            name: 'Maya Rodriguez, LMFT',
            title: 'Licensed Marriage & Family Therapist',
            price: 130,
            avatar: 'MR'
        },
        {
            id: 'prof4',
            name: 'James Williams, LCSW',
            title: 'Licensed Clinical Social Worker',
            price: 120,
            avatar: 'JW'
        }
    ];
    
    const prof = professionals.find(p => p.id === profId);
    
    if (!prof) {
        showNotification('Error loading professional data', 'error');
        return;
    }
    
    // Generate available dates for the next 7 days
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    
    // Generate time slots
    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', 
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];
    
    // Create the appointment form
    formContent.innerHTML = `
        <div class="appointment-form">
            <h3>Book a Session with ${prof.name}</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Select Session Type</label>
                    <div class="session-options">
                        <div class="session-option" data-type="video" onclick="selectSessionType(this)">
                            <div class="session-option-icon">📹</div>
                            <div>Video Call</div>
                        </div>
                        <div class="session-option" data-type="phone" onclick="selectSessionType(this)">
                            <div class="session-option-icon">📞</div>
                            <div>Phone Call</div>
                        </div>
                        <div class="session-option" data-type="in-person" onclick="selectSessionType(this)">
                            <div class="session-option-icon">🏢</div>
                            <div>In Person</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Select a Date</label>
                    <select id="appointment-date" class="filter-select" onchange="updateTimeSlots()">
                        ${dates.map((date, index) => {
                            const formattedDate = date.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                            });
                            return `<option value="${index}">${formattedDate}</option>`;
                        }).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Select a Time</label>
                    <div class="time-slots" id="time-slots-container">
                        ${timeSlots.map(time => `
                            <div class="time-slot" onclick="selectTimeSlot(this)">${time}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="payment-info">
                <div class="payment-title">Session Summary</div>
                <div class="payment-details">
                    <span>Initial Consultation (50 min)</span>
                    <span>$${prof.price}</span>
                </div>
                <div class="payment-total">
                    <span>Total</span>
                    <span>$${prof.price}</span>
                </div>
            </div>
            
            <button class="confirm-booking-btn" onclick="confirmBooking('${prof.id}')">Confirm Booking</button>
        </div>
    `;
    
    // Show the modal
    modal.style.display = 'flex';
}

// Hide the appointment booking modal
function hideAppointmentModal() {
    const modal = document.getElementById('appointment-modal');
    modal.style.display = 'none';
}

// Handle session type selection
function selectSessionType(element) {
    // Remove selected class from all options
    document.querySelectorAll('.session-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
}

// Handle time slot selection
function selectTimeSlot(element) {
    // Remove selected class from all slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selected class to clicked slot
    element.classList.add('selected');
}

// Update time slots based on selected date (simulated availability)
function updateTimeSlots() {
    const dateIndex = document.getElementById('appointment-date').value;
    const timeSlots = document.querySelectorAll('.time-slot');
    
    // Reset all slots to be available
    timeSlots.forEach(slot => {
        slot.style.display = 'block';
        slot.classList.remove('selected');
    });
    
    // Randomly make some slots unavailable based on the date
    const random = new Date().getTime() + parseInt(dateIndex);
    timeSlots.forEach((slot, index) => {
        if ((random + index) % 5 === 0) {
            slot.style.display = 'none';
        }
    });
}

// Confirm booking
function confirmBooking(profId) {
    const sessionType = document.querySelector('.session-option.selected');
    const timeSlot = document.querySelector('.time-slot.selected');
    const dateSelect = document.getElementById('appointment-date');
    
    if (!sessionType) {
        showNotification('Please select a session type', 'error');
        return;
    }
    
    if (!timeSlot) {
        showNotification('Please select a time slot', 'error');
        return;
    }
    
    const dateOption = dateSelect.options[dateSelect.selectedIndex];
    
    showNotification('Appointment booked successfully! You will receive a confirmation email shortly.', 'success');
    hideAppointmentModal();
}

// Export the functions for use in script.js
window.showProfessionals = showProfessionals;
window.hideAppointmentModal = hideAppointmentModal;
window.selectSessionType = selectSessionType;
window.selectTimeSlot = selectTimeSlot;
window.confirmBooking = confirmBooking;
window.updateTimeSlots = updateTimeSlots;
window.filterProfessionals = filterProfessionals;
window.showAppointmentModal = showAppointmentModal;
