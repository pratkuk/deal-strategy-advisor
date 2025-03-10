// calendar.js - Calendar app functionality

const calendarApp = {
    // Track initialization state
    initialized: false,
    
    // Current date tracking
    currentDate: new Date(),
    
    // Calendar event data (would come from API in real implementation)
    events: [
        {
            id: 'event-1',
            title: 'Acme Corp Technical Discussion',
            date: '2024-03-18',
            time: '10:00 AM - 11:00 AM',
            type: 'deal-meeting',
            location: 'Zoom',
            description: 'Technical discussion with Acme Corp IT team to review integration requirements.',
            attendees: ['John Smith', 'Sarah Jones', 'Your Team'],
            deal: 'deal-1'
        },
        {
            id: 'event-2',
            title: 'Weekly Sales Team Meeting',
            date: '2024-03-20',
            time: '9:00 AM - 10:00 AM',
            type: 'internal-meeting',
            location: 'Conference Room B',
            description: 'Regular weekly sales team meeting to review pipeline and discuss strategies.',
            attendees: ['Sales Team']
        },
        {
            id: 'event-3',
            title: 'TechStart Contract Review Call',
            date: '2024-03-21',
            time: '2:00 PM - 3:00 PM',
            type: 'deal-meeting',
            location: 'Microsoft Teams',
            description: 'Call with TechStart legal team to discuss contract terms.',
            attendees: ['Mike Johnson', 'Lisa Wong', 'Legal Counsel'],
            deal: 'deal-2'
        },
        {
            id: 'event-4',
            title: 'GlobalRetail Implementation Planning',
            date: '2024-03-22',
            time: '11:00 AM - 12:30 PM',
            type: 'deal-meeting',
            location: 'On-site at GlobalRetail HQ',
            description: 'Planning session for the POS upgrade implementation.',
            attendees: ['Robert Chen', 'Amanda Miller', 'Implementation Team'],
            deal: 'deal-3'
        },
        {
            id: 'event-5',
            title: 'Customer Success Review',
            date: '2024-03-15',
            time: '1:00 PM - 2:00 PM',
            type: 'internal-meeting',
            location: 'Conference Room A',
            description: 'Monthly review of customer success metrics and support cases.',
            attendees: ['Customer Success Team', 'Support Team']
        },
        {
            id: 'event-6',
            title: 'Call with Acme Corp Decision Maker',
            date: '2024-03-25',
            time: '9:30 AM - 10:00 AM',
            type: 'customer-call',
            location: 'Phone',
            description: 'Follow-up call with primary decision maker to address concerns.',
            attendees: ['John Smith'],
            deal: 'deal-1'
        }
    ],
    
    // Filter states
    filters: {
        'deal-meeting': true,
        'internal-meeting': true,
        'customer-call': true
    },
    
    // Initialize Calendar app
    initialize: function() {
        if (this.initialized) return;
        
        this.setupEventListeners();
        this.renderCalendar();
        
        this.initialized = true;
        console.log('Calendar app initialized');
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Month navigation
        const prevMonthBtn = document.querySelector('.prev-month');
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.navigateMonth(-1);
            });
        }
        
        const nextMonthBtn = document.querySelector('.next-month');
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.navigateMonth(1);
            });
        }
        
        // Event filters
        document.querySelectorAll('.calendar-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filterType = e.target.parentNode.textContent.trim().toLowerCase().replace(/\s+/g, '-');
                this.filters[filterType] = e.target.checked;
                this.renderCalendar();
            });
        });
        
        // Add event button
        const addEventBtn = document.querySelector('.quick-add button');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                this.showAddEventModal();
            });
        }
        
        // Listen for deal selection events
        document.addEventListener('dealSelected', (e) => {
            // Highlight events related to selected deal
            this.highlightDealEvents(e.detail.dealId);
        });
    },
    
    // Render the calendar for current month
    renderCalendar: function() {
        // Update month display
        const monthYearDisplay = document.querySelector('.calendar-navigation h2');
        if (monthYearDisplay) {
            monthYearDisplay.textContent = this.formatMonthYear(this.currentDate);
        }
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        
        // Calculate days from previous month to display
        const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Calculate days from next month to display
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;
        
        // Get calendar grid container
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;
        
        // Clear existing calendar
        calendarGrid.innerHTML = '';
        
        // Add days from previous month
        const prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
        for (let i = firstDayIndex; i > 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day outside-month';
            day.innerHTML = `<div class="date">${prevMonthLastDay - i + 1}</div>`;
            calendarGrid.appendChild(day);
        }
        
        // Add days from current month
        const today = new Date();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            
            // Check if this is today
            if (
                i === today.getDate() && 
                this.currentDate.getMonth() === today.getMonth() && 
                this.currentDate.getFullYear() === today.getFullYear()
            ) {
                day.classList.add('today');
            }
            
            day.innerHTML = `<div class="date">${i}</div>`;
            
            // Add events for this day
            const currentDateStr = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = this.getEventsForDate(currentDateStr);
            
            // Add filtered events to day
            dayEvents.forEach(event => {
                // Skip if event type is filtered out
                if (!this.filters[event.type]) return;
                
                const eventEl = document.createElement('div');
                eventEl.className = `calendar-event ${event.type}`;
                eventEl.setAttribute('data-event-id', event.id);
                
                if (event.deal) {
                    eventEl.setAttribute('data-deal-id', event.deal);
                }
                
                eventEl.textContent = event.title;
                
                // Add click event
                eventEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showEventDetails(event);
                });
                
                day.appendChild(eventEl);
            });
            
            // Add click event for empty space in day
            day.addEventListener('click', () => {
                this.showAddEventModal(currentDateStr);
            });
            
            calendarGrid.appendChild(day);
        }
        
        // Add days from next month
        for (let i = 1; i <= nextDays; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day outside-month';
            day.innerHTML = `<div class="date">${i}</div>`;
            calendarGrid.appendChild(day);
        }
    },
    
    // Navigate between months
    navigateMonth: function(direction) {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + direction, 1);
        this.renderCalendar();
        
        // Clear any displayed event details
        const eventPreview = document.querySelector('.event-preview');
        if (eventPreview) {
            eventPreview.innerHTML = '';
            eventPreview.classList.remove('active');
        }
    },
    
    // Show event details
    showEventDetails: function(event) {
        const eventPreview = document.querySelector('.event-preview');
        if (!eventPreview) return;
        
        // Format event type for display
        const eventTypeDisplay = this.formatEventType(event.type);
        
        // Create event details content
        eventPreview.innerHTML = `
            <div class="event-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${this.formatDateForDisplay(event.date)}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Type:</strong> ${eventTypeDisplay}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                ${event.deal ? `<p><strong>Related Deal:</strong> ${this.getDealName(event.deal)}</p>` : ''}
                <p><strong>Attendees:</strong> ${event.attendees.join(', ')}</p>
                <p><strong>Description:</strong></p>
                <p>${event.description}</p>
            </div>
        `;
        
        // Add active class
        eventPreview.classList.add('active');
        
        // Add event listeners for actions
        const editBtn = eventPreview.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.editEvent(event);
            });
        }
        
        const deleteBtn = eventPreview.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteEvent(event);
            });
        }
    },
    
    // Format event type for display
    formatEventType: function(type) {
        switch(type) {
            case 'deal-meeting':
                return 'Deal Meeting';
            case 'internal-meeting':
                return 'Internal Meeting';
            case 'customer-call':
                return 'Customer Call';
            default:
                return type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    },
    
    // Format month and year for display
    formatMonthYear: function(date) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    
    // Format date for display
    formatDateForDisplay: function(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },
    
    // Get events for a specific date
    getEventsForDate: function(dateStr) {
        return this.events.filter(event => event.date === dateStr);
    },
    
    // Show modal to add an event
    showAddEventModal: function(dateStr) {
        let message = 'Add event functionality would go here';
        if (dateStr) {
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
            });
            message += ` for ${formattedDate}`;
        }
        alert(message);
        // In a real implementation, this would show a modal form
    },
    
    // Edit an event
    editEvent: function(event) {
        alert(`Edit "${event.title}" functionality would go here`);
        // In a real implementation, this would show a modal form
    },
    
    // Delete an event
    deleteEvent: function(event) {
        alert(`Delete "${event.title}" functionality would go here`);
        // In a real implementation, this would remove the event and update the UI
    },
    
    // Get deal name from deal ID
    getDealName: function(dealId) {
        // In a real implementation, this would use the deals module
        const dealNames = {
            'deal-1': 'Acme Corp Enterprise Agreement',
            'deal-2': 'TechStart SaaS Implementation',
            'deal-3': 'GlobalRetail POS Upgrade'
        };
        
        return dealNames[dealId] || 'Unknown Deal';
    },
    
    // Highlight events related to a deal
    highlightDealEvents: function(dealId) {
        // Remove highlight from all events
        document.querySelectorAll('.calendar-event').forEach(event => {
            event.classList.remove('deal-highlight');
        });
        
        // Add highlight to events related to the deal
        document.querySelectorAll(`.calendar-event[data-deal-id="${dealId}"]`).forEach(event => {
            event.classList.add('deal-highlight');
        });
    }
};

// Export the module
export default calendarApp;

// Expose to window for legacy compatibility
window.calendarApp = calendarApp; 