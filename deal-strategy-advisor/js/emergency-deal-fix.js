/**
 * EMERGENCY DEAL DISPLAY FIX
 * This script directly manipulates the DOM to ensure deal data is displayed
 * regardless of other scripts or styling issues.
 */

(function() {
    console.log("🚨 EMERGENCY DEAL DISPLAY FIX ACTIVATED");
    
    // Store for deal data
    let currentDealData = null;
    
    // Run immediately and on DOM content loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeEmergencyFix();
    } else {
        document.addEventListener('DOMContentLoaded', initializeEmergencyFix);
    }
    
    // Main initialization function
    function initializeEmergencyFix() {
        console.log("🚨 Initializing emergency deal display fix");
        
        // 1. Add a mutation observer to detect DOM changes
        setupMutationObserver();
        
        // 2. Add direct hooks to deal selection
        addDealSelectionHooks();
        
        // 3. Add emergency fix button
        addEmergencyFixButton();
        
        // 4. Check if a deal is already selected
        checkForExistingDeal();
        
        // 5. Start a repeated check for dash content
        startDashContentCheck();
    }
    
    // Setup a mutation observer to detect DOM changes
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if we have deal data and if content was added
                if (currentDealData && mutation.addedNodes.length) {
                    // If deal content pane was added or modified
                    if (mutation.target.classList && 
                        (mutation.target.classList.contains('deal-content-pane') ||
                         mutation.target.classList.contains('deal-overview') ||
                         mutation.target.classList.contains('deal-content-body'))) {
                        console.log("🔄 Deal content DOM changed, reapplying fix");
                        performEmergencyFix();
                    }
                }
            });
        });
        
        // Observe the entire document, but focus on deal content
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
        
        console.log("👁️ Mutation observer setup complete");
    }
    
    // Add direct hooks to deal selection buttons and dropdowns
    function addDealSelectionHooks() {
        // Wait a bit to ensure elements are present
        setTimeout(() => {
            // Get all deal dropdown options
            document.querySelectorAll('[data-deal]').forEach(option => {
                // Clone and replace to remove existing handlers
                const newOption = option.cloneNode(true);
                option.parentNode.replaceChild(newOption, option);
                
                // Add our direct handler
                newOption.addEventListener('click', function(e) {
                    const dealId = this.getAttribute('data-deal');
                    const dealName = this.textContent;
                    
                    console.log(`🚨 EMERGENCY: Deal selected: ${dealName} (${dealId})`);
                    
                    // Extract deal data
                    extractDealData(dealId, dealName);
                    
                    // Perform the emergency fix after a short delay
                    setTimeout(performEmergencyFix, 100);
                    
                    // Try multiple times to ensure it sticks
                    setTimeout(performEmergencyFix, 500);
                    setTimeout(performEmergencyFix, 1000);
                    setTimeout(performEmergencyFix, 2000);
                });
            });
            
            console.log("🔗 Deal selection hooks added");
        }, 500);
    }
    
    // Add an emergency fix button
    function addEmergencyFixButton() {
        const button = document.createElement('button');
        button.textContent = "Fix Deal Display";
        button.id = "emergency-deal-fix-btn";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.right = "120px";
        button.style.zIndex = "10000";
        button.style.backgroundColor = "#e74c3c";
        button.style.color = "white";
        button.style.padding = "8px 15px";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.fontWeight = "bold";
        button.style.cursor = "pointer";
        
        button.addEventListener('click', function() {
            console.log("🚨 Emergency fix button clicked");
            
            // Check if we already have deal data
            if (currentDealData) {
                performEmergencyFix();
            } else {
                // Check if we can extract deal data from the UI
                const dealNameElement = document.querySelector('.active-deal-name');
                if (dealNameElement && dealNameElement.textContent) {
                    extractDealData(null, dealNameElement.textContent);
                    performEmergencyFix();
                } else {
                    console.log("❌ No deal data available and no deal selected");
                    alert("Please select a deal first");
                }
            }
        });
        
        document.body.appendChild(button);
        console.log("🆘 Emergency fix button added");
    }
    
    // Check if a deal is already selected
    function checkForExistingDeal() {
        console.log("🔍 Checking for existing selected deal");
        
        // Check if active-deal-state is visible
        const activeDealState = document.querySelector('.active-deal-state.active');
        if (activeDealState) {
            console.log("✅ Found active deal state");
            
            // Get deal name from UI
            const dealNameElement = document.querySelector('.active-deal-name');
            if (dealNameElement && dealNameElement.textContent) {
                console.log(`Found selected deal: ${dealNameElement.textContent}`);
                
                // Try to extract deal data
                extractDealData(null, dealNameElement.textContent);
                
                // Perform fix
                setTimeout(performEmergencyFix, 100);
            }
        } else {
            console.log("❌ No deal currently selected");
        }
    }
    
    // Start a repeated check for dash content
    function startDashContentCheck() {
        // Check immediately
        checkForDashContent();
        
        // Then check repeatedly
        setInterval(checkForDashContent, 1000);
    }
    
    // Check for dash content that needs to be replaced
    function checkForDashContent() {
        // Only proceed if we have deal data
        if (!currentDealData) return;
        
        // Look for dash content in deal info spans
        document.querySelectorAll('.deal-overview span').forEach(span => {
            if (span.textContent === '-') {
                console.log("🚨 Found dash content that needs fixing:", span);
                
                // Try to determine what this field is
                const parent = span.parentNode;
                if (parent) {
                    const parentText = parent.textContent;
                    
                    if (parentText.includes('Company')) {
                        span.textContent = currentDealData.name;
                    }
                    else if (parentText.includes('Value')) {
                        span.textContent = currentDealData.value;
                    }
                    else if (parentText.includes('Stage')) {
                        span.textContent = currentDealData.stage;
                    }
                    else if (parentText.includes('Date')) {
                        span.textContent = currentDealData.closeDate || 'Not set';
                    }
                }
            }
        });
    }
    
    // Extract deal data from selected deal
    function extractDealData(dealId, dealName) {
        console.log(`🔍 Extracting deal data for: ${dealName} (${dealId})`);
        
        let dealData = null;
        
        // Try to get data from dealStore if available
        if (dealId && window.dealStore && window.dealStore.deals) {
            dealData = window.dealStore.deals[dealId];
            console.log("Found deal in dealStore:", dealData);
        }
        
        // If we couldn't get data, create fallback data
        if (!dealData) {
            // Try to parse dealName for value
            let name = dealName;
            let value = '';
            
            if (dealName && dealName.includes(" - ")) {
                const parts = dealName.split(" - ");
                name = parts[0];
                value = parts[1];
            }
            
            // Create fallback data
            dealData = {
                id: dealId || 'unknown',
                name: name,
                value: value || '$0',
                stage: 'Unknown',
                probability: '0%',
                closeDate: 'Not set'
            };
            
            console.log("Created fallback deal data:", dealData);
        }
        
        // Store for later use
        currentDealData = dealData;
    }
    
    // Main emergency fix function
    function performEmergencyFix() {
        console.log("🚨 Performing emergency fix");
        
        if (!currentDealData) {
            console.log("❌ No deal data available");
            return;
        }
        
        try {
            // 1. Make sure the .deal-overview is shown
            showDealOverview();
            
            // 2. Find or create the info items
            updateOrCreateInfoItems();
            
        } catch (error) {
            console.error("❌ Error in emergency fix:", error);
        }
    }
    
    // Make sure deal overview is visible
    function showDealOverview() {
        // Find the no-deal-selected elements
        document.querySelectorAll('.no-deal-selected').forEach(el => {
            el.classList.remove('active');
            console.log("Removed active class from no-deal-selected");
        });
        
        // Find deal overview element
        const dealOverview = document.querySelector('.deal-overview');
        if (dealOverview) {
            dealOverview.classList.add('active');
            console.log("Made deal-overview active");
        } else {
            console.log("❌ Could not find .deal-overview");
            
            // Try to find deal-tab-content to add it
            const dealTabContent = document.querySelector('.deal-tab-content.overview-tab');
            if (dealTabContent) {
                // Create deal overview if it doesn't exist
                const newDealOverview = document.createElement('div');
                newDealOverview.className = 'deal-overview active';
                dealTabContent.appendChild(newDealOverview);
                console.log("Created new deal-overview element");
            }
        }
    }
    
    // Update or create info items
    function updateOrCreateInfoItems() {
        // Look for info items
        const dealOverview = document.querySelector('.deal-overview');
        if (!dealOverview) {
            console.log("❌ Could not find deal-overview");
            return;
        }
        
        // Define the info fields we need
        const infoFields = [
            { label: 'Company:', value: currentDealData.name, className: 'company-name' },
            { label: 'Value:', value: currentDealData.value, className: 'deal-value' },
            { label: 'Stage:', value: currentDealData.stage, className: 'deal-stage' },
            { label: 'Close Date:', value: currentDealData.closeDate || 'Not set', className: 'close-date' }
        ];
        
        // Find deal-info-grid
        let infoGrid = dealOverview.querySelector('.deal-info-grid');
        
        // If info grid doesn't exist, create it
        if (!infoGrid) {
            console.log("Creating new deal-info-grid");
            
            // First try to find a deal-section
            let dealSection = dealOverview.querySelector('.deal-section');
            
            if (!dealSection) {
                // Create the deal section
                dealSection = document.createElement('div');
                dealSection.className = 'deal-section';
                
                // Add heading
                const heading = document.createElement('h4');
                heading.textContent = 'Deal Information';
                dealSection.appendChild(heading);
                
                // Add to deal overview
                dealOverview.appendChild(dealSection);
            }
            
            // Create info grid
            infoGrid = document.createElement('div');
            infoGrid.className = 'deal-info-grid';
            dealSection.appendChild(infoGrid);
        }
        
        // Clear existing items if they exist
        infoGrid.innerHTML = '';
        
        // Create info items
        infoFields.forEach(field => {
            // Create info item
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            
            // Create label
            const label = document.createElement('span');
            label.className = 'info-label';
            label.textContent = field.label;
            
            // Create value
            const value = document.createElement('span');
            value.className = `info-value ${field.className}`;
            value.textContent = field.value;
            
            // Add to info item
            infoItem.appendChild(label);
            infoItem.appendChild(value);
            
            // Add to info grid
            infoGrid.appendChild(infoItem);
        });
        
        console.log("✅ Deal info items updated successfully");
    }
})(); 