/**
 * DIRECT SELECT DEAL DROPDOWN FIX
 * This script fixes ONLY the Select Deal dropdown with a direct approach
 */

// Execute immediately and also on DOM loaded
(function() {
    // Run immediately
    setTimeout(fixSelectDealDropdown, 100);
    
    // Also run when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log("📋 Select Deal Fix loading...");
        setTimeout(fixSelectDealDropdown, 100);
    });
    
    // Also run when window loads (all resources)
    window.addEventListener('load', function() {
        setTimeout(fixSelectDealDropdown, 300);
    });
    
    // Direct fix for Select Deal dropdown
    function fixSelectDealDropdown() {
        console.log("📋 Attempting to fix Select Deal dropdown");
        
        // Find the elements
        const dealButton = document.querySelector('.select-deal-btn');
        if (!dealButton) {
            console.error("❌ Select Deal button not found");
            return;
        }
        
        // Force direct styling to make button visible and clickable
        dealButton.style.position = "relative";
        dealButton.style.zIndex = "2000";
        dealButton.style.cursor = "pointer";
        dealButton.style.backgroundColor = "#4285f4";
        dealButton.style.color = "white";
        dealButton.style.border = "none";
        dealButton.style.borderRadius = "4px";
        dealButton.style.padding = "8px 12px";
        
        // Clone to remove any existing handlers
        const newDealButton = dealButton.cloneNode(true);
        dealButton.parentNode.replaceChild(newDealButton, dealButton);
        
        // Create a completely new dropdown menu from scratch
        const dealContainer = newDealButton.closest('.no-deal-state');
        if (!dealContainer) {
            console.error("❌ Deal container not found");
            return;
        }
        
        // Remove old dropdown content if it exists
        const oldDropdown = dealContainer.querySelector('.dropdown-content');
        if (oldDropdown) {
            oldDropdown.remove();
        }
        
        // Create new dropdown
        const newDropdown = document.createElement('div');
        newDropdown.className = 'dropdown-content select-deal-dropdown';
        newDropdown.style.display = 'none';
        newDropdown.style.position = 'absolute';
        newDropdown.style.top = '100%';
        newDropdown.style.left = '0';
        newDropdown.style.marginTop = '5px';
        newDropdown.style.backgroundColor = '#fff';
        newDropdown.style.minWidth = '220px';
        newDropdown.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        newDropdown.style.zIndex = '9999';
        newDropdown.style.borderRadius = '4px';
        newDropdown.style.border = '1px solid rgba(0,0,0,0.1)';
        
        // Add deal options from data or hardcoded examples
        const deals = window.dealStore ? window.dealStore.deals : [
            { id: 'deal-1', name: 'Acme Corp', value: '$50,000' },
            { id: 'deal-2', name: 'TechStar Inc', value: '$75,000' },
            { id: 'deal-3', name: 'Global Systems', value: '$120,000' }
        ];
        
        deals.forEach(deal => {
            const dealOption = document.createElement('a');
            dealOption.href = '#';
            dealOption.setAttribute('data-deal', deal.id || 'deal-1');
            dealOption.textContent = `${deal.name || 'Company'} - ${deal.value || '$0'}`;
            dealOption.style.color = '#333';
            dealOption.style.padding = '10px 16px';
            dealOption.style.textDecoration = 'none';
            dealOption.style.display = 'block';
            dealOption.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
            
            // Hover effect
            dealOption.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#f5f5f5';
            });
            
            dealOption.addEventListener('mouseout', function() {
                this.style.backgroundColor = '';
            });
            
            // Click handler
            dealOption.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Handle deal selection
                const dealId = this.getAttribute('data-deal');
                handleDealSelection(dealId, this.textContent);
                
                // Hide dropdown
                newDropdown.style.display = 'none';
            });
            
            newDropdown.appendChild(dealOption);
        });
        
        // Add dropdown to container
        const dropdownContainer = newDealButton.parentNode;
        dropdownContainer.appendChild(newDropdown);
        
        // Toggle dropdown on button click
        newDealButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("📋 Select Deal button clicked");
            
            // Close any other open dropdowns
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content !== newDropdown) {
                    content.style.display = 'none';
                }
            });
            
            // Toggle this dropdown
            newDropdown.style.display = 
                newDropdown.style.display === 'none' || newDropdown.style.display === '' 
                ? 'block' 
                : 'none';
                
            console.log("📋 Dropdown toggled: " + newDropdown.style.display);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownContainer.contains(e.target)) {
                newDropdown.style.display = 'none';
            }
        });
        
        console.log("✅ Select Deal dropdown fix applied");
    }
    
    // Handle deal selection
    function handleDealSelection(dealId, dealText) {
        console.log(`📋 Selected deal: ${dealId} (${dealText})`);
        
        try {
            // Try to use existing function if available
            if (typeof window.selectDeal === 'function') {
                window.selectDeal(dealId);
                return;
            }
            
            // Otherwise do the minimal required updates
            document.querySelector('.no-deal-state').classList.remove('active');
            document.querySelector('.active-deal-state').classList.add('active');
            
            // Update deal name displays
            document.querySelectorAll('.active-deal-name, .deal-name').forEach(el => {
                if (el) el.textContent = dealText;
            });
            
            // Update message state
            document.querySelector('.no-deal-message').classList.remove('active');
            document.querySelector('.deal-message').classList.add('active');
            
            // Update deal content view
            document.querySelectorAll('.no-deal-selected').forEach(el => {
                el.classList.remove('active');
            });
            document.querySelector('.deal-overview').classList.add('active');
            
        } catch (error) {
            console.error("❌ Error selecting deal:", error);
        }
    }
})(); 