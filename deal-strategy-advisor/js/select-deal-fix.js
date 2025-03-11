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
        
        // Get or create the select deal button
        let selectDealBtn = document.querySelector('.select-deal-btn');
        if (!selectDealBtn) {
            selectDealBtn = document.createElement('button');
            selectDealBtn.className = 'select-deal-btn';
            selectDealBtn.textContent = 'Select Deal';
        }
        
        // Remove any existing dropdown content
        const oldDropdown = document.querySelector('.select-deal-dropdown');
        if (oldDropdown) {
            oldDropdown.remove();
        }
        
        // Create new dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-content select-deal-dropdown';
        dropdown.style.display = 'none';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.marginTop = '5px';
        dropdown.style.backgroundColor = '#fff';
        dropdown.style.minWidth = '220px';
        dropdown.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        dropdown.style.zIndex = '9999';
        dropdown.style.borderRadius = '4px';
        dropdown.style.border = '1px solid rgba(0,0,0,0.1)';
        
        // Get deals from dealStore
        const deals = window.dealStore ? Object.values(window.dealStore.deals) : [
            { id: 'deal-1', name: 'Acme Corp', value: '$50,000' },
            { id: 'deal-2', name: 'TechStar Inc', value: '$75,000' },
            { id: 'deal-3', name: 'Global Systems', value: '$120,000' }
        ];
        
        // Add deal options
        deals.forEach(deal => {
            const dealOption = document.createElement('a');
            dealOption.href = '#';
            dealOption.setAttribute('data-deal', deal.id);
            dealOption.textContent = `${deal.name} - ${deal.value}`;
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
                dropdown.style.display = 'none';
            });
            
            dropdown.appendChild(dealOption);
        });
        
        // Add dropdown to container
        const dropdownContainer = selectDealBtn.parentNode || document.querySelector('.deal-selector');
        if (dropdownContainer) {
            dropdownContainer.style.position = 'relative';
            dropdownContainer.appendChild(dropdown);
        }
        
        // Toggle dropdown on button click
        selectDealBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("📋 Select Deal button clicked");
            
            // Close any other open dropdowns
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content !== dropdown) {
                    content.style.display = 'none';
                }
            });
            
            // Toggle this dropdown
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            console.log("📋 Dropdown toggled:", dropdown.style.display);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownContainer.contains(e.target)) {
                dropdown.style.display = 'none';
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