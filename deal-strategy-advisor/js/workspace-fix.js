/**
 * workspace-fix.js - Direct fix for workspace tab navigation
 * This script provides direct event handlers for workspace tabs without relying on modules
 */

(function() {
    // Execute when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📌 Workspace-fix direct handlers loaded');
        initWorkspaceTabs();
        // Disabled workspace controls
        // addWorkspaceTabDiagnosticButton();
    });

    // Initialize workspace tabs directly
    function initWorkspaceTabs() {
        const workspaceTabs = document.querySelectorAll('.workspace-tabs .tab');
        
        if (workspaceTabs.length === 0) {
            console.warn('No workspace tabs found');
            return;
        }
        
        console.log(`Found ${workspaceTabs.length} workspace tabs`);
        
        // Add click handlers to each tab
        workspaceTabs.forEach(tab => {
            // First, remove any existing event listeners (to avoid duplicates)
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            // Add our direct event listener
            newTab.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const tabId = this.getAttribute('data-tab');
                if (!tabId) {
                    console.warn('Tab missing data-tab attribute:', this);
                    return;
                }
                
                console.log(`Switching to workspace tab: ${tabId}`);
                
                // Remove active class from all tabs and content
                document.querySelectorAll('.workspace-tabs .tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.workspace-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const contentId = `${tabId}-content`;
                const content = document.getElementById(contentId);
                if (content) {
                    content.classList.add('active');
                } else {
                    console.warn(`Content not found for tab: ${contentId}`);
                }
            });
            
            console.log(`Added direct click handler to tab: ${newTab.getAttribute('data-tab')}`);
        });
        
        console.log('Workspace tabs initialized with direct handlers');
    }
    
    // Add diagnostic button to test controls
    function addWorkspaceTabDiagnosticButton() {
        // Disabled workspace controls
        return;
        
        function addButton() {
            // Try multiple possible selectors for test controls
            const testSelectors = [
                '.ui-test-controls', 
                '[id*="test-controls"]', 
                '.test-controls',
                'div:contains("Test Controls")',
                'div[style*="fixed"][style*="right"]', // Likely a fixed positioned div
                '#test-mode-indicator', // The TESTING MODE indicator
                'div:contains("Test Deal")' // Any div containing Test Deal text
            ];
            
            let testControls = null;
            for (let selector of testSelectors) {
                try {
                    const element = document.querySelector(selector);
                    if (element) {
                        testControls = element.closest('div'); // Get the parent div
                        if (testControls.innerText.includes('Test')) {
                            break; // Found it!
                        }
                    }
                } catch (e) {
                    // Ignore errors for invalid selectors
                }
            }
            
            // Fallback: Look for controls based on style (fixed position at top)
            if (!testControls) {
                const allDivs = document.querySelectorAll('div');
                for (let div of allDivs) {
                    if (div.innerText && div.innerText.includes('Test Deal')) {
                        testControls = div;
                        break;
                    }
                }
            }
            
            if (!testControls) {
                console.warn('Test controls container not found - creating one');
                // Create a test controls container if none exists
                testControls = document.createElement('div');
                testControls.style.position = 'fixed';
                testControls.style.top = '100px';
                testControls.style.right = '10px';
                testControls.style.backgroundColor = '#f8f8f8';
                testControls.style.padding = '10px';
                testControls.style.borderRadius = '5px';
                testControls.style.border = '1px solid #ddd';
                testControls.style.zIndex = '9999';
                testControls.innerHTML = '<div style="font-weight: bold; margin-bottom: 5px;">Workspace Controls</div>';
                document.body.appendChild(testControls);
            }
            
            // Create diagnostic button
            const tabFixButton = document.createElement('button');
            tabFixButton.textContent = 'Fix Workspace Tabs';
            tabFixButton.style.backgroundColor = '#f5a742';
            tabFixButton.style.color = 'white';
            tabFixButton.style.border = 'none';
            tabFixButton.style.padding = '8px 12px';
            tabFixButton.style.borderRadius = '4px';
            tabFixButton.style.margin = '5px';
            tabFixButton.style.cursor = 'pointer';
            tabFixButton.style.display = 'block';
            tabFixButton.style.width = '100%';
            tabFixButton.style.marginTop = '10px';
            
            // Add click handler
            tabFixButton.addEventListener('click', function() {
                console.log('🔧 Manually reinitializing workspace tabs');
                initWorkspaceTabs();
                alert('Workspace tabs reinitialized!');
            });
            
            // Add to the test controls
            testControls.appendChild(tabFixButton);
            console.log('Added workspace tab diagnostic button to test controls');
        }
        
        // Try immediately
        addButton();
        
        // Also try with a delay in case test controls are added dynamically
        setTimeout(addButton, 1500);
        
        // And check again after more delay in case test.js loads late
        setTimeout(addButton, 3000);
    }
    
    // Force initialization after a delay to ensure it works even if other scripts are slow
    setTimeout(function() {
        console.log('Forcing workspace tab initialization');
        initWorkspaceTabs();
    }, 1000);
})(); 