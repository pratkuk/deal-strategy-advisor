/**
 * Recovery utility script for Deal Strategy Advisor
 * Detects and recovers from page freezes or unresponsiveness
 */

// Health check functionality
(function() {
    // Set up a heartbeat to detect UI freezes
    let lastHeartbeat = Date.now();
    let heartbeatInterval = null;
    let recoveryAttempts = 0;
    let isRecovering = false;
    
    // Health check interval (in ms) - Increased to reduce frequency
    const HEALTH_CHECK_INTERVAL = 8000;
    
    // Threshold for considering UI frozen (in ms) - Increased to be less aggressive
    const FREEZE_THRESHOLD = 12000;
    
    // Maximum number of recovery attempts
    const MAX_RECOVERY_ATTEMPTS = 3;
    
    // Mark a heartbeat
    function registerHeartbeat() {
        lastHeartbeat = Date.now();
        
        // Reset recovery attempts counter if UI is responsive
        if (recoveryAttempts > 0 && !isRecovering) {
            console.log('UI is responsive again, resetting recovery counter');
            recoveryAttempts = 0;
        }
    }
    
    // Check for UI responsiveness
    function checkHealth() {
        if (isRecovering) return; // Skip check if already recovering
        
        const now = Date.now();
        const timeSinceLastHeartbeat = now - lastHeartbeat;
        
        if (timeSinceLastHeartbeat > FREEZE_THRESHOLD) {
            // Check if there's active content loading
            const loadingIndicators = document.querySelectorAll('.loading-indicator');
            if (loadingIndicators.length > 0) {
                console.log('Content is still loading, delaying recovery check');
                return;
            }
            
            // UI might be frozen
            console.warn(`Possible UI freeze detected (${timeSinceLastHeartbeat}ms since last interaction)`);
            
            if (recoveryAttempts < MAX_RECOVERY_ATTEMPTS) {
                recoveryAttempts++;
                console.warn(`Attempting recovery (attempt ${recoveryAttempts}/${MAX_RECOVERY_ATTEMPTS})`);
                attemptRecovery();
            } else {
                console.error('Maximum recovery attempts reached');
                showRecoveryMessage();
            }
        }
    }
    
    // Attempt to recover from UI freeze
    function attemptRecovery() {
        try {
            isRecovering = true;
            
            // Check if we actually need to recover
            if (window.dealStore && window.dealStore.currentDeal) {
                const currentDeal = window.dealStore.deals[window.dealStore.currentDeal];
                if (currentDeal) {
                    console.log('Recovery: Current deal is valid, refreshing UI');
                    // Just refresh the UI
                    if (typeof window.forceDealContentUpdate === 'function') {
                        window.forceDealContentUpdate(currentDeal.id, currentDeal.name);
                    }
                    isRecovering = false;
                    registerHeartbeat();
                    return;
                }
            }
            
            // Only clear if necessary
            console.log('Recovery: Resetting application state');
            
            // Clear any loading states first
            document.querySelectorAll('.loading-indicator').forEach(el => {
                el.innerHTML = 'Loading cancelled';
            });
            
            // Reset deal store
            if (window.dealStore) {
                window.dealStore.currentDeal = null;
            }
            
            // Reset UI elements
            const dealContentPane = document.querySelector('.deal-content-pane');
            if (dealContentPane) {
                dealContentPane.innerHTML = '<div class="message">Please select a deal to continue.</div>';
            }
            
            // Reset the context bar
            const noDealState = document.querySelector('.no-deal-state');
            const activeDealState = document.querySelector('.active-deal-state');
            if (noDealState && activeDealState) {
                noDealState.classList.add('active');
                activeDealState.classList.remove('active');
            }
            
            // Clear any pending timeouts
            const highestTimeoutId = setTimeout(";");
            for (let i = 0; i < highestTimeoutId; i++) {
                clearTimeout(i);
            }
            
            // Reset any ongoing operations
            window.onRecovery && window.onRecovery();
            
            isRecovering = false;
            registerHeartbeat();
            
        } catch (error) {
            console.error('Recovery attempt failed:', error);
            isRecovering = false;
        }
    }
    
    // Show a recovery message to the user
    function showRecoveryMessage() {
        try {
            const existingMessage = document.querySelector('.recovery-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageContainer = document.createElement('div');
            messageContainer.className = 'recovery-message';
            messageContainer.innerHTML = `
                <div class="recovery-header">Deal Strategy Advisor is not responding</div>
                <div class="recovery-content">
                    <p>The application seems to be unresponsive. Would you like to:</p>
                    <button class="recovery-btn" id="refreshBtn">Refresh Page</button>
                    <button class="recovery-btn" id="resetBtn">Reset State</button>
                </div>
            `;
            
            document.body.appendChild(messageContainer);
            
            document.getElementById('refreshBtn').addEventListener('click', function() {
                window.location.reload();
            });
            
            document.getElementById('resetBtn').addEventListener('click', function() {
                messageContainer.remove();
                attemptRecovery();
            });
        } catch (error) {
            console.error('Could not show recovery message:', error);
        }
    }
    
    // Start the health checker
    function startHealthChecker() {
        // Register heartbeat for various user interactions
        document.addEventListener('click', registerHeartbeat);
        document.addEventListener('keydown', registerHeartbeat);
        document.addEventListener('mousemove', registerHeartbeat);
        document.addEventListener('scroll', registerHeartbeat);
        
        // Set up the interval checker
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
        }
        heartbeatInterval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
        
        // Initial heartbeat
        registerHeartbeat();
    }
    
    // Start monitoring
    startHealthChecker();
})();

// Recovery handler
function handleRecovery(dealId, deal) {
    // Don't reset if we have valid deal data
    if (deal && deal.id) {
        console.log('Recovery: Valid deal data found, skipping reset');
        return false;
    }

    // Check if dealStore exists and has the current deal
    if (window.dealStore && window.dealStore.currentDeal) {
        const currentDeal = window.dealStore.deals[window.dealStore.currentDeal];
        if (currentDeal) {
            console.log('Recovery: Current deal found in store, preserving state');
            return false;
        }
    }

    // Only initialize dealStore if it doesn't exist
    if (!window.dealStore) {
        console.log('Recovery: Initializing dealStore');
        window.dealStore = {
            deals: {},
            currentDeal: null
        };
        return true;
    }

    return false;
}

// Export recovery handler
window.handleRecovery = handleRecovery; 