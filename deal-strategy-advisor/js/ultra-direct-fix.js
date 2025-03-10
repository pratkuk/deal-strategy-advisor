/**
 * ULTRA DIRECT FIX - Last resort fix for dash-filled fields
 * 
 * This script directly targets the dash (-) characters in the deal information
 * section and replaces them with values from the currently selected deal.
 * It runs on a short interval to continuously fix any issues.
 */

(function() {
    console.log("🔥 ULTRA DIRECT FIX LOADED");
    
    // Get the currently selected deal (from multiple possible sources)
    function getCurrentDeal() {
        // First, try the most direct evidence - the deal info in the left pane
        const dealNameElement = document.querySelector('.active-deal-name, .deal-name');
        if (dealNameElement && dealNameElement.textContent) {
            const dealName = dealNameElement.textContent.trim();
            
            // Find all deals in dealStore that match this name
            if (window.dealStore && window.dealStore.deals) {
                for (const id in window.dealStore.deals) {
                    const deal = window.dealStore.deals[id];
                    if (deal.name === dealName) {
                        return deal;
                    }
                }
            }
            
            // If we can't find it in dealStore, create a fallback
            // Parse the name to get value if possible
            let value = '';
            if (dealName.includes(' - ')) {
                value = dealName.split(' - ')[1];
            }
            
            // Return a fallback deal object
            return {
                name: dealName,
                value: value || '$0',
                stage: 'Unknown',
                closeDate: 'N/A'
            };
        }
        
        // If we can't find an active deal name, check if dealStore has a currentDeal
        if (window.dealStore && window.dealStore.currentDeal) {
            return window.dealStore.currentDeal;
        }
        
        // If all else fails, return null
        return null;
    }
    
    // The main fix function
    function fixDashValues() {
        // Only run if a deal is selected
        const activeDealState = document.querySelector('.active-deal-state.active');
        if (!activeDealState) {
            return;
        }
        
        console.log("🔍 Checking for dash values to fix...");
        
        // Get the current deal
        const deal = getCurrentDeal();
        if (!deal) {
            console.log("❌ No current deal found");
            return;
        }
        
        console.log("✅ Found current deal:", deal.name);
        
        // Get all spans in the deal overview section
        const dealOverview = document.querySelector('.deal-overview');
        if (!dealOverview) {
            console.log("❌ Deal overview not found");
            return;
        }
        
        // Find all spans with dash content (both actual spans and others)
        const spans = dealOverview.querySelectorAll('span, .info-value');
        let fixedCount = 0;
        
        spans.forEach((span) => {
            // Skip spans that don't have dash content or are labels
            if (span.textContent !== '-' || 
                span.classList.contains('info-label') || 
                span.textContent.includes(':')) {
                return;
            }
            
            // Determine what this span is based on its parent
            const parent = span.parentNode;
            const parentText = parent ? parent.textContent : '';
            
            if (parentText.includes('Company')) {
                span.textContent = deal.name;
                fixedCount++;
            }
            else if (parentText.includes('Value')) {
                span.textContent = deal.value;
                fixedCount++;
            }
            else if (parentText.includes('Stage')) {
                span.textContent = deal.stage;
                fixedCount++;
            }
            else if (parentText.includes('Date') || parentText.includes('Close')) {
                span.textContent = deal.closeDate || 'Not set';
                fixedCount++;
            }
            // If we can't determine by parent text, make educated guess by position
            else {
                const allDashSpans = Array.from(dealOverview.querySelectorAll('span')).filter(s => s.textContent === '-');
                const index = allDashSpans.indexOf(span);
                
                if (index === 0) {
                    span.textContent = deal.name;
                    fixedCount++;
                }
                else if (index === 1) {
                    span.textContent = deal.value;
                    fixedCount++;
                }
                else if (index === 2) {
                    span.textContent = deal.stage;
                    fixedCount++;
                }
                else if (index === 3) {
                    span.textContent = deal.closeDate || 'Not set';
                    fixedCount++;
                }
            }
        });
        
        if (fixedCount > 0) {
            console.log(`✅ Fixed ${fixedCount} dash values`);
        }
    }
    
    // Also add a visual fix button
    function addFixButton() {
        const existingButton = document.getElementById('ultra-fix-button');
        if (existingButton) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'ultra-fix-button';
        button.textContent = 'FIX DASHES';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.backgroundColor = '#ff4d4d';
        button.style.color = 'white';
        button.style.padding = '8px 15px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.fontWeight = 'bold';
        button.style.zIndex = '10000';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', function() {
            fixDashValues();
            alert('Dash values fixed!');
        });
        
        document.body.appendChild(button);
    }
    
    // Initialize
    function initialize() {
        // Run fix immediately
        setTimeout(fixDashValues, 100);
        
        // Run fix shortly after
        setTimeout(fixDashValues, 500);
        setTimeout(fixDashValues, 1000);
        
        // Run fix on an interval
        setInterval(fixDashValues, 2000);
        
        // Add a button for manual fixes
        addFixButton();
        
        // Run fix when a deal is selected
        document.addEventListener('click', function(e) {
            // If the click target is a dropdown option
            if (e.target.getAttribute('data-deal')) {
                setTimeout(fixDashValues, 500);
                setTimeout(fixDashValues, 1000);
                setTimeout(fixDashValues, 1500);
            }
        });
    }
    
    // Run immediately if DOM is loaded, otherwise wait
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }
})(); 