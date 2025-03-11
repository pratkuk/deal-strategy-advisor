// Main application initialization

const app = {
    initialize: function() {
        console.log('Initializing application...');
        
        // Initialize chat widget
        if (window.chatWidget) {
            console.log('Found chat widget, initializing...');
            window.chatWidget.init();
        } else {
            console.error('Chat widget not found!');
        }
        
        this.setupGlobalEventListeners();
        console.log('Application initialized');
    },
    
    setupGlobalEventListeners: function() {
        console.log('Setting up global event listeners...');
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle key commands
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
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
        
        console.log('Global event listeners set up');
    },
    
    handleResize: function() {
        const widget = document.getElementById('deal-chat-widget');
        if (widget) {
            const rect = widget.getBoundingClientRect();
            if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
                widget.style.left = Math.min(rect.left, window.innerWidth - widget.offsetWidth) + 'px';
                widget.style.top = Math.min(rect.top, window.innerHeight - widget.offsetHeight) + 'px';
            }
        }
    }
};

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    app.initialize();
    
    // Set up deal-related functionality
    setupDealDropdown();
    setupClearDealButton();
    
    // Make selectDeal globally available
    window.selectDeal = selectDeal;
});

// Make app globally available
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
                
                // Get the actual deal object from dealStore
                if (window.dealStore && window.dealStore.deals && window.dealStore.deals[dealId]) {
                    const deal = window.dealStore.deals[dealId];
                    
                    // Set as current deal
                    window.dealStore.currentDeal = dealId;
                    
                    // Dispatch deal selected event with the full deal object
                    document.dispatchEvent(new CustomEvent('dealSelected', { 
                        detail: { 
                            dealId: dealId,
                            deal: deal
                        } 
                    }));
                    
                    console.log('Deal object dispatched:', deal);
                } else {
                    console.error('Deal not found in dealStore:', dealId);
                }
                
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
    
    // Also find the test clear deal button
    const testClearDealBtn = document.getElementById('testClearDealBtn');
    
    const setupButton = (btn) => {
        if (btn) {
            btn.addEventListener('click', function() {
                console.log('Clear deal button clicked');
                
                // Update the deal context bar
                const noDealState = document.querySelector('.deal-context-bar .no-deal-state');
                const activeDealState = document.querySelector('.deal-context-bar .active-deal-state');
                
                if (noDealState) noDealState.classList.add('active');
                if (activeDealState) activeDealState.classList.remove('active');
                
                // Update welcome messages
                const noDealMessage = document.querySelector('.welcome-message.no-deal-message');
                const dealMessage = document.querySelector('.welcome-message.deal-message');
                
                if (noDealMessage) noDealMessage.classList.add('active');
                if (dealMessage) dealMessage.classList.remove('active');
                
                // Dispatch deal cleared event
                document.dispatchEvent(new CustomEvent('dealCleared'));
                
                // If we're in expanded-plus view, switch back to regular view
                const widget = document.getElementById('deal-chat-widget');
                if (widget && widget.classList.contains('widget-expanded-plus')) {
                    widget.classList.remove('widget-expanded-plus');
                    widget.classList.add('widget-expanded');
                    widget.style.width = '320px';
                    
                    // Hide deal content pane
                    const dealContentPane = widget.querySelector('.deal-content-pane');
                    if (dealContentPane) dealContentPane.style.display = 'none';
                }
            });
        }
    };
    
    // Set up both buttons
    setupButton(clearDealBtn);
    setupButton(testClearDealBtn);
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

// Function to initialize the deal content
function initDealContent() {
    // Set up tab switching
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('tab')) {
            const tabContainer = event.target.closest('.deal-tabs');
            if (!tabContainer) return;
            
            // Get the tab id
            const tabId = event.target.getAttribute('data-tab');
            if (!tabId) return;
            
            // Deactivate all tabs and tab panes in this container
            const allTabs = tabContainer.querySelectorAll('.tab');
            allTabs.forEach(tab => tab.classList.remove('active'));
            
            const tabContentContainer = tabContainer.nextElementSibling;
            if (!tabContentContainer) return;
            
            const allTabPanes = tabContentContainer.querySelectorAll('.tab-pane');
            allTabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Activate the selected tab and tab pane
            event.target.classList.add('active');
            const targetPane = document.getElementById(tabId);
            if (targetPane) targetPane.classList.add('active');
        }
    });
    
    // Load a default deal on page load
    window.addEventListener('DOMContentLoaded', function() {
        // Select the first deal by default
        const firstDealId = Object.keys(dealStore.deals)[0];
        if (firstDealId) {
            selectDeal(firstDealId);
        }
    });
}

// Function to select a deal and render its content
function selectDeal(dealId) {
    try {
        console.log('selectDeal called with dealId:', dealId);
        
        // Ensure dealStore exists
        if (!window.dealStore) {
            console.error('dealStore not initialized');
            window.dealStore = { deals: {}, currentDeal: null };
        }
        
        // Get the deal from dealStore
        const deal = window.dealStore.deals[dealId];
        if (!deal) {
            console.error('Deal not found in dealStore:', dealId);
            return;
        }
        
        console.log('Found deal:', deal);
        
        // Update current deal in the store
        window.dealStore.currentDeal = dealId;
        
        // Update deal context bar
        try {
            updateDealContextBar(deal);
        } catch (error) {
            console.error('Error updating deal context bar:', error);
        }
        
        // Render the deal content
        try {
            renderDealContent(deal);
        } catch (error) {
            console.error('Error rendering deal content:', error);
        }
        
        // Update deal selection in dropdown
        try {
            updateDealDropdownSelection(deal.name);
        } catch (error) {
            console.error('Error updating dropdown selection:', error);
        }
        
        // Dispatch a custom event that the deal was selected
        try {
            document.dispatchEvent(new CustomEvent('dealSelected', { detail: { dealId, deal } }));
        } catch (error) {
            console.error('Error dispatching dealSelected event:', error);
        }
    } catch (error) {
        console.error('Fatal error in selectDeal function:', error);
    }
}

// Function to update deal context bar
function updateDealContextBar(deal) {
    const dealContextBar = document.querySelector('.deal-context-bar');
    if (!dealContextBar) return;
    
    dealContextBar.innerHTML = `
        <div class="deal-name">${deal.name}</div>
        <div class="deal-details">
            <span class="deal-value">${deal.value}</span> • 
            <span class="deal-stage">${deal.stage}</span> • 
            <span class="deal-close-date">Close: ${deal.closeDate}</span>
        </div>
    `;
}

// Function to render deal content
function renderDealContent(deal) {
    console.log('Rendering deal content for:', deal);
    
    // Use the DealContent module if available
    if (window.DealContent) {
        console.log('Using DealContent module to render deal');
        
        // Make sure the deal content pane is visible
        const dealContentPane = document.querySelector('.deal-content-pane');
        if (dealContentPane) {
            dealContentPane.style.display = 'block';
            dealContentPane.style.visibility = 'visible';
            dealContentPane.style.opacity = '1';
        }
        
        // Trigger a manual deal selected event for DealContent to handle
        const event = {
            detail: {
                dealId: deal.id,
                deal: deal
            }
        };
        
        // Call the handler directly if accessible
        if (typeof window.DealContent.handleDealSelected === 'function') {
            window.DealContent.handleDealSelected(event);
        } else {
            console.error('DealContent.handleDealSelected is not a function');
        }
        
        return;
    }
    
    // Fallback rendering if DealContent module is not available
    const dealContentPane = document.querySelector('.deal-content-pane');
    if (!dealContentPane) {
        console.error('Deal content pane not found');
        return;
    }
    
    // Update the overview section
    try {
        // Hide "no deal selected" message
        const noDealSelectedElements = document.querySelectorAll('.no-deal-selected');
        noDealSelectedElements.forEach(el => el.classList.remove('active'));
        
        // Show deal overview
        const dealOverview = document.querySelector('.deal-overview');
        if (dealOverview) dealOverview.classList.add('active');
        
        // Update company name
        const companyNameEl = document.querySelector('.info-value.company-name');
        if (companyNameEl) companyNameEl.textContent = deal.name || '-';
        
        // Update deal value
        const dealValueEl = document.querySelector('.info-value.deal-value');
        if (dealValueEl) dealValueEl.textContent = deal.value || '-';
        
        // Update deal stage
        const dealStageEl = document.querySelector('.deal-stage');
        if (dealStageEl) dealStageEl.textContent = deal.stage || '-';
        
        // Update close date
        const closeDateEl = document.querySelector('.info-value.close-date');
        if (closeDateEl) closeDateEl.textContent = deal.closeDate || '-';
    } catch (error) {
        console.error('Error updating deal info:', error);
    }
    
    console.log('Deal content rendered successfully');
}

// Function to update deal selection in dropdown
function updateDealDropdownSelection(dealName) {
    const dealButton = document.querySelector('.dropdown-button.deal-dropdown-button');
    if (dealButton) {
        dealButton.textContent = dealName;
    }
}

// Function to setup Deal dropdown in the context bar
function setupDealDropdown() {
    const dealDropdown = document.querySelector('.dropdown.deal-dropdown');
    if (!dealDropdown) return;
    
    const dropdownContent = dealDropdown.querySelector('.dropdown-content');
    if (!dropdownContent) return;
    
    // Clear existing content
    dropdownContent.innerHTML = '';
    
    // Add deals to dropdown
    Object.entries(dealStore.deals).forEach(([id, deal]) => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.setAttribute('data-deal-id', id);
        option.textContent = deal.name;
        dropdownContent.appendChild(option);
        
        // Add click event
        option.addEventListener('click', function() {
            selectDeal(id);
            // Hide dropdown
            dropdownContent.classList.remove('show');
        });
    });
}

// Function to setup Clear Deal button
function setupClearDealButton() {
    const clearDealButton = document.querySelector('.clear-deal-button');
    if (clearDealButton) {
        clearDealButton.addEventListener('click', function() {
            // Clear current deal
            dealStore.currentDeal = null;
            
            // Update UI
            const dealContextBar = document.querySelector('.deal-context-bar');
            if (dealContextBar) {
                dealContextBar.innerHTML = `
                    <div class="deal-name">No Deal Selected</div>
                    <div class="deal-details">
                        <span class="deal-message">Select a deal to view details</span>
                    </div>
                `;
            }
            
            // Clear deal dropdown selection
            const dealButton = document.querySelector('.dropdown-button.deal-dropdown-button');
            if (dealButton) {
                dealButton.textContent = 'Select Deal';
            }
            
            // Clear content pane
            const dealContentPane = document.querySelector('.deal-content-pane');
            if (dealContentPane) {
                dealContentPane.innerHTML = `
                    <div class="no-deal-selected">
                        <div class="no-deal-icon">📈</div>
                        <div class="no-deal-message">Select a deal to view details</div>
                    </div>
                `;
            }
            
            // Hide the deal-content-pane if widget was in expandedPlus mode
            const widgetContainer = document.querySelector('.widget-container');
            if (widgetContainer && widgetContainer.classList.contains('expandedPlus')) {
                const dealContentPane = document.querySelector('.deal-content-pane');
                if (dealContentPane) {
                    dealContentPane.style.display = 'none';
                }
                
                // Switch back to regular expanded mode
                widgetContainer.classList.remove('expandedPlus');
                widgetContainer.classList.add('widget-expanded');
            }
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('dealCleared'));
        });
    }
}

// Function to initialize the widget
function initializeWidget() {
    console.log('Initializing Deal Strategy Advisor widget');
    
    try {
        // Get references to all the deal data - with error handling
        const dealStore = window.dealStore || {};
        
        // Initialize chat widget
        if (window.chatWidget) {
            try {
                window.chatWidget.init();
            } catch (error) {
                console.error('Error initializing chat widget:', error);
            }
        }
        
        // Initialize deal content tab listeners
        if (window.dealContent && window.dealContent.initDealTabListeners) {
            try {
                window.dealContent.initDealTabListeners();
            } catch (error) {
                console.error('Error initializing deal tab listeners:', error);
            }
        }
        
        // Setup deal dropdown
        setupDealDropdown();
        
        // Setup clear deal button
        setupClearDealButton();
        
        // Initialize deal content
        initDealContent();
        
        // Log the available deals to console to debug
        console.log('Available deals:', dealStore);
    } catch (error) {
        console.error('Error in widget initialization:', error);
    }
}

// Initialize the widget when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeWidget();
    } catch (error) {
        console.error('Error during widget initialization:', error);
    }
});

// Modified auto-selection with timeout and error handling
let autoSelectAttempts = 0;
function attemptAutoSelectDeal() {
    try {
        // Limit retry attempts to prevent infinite loops
        if (autoSelectAttempts >= 3) {
            console.log('Reached maximum auto-select attempts');
            return;
        }
        
        autoSelectAttempts++;
        
        // Select the first deal by default
        if (typeof dealStore !== 'undefined' && dealStore.deals) {
            const firstDealId = Object.keys(dealStore.deals)[0];
            if (firstDealId) {
                console.log('Auto-selecting first deal:', firstDealId);
                
                // Safe call to selectDeal with error handling
                try {
                    selectDeal(firstDealId);
                } catch (error) {
                    console.error('Error selecting deal:', error);
                }
            }
        } else {
            console.error('Deal store not found or has no deals');
            // Try again with a delay if dealStore isn't ready yet
            if (autoSelectAttempts < 3) {
                setTimeout(attemptAutoSelectDeal, 500);
            }
        }
    } catch (error) {
        console.error('Error in auto-select function:', error);
    }
}

// Call with timeout to ensure page is loaded
setTimeout(attemptAutoSelectDeal, 800); 