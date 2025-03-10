// widget.js - Controls the Deal Advisor chat widget

// Import widget tab modules
import agentModule from './agent.js';  // Chat tab functionality (formerly "Chat")
import askModule from './ask.js';    // Ask tab functionality (formerly "Composer")
import tasksModule from './tasks.js';  // Tasks tab functionality (formerly "Coaching")
import contextModule from './context.js'; // Context menu functionality

// Import deal data
import dealsModule from '../data/deals.js';

const widgetModule = {
    // State variables
    currentTab: 'agent',
    activeDeal: null,
    isCollapsed: false,
    isExpanded: false,
    dragStartX: 0,
    dragStartY: 0,
    
    // Initialize the widget
    initialize: function() {
        console.log('Initializing widget module');
        
        // Make sure the widget is visible
        const widget = document.getElementById('deal-chat-widget');
        if (widget) {
            console.log('Widget element found');
            widget.classList.remove('widget-collapsed');
            widget.style.display = 'block';
            widget.style.position = 'fixed';
            widget.style.bottom = '20px';
            widget.style.right = '20px';
            widget.style.zIndex = '1000';
        } else {
            console.error('Widget element not found in DOM');
        }
        
        this.initializeWidgetControls();
        this.initializeTabSwitching();
        this.initializeDealContext();
        
        // Initialize all child modules
        if (contextModule) {
            console.log('Initializing context module');
            contextModule.initialize();
        }
        if (agentModule) {
            console.log('Initializing agent module');
            agentModule.initialize();
        }
        if (askModule) {
            console.log('Initializing ask module');
            askModule.initialize();
        }
        if (tasksModule) {
            console.log('Initializing tasks module');
            tasksModule.initialize();
        }
        
        console.log('Widget module initialized');
    },
    
    // Set up widget controls (collapse, expand, drag)
    initializeWidgetControls: function() {
        const widget = document.getElementById('deal-chat-widget');
        const dragHandle = widget.querySelector('.drag-handle');
        const collapseBtn = widget.querySelector('.collapse-btn');
        const expandBtn = widget.querySelector('.expand-btn');
        
        // Collapse button
        collapseBtn.addEventListener('click', () => {
            this.toggleCollapse();
        });
        
        // Expand button
        expandBtn.addEventListener('click', () => {
            this.toggleExpand();
        });
        
        // Drag functionality
        dragHandle.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.onDrag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        
        // Double-click to toggle collapse
        dragHandle.addEventListener('dblclick', () => {
            this.toggleCollapse();
        });
        
        // Initial position
        this.updateWidgetPosition(20, window.innerHeight - 600);
    },
    
    // Set up tab switching
    initializeTabSwitching: function() {
        const tabButtons = document.querySelectorAll('.widget-tabs .tab-btn');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    },
    
    // Set up deal context functionality
    initializeDealContext: function() {
        const selectDealBtn = document.querySelector('.select-deal-btn');
        const switchDealBtn = document.querySelector('.switch-deal-btn');
        const clearDealBtn = document.querySelector('.clear-deal-btn');
        
        // Select deal button
        selectDealBtn.addEventListener('click', () => {
            this.showDealSelector();
        });
        
        // Switch deal button
        switchDealBtn.addEventListener('click', () => {
            this.showDealSelector();
        });
        
        // Clear deal button
        clearDealBtn.addEventListener('click', () => {
            this.clearActiveDeal();
        });
        
        // Listen for deal selection events from other parts of the app
        document.addEventListener('dealSelected', (e) => {
            this.setActiveDeal(e.detail.dealId);
        });
        
        // Update UI for null state initially
        this.updateUIforNullState();
    },
    
    // Switch between tabs (Agent, Ask, Tasks)
    switchTab: function(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Map the new tab names to the old class names in the HTML
        const tabClassMap = {
            'agent': 'chat',
            'ask': 'composer',
            'tasks': 'coaching'
        };
        
        // Get the correct class name for the tab content
        const contentClassName = tabClassMap[tabName] || tabName;
        
        // Update current tab
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.widget-tabs .tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            console.log('Checking tab content:', content.className);
            if (content.classList.contains(`${contentClassName}-tab`)) {
                console.log('Activating tab content:', content.className);
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Initialize specific tab content if needed
        switch(tabName) {
            case 'agent':
                if (agentModule) {
                    agentModule.activate();
                }
                break;
            case 'ask':
                if (askModule) {
                    askModule.activate();
                }
                break;
            case 'tasks':
                if (tasksModule) {
                    tasksModule.activate();
                }
                break;
        }
        
        console.log('Tab switch complete');
    },
    
    // Show deal selector interface
    showDealSelector: function() {
        // In a real implementation, this would show a modal with deals to select
        // For now, we'll simulate it with a prompt
        const dealId = prompt('Enter deal ID (deal-1, deal-2, or deal-3):');
        if (dealId) {
            this.setActiveDeal(dealId);
        }
    },
    
    // Set the active deal
    setActiveDeal: function(dealId) {
        const deal = dealsModule.getDealById(dealId);
        if (!deal) {
            console.error('Deal not found:', dealId);
            return;
        }
        
        this.activeDeal = deal;
        this.updateUIforActiveDeal();
        
        // Notify other modules about deal change
        const event = new CustomEvent('widgetDealChanged', { 
            detail: { dealId: dealId, deal: deal } 
        });
        document.dispatchEvent(event);
    },
    
    // Clear the active deal
    clearActiveDeal: function() {
        this.activeDeal = null;
        this.updateUIforNullState();
        
        // Notify other modules
        document.dispatchEvent(new CustomEvent('widgetDealCleared'));
    },
    
    // Update UI for active deal
    updateUIforActiveDeal: function() {
        if (!this.activeDeal) return;
        
        // Update deal name displays
        document.querySelectorAll('.active-deal-name').forEach(el => {
            el.textContent = this.activeDeal.name;
        });
        
        document.querySelectorAll('.deal-name').forEach(el => {
            el.textContent = this.activeDeal.name;
        });
        
        // Update deal stage pills
        document.querySelectorAll('.deal-stage-pill').forEach(el => {
            el.textContent = this.activeDeal.stage;
            
            // Clear existing status classes
            el.classList.remove('new', 'active', 'at-risk');
            
            // Add appropriate status class
            if (this.activeDeal.status) {
                el.classList.add(this.activeDeal.status);
            }
        });
        
        // Show active deal state, hide null state
        document.querySelectorAll('.no-deal-state').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelectorAll('.active-deal-state').forEach(el => {
            el.classList.add('active');
        });
        
        // Update welcome message
        document.querySelectorAll('.welcome-message').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelector('.welcome-message.deal-message').classList.add('active');
    },
    
    // Update UI for null state (no deal selected)
    updateUIforNullState: function() {
        // Show null state, hide active deal state
        document.querySelectorAll('.active-deal-state').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelectorAll('.no-deal-state').forEach(el => {
            el.classList.add('active');
        });
        
        // Update welcome message
        document.querySelectorAll('.welcome-message').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelector('.welcome-message.no-deal-message').classList.add('active');
    },
    
    // Toggle widget collapse state
    toggleCollapse: function() {
        const widget = document.getElementById('deal-chat-widget');
        
        if (this.isCollapsed) {
            widget.classList.remove('widget-collapsed');
            this.isCollapsed = false;
        } else {
            widget.classList.add('widget-collapsed');
            this.isCollapsed = true;
            
            // If expanded, collapse that too
            if (this.isExpanded) {
                this.toggleExpand();
            }
        }
    },
    
    // Toggle widget expanded state
    toggleExpand: function() {
        const widget = document.getElementById('deal-chat-widget');
        
        if (this.isExpanded) {
            widget.classList.remove('widget-expanded');
            this.isExpanded = false;
        } else {
            widget.classList.add('widget-expanded');
            this.isExpanded = true;
        }
    },
    
    // Start dragging the widget
    startDrag: function(e) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.widgetStartX = parseInt(document.getElementById('deal-chat-widget').style.left) || 0;
        this.widgetStartY = parseInt(document.getElementById('deal-chat-widget').style.top) || 0;
        
        document.getElementById('deal-chat-widget').classList.add('dragging');
    },
    
    // Handle drag movement
    onDrag: function(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;
        
        this.updateWidgetPosition(
            this.widgetStartX + deltaX,
            this.widgetStartY + deltaY
        );
    },
    
    // End dragging
    stopDrag: function() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        document.getElementById('deal-chat-widget').classList.remove('dragging');
    },
    
    // Update widget position
    updateWidgetPosition: function(x, y) {
        const widget = document.getElementById('deal-chat-widget');
        
        // Keep widget within viewport bounds
        const maxX = window.innerWidth - widget.offsetWidth;
        const maxY = window.innerHeight - widget.offsetHeight;
        
        x = Math.max(0, Math.min(maxX, x));
        y = Math.max(0, Math.min(maxY, y));
        
        widget.style.left = x + 'px';
        widget.style.top = y + 'px';
    }
};

// Export the module
export default widgetModule;

// Expose to window for legacy compatibility
window.widgetModule = widgetModule; 