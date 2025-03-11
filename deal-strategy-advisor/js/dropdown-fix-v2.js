/**
 * Improved Dropdown Fix v2 - ABSOLUTE PRECEDENCE
 * Direct DOM manipulation approach to ensure dropdowns work consistently
 * This script will overwrite any other dropdown behavior
 */

(function() {
    console.log("🛠️ Dropdown Fix v2 PRIORITY VERSION loaded");

    // Create global flag
    window.dropdownFixV2Applied = false;
    
    // Run immediately and continuously check for changes
    setTimeout(initializeDropdownFixes, 0);
    
    // Main initialization function
    function initializeDropdownFixes() {
        console.log("🛠️ Initializing dropdown fixes v2 (priority version)");
        
        try {
            // Apply fixes for both dropdowns
            fixAgentDropdown();
            fixSelectDealDropdown(); // Renamed for clarity
            
            // Add global click handler to close dropdowns
            addGlobalClickHandler();
            
            // Add debug controls
            addDebugControls();
            
            // Set flag to indicate fixes are applied
            window.dropdownFixV2Applied = true;
            
            console.log("✅ Dropdown fixes v2 applied successfully");
        } catch (error) {
            console.error("❌ Error applying dropdown fixes:", error);
        }
    }
    
    // Fix the Agent dropdown (opens upward)
    function fixAgentDropdown() {
        console.log("🛠️ Fixing Agent dropdown");
        
        // 1. Find the dropdown button and content
        const agentButton = document.querySelector('.mode-selector-btn');
        let agentDropdown = document.querySelector('.widget-mode-selector .dropdown-content');
        
        if (!agentButton) {
            console.error("❌ Agent dropdown button not found");
            return;
        }
        
        // 2. If the dropdown content doesn't exist, create it
        if (!agentDropdown) {
            console.log("🛠️ Creating new Agent dropdown content");
            agentDropdown = createAgentDropdownContent();
            
            // Find the container
            const container = agentButton.closest('.widget-mode-selector');
            if (container) {
                container.appendChild(agentDropdown);
            } else {
                agentButton.parentNode.appendChild(agentDropdown);
            }
        }
        
        // 3. Apply critical styles to ensure visibility
        forceUpwardStyles(agentDropdown);
        
        // 4. Remove existing click handlers by cloning
        const newAgentButton = agentButton.cloneNode(true);
        agentButton.parentNode.replaceChild(newAgentButton, agentButton);
        
        // Find the .dropdown-content again after DOM changes
        agentDropdown = document.querySelector('.widget-mode-selector .dropdown-content');
        
        // 5. Add click handler to toggle dropdown
        newAgentButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🛠️ Agent button clicked");
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content !== agentDropdown) {
                    content.classList.remove('show');
                    content.style.display = 'none';
                    content.style.transform = '';
                    content.style.opacity = '0';
                }
            });
            
            // Toggle this dropdown with animation
            if (agentDropdown.classList.contains('show')) {
                // Hide dropdown with animation
                agentDropdown.style.opacity = '0';
                agentDropdown.style.transform = 'translateY(5px)';
                
                // Delay the actual hide to allow animation to complete
                setTimeout(() => {
                    agentDropdown.classList.remove('show');
                    agentDropdown.style.display = 'none';
                }, 150);
            } else {
                // Show dropdown with animation
                agentDropdown.classList.add('show');
                agentDropdown.style.display = 'block';
                agentDropdown.style.opacity = '0';
                agentDropdown.style.transform = 'translateY(5px)';
                
                // Force upward styles again to prevent overwrites
                forceUpwardStyles(agentDropdown);
                
                // Trigger animation
                setTimeout(() => {
                    agentDropdown.style.opacity = '1';
                    agentDropdown.style.transform = 'translateY(0)';
                }, 10);
            }
            
            console.log("🛠️ Agent dropdown toggled: " + (agentDropdown.classList.contains('show') ? 'showing' : 'hiding'));
        });
        
        // 6. Add click handlers to each dropdown item
        agentDropdown.querySelectorAll('a').forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const tabId = this.getAttribute('data-tab');
                console.log(`🛠️ Agent dropdown item clicked: ${tabId}`);
                
                // Update current mode display
                const currentMode = newAgentButton.querySelector('.current-mode');
                if (currentMode) {
                    currentMode.textContent = this.textContent;
                }
                
                // Update active state
                agentDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
                
                // MODIFIED: Keep chat-tab active for all tab selections
                // This ensures the widget doesn't go blank when selecting other tabs
                const chatTabContent = document.querySelector('.tab-content.chat-tab');
                
                // We'll always keep the chat tab visible but update active classes
                if (chatTabContent) {
                    // Remove active class from all tab contents
                    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                    
                    // Always show the chat tab content
                    chatTabContent.classList.add('active');
                    
                    // Dispatch a custom event to let other components know about the tab change
                    document.dispatchEvent(new CustomEvent('tabChanged', { 
                        detail: { tabId: tabId }
                    }));
                    
                    console.log(`🛠️ Keeping chat tab visible while setting active tab to: ${tabId}`);
                }
                
                // Close dropdown
                agentDropdown.classList.remove('show');
                agentDropdown.style.display = 'none';
            });
        });
        
        console.log("✅ Agent dropdown fix applied");
    }
    
    // Fix the SELECT DEAL dropdown (opens upward)
    function fixSelectDealDropdown() {
        console.log("🛠️ Fixing SELECT DEAL dropdown (expanding UPWARD)");
        
        // 1. Find the dropdown button
        const dealButton = document.querySelector('.select-deal-btn');
        if (!dealButton) {
            console.error("❌ Select Deal dropdown button not found");
            return;
        }
        
        // 2. Find or create dropdown container
        let dropdownContainer = dealButton.closest('.dropdown');
        if (!dropdownContainer) {
            // If there's no dropdown container, wrap the button in one
            console.log("🛠️ Creating dropdown container for Deal button");
            dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'dropdown';
            dropdownContainer.style.position = 'relative';
            dropdownContainer.style.display = 'inline-block';
            dealButton.parentNode.insertBefore(dropdownContainer, dealButton);
            dropdownContainer.appendChild(dealButton);
        }
        
        // 3. Find or create dropdown content
        let dealDropdown = dropdownContainer.querySelector('.dropdown-content');
        if (!dealDropdown) {
            console.log("🛠️ Creating new Deal dropdown content");
            dealDropdown = createDealDropdownContent();
            dropdownContainer.appendChild(dealDropdown);
        }
        
        // 4. Apply critical styles to FORCE upward expansion - HIGHEST PRIORITY
        forceUpwardStyles(dealDropdown);
                
        // 5. Remove existing click handlers by cloning
        const newDealButton = dealButton.cloneNode(true);
        dealButton.parentNode.replaceChild(newDealButton, dealButton);
        
        // Get the dropdown again after DOM changes
        dealDropdown = dropdownContainer.querySelector('.dropdown-content');
        
        // 6. Add click handler to toggle dropdown
        newDealButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🛠️ Select Deal button clicked");
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content !== dealDropdown) {
                    content.classList.remove('show');
                    content.style.display = 'none';
                    content.style.transform = '';
                    content.style.opacity = '0';
                }
            });
            
            // Toggle this dropdown with animation
            if (dealDropdown.classList.contains('show')) {
                // Hide dropdown with animation
                dealDropdown.style.opacity = '0';
                dealDropdown.style.transform = 'translateY(5px)';
                
                // Delay the actual hide to allow animation to complete
                setTimeout(() => {
                    dealDropdown.classList.remove('show');
                    dealDropdown.style.display = 'none';
                }, 150);
            } else {
                // Show dropdown with animation
                dealDropdown.classList.add('show');
                dealDropdown.style.display = 'block';
                dealDropdown.style.opacity = '0';
                dealDropdown.style.transform = 'translateY(5px)';
                
                // Force upward styles AGAIN when shown to prevent any overrides
                forceUpwardStyles(dealDropdown);
                
                // Trigger animation
                setTimeout(() => {
                    dealDropdown.style.opacity = '1';
                    dealDropdown.style.transform = 'translateY(0)';
                    
                    // One more time to be absolutely sure
                    forceUpwardStyles(dealDropdown);
                }, 10);
            }
            
            console.log("🛠️ Deal dropdown toggled: " + (dealDropdown.classList.contains('show') ? 'showing' : 'hiding'));
        });
        
        // 7. Add click handlers to each deal option
        dealDropdown.querySelectorAll('a').forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const dealId = this.getAttribute('data-deal');
                console.log(`🛠️ Deal dropdown item clicked: ${dealId}`);
                
                if (dealId) {
                    if (typeof window.selectDeal === 'function') {
                        // Use the existing function if available
                        window.selectDeal(dealId);
                    } else {
                        // Fallback implementation
                        handleDealSelection(dealId, this.textContent);
                    }
                }
                
                // Close dropdown
                dealDropdown.classList.remove('show');
                dealDropdown.style.display = 'none';
            });
        });
        
        console.log("✅ Select Deal dropdown fix applied (UPWARD expansion)");
    }
    
    // Helper function to force upward styles on a dropdown
    function forceUpwardStyles(dropdownElement) {
        if (!dropdownElement) return;
        
        // Force these exact styles - highest possible priority
        const forceStyles = {
            'display': 'none',
            'position': 'absolute',
            'bottom': '100%',            // Position ABOVE the button
            'left': '0',
            'top': 'auto',               // Explicitly override any top positioning
            'margin-bottom': '8px',      // Space ABOVE
            'margin-top': '0',           // Clear any top margin
            'background-color': '#fff',
            'box-shadow': '0px -2px 10px rgba(0,0,0,0.2), 0px 0px 16px rgba(0,0,0,0.1)', // Shadow for upward dropdown
            'border-radius': '4px',
            'border': '1px solid rgba(0,0,0,0.1)',
            'z-index': '9999',
            'min-width': '200px',
            'max-height': '300px',
            'overflow-y': 'auto',
            'transform-origin': 'bottom center',
            'transition': 'opacity 0.15s ease-out, transform 0.15s ease-out'
        };
        
        // Apply each style with !important
        Object.keys(forceStyles).forEach(key => {
            dropdownElement.style.setProperty(key, forceStyles[key], 'important');
        });
        
        // Update CSS show class to also use these styles
        if (dropdownElement.classList.contains('show')) {
            dropdownElement.style.setProperty('display', 'block', 'important');
        }
        
        // Add custom attribute to mark as fixed
        dropdownElement.setAttribute('data-fixed-upward', 'true');
    }
    
    // Create Agent dropdown content if needed
    function createAgentDropdownContent() {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-content';
        
        const options = [
            { id: 'agent', text: 'Assistant', active: false },
            { id: 'ask', text: 'Strategy', active: true },
            { id: 'tasks', text: 'Ask', active: false }
        ];
        
        options.forEach(option => {
            const link = document.createElement('a');
            link.href = '#';
            link.setAttribute('data-tab', option.id);
            link.textContent = option.text;
            if (option.active) {
                link.classList.add('active');
            }
            
            link.style.padding = '10px 16px';
            link.style.display = 'block';
            link.style.color = '#333';
            link.style.textDecoration = 'none';
            link.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
            
            dropdown.appendChild(link);
        });
        
        return dropdown;
    }
    
    // Create Deal dropdown content if needed
    function createDealDropdownContent() {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-content';
        dropdown.setAttribute('data-fixed-upward', 'true'); // Mark as fixed
        
        // Get real deals from dealStore if available
        let deals = [];
        
        if (window.dealStore && window.dealStore.deals) {
            Object.keys(window.dealStore.deals).forEach(dealId => {
                const deal = window.dealStore.deals[dealId];
                if (deal && deal.name && deal.value) {  // Only add valid deals
                    deals.push({
                        id: dealId,
                        name: deal.name,
                        value: deal.value
                    });
                }
            });
        }
        
        // If no deals found in dealStore, use fallback deals
        if (deals.length === 0) {
            deals = [
                { id: 'deal-1', name: 'Acme Corporation', value: '$52,500' },
                { id: 'deal-2', name: 'TechStar Inc', value: '$78,500' },
                { id: 'deal-3', name: 'Global Systems', value: '$124,000' }
            ];
        }
        
        deals.forEach(deal => {
            const link = document.createElement('a');
            link.href = '#';
            link.setAttribute('data-deal', deal.id);
            link.textContent = `${deal.name} - ${deal.value}`;
            
            // Add click handler directly to the link
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (typeof window.selectDeal === 'function') {
                    window.selectDeal(deal.id);
                } else {
                    handleDealSelection(deal.id, link.textContent);
                }
                
                // Close dropdown
                dropdown.classList.remove('show');
                dropdown.style.display = 'none';
            });
            
            link.style.padding = '10px 16px';
            link.style.display = 'block';
            link.style.color = '#333';
            link.style.textDecoration = 'none';
            link.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
            link.style.whiteSpace = 'nowrap';
            link.style.overflow = 'hidden';
            link.style.textOverflow = 'ellipsis';
            
            dropdown.appendChild(link);
        });
        
        return dropdown;
    }
    
    // Handle deal selection (fallback if window.selectDeal is not available)
    function handleDealSelection(dealId, dealText) {
        console.log(`🛠️ Selecting deal: ${dealId} - ${dealText}`);
        
        try {
            // Basic UI updates
            document.querySelector('.no-deal-state').classList.remove('active');
            document.querySelector('.active-deal-state').classList.add('active');
            
            // Update deal name displays
            document.querySelectorAll('.active-deal-name, .deal-name').forEach(el => {
                if (el) el.textContent = dealText.split(' - ')[0]; // Just the name, not the value
            });
            
            // Update deal stage pill if available
            const dealStage = window.dealStore && window.dealStore.deals[dealId] ? 
                window.dealStore.deals[dealId].stage : 'Unknown';
            
            document.querySelectorAll('.deal-stage-pill').forEach(el => {
                if (el) el.textContent = dealStage;
            });
            
            // Update message state
            const noMessageEl = document.querySelector('.no-deal-message');
            const dealMessageEl = document.querySelector('.deal-message');
            
            if (noMessageEl) noMessageEl.classList.remove('active');
            if (dealMessageEl) dealMessageEl.classList.add('active');
            
            // Update deal content view
            document.querySelectorAll('.no-deal-selected').forEach(el => {
                el.classList.remove('active');
            });
            
            const overviewEl = document.querySelector('.deal-overview');
            if (overviewEl) overviewEl.classList.add('active');
            
            // Dispatch custom event for other components
            document.dispatchEvent(new CustomEvent('dealSelected', { 
                detail: { dealId: dealId, dealName: dealText } 
            }));
            
        } catch (error) {
            console.error("❌ Error in handleDealSelection:", error);
        }
    }
    
    // Add a global click handler to close all dropdowns when clicking outside
    function addGlobalClickHandler() {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown') && !e.target.closest('.widget-mode-selector')) {
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.classList.remove('show');
                    content.style.display = 'none';
                });
            }
        });
    }
    
    // Add debug UI controls
    function addDebugControls() {
        // Disable debug controls
        return;
        
        const debugControls = document.createElement('div');
        debugControls.id = 'dropdown-debug-controls';
        debugControls.style.position = 'fixed';
        debugControls.style.bottom = '10px';
        debugControls.style.right = '10px';
        debugControls.style.background = 'rgba(0,0,0,0.7)';
        debugControls.style.color = 'white';
        debugControls.style.padding = '5px 10px';
        debugControls.style.borderRadius = '5px';
        debugControls.style.fontSize = '12px';
        debugControls.style.zIndex = '10000';
        debugControls.innerHTML = `
            <strong>Dropdown Debug:</strong>
            <button id="test-agent-btn" style="margin-left:5px;padding:3px;">Test Agent</button>
            <button id="test-deal-btn" style="margin-left:5px;padding:3px;">Test Deal</button>
            <button id="fix-dropdowns-btn" style="margin-left:5px;padding:3px;background:#f44336;color:white;">Force Fix</button>
        `;
        
        document.body.appendChild(debugControls);
        
        // Add click handlers to debug buttons
        document.getElementById('test-agent-btn').addEventListener('click', function() {
            const agentBtn = document.querySelector('.mode-selector-btn');
            if (agentBtn) agentBtn.click();
        });
        
        document.getElementById('test-deal-btn').addEventListener('click', function() {
            const dealBtn = document.querySelector('.select-deal-btn');
            if (dealBtn) dealBtn.click();
        });
        
        document.getElementById('fix-dropdowns-btn').addEventListener('click', function() {
            // Force a full reapplication of fixes
            console.log("🔄 Force-fixing all dropdowns");
            initializeDropdownFixes();
            
            // Additional force fix for any visible dropdowns
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                if (dropdown.classList.contains('show') || dropdown.style.display === 'block') {
                    forceUpwardStyles(dropdown);
                    dropdown.style.display = 'block';
                    dropdown.style.opacity = '1';
                    dropdown.style.transform = 'translateY(0)';
                }
            });
            
            // Alert when done
            alert("All dropdowns have been force-fixed to appear upward");
        });
    }
    
    // Special browser compatibility check for Safari and older browsers
    function fixForSafari() {
        // Fix for pointer-events in Safari
        const allDropdowns = document.querySelectorAll('.dropdown, .dropdown-content, .dropdown-content a');
        allDropdowns.forEach(el => {
            el.style.pointerEvents = 'auto';
        });
        
        // Force z-index on dropdowns
        const dropdownContents = document.querySelectorAll('.dropdown-content');
        dropdownContents.forEach(el => {
            el.style.zIndex = '9999';
            
            // Apply upward styles to any that should be upward
            if (el.closest('.widget-mode-selector') || 
                el.closest('.no-deal-state') || 
                el.closest('.dropdown')) {
                forceUpwardStyles(el);
                
                // If it's visible, make sure it stays that way
                if (el.classList.contains('show')) {
                    el.style.display = 'block';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            }
        });
    }
    
    // Run once per second to ensure all changes stick
    const fixInterval = setInterval(() => {
        fixForSafari();
        
        // Reapply any opened dropdowns that might have been affected by other scripts
        document.querySelectorAll('.dropdown-content.show').forEach(dropdown => {
            forceUpwardStyles(dropdown);
            dropdown.style.display = 'block';
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        });
        
    }, 1000);
    
    // Stop after 2 minutes to prevent continuous processing
    setTimeout(() => {
        clearInterval(fixInterval);
        console.log("🛑 Stopped dropdown monitoring interval (timeout reached)");
    }, 120000);
    
    // Run immediately if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeDropdownFixes();
    }
    
    // Run on page load
    window.addEventListener('load', function() {
        setTimeout(initializeDropdownFixes, 500);
    });
})(); 