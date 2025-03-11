/**
 * Emergency Dropdown Fix Script
 * Specifically targets both the Agent and Select Deal dropdowns separately
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔧 Dropdown fix script loaded");
    setTimeout(fixDropdowns, 100);
});

// Main function to fix all dropdowns
function fixDropdowns() {
    console.log("🔧 Fixing dropdown issues");
    
    // Clean up any existing handlers
    removeExistingHandlers();
    
    // Fix each dropdown type directly
    fixAgentDropdown();
    fixSelectDealDropdown();
    
    // Global click handler to close dropdowns
    setupGlobalHandler();
    
    // Add debug to page
    addDebugInfo();
}

// Remove any conflicting handlers
function removeExistingHandlers() {
    // Clone all dropdown buttons to remove existing listeners
    document.querySelectorAll('.select-deal-btn, .mode-selector-btn').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Clone all dropdown items to remove existing listeners
    document.querySelectorAll('.dropdown-content a').forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
    });
}

// Fix the Agent dropdown specifically (expand UPWARD)
function fixAgentDropdown() {
    // Get the specific elements
    const agentButton = document.querySelector('.widget-mode-selector .mode-selector-btn');
    const agentDropdown = document.querySelector('.widget-mode-selector .dropdown-content');
    
    if (!agentButton || !agentDropdown) {
        console.error("❌ Agent dropdown elements not found");
        return;
    }
    
    console.log("🔧 Setting up Agent dropdown (expands upward)");
    
    // Force critical inline styles for visibility
    agentDropdown.style.position = 'absolute';
    agentDropdown.style.bottom = '100%';
    agentDropdown.style.left = '0';
    agentDropdown.style.marginBottom = '6px';
    agentDropdown.style.zIndex = '9999';
    agentDropdown.style.display = 'none';
    
    // Add click handler to the button
    agentButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown-content.show').forEach(content => {
            if (content !== agentDropdown) {
                content.classList.remove('show');
                content.style.display = 'none';
            }
        });
        
        // Toggle this dropdown
        if (agentDropdown.classList.contains('show')) {
            agentDropdown.classList.remove('show');
            agentDropdown.style.display = 'none';
            console.log("🔽 Agent dropdown closed");
        } else {
            agentDropdown.classList.add('show');
            agentDropdown.style.display = 'block';
            console.log("🔼 Agent dropdown opened (upward)");
        }
    });
    
    // Add click handlers to each dropdown item
    agentDropdown.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Update the current mode display
            const currentMode = agentButton.querySelector('.current-mode');
            if (currentMode) {
                currentMode.textContent = this.textContent;
            }
            
            // Update active state
            agentDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Handle tab switching if needed
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                try {
                    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                    const activeTab = document.querySelector(`.tab-content.${tabId}-tab`);
                    if (activeTab) {
                        activeTab.classList.add('active');
                    }
                } catch (error) {
                    console.error('❌ Error switching tabs:', error);
                }
            }
            
            // Close the dropdown
            agentDropdown.classList.remove('show');
            agentDropdown.style.display = 'none';
        });
    });
}

// Fix the Select Deal dropdown specifically (expand DOWNWARD)
function fixSelectDealDropdown() {
    // Get the specific elements
    const dealButton = document.querySelector('.select-deal-btn');
    const dealDropdown = dealButton ? dealButton.nextElementSibling : null;
    
    if (!dealButton || !dealDropdown) {
        console.error("❌ Select Deal dropdown elements not found");
        return;
    }
    
    console.log("🔧 Setting up Select Deal dropdown (expands downward)");
    
    // Force critical inline styles for visibility
    dealDropdown.style.position = 'absolute';
    dealDropdown.style.top = '100%';
    dealDropdown.style.left = '0';
    dealDropdown.style.marginTop = '6px';
    dealDropdown.style.zIndex = '9999';
    dealDropdown.style.display = 'none';
    dealDropdown.style.minWidth = '220px';
    dealDropdown.style.backgroundColor = '#fff';
    dealDropdown.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
    dealDropdown.style.border = '1px solid rgba(0,0,0,0.1)';
    dealDropdown.style.borderRadius = '4px';
    
    // Add click handler to the button
    dealButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown-content.show').forEach(content => {
            if (content !== dealDropdown) {
                content.classList.remove('show');
                content.style.display = 'none';
            }
        });
        
        // Toggle this dropdown
        if (dealDropdown.classList.contains('show')) {
            dealDropdown.classList.remove('show');
            dealDropdown.style.display = 'none';
            console.log("🔽 Deal dropdown closed");
        } else {
            dealDropdown.classList.add('show');
            dealDropdown.style.display = 'block';
            console.log("🔽 Deal dropdown opened (downward)");
        }
    });
    
    // Add click handlers to each deal option
    dealDropdown.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the deal ID
            const dealId = this.getAttribute('data-deal');
            if (dealId) {
                try {
                    // Try to use the existing selectDeal function if available
                    if (typeof window.selectDeal === 'function') {
                        window.selectDeal(dealId);
                    } else {
                        // Fallback handling if the selectDeal function isn't available
                        console.log(`🔍 Selected deal: ${dealId}`);
                        
                        // Hide no-deal state and show active-deal state
                        document.querySelector('.no-deal-state').classList.remove('active');
                        document.querySelector('.active-deal-state').classList.add('active');
                        
                        // Update deal name display
                        const dealName = this.textContent;
                        document.querySelectorAll('.active-deal-name, .deal-name').forEach(el => {
                            if (el) el.textContent = dealName;
                        });
                        
                        // Show deal message and hide no-deal message
                        document.querySelector('.no-deal-message').classList.remove('active');
                        document.querySelector('.deal-message').classList.add('active');
                        
                        // Update deal details if visible
                        document.querySelectorAll('.no-deal-selected').forEach(el => el.classList.remove('active'));
                        document.querySelector('.deal-overview').classList.add('active');
                    }
                } catch (error) {
                    console.error('❌ Error selecting deal:', error);
                }
            }
            
            // Close the dropdown
            dealDropdown.classList.remove('show');
            dealDropdown.style.display = 'none';
        });
    });
}

// Close dropdowns when clicking elsewhere
function setupGlobalHandler() {
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content.show').forEach(content => {
                content.classList.remove('show');
                content.style.display = 'none';
            });
        }
    });
}

// Add debug info to help identify dropdown status
function addDebugInfo() {
    // Disable debug info
    return;
    
    const debugControls = document.createElement('div');
    debugControls.style.position = 'fixed';
    debugControls.style.bottom = '10px';
    debugControls.style.right = '10px';
    debugControls.style.background = 'rgba(0,0,0,0.7)';
    debugControls.style.color = 'white';
    debugControls.style.padding = '5px 10px';
    debugControls.style.borderRadius = '5px';
    debugControls.style.fontSize = '12px';
    debugControls.style.zIndex = '10000';
    debugControls.innerHTML = '<strong>Dropdown Debug:</strong> ' +
                             '<button id="test-agent-btn" style="margin-left:5px;padding:3px;">Test Agent</button> ' +
                             '<button id="test-deal-btn" style="margin-left:5px;padding:3px;">Test Deal</button>';
    
    document.body.appendChild(debugControls);
    
    // Debug buttons to manually trigger dropdowns
    document.getElementById('test-agent-btn').addEventListener('click', function() {
        const agentBtn = document.querySelector('.mode-selector-btn');
        if (agentBtn) agentBtn.click();
    });
    
    document.getElementById('test-deal-btn').addEventListener('click', function() {
        const dealBtn = document.querySelector('.select-deal-btn');
        if (dealBtn) dealBtn.click();
    });
}

// Run on page load if ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fixDropdowns, 100);
}

// Reinitialize periodically in case of dynamic DOM changes
setInterval(function() {
    // Only reinitialize if dropdowns aren't working
    const dealDropdown = document.querySelector('.select-deal-btn + .dropdown-content');
    const agentDropdown = document.querySelector('.widget-mode-selector .dropdown-content');
    
    if ((dealDropdown && !dealDropdown.hasClickHandlers) || 
        (agentDropdown && !agentDropdown.hasClickHandlers)) {
        console.log("🔄 Reinitializing dropdown handlers");
        fixDropdowns();
    }
}, 3000); 