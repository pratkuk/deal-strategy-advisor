// main.js - Main application initialization

// Import modules
import workspaceModule from './workspace/workspace.js';
import widgetModule from './widget/widget.js';
import dealsModule from './data/deals.js';
import * as DealContent from './dealContent.js';

// Application initialization
const app = {
    // Initialize the application
    initialize: function() {
        // Initialize modules in order
        this.initWorkspace();
        this.initWidget();
        this.setupGlobalEventListeners();
        
        console.log('Application initialized');
    },
    
    // Initialize the workspace
    initWorkspace: function() {
        workspaceModule.initialize();
    },
    
    // Initialize the widget
    initWidget: function() {
        widgetModule.initialize();
    },
    
    // Set up global event listeners
    setupGlobalEventListeners: function() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle key commands
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                // Close any open modals or context menus
                const contextMenu = document.getElementById('contextMenu');
                if (contextMenu && contextMenu.classList.contains('visible')) {
                    const contextBackdrop = document.getElementById('contextModalBackdrop');
                    if (contextBackdrop) {
                        contextBackdrop.classList.remove('visible');
                    }
                    contextMenu.classList.remove('visible');
                }
            }
        });
    },
    
    // Handle window resize
    handleResize: function() {
        // Adjust widget position if needed
        if (typeof widgetModule !== 'undefined') {
            const widget = document.getElementById('deal-chat-widget');
            if (widget) {
                const rect = widget.getBoundingClientRect();
                if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
                    widgetModule.updateWidgetPosition(
                        Math.min(rect.left, window.innerWidth - widget.offsetWidth),
                        Math.min(rect.top, window.innerHeight - widget.offsetHeight)
                    );
                }
            }
        }
    }
};

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.initialize();
    
    console.log('Main script loaded');
    
    // Initialize deal content UI module
    DealContent.init();
    
    // Deal selection dropdown functionality
    setupDealDropdown();
    
    // Set up clear deal button
    setupClearDealButton();
    
    // Add expand-plus button handler
    setupExpandPlusButton();
});

// Expose to window for legacy compatibility
window.app = app;

// Setup deal dropdown functionality
function setupDealDropdown() {
    const dealDropdown = document.querySelector('.deal-context-bar .dropdown');
    if (dealDropdown) {
        const dealOptions = dealDropdown.querySelectorAll('.dropdown-content a');
        const dealDropdownBtn = dealDropdown.querySelector('.select-deal-btn');
        const dealDropdownContent = dealDropdown.querySelector('.dropdown-content');
        
        // Add click handler to show/hide dropdown
        dealDropdownBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Close all dropdowns first
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                if (dropdown !== dealDropdownContent) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Toggle dropdown visibility
            dealDropdownContent.classList.toggle('show');
            
            console.log('Deal dropdown clicked, show state:', dealDropdownContent.classList.contains('show'));
        });
        
        dealOptions.forEach(option => {
            option.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                // Hide dropdown
                dealDropdownContent.classList.remove('show');
                
                const dealId = this.getAttribute('data-deal');
                console.log('Deal selected:', dealId);
                
                // Simulate deal selection
                document.dispatchEvent(new CustomEvent('dealSelected', { 
                    detail: { 
                        dealId: dealId,
                        dealName: this.textContent
                    } 
                }));
                
                // Show the deal content by triggering expand-plus if not already in that mode
                const widget = document.getElementById('deal-chat-widget');
                if (widget && !widget.classList.contains('widget-expanded-plus') && !widget.classList.contains('widget-collapsed')) {
                    const expandPlusBtn = widget.querySelector('.expand-plus-btn');
                    if (expandPlusBtn) {
                        expandPlusBtn.click();
                    }
                }
            });
        });
    }
}

// Set up clear deal button
function setupClearDealButton() {
    const clearDealBtn = document.querySelector('.clear-deal-btn');
    if (clearDealBtn) {
        clearDealBtn.addEventListener('click', function() {
            console.log('Clear deal button clicked');
            
            // Update the deal context bar
            document.querySelector('.deal-context-bar .no-deal-state').classList.add('active');
            document.querySelector('.deal-context-bar .active-deal-state').classList.remove('active');
            
            // Update welcome messages
            document.querySelector('.welcome-message.no-deal-message').classList.add('active');
            document.querySelector('.welcome-message.deal-message').classList.remove('active');
            
            // Dispatch deal cleared event
            document.dispatchEvent(new CustomEvent('dealCleared'));
        });
    }
}

// Set up expand-plus button handler
function setupExpandPlusButton() {
    const widget = document.getElementById('deal-chat-widget');
    const expandPlusBtn = widget?.querySelector('.expand-plus-btn');
    
    if (expandPlusBtn) {
        expandPlusBtn.addEventListener('click', function() {
            console.log('Expand-plus button clicked');
            
            if (widget.classList.contains('widget-collapsed')) {
                // If collapsed, first expand
                widget.classList.remove('widget-collapsed');
                widget.classList.add('widget-expanded');
            }
            
            if (!widget.classList.contains('widget-expanded-plus')) {
                // Switch to expanded-plus view
                widget.classList.remove('widget-expanded');
                widget.classList.add('widget-expanded-plus');
                widget.style.width = '700px';
                widget.style.height = '500px';
                
                // Show deal content pane
                const dealContentPane = widget.querySelector('.deal-content-pane');
                if (dealContentPane) dealContentPane.style.display = 'block';
                
                // Ensure chat pane is visible
                const chatPane = widget.querySelector('.chat-pane');
                if (chatPane) chatPane.style.display = 'block';
            } else {
                // Switch back to regular expanded view
                widget.classList.remove('widget-expanded-plus');
                widget.classList.add('widget-expanded');
                widget.style.width = '320px';
                
                // Hide deal content pane
                const dealContentPane = widget.querySelector('.deal-content-pane');
                if (dealContentPane) dealContentPane.style.display = 'none';
            }
        });
    }
} 