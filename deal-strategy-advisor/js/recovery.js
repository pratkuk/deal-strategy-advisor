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
    
    // Health check interval (in ms)
    const HEALTH_CHECK_INTERVAL = 5000;
    
    // Threshold for considering UI frozen (in ms)
    const FREEZE_THRESHOLD = 8000;
    
    // Maximum number of recovery attempts
    const MAX_RECOVERY_ATTEMPTS = 3;
    
    // Mark a heartbeat
    function registerHeartbeat() {
        lastHeartbeat = Date.now();
        
        // Reset recovery attempts counter if UI is responsive
        if (recoveryAttempts > 0) {
            console.log('UI is responsive again');
            recoveryAttempts = 0;
        }
    }
    
    // Check for UI responsiveness
    function checkHealth() {
        const now = Date.now();
        const timeSinceLastHeartbeat = now - lastHeartbeat;
        
        if (timeSinceLastHeartbeat > FREEZE_THRESHOLD) {
            // UI might be frozen
            console.warn(`Possible UI freeze detected (${timeSinceLastHeartbeat}ms since last interaction)`);
            
            if (recoveryAttempts < MAX_RECOVERY_ATTEMPTS) {
                recoveryAttempts++;
                console.warn(`Attempting recovery (attempt ${recoveryAttempts}/${MAX_RECOVERY_ATTEMPTS})`);
                attemptRecovery();
            } else {
                console.error('Maximum recovery attempts reached. Please refresh the page manually.');
                showRecoveryMessage();
            }
        }
    }
    
    // Attempt to recover from UI freeze
    function attemptRecovery() {
        try {
            // Clear any potential infinite loop in deal rendering
            if (window.dealStore && window.dealStore.currentDeal) {
                console.log('Clearing current deal to recover');
                window.dealStore.currentDeal = null;
                
                // Clear the UI
                const dealContentPane = document.querySelector('.deal-content-pane');
                if (dealContentPane) {
                    dealContentPane.innerHTML = '<div class="error-message">Recovery process: Deal content has been reset due to a performance issue. Please select a deal again.</div>';
                }
                
                // Reset the context bar
                const noDealState = document.querySelector('.no-deal-state');
                const activeDealState = document.querySelector('.active-deal-state');
                if (noDealState && activeDealState) {
                    noDealState.classList.add('active');
                    activeDealState.classList.remove('active');
                }
            }
            
            // Reset any ongoing operations
            window.onRecovery && window.onRecovery();
            
            // Mark a heartbeat to prevent immediate retrigger
            registerHeartbeat();
            
        } catch (error) {
            console.error('Recovery attempt failed:', error);
        }
    }
    
    // Show a recovery message to the user
    function showRecoveryMessage() {
        try {
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
                attemptRecovery();
                messageContainer.remove();
            });
        } catch (error) {
            // If we can't show the message, just log it
            console.error('Could not show recovery message:', error);
        }
    }
    
    // Start the health checker
    function startHealthChecker() {
        // Register heartbeat when user interacts with the page
        document.addEventListener('click', registerHeartbeat);
        document.addEventListener('keydown', registerHeartbeat);
        document.addEventListener('mousemove', registerHeartbeat);
        document.addEventListener('scroll', registerHeartbeat);
        
        // Set up the interval checker
        heartbeatInterval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
        
        // Initial heartbeat
        registerHeartbeat();
    }
    
    // Wait for page load, then start the health checker
    if (document.readyState === 'complete') {
        startHealthChecker();
    } else {
        window.addEventListener('load', startHealthChecker);
    }
    
    // Add some CSS for the recovery message
    const style = document.createElement('style');
    style.textContent = `
        .recovery-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 20px;
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        }
        .recovery-header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #e53935;
        }
        .recovery-content p {
            margin-bottom: 20px;
            color: #333;
        }
        .recovery-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            margin-right: 10px;
            cursor: pointer;
            font-weight: 500;
        }
        #refreshBtn {
            background-color: #4f89f2;
            color: white;
        }
        #resetBtn {
            background-color: #f1f1f1;
            color: #333;
        }
    `;
    document.head.appendChild(style);
    
    // Expose globally for advanced recovery
    window.dealAdvisorRecovery = {
        registerHeartbeat,
        attemptRecovery,
        reset: function() {
            recoveryAttempts = 0;
            registerHeartbeat();
        }
    };
})(); 