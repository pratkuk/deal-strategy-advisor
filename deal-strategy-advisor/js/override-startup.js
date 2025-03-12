/**
 * Override Startup
 * Ensures our direct implementations take precedence over any other code
 */

(function() {
    // Run as soon as DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Override Startup initializing...');
        setTimeout(applyOverrides, 200); // Wait for other scripts to load
    });
    
    // Also try to run immediately for already loaded pages
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('Document already loaded - applying overrides');
        setTimeout(applyOverrides, 200);
    }
    
    function applyOverrides() {
        console.log('Applying override functions...');
        
        try {
            // 1. Override the selectDeal function
            if (window.DirectDealHandler) {
                console.log('Overriding selectDeal function');
                window.selectDeal = window.DirectDealHandler.selectDeal.bind(window.DirectDealHandler);
            }
            
            // 2. Override DealContent.handleFileUploaded if it exists
            if (window.DealContent && window.DealContent.handleFileUploaded && 
                window.SimpleUploadHandler && window.SimpleUploadHandler.handleFileUpload) {
                console.log('Overriding DealContent.handleFileUploaded');
                window.DealContent.handleFileUploaded = function(files) {
                    window.SimpleUploadHandler.handleFileUpload(files);
                };
            }
            
            // 3. Override the file input change handler
            const fileInput = document.getElementById('chat-file-input');
            if (fileInput) {
                console.log('Overriding file input change handler');
                fileInput.addEventListener('change', function(e) {
                    e.stopPropagation(); // Stop propagation to prevent other handlers
                    
                    // Call our simple upload handler
                    if (window.SimpleUploadHandler) {
                        window.SimpleUploadHandler.handleFileUpload(e.target.files);
                    } else if (window.DirectDealHandler) {
                        window.DirectDealHandler.handleFileUpload(e.target.files);
                    }
                    
                    // Reset the input to allow uploading the same file again
                    setTimeout(() => {
                        fileInput.value = '';
                    }, 100);
                    
                    return false;
                }, true); // Use capture to ensure we get the event first
            }
            
            // 4. Force the widget to always be expandable
            const widget = document.getElementById('deal-chat-widget');
            if (widget) {
                // Make sure widget has correct class
                if (widget.className.includes('collapsed')) {
                    widget.className = 'widget-expanded';
                }
                
                // Function to ensure content pane is visible when needed
                window.ensureContentPaneVisible = function() {
                    if (!window.dealStore || !window.dealStore.currentDeal) return;
                    
                    const contentPane = document.querySelector('.deal-content-pane');
                    if (contentPane) {
                        contentPane.style.display = 'block';
                        contentPane.style.visibility = 'visible';
                        contentPane.style.opacity = '1';
                        contentPane.style.width = '400px';
                        
                        // Make sure widget is expanded-plus
                        widget.className = 'widget-expanded-plus';
                        widget.style.width = '900px';
                        widget.style.height = '600px';
                    }
                };
                
                // Set interval to check content pane visibility
                setInterval(window.ensureContentPaneVisible, 1000);
            }
            
            // 5. Set up a global upload interface for testing
            window.testUpload = function() {
                // Create a mock file
                const blob = new Blob(['Test file content'], { type: 'text/plain' });
                const file = new File([blob], 'test-file.pdf', { type: 'application/pdf' });
                
                // Create a mock FileList
                const fileList = {
                    0: file,
                    length: 1,
                    item: function(i) { return this[i]; }
                };
                
                // Process the file
                if (window.SimpleUploadHandler) {
                    window.SimpleUploadHandler.handleFileUpload(fileList);
                } else if (window.DirectDealHandler) {
                    window.DirectDealHandler.handleFileUpload(fileList);
                } else {
                    console.error('No upload handlers available');
                }
            };
            
            // 6. Add a one-time test upload button to the page for testing
            const testButton = document.createElement('button');
            testButton.textContent = 'TEST UPLOAD';
            testButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 10000; padding: 5px 10px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;';
            testButton.addEventListener('click', window.testUpload);
            document.body.appendChild(testButton);
            
            console.log('Override functions applied successfully');
        } catch (err) {
            console.error('Error applying override functions:', err);
        }
    }
})(); 