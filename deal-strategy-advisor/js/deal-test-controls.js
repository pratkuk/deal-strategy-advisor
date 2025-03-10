/**
 * Deal Test Controls - Replaces test deal buttons with real deals from dealData.js
 * This script adds test controls with real deal buttons
 */

(function() {
    console.log("🔄 Deal Test Controls script loaded");
    
    // Set a flag to track if we've successfully replaced the buttons
    window.dealTestControlsApplied = false;
    
    // Function to initialize test controls with real deals
    function initializeDealTestControls() {
        // If we've already applied the changes, don't do it again
        if (window.dealTestControlsApplied) {
            console.log("Deal test controls already applied, skipping");
            return;
        }
        
        console.log("Attempting to replace test deal buttons with real deals");
        
        // Get the deal names from dealStore
        let dealNames = ["Acme Corporation (Fallback)", "TechStar Inc (Fallback)", "Global Systems (Fallback)"];
        
        // Try to get real deal names if dealStore is available
        if (window.dealStore && window.dealStore.deals) {
            console.log("Found dealStore with " + Object.keys(window.dealStore.deals).length + " deals");
            const dealIds = Object.keys(window.dealStore.deals);
            for (let i = 0; i < Math.min(3, dealIds.length); i++) {
                if (dealIds[i] && window.dealStore.deals[dealIds[i]]) {
                    dealNames[i] = window.dealStore.deals[dealIds[i]].name;
                }
            }
        } else {
            console.log("dealStore not available yet, using fallback names");
        }
        
        // Method 1: Find existing test deal buttons by innerText and replace them
        const replaceTestDealButtons = () => {
            // Find all buttons matching the pattern "Test Deal N"
            const buttons = Array.from(document.querySelectorAll('button'));
            console.log("Found " + buttons.length + " total buttons on the page");
            
            const testDealButtons = buttons.filter(btn => 
                btn.innerText && (
                    btn.innerText.trim() === "Test Deal 1" ||
                    btn.innerText.trim() === "Test Deal 2" ||
                    btn.innerText.trim() === "Test Deal 3"
                )
            );
            
            if (testDealButtons.length > 0) {
                console.log(`Found ${testDealButtons.length} test deal buttons to replace`);
                
                // Replace text and setup event listeners
                testDealButtons.forEach((btn, index) => {
                    if (index < 3) {
                        const oldText = btn.innerText;
                        btn.innerText = dealNames[index];
                        console.log(`Replaced "${oldText}" with "${dealNames[index]}"`);
                        
                        // Clear old event listeners by cloning
                        const newBtn = btn.cloneNode(true);
                        btn.parentNode.replaceChild(newBtn, btn);
                        
                        // Add our event listener
                        newBtn.addEventListener('click', function() {
                            const dealId = index === 0 ? 'deal-1' : (index === 1 ? 'deal-2' : 'deal-3');
                            selectRealDeal(dealId, dealNames[index]);
                        });
                    }
                });
                
                window.dealTestControlsApplied = true;
                return true;
            }
            return false;
        };
        
        // Method 2: Replace entire Test Controls div if found
        const replaceTestControlsDiv = () => {
            // Find Test Controls container by its heading content
            const divs = Array.from(document.querySelectorAll('div'));
            console.log("Searching through " + divs.length + " divs for Test Controls");
            
            const testControlsDiv = divs.find(div => 
                div.textContent && div.textContent.includes("Test Controls") && 
                div.textContent.includes("Test Deal 1")
            );
            
            if (testControlsDiv) {
                console.log("Found Test Controls div, replacing content:", testControlsDiv);
                
                // Update HTML content
                testControlsDiv.innerHTML = `
                    <div style="margin-bottom: 10px; font-weight: bold;">Test Controls</div>
                    <button id="realDeal1Btn" style="margin-right: 5px;">${dealNames[0]}</button>
                    <button id="realDeal2Btn" style="margin-right: 5px;">${dealNames[1]}</button>
                    <button id="realDeal3Btn" style="margin-right: 5px;">${dealNames[2]}</button>
                    <button id="testClearDealBtn" style="margin-top: 5px;">Clear Deal</button>
                    <div style="margin-top: 10px;">
                        <button id="testCommandBtn" style="margin-right: 5px;">/help Command</button>
                        <button id="testChatBtn">Test Chat</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <button id="testExpandPlusBtn">Show Deal Content</button>
                    </div>
                `;
                
                // Add event listeners
                document.getElementById('realDeal1Btn').addEventListener('click', function() {
                    selectRealDeal('deal-1', dealNames[0]);
                });
                
                document.getElementById('realDeal2Btn').addEventListener('click', function() {
                    selectRealDeal('deal-2', dealNames[1]);
                });
                
                document.getElementById('realDeal3Btn').addEventListener('click', function() {
                    selectRealDeal('deal-3', dealNames[2]);
                });
                
                document.getElementById('testClearDealBtn').addEventListener('click', function() {
                    clearSelectedDeal();
                });
                
                document.getElementById('testCommandBtn').addEventListener('click', function() {
                    simulateHelpCommand();
                });
                
                document.getElementById('testChatBtn').addEventListener('click', function() {
                    simulateTestChat();
                });
                
                document.getElementById('testExpandPlusBtn').addEventListener('click', function() {
                    showDealContent();
                });
                
                window.dealTestControlsApplied = true;
                return true;
            }
            return false;
        };
        
        // Try both methods
        const replaced = replaceTestDealButtons() || replaceTestControlsDiv();
        
        if (!replaced) {
            console.log("Could not find existing Test Controls to update. Will try again later.");
        } else {
            console.log("Successfully replaced Test Deal buttons with real deals");
        }
    }
    
    // Function to select a real deal
    function selectRealDeal(dealId, dealName) {
        console.log(`Selecting real deal: ${dealId} - ${dealName}`);
        
        // Try different methods to select the deal
        
        // Method 1: Use the dealStore directly
        if (window.dealStore && typeof window.dealStore.selectDeal === 'function') {
            try {
                window.dealStore.selectDeal(dealId);
                console.log("Selected deal using dealStore.selectDeal");
                return;
            } catch (e) {
                console.error("Error selecting deal with dealStore:", e);
            }
        }
        
        // Method 2: Use the global selectDeal function
        if (typeof window.selectDeal === 'function') {
            try {
                window.selectDeal(dealId);
                console.log("Selected deal using global selectDeal function");
                return;
            } catch (e) {
                console.error("Error selecting deal with global function:", e);
            }
        }
        
        // Method 3: Try to dispatch a custom event
        try {
            const event = new CustomEvent('dealSelected', { detail: { dealId: dealId } });
            document.dispatchEvent(event);
            console.log("Dispatched dealSelected event");
            return;
        } catch (e) {
            console.error("Error dispatching deal event:", e);
        }
        
        // Method 4: Try to simulate selection from dropdown
        try {
            const dealOption = document.querySelector(`[data-deal="${dealId}"]`);
            if (dealOption) {
                dealOption.click();
                console.log("Selected deal by clicking data-deal element");
                return;
            }
        } catch (e) {
            console.error("Error with dropdown selection:", e);
        }
        
        // If all methods fail, show an alert
        alert(`Could not select deal: ${dealName}. See console for details.`);
    }
    
    // Function to clear the selected deal
    function clearSelectedDeal() {
        console.log("Clearing selected deal");
        
        // Method 1: Use dealStore
        if (window.dealStore && typeof window.dealStore.clearDeal === 'function') {
            try {
                window.dealStore.clearDeal();
                console.log("Cleared deal using dealStore.clearDeal");
                return;
            } catch (e) {
                console.error("Error clearing deal with dealStore:", e);
            }
        }
        
        // Method 2: Use global function
        if (typeof window.clearDeal === 'function') {
            try {
                window.clearDeal();
                console.log("Cleared deal using global clearDeal function");
                return;
            } catch (e) {
                console.error("Error clearing deal with global function:", e);
            }
        }
        
        // Method 3: Try to dispatch a custom event
        try {
            document.dispatchEvent(new CustomEvent('dealCleared'));
            console.log("Dispatched dealCleared event");
            return;
        } catch (e) {
            console.error("Error dispatching clear deal event:", e);
        }
        
        // Method 4: Try to click the clear button
        try {
            const clearBtn = document.querySelector('.clear-deal-btn');
            if (clearBtn) {
                clearBtn.click();
                console.log("Cleared deal by clicking clear button");
                return;
            }
        } catch (e) {
            console.error("Error clicking clear button:", e);
        }
    }
    
    // Simulate help command
    function simulateHelpCommand() {
        console.log("Simulating help command");
        
        // Find the chat input
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            // Set the value
            chatInput.value = "/help";
            
            // Dispatch input event
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Find and click the send button
            const sendBtn = document.querySelector('.chat-send-btn');
            if (sendBtn) {
                sendBtn.click();
            }
        }
    }
    
    // Simulate test chat
    function simulateTestChat() {
        console.log("Simulating test chat");
        
        // Find the chat input
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            // Set the value
            chatInput.value = "What's the status of this deal?";
            
            // Dispatch input event
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Find and click the send button
            const sendBtn = document.querySelector('.chat-send-btn');
            if (sendBtn) {
                sendBtn.click();
            }
        }
    }
    
    // Show deal content
    function showDealContent() {
        console.log("Showing deal content");
        
        // Try to expand the widget
        const widget = document.getElementById('deal-chat-widget');
        if (widget) {
            widget.classList.add('widget-expanded');
            widget.classList.add('widget-expanded-plus');
            
            // Update button text
            const expandBtn = document.querySelector('.widget-expand-btn');
            if (expandBtn) {
                expandBtn.textContent = "−";
            }
            
            console.log("Widget expanded to show deal content");
        }
    }
    
    // Initialize the test controls when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDealTestControls);
    } else {
        // DOM is already loaded, run immediately
        initializeDealTestControls();
    }
    
    // Try multiple times to catch when the elements are added to the DOM
    const checkInterval = setInterval(function() {
        if (window.dealTestControlsApplied) {
            console.log("Deal test controls successfully applied, stopping interval checks");
            clearInterval(checkInterval);
        } else {
            console.log("Checking for Test Controls to replace...");
            initializeDealTestControls();
        }
    }, 500);
    
    // Also clear the interval after 10 seconds to prevent infinite checking
    setTimeout(function() {
        clearInterval(checkInterval);
    }, 10000);
})(); 