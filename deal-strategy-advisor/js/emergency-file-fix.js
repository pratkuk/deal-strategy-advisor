/**
 * Emergency File Upload Fix
 * This script provides a hard fix for file upload issues in the Deal Strategy Advisor app.
 */

(function() {
    console.log('Emergency file upload fix initializing...');
    
    // Run as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM ready - applying emergency file fixes');
        initEmergencyFileFix();
    });
    
    // Also try to run immediately for already loaded pages
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('Document already loaded - applying emergency file fixes');
        setTimeout(initEmergencyFileFix, 0);
    }
    
    function initEmergencyFileFix() {
        try {
            // 1. Add global emergency file handler function
            if (!window.emergencyFileUpload) {
                window.emergencyFileUpload = function(files) {
                    console.log('Emergency file upload requested', files);
                    
                    // Ensure we have the deal content module
                    if (window.DealContent) {
                        console.log('Using DealContent module for emergency upload');
                        window.DealContent.handleFileUploaded(files);
                    } 
                    // Fallback to ChatWidget if available
                    else if (window.chatWidget && window.chatWidget.FileHandler) {
                        console.log('Using ChatWidget for emergency upload');
                        const dealStore = window.dealStore || {};
                        const currentDeal = dealStore.currentDeal;
                        
                        if (currentDeal) {
                            window.chatWidget.FileHandler.addFilesToDeal(files, currentDeal);
                        } else {
                            console.error('No current deal found for emergency upload');
                            
                            // Try to use any available deal
                            const dealIds = dealStore.deals ? Object.keys(dealStore.deals) : [];
                            if (dealIds.length > 0) {
                                const firstDeal = dealStore.deals[dealIds[0]];
                                console.log('Using first available deal for emergency upload', firstDeal.id);
                                window.chatWidget.FileHandler.addFilesToDeal(files, firstDeal);
                            }
                        }
                    } else {
                        console.error('No file handler modules found for emergency upload');
                    }
                };
            }
            
            // 2. Override the default file input handler
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                // Remove existing listeners
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
                
                // Add our emergency handler
                newInput.addEventListener('change', function(e) {
                    console.log('Emergency file handler intercepted file input change', e.target.files);
                    if (e.target.files && e.target.files.length > 0) {
                        // Call both normal and emergency handlers
                        if (window.emergencyFileUpload) {
                            window.emergencyFileUpload(e.target.files);
                        }
                    }
                });
            });
            
            // 3. Add a file drop zone to the entire deal content pane
            const contentPane = document.querySelector('.deal-content-pane');
            if (contentPane) {
                // Add file drop styling
                contentPane.style.position = 'relative';
                
                // Create drop message element
                const dropMessage = document.createElement('div');
                dropMessage.className = 'file-drop-message';
                dropMessage.innerHTML = 'Drop files here';
                dropMessage.style.cssText = 'display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(66, 133, 244, 0.7); color: white; font-size: 24px; font-weight: bold; text-align: center; padding-top: 40%; z-index: 1000;';
                contentPane.appendChild(dropMessage);
                
                // Add drag and drop handlers
                contentPane.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropMessage.style.display = 'block';
                });
                
                contentPane.addEventListener('dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropMessage.style.display = 'none';
                });
                
                contentPane.addEventListener('drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropMessage.style.display = 'none';
                    
                    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        console.log('Files dropped on deal content pane', e.dataTransfer.files);
                        
                        // Process the dropped files
                        if (window.emergencyFileUpload) {
                            window.emergencyFileUpload(e.dataTransfer.files);
                        }
                    }
                });
            }
            
            // 4. Monitor and fix deal context visibility
            setInterval(function() {
                // Check if we have a selected deal but the context pane is not visible
                const dealStore = window.dealStore || {};
                const hasDeal = dealStore.currentDeal !== null && dealStore.currentDeal !== undefined;
                const contentPane = document.querySelector('.deal-content-pane');
                
                if (hasDeal && contentPane) {
                    // Make sure content pane is visible
                    const isHidden = contentPane.style.display === 'none' || 
                                   contentPane.style.visibility === 'hidden' ||
                                   contentPane.offsetParent === null;
                    
                    if (isHidden) {
                        console.log('Emergency fix: Deal content pane was hidden but should be visible');
                        contentPane.style.display = 'block';
                        contentPane.style.visibility = 'visible';
                        contentPane.style.opacity = '1';
                        contentPane.style.width = '400px';
                        
                        // Expand widget
                        const widget = document.getElementById('deal-chat-widget');
                        if (widget) {
                            widget.className = 'widget-expanded-plus';
                        }
                        
                        // Try to render files if files tab is active
                        if (window.DealContent) {
                            const activeTab = window.DealContent.getActiveTabName();
                            if (activeTab === 'files') {
                                window.DealContent.renderFiles();
                            }
                        }
                    }
                }
            }, 1000); // Check every second
            
            console.log('Emergency file upload fix initialized successfully');
        } catch (err) {
            console.error('Error initializing emergency file fix:', err);
        }
    }
})(); 