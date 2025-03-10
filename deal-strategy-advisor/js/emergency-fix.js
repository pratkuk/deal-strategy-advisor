/**
 * Emergency Fix Script
 * This script runs independently to restore basic functionality when the page becomes unresponsive
 */

(function() {
    console.log("🚨 Emergency fix script loaded");
    
    // Create a global variable to track if we're in emergency mode
    window.emergencyModeActive = false;
    
    // Function to check if page is responsive
    function checkResponsiveness() {
        // If we've already activated emergency mode, don't check again
        if (window.emergencyModeActive) return;

        console.log("🚨 Checking page responsiveness");
        
        try {
            // Try to detect if any click handlers are working
            const testButton = document.createElement('button');
            testButton.style.display = 'none';
            let testClicked = false;
            
            testButton.addEventListener('click', function() {
                testClicked = true;
            });
            
            document.body.appendChild(testButton);
            testButton.click();
            document.body.removeChild(testButton);
            
            if (!testClicked) {
                console.error("🚨 Synthetic click test failed - page may be unresponsive");
                activateEmergencyMode();
                return;
            }
            
            // Check for visible elements that should be clickable
            const clickableElements = document.querySelectorAll('button, .dropdown-btn, .tab, .select-deal-btn');
            if (clickableElements.length === 0) {
                console.error("🚨 No clickable elements found - UI may be broken");
                activateEmergencyMode();
                return;
            }
            
            console.log("✅ Basic responsiveness check passed");
        } catch (error) {
            console.error("🚨 Error during responsiveness check:", error);
            activateEmergencyMode();
        }
    }
    
    // Function to activate emergency mode
    function activateEmergencyMode() {
        if (window.emergencyModeActive) return;
        window.emergencyModeActive = true;
        
        console.error("🚨 ACTIVATING EMERGENCY MODE");
        
        try {
            // Create an emergency control panel
            createEmergencyPanel();
            
            // Fix pointer events on all elements
            fixPointerEvents();
            
            // Re-attach important event handlers
            reattachEventHandlers();
            
            console.log("✅ Emergency mode activated");
        } catch (error) {
            console.error("🚨 Failed to activate emergency mode:", error);
            showFatalErrorMessage();
        }
    }
    
    // Create an emergency control panel for basic functions
    function createEmergencyPanel() {
        const panel = document.createElement('div');
        panel.className = 'emergency-panel';
        panel.innerHTML = `
            <div class="emergency-header">⚠️ Emergency Recovery Mode</div>
            <div class="emergency-controls">
                <button id="em-refresh" class="em-button">Refresh Page</button>
                <button id="em-reset" class="em-button">Reset State</button>
                <button id="em-debug" class="em-button">Open Debug Mode</button>
                <select id="em-deal-select" class="em-select">
                    <option value="">Select a Deal...</option>
                </select>
            </div>
        `;
        
        // Add styles for the panel
        const style = document.createElement('style');
        style.textContent = `
            .emergency-panel {
                position: fixed;
                top: 10px;
                left: 10px;
                background: #f44336;
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-family: sans-serif;
                max-width: 300px;
            }
            .emergency-header {
                font-weight: bold;
                margin-bottom: 10px;
                text-align: center;
            }
            .emergency-controls {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .em-button, .em-select {
                padding: 8px;
                border: none;
                border-radius: 4px;
                background: white;
                color: black;
                cursor: pointer;
                font-size: 14px;
            }
            .em-button:hover {
                background: #f0f0f0;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(panel);
        
        // Add event listeners to the emergency controls
        document.getElementById('em-refresh').addEventListener('click', function() {
            window.location.reload();
        });
        
        document.getElementById('em-reset').addEventListener('click', function() {
            resetAppState();
        });
        
        document.getElementById('em-debug').addEventListener('click', function() {
            window.location.href = 'debug.html';
        });
        
        // Populate deal dropdown if dealStore is available
        const dealSelect = document.getElementById('em-deal-select');
        if (window.dealStore && window.dealStore.deals) {
            Object.entries(window.dealStore.deals).forEach(([id, deal]) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = deal.name;
                dealSelect.appendChild(option);
            });
            
            dealSelect.addEventListener('change', function() {
                if (this.value && typeof window.selectDeal === 'function') {
                    window.selectDeal(this.value);
                }
            });
        }
    }
    
    // Fix pointer events on elements that might have them disabled
    function fixPointerEvents() {
        // Make sure nothing is accidentally blocking clicks
        const allElements = document.querySelectorAll('*');
        
        for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            
            // Skip actual hidden elements
            if (el.style && el.style.display === 'none') continue;
            
            // Fix pointer events
            if (getComputedStyle(el).pointerEvents === 'none') {
                console.log("🔧 Fixing pointer-events on", el);
                el.style.pointerEvents = 'auto';
            }
            
            // Ensure position: fixed elements don't cover the entire page
            if (getComputedStyle(el).position === 'fixed') {
                const rect = el.getBoundingClientRect();
                
                // If element covers most of viewport, adjust it
                if (rect.width > window.innerWidth * 0.9 && rect.height > window.innerHeight * 0.9) {
                    console.log("🔧 Fixing oversized fixed element:", el);
                    el.style.width = '90%';
                    el.style.height = '90%';
                    el.style.top = '5%';
                    el.style.left = '5%';
                }
            }
        }
    }
    
    // Re-attach important event handlers
    function reattachEventHandlers() {
        // Re-attach click handlers for deal dropdown
        const dealDropdown = document.querySelector('.select-deal-btn');
        if (dealDropdown) {
            // Remove all existing event listeners by cloning
            const newDealDropdown = dealDropdown.cloneNode(true);
            dealDropdown.parentNode.replaceChild(newDealDropdown, dealDropdown);
            
            newDealDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
                const dropdownContent = this.nextElementSibling || this.parentElement.querySelector('.dropdown-content');
                if (dropdownContent) {
                    dropdownContent.classList.toggle('show');
                }
            });
        }
        
        // Deal options
        const dealOptions = document.querySelectorAll('.dropdown-content a[data-deal]');
        dealOptions.forEach(option => {
            // Remove all existing event listeners by cloning
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
            
            newOption.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const dealId = this.getAttribute('data-deal');
                if (dealId && typeof window.selectDeal === 'function') {
                    window.selectDeal(dealId);
                }
                
                // Hide dropdown
                const dropdowns = document.querySelectorAll('.dropdown-content');
                dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
            });
        });
        
        // Clear deal button
        const clearDealBtn = document.querySelector('.clear-deal-button');
        if (clearDealBtn) {
            // Remove all existing event listeners by cloning
            const newClearBtn = clearDealBtn.cloneNode(true);
            clearDealBtn.parentNode.replaceChild(newClearBtn, clearDealBtn);
            
            newClearBtn.addEventListener('click', function() {
                if (window.dealStore) {
                    window.dealStore.currentDeal = null;
                    
                    // Update UI
                    const dealContextBar = document.querySelector('.deal-context-bar');
                    if (dealContextBar) {
                        const noDealState = dealContextBar.querySelector('.no-deal-state');
                        const activeDealState = dealContextBar.querySelector('.active-deal-state');
                        
                        if (noDealState) noDealState.classList.add('active');
                        if (activeDealState) activeDealState.classList.remove('active');
                    }
                }
            });
        }
        
        // Tab buttons
        document.querySelectorAll('.deal-tab-btn').forEach(tab => {
            // Remove all existing event listeners by cloning
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            newTab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-dealtab');
                
                // Update active tab UI
                document.querySelectorAll('.deal-tab-btn').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update content
                document.querySelectorAll('.deal-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetTab = document.querySelector(`.${tabName}-tab`);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }
    
    // Reset the application state
    function resetAppState() {
        // Clear any saved state
        if (window.dealStore) {
            window.dealStore.currentDeal = null;
        }
        
        // Reset UI elements
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        
        // Reset deal context
        const noDealState = document.querySelector('.no-deal-state');
        const activeDealState = document.querySelector('.active-deal-state');
        
        if (noDealState) noDealState.classList.add('active');
        if (activeDealState) activeDealState.classList.remove('active');
        
        // Clear any deal content
        const dealContentPane = document.querySelector('.deal-content-pane');
        if (dealContentPane) {
            const noDealSelected = dealContentPane.querySelector('.no-deal-selected');
            if (noDealSelected) noDealSelected.classList.add('active');
            
            document.querySelectorAll('.deal-tab-content').forEach(content => {
                content.classList.remove('active');
            });
        }
        
        console.log("✅ Application state reset");
    }
    
    function showFatalErrorMessage() {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'white';
        message.style.padding = '20px';
        message.style.border = '1px solid red';
        message.style.borderRadius = '5px';
        message.style.zIndex = '99999';
        message.style.maxWidth = '80%';
        message.style.textAlign = 'center';
        
        message.innerHTML = `
            <h2 style="color: red; margin-top: 0;">Critical Error</h2>
            <p>The application is completely unresponsive. Try one of the following:</p>
            <p><button onclick="window.location.reload()" style="padding: 8px; margin: 5px;">Refresh Page</button></p>
            <p><button onclick="window.location.href='debug.html'" style="padding: 8px; margin: 5px;">Open Debug Mode</button></p>
        `;
        
        document.body.appendChild(message);
    }
    
    // Run checks after a small delay to allow normal scripts to load
    setTimeout(checkResponsiveness, 2000);
    
    // Double-check after a longer delay in case the page became unresponsive after initial load
    setTimeout(checkResponsiveness, 8000);
})(); 