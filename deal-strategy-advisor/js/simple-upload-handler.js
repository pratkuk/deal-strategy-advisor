/**
 * Simple Upload Handler
 * A straightforward implementation for file uploads that works with DirectDealHandler
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple Upload Handler initializing...');
    SimpleUploadHandler.init();
});

const SimpleUploadHandler = {
    // Initialize the handler
    init: function() {
        // Wait to make sure DirectDealHandler is loaded
        setTimeout(() => {
            this.setupUploadHandlers();
            
            // Make it globally available
            window.SimpleUploadHandler = this;
            
            console.log('Simple Upload Handler initialized');
        }, 100);
    },
    
    // Setup file upload handlers
    setupUploadHandlers: function() {
        // Handle global file upload button in chat widget
        const fileUploadBtn = document.querySelector('.file-upload-btn-chat');
        const fileInput = document.getElementById('chat-file-input');
        
        if (fileUploadBtn && fileInput) {
            // Make sure we remove any existing listeners
            const newUploadBtn = fileUploadBtn.cloneNode(true);
            const newFileInput = fileInput.cloneNode(true);
            
            if (fileUploadBtn.parentNode) {
                fileUploadBtn.parentNode.replaceChild(newUploadBtn, fileUploadBtn);
            }
            
            if (fileInput.parentNode) {
                fileInput.parentNode.replaceChild(newFileInput, fileInput);
            }
            
            // Add our new listeners
            newUploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                newFileInput.click();
            });
            
            newFileInput.addEventListener('change', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (e.target.files && e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files);
                }
            });
        }
        
        // Handle upload button in files tab
        const uploadFileBtn = document.querySelector('.upload-file-btn');
        
        if (uploadFileBtn) {
            // Remove existing listeners
            const newUploadFileBtn = uploadFileBtn.cloneNode(true);
            
            if (uploadFileBtn.parentNode) {
                uploadFileBtn.parentNode.replaceChild(newUploadFileBtn, uploadFileBtn);
            }
            
            // Add our new listener
            newUploadFileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.triggerFileUpload();
            });
        }
        
        // Add drag and drop for content pane
        this.setupDragAndDrop();
    },
    
    // Handle file uploads
    handleFileUpload: function(files) {
        console.log('SimpleUploadHandler: Processing files:', files.length);
        
        try {
            // If DirectDealHandler is available, use it
            if (window.DirectDealHandler) {
                console.log('Using DirectDealHandler for file upload');
                window.DirectDealHandler.handleFileUpload(files);
                return;
            }
            
            // Fallback: Create a fake DirectDealHandler if it doesn't exist
            const defaultDealId = 'deal-1';
            
            // Try to get current deal from dealStore
            let currentDeal = null;
            
            if (window.dealStore && window.dealStore.currentDeal) {
                currentDeal = window.dealStore.currentDeal;
            } else if (window.dealStore && window.dealStore.deals && window.dealStore.deals[defaultDealId]) {
                currentDeal = window.dealStore.deals[defaultDealId];
            } else {
                // Create a minimal deal
                currentDeal = {
                    id: defaultDealId,
                    name: 'Acme Corporation',
                    files: [],
                    history: []
                };
                
                // Store it
                if (!window.dealStore) {
                    window.dealStore = { currentDeal: null, deals: {} };
                }
                
                window.dealStore.currentDeal = currentDeal;
                window.dealStore.deals[defaultDealId] = currentDeal;
            }
            
            // Process each file
            Array.from(files).forEach(file => {
                // Create file data
                const fileData = {
                    id: 'f' + Date.now() + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    type: file.name.split('.').pop().toLowerCase(),
                    size: this.formatFileSize(file.size),
                    date: new Date().toISOString().split('T')[0]
                };
                
                // Add file to current deal
                if (!currentDeal.files) {
                    currentDeal.files = [];
                }
                currentDeal.files.push(fileData);
                
                // Add to history
                if (!currentDeal.history) {
                    currentDeal.history = [];
                }
                currentDeal.history.push({
                    id: 'h' + Date.now(),
                    title: 'File uploaded',
                    date: new Date().toISOString().split('T')[0],
                    description: `File "${file.name}" was uploaded to the deal`
                });
            });
            
            // Update UI directly with DOM manipulation
            this.updateFilesUI(currentDeal);
            
        } catch (error) {
            console.error('Error handling file upload:', error);
        }
    },
    
    // Update UI to show files
    updateFilesUI: function(deal) {
        if (!deal || !deal.files) return;
        
        try {
            // Switch to files tab
            const filesTab = document.querySelector('.deal-tab-btn[data-dealtab="files"]');
            if (filesTab) {
                // Remove active class from all tabs
                document.querySelectorAll('.deal-tab-btn').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Add active class to files tab
                filesTab.classList.add('active');
                
                // Update files count
                filesTab.textContent = `Files (${deal.files.length})`;
            }
            
            // Hide all tab contents
            document.querySelectorAll('.deal-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show files tab content
            const filesContent = document.querySelector('.deal-tab-content.files-tab');
            if (filesContent) {
                filesContent.classList.add('active');
            }
            
            // Update files list
            const filesList = document.querySelector('.files-list');
            if (filesList) {
                // Hide no files message
                const noFilesMsg = document.querySelector('.no-files-message');
                if (noFilesMsg) {
                    noFilesMsg.style.display = 'none';
                }
                
                // Generate HTML for files
                const filesHTML = deal.files.map(file => `
                    <div class="file-item">
                        <div class="file-icon">📄</div>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-meta">${file.size} • ${file.date}</div>
                        </div>
                    </div>
                `).join('');
                
                // Update files list
                filesList.innerHTML = filesHTML;
            }
            
            // Make sure the deal content pane is visible
            const contentPane = document.querySelector('.deal-content-pane');
            if (contentPane) {
                contentPane.style.display = 'block';
                contentPane.style.visibility = 'visible';
                contentPane.style.opacity = '1';
                contentPane.style.width = '400px';
            }
            
            // Make sure widget is expanded
            const widget = document.getElementById('deal-chat-widget');
            if (widget) {
                widget.className = 'widget-expanded-plus';
                widget.style.width = '900px';
                widget.style.height = '600px';
            }
            
            // Show deal files section
            const dealFiles = document.querySelector('.deal-files');
            if (dealFiles) {
                dealFiles.classList.add('active');
            }
            
            // Hide "no deal selected" messages
            document.querySelectorAll('.no-deal-selected').forEach(el => {
                el.classList.remove('active');
            });
            
        } catch (error) {
            console.error('Error updating files UI:', error);
        }
    },
    
    // Trigger file upload dialog
    triggerFileUpload: function() {
        // Create a temporary input element
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.docx,.txt,.xlsx,.pptx';
        
        // Add it to the DOM temporarily
        document.body.appendChild(input);
        
        // Handle file selection
        input.onchange = (e) => {
            if (e.target.files && e.target.files.length > 0) {
                this.handleFileUpload(e.target.files);
            }
            
            // Remove the input element
            document.body.removeChild(input);
        };
        
        // Show file dialog
        input.click();
    },
    
    // Setup drag and drop for content pane
    setupDragAndDrop: function() {
        const contentPane = document.querySelector('.deal-content-pane');
        if (!contentPane) return;
        
        // Create drop message element if it doesn't exist
        let dropMessage = document.querySelector('.file-drop-message');
        
        if (!dropMessage) {
            dropMessage = document.createElement('div');
            dropMessage.className = 'file-drop-message';
            dropMessage.innerHTML = 'Drop files here';
            dropMessage.style.cssText = 'display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(66, 133, 244, 0.7); color: white; font-size: 24px; font-weight: bold; text-align: center; padding-top: 40%; z-index: 1000;';
            contentPane.appendChild(dropMessage);
        }
        
        // Set relative position on content pane
        contentPane.style.position = 'relative';
        
        // Add drag and drop handlers
        contentPane.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropMessage.style.display = 'block';
        });
        
        contentPane.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropMessage.style.display = 'none';
        });
        
        contentPane.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropMessage.style.display = 'none';
            
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files);
            }
        });
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return Math.round((bytes / (1024 * 1024)) * 10) / 10 + ' MB';
    }
};

// Global handler for manual testing via console
window.uploadFile = function(fileName) {
    // Create a mock file
    const blob = new Blob(['Test file content'], { type: 'text/plain' });
    const file = new File([blob], fileName || 'test-file.pdf', { type: 'application/pdf' });
    
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