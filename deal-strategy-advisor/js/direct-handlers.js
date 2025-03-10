/**
 * Direct Event Handlers
 * Simple, self-contained event handlers for critical UI elements
 * This will work even if the main application JavaScript fails
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📌 Direct event handlers activated');
    
    // Wait a bit to let regular handlers load first
    setTimeout(function() {
        setupDirectHandlers();
    }, 1000);
});

// Setup direct event handlers for critical UI elements
function setupDirectHandlers() {
    // Deal dropdown button
    setupDealDropdownHandler();
    
    // Deal options in dropdown
    setupDealOptionsHandlers();
    
    // Clear deal button
    setupClearDealButtonHandler();
    
    // Tab buttons
    setupTabButtonsHandlers();
    
    // Expand/Collapse widget buttons
    setupWidgetControlHandlers();
    
    // Close dropdown when clicking outside
    setupOutsideClickHandler();
    
    console.log('📌 Direct handlers setup complete');
}

// Handle deal dropdown button clicks
function setupDealDropdownHandler() {
    const dealDropdownBtn = document.querySelector('.select-deal-btn');
    if (!dealDropdownBtn) return;
    
    // Add our own click handler
    dealDropdownBtn.addEventListener('click', function(e) {
        console.log('📌 Deal dropdown button clicked');
        e.preventDefault();
        e.stopPropagation();
        
        // Find dropdown content
        const dropdownContent = this.nextElementSibling || 
                               this.parentElement.querySelector('.dropdown-content');
        
        if (dropdownContent) {
            // Close any other open dropdowns
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                if (dropdown !== dropdownContent) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Toggle visibility
            dropdownContent.classList.toggle('show');
        }
    });
}

// Handle deal options in dropdown
function setupDealOptionsHandlers() {
    const dealOptions = document.querySelectorAll('.dropdown-content a[data-deal]');
    dealOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            console.log('📌 Deal option clicked:', this.getAttribute('data-deal'));
            e.preventDefault();
            e.stopPropagation();
            
            const dealId = this.getAttribute('data-deal');
            selectDealDirectly(dealId, this.textContent);
            
            // Hide all dropdowns
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        });
    });
}

// A direct implementation of selectDeal that doesn't rely on other code
function selectDealDirectly(dealId, dealName) {
    console.log('📌 Selecting deal directly:', dealId);
    
    try {
        // Update global state if available
        if (window.dealStore) {
            window.dealStore.currentDeal = dealId;
        }
        
        // Update UI state
        
        // 1. Update deal context bar
        document.querySelector('.no-deal-state')?.classList.remove('active');
        document.querySelector('.active-deal-state')?.classList.add('active');
        
        // 2. Set deal name in UI
        document.querySelectorAll('.deal-name, .active-deal-name').forEach(el => {
            el.textContent = dealName;
        });
        
        // 3. Show deal message
        document.querySelector('.welcome-message.no-deal-message')?.classList.remove('active');
        document.querySelector('.welcome-message.deal-message')?.classList.add('active');
        
        // 4. Show deal content if available and widget is in expanded plus mode
        document.querySelectorAll('.no-deal-selected').forEach(el => {
            el.classList.remove('active');
        });
        
        // 5. Try to use existing code if available
        if (typeof window.selectDeal === 'function') {
            try {
                window.selectDeal(dealId);
            } catch (error) {
                console.error('📌 Error using existing selectDeal function:', error);
            }
        }
        
        console.log('📌 Deal selected successfully');
    } catch (error) {
        console.error('📌 Error selecting deal:', error);
    }
}

// Handle clear deal button
function setupClearDealButtonHandler() {
    const clearDealBtn = document.querySelector('.clear-deal-button');
    if (!clearDealBtn) return;
    
    clearDealBtn.addEventListener('click', function() {
        console.log('📌 Clear deal button clicked');
        
        try {
            // Update global state if available
            if (window.dealStore) {
                window.dealStore.currentDeal = null;
            }
            
            // Update UI state
            
            // 1. Update deal context bar
            document.querySelector('.no-deal-state')?.classList.add('active');
            document.querySelector('.active-deal-state')?.classList.remove('active');
            
            // 2. Show no deal message
            document.querySelector('.welcome-message.no-deal-message')?.classList.add('active');
            document.querySelector('.welcome-message.deal-message')?.classList.remove('active');
            
            // 3. Show no deal selected message in content pane
            document.querySelectorAll('.no-deal-selected').forEach(el => {
                el.classList.add('active');
            });
            
            // 4. Reset dropdown button text
            const dealButton = document.querySelector('.select-deal-btn');
            if (dealButton) {
                dealButton.textContent = 'Select Deal';
            }
            
            console.log('📌 Deal cleared successfully');
        } catch (error) {
            console.error('📌 Error clearing deal:', error);
        }
    });
}

// Handle tab buttons
function setupTabButtonsHandlers() {
    const tabButtons = document.querySelectorAll('.deal-tab-btn');
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            console.log('📌 Tab button clicked:', this.getAttribute('data-dealtab'));
            
            const tabName = this.getAttribute('data-dealtab');
            if (!tabName) return;
            
            // Update active tab button
            document.querySelectorAll('.deal-tab-btn').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.deal-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const tabContent = document.querySelector(`.${tabName}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Handle widget control buttons (expand, collapse, etc.)
function setupWidgetControlHandlers() {
    // Collapse button
    const collapseBtn = document.querySelector('.collapse-btn');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', function() {
            console.log('📌 Collapse button clicked');
            
            const widget = document.getElementById('deal-chat-widget');
            if (!widget) return;
            
            if (widget.classList.contains('widget-collapsed')) {
                // Expand
                widget.classList.remove('widget-collapsed');
                widget.classList.add('widget-expanded');
                widget.style.height = '500px';
                
                // Show content elements
                document.querySelector('.widget-content').style.display = 'block';
                document.querySelector('.controls-bar').style.display = 'flex';
                document.querySelector('.chat-input-container').style.display = 'flex';
            } else {
                // Collapse
                widget.classList.add('widget-collapsed');
                widget.classList.remove('widget-expanded');
                widget.classList.remove('widget-expanded-plus');
                widget.style.height = '40px';
                
                // Hide content elements
                document.querySelector('.widget-content').style.display = 'none';
                document.querySelector('.controls-bar').style.display = 'none';
                document.querySelector('.chat-input-container').style.display = 'none';
            }
        });
    }
    
    // Expand button
    const expandBtn = document.querySelector('.expand-btn');
    if (expandBtn) {
        expandBtn.addEventListener('click', function() {
            console.log('📌 Expand button clicked');
            
            const widget = document.getElementById('deal-chat-widget');
            if (!widget) return;
            
            if (widget.classList.contains('widget-collapsed')) {
                // If collapsed, first expand
                widget.classList.remove('widget-collapsed');
                widget.classList.add('widget-expanded');
                widget.style.height = '500px';
                
                // Show content
                document.querySelector('.widget-content').style.display = 'block';
                document.querySelector('.controls-bar').style.display = 'flex';
                document.querySelector('.chat-input-container').style.display = 'flex';
                return;
            }
        });
    }
    
    // Expand Plus button
    const expandPlusBtn = document.querySelector('.expand-plus-btn');
    if (expandPlusBtn) {
        expandPlusBtn.addEventListener('click', function() {
            console.log('📌 Expand Plus button clicked');
            
            const widget = document.getElementById('deal-chat-widget');
            if (!widget) return;
            
            if (widget.classList.contains('widget-collapsed')) {
                // If collapsed, first expand
                widget.classList.remove('widget-collapsed');
                widget.classList.add('widget-expanded');
                widget.style.height = '500px';
            }
            
            if (!widget.classList.contains('widget-expanded-plus')) {
                // Switch to expanded-plus view
                widget.classList.remove('widget-expanded');
                widget.classList.add('widget-expanded-plus');
                widget.style.width = '700px';
                
                // Show deal content pane
                const dealContentPane = document.querySelector('.deal-content-pane');
                if (dealContentPane) dealContentPane.style.display = 'block';
            } else {
                // Switch back to regular expanded view
                widget.classList.remove('widget-expanded-plus');
                widget.classList.add('widget-expanded');
                widget.style.width = '320px';
                
                // Hide deal content pane
                const dealContentPane = document.querySelector('.deal-content-pane');
                if (dealContentPane) dealContentPane.style.display = 'none';
            }
        });
    }
}

// Close dropdowns when clicking outside
function setupOutsideClickHandler() {
    document.addEventListener('click', function(e) {
        // Check if click was inside a dropdown
        let clickedInsideDropdown = false;
        let currentElement = e.target;
        
        while (currentElement) {
            if (currentElement.classList && 
               (currentElement.classList.contains('dropdown') || 
                currentElement.classList.contains('dropdown-content'))) {
                clickedInsideDropdown = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }
        
        if (!clickedInsideDropdown) {
            // Close all dropdowns
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
} 