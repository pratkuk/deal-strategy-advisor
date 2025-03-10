/**
 * Debug Verification Script
 * This script runs after all other scripts to ensure deals are properly loaded
 */

(function() {
    console.log('Debug verification script running...');
    
    // Function to check if dealStore is properly initialized
    function verifyDealStore() {
        console.log('Verifying dealStore...');
        
        if (typeof window.dealStore === 'undefined') {
            console.error('dealStore is not defined on window object');
            showError('dealStore is missing - dealData.js may not have loaded properly');
            return false;
        }
        
        if (!window.dealStore.deals || Object.keys(window.dealStore.deals).length === 0) {
            console.error('dealStore has no deals');
            showError('dealStore has no deals - data may be corrupted');
            return false;
        }
        
        console.log('dealStore is valid with ' + Object.keys(window.dealStore.deals).length + ' deals');
        return true;
    }
    
    // Function to display an error message visibly on the page
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.backgroundColor = '#ffebee';
        errorDiv.style.border = '1px solid #f44336';
        errorDiv.style.borderLeft = '5px solid #f44336';
        errorDiv.style.padding = '15px';
        errorDiv.style.marginBottom = '15px';
        errorDiv.style.borderRadius = '4px';
        errorDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #d32f2f;">Error</h3>
            <p style="margin-bottom: 10px;">${message}</p>
            <button onclick="window.location.reload()" style="background-color: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Reload Page</button>
        `;
        
        // Insert at the top of the first section
        const firstSection = document.querySelector('.debug-section');
        if (firstSection) {
            firstSection.insertBefore(errorDiv, firstSection.firstChild);
        } else {
            document.body.insertBefore(errorDiv, document.body.firstChild);
        }
    }
    
    // Function to force display of all deals
    function forceDisplayDeals() {
        console.log('Forcing display of all deals...');
        
        const dealsContainer = document.getElementById('availableDeals');
        if (!dealsContainer) {
            console.error('Cannot find deals container');
            return;
        }
        
        // Clear container first
        dealsContainer.innerHTML = '';
        
        // Add status indicator
        const statusDiv = document.createElement('div');
        statusDiv.style.padding = '10px';
        statusDiv.style.marginBottom = '10px';
        statusDiv.style.backgroundColor = '#e8f5e9';
        statusDiv.style.borderRadius = '4px';
        statusDiv.innerHTML = `<strong>Debug Status:</strong> Found ${Object.keys(window.dealStore.deals).length} deals`;
        dealsContainer.appendChild(statusDiv);
        
        // Add each deal
        Object.keys(window.dealStore.deals).forEach(dealId => {
            try {
                const deal = window.dealStore.deals[dealId];
                
                const card = document.createElement('div');
                card.className = 'deal-card';
                card.setAttribute('data-deal-id', dealId);
                card.innerHTML = `
                    <h3>${deal.name}</h3>
                    <div class="deal-card-details">
                        <div class="deal-card-value">${deal.value}</div>
                        <div class="deal-card-stage">${deal.stage}</div>
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #666;">
                        <strong>ID:</strong> ${dealId}
                    </div>
                `;
                
                // Add click handler
                card.addEventListener('click', function() {
                    console.log(`Selecting deal: ${dealId}`);
                    selectDebugDeal(dealId);
                });
                
                dealsContainer.appendChild(card);
            } catch (e) {
                console.error(`Error creating card for deal ${dealId}:`, e);
            }
        });
    }
    
    // Function that runs when the page is fully loaded
    function onFullyLoaded() {
        console.log('Page fully loaded, running verification...');
        
        // Verify dealStore
        if (verifyDealStore()) {
            // Force display of all deals
            forceDisplayDeals();
        }
    }
    
    // Wait for the page to be fully loaded
    if (document.readyState === 'complete') {
        onFullyLoaded();
    } else {
        window.addEventListener('load', onFullyLoaded);
    }
})(); 