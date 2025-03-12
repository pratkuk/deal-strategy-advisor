/**
 * Direct Deal Handler
 * A direct implementation that bypasses complex event systems with direct DOM manipulation
 * This file handles deal selection and file upload functionality
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct Deal Handler initializing...');
    DirectDealHandler.init();
});

// Direct Deal Handler - simpler implementation with direct DOM manipulation
const DirectDealHandler = {
    // Current deal state
    currentDeal: null,
    
    // Cached DOM elements
    elements: {},
    
    // Special deals data
    specialDeals: {
        'deal-1': {
            id: 'deal-1',
            name: 'Acme Corporation',
            value: '$52,500',
            stage: 'Proposal',
            closeDate: '2024-05-15',
            company: { size: '250-500 employees', industry: 'Manufacturing' },
            files: [],
            notes: [],
            history: []
        },
        'deal-2': {
            id: 'deal-2',
            name: 'TechStar Inc',
            value: '$78,500',
            stage: 'Discovery',
            closeDate: '2024-06-30',
            company: { size: '100-250 employees', industry: 'Technology' },
            files: [],
            notes: [],
            history: []
        },
        'deal-3': {
            id: 'deal-3',
            name: 'Global Systems',
            value: '$124,000',
            stage: 'Negotiation',
            closeDate: '2024-04-15',
            company: { size: '500+ employees', industry: 'Financial Services' },
            files: [],
            notes: [],
            history: []
        }
    },
    
    // Initialize the module
    init: function() {
        // Cache DOM elements
        this.cacheElements();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Make the handler globally accessible
        window.DirectDealHandler = this;
        
        // Replace the default selectDeal function
        window.selectDeal = this.selectDeal.bind(this);
        
        console.log('Direct Deal Handler initialized');
    },
    
    // Cache DOM elements for better performance
    cacheElements: function() {
        this.elements = {
            widget: document.getElementById('deal-chat-widget'),
            contentPane: document.querySelector('.deal-content-pane'),
            chatPane: document.querySelector('.chat-pane'),
            tabsContainer: document.querySelector('.deal-tabs'),
            contentContainer: document.querySelector('.deal-tab-content-container'),
            selectDealBtn: document.querySelector('.select-deal-btn'),
            clearDealBtn: document.querySelector('.clear-deal-btn'),
            fileUploadBtn: document.querySelector('.file-upload-btn-chat'),
            fileInput: document.getElementById('chat-file-input'),
            noDealState: document.querySelector('.no-deal-state'),
            activeDealState: document.querySelector('.active-deal-state'),
            dealTabs: document.querySelectorAll('.deal-tab-btn'),
            tabContents: document.querySelectorAll('.deal-tab-content'),
            dealNameElement: document.querySelector('.active-deal-name'),
            companyNameElement: document.querySelector('.info-value.company-name'),
            dealValueElement: document.querySelector('.info-value.deal-value'),
            dealStageElement: document.querySelector('.deal-stage'),
            closeDateElement: document.querySelector('.info-value.close-date'),
            uploadFileBtn: document.querySelector('.upload-file-btn'),
            noDealSelected: document.querySelectorAll('.no-deal-selected'),
            dealOverview: document.querySelector('.deal-overview'),
            dealFiles: document.querySelector('.deal-files'),
            filesList: document.querySelector('.files-list'),
            noFilesMessage: document.querySelector('.no-files-message'),
            dealStagePill: document.querySelector('.deal-stage-pill')
        };
    },
    
    // Setup event listeners using direct binding
    setupEventListeners: function() {
        // Handle Select Deal button click
        if (this.elements.selectDealBtn) {
            this.elements.selectDealBtn.addEventListener('click', () => {
                const dropdown = document.querySelector('.no-deal-state .dropdown-content');
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            });
        }
        
        // Handle Clear Deal button click
        if (this.elements.clearDealBtn) {
            this.elements.clearDealBtn.addEventListener('click', this.clearDeal.bind(this));
        }
        
        // Handle file upload button click
        if (this.elements.fileUploadBtn && this.elements.fileInput) {
            this.elements.fileUploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.elements.fileInput.click();
            });
            
            this.elements.fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files);
                }
            });
        }
        
        // Handle tab clicks
        if (this.elements.dealTabs) {
            this.elements.dealTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Only handle clicks if a deal is selected
                    if (this.currentDeal) {
                        this.handleTabClick(tab);
                    }
                });
            });
        }
        
        // Handle upload button in files tab
        if (this.elements.uploadFileBtn) {
            this.elements.uploadFileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentDeal) {
                    this.triggerFileUpload();
                }
            });
        }
        
        // Override dropdown deal options
        document.querySelectorAll('.dropdown-content a[data-deal]').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const dealId = option.getAttribute('data-deal');
                if (dealId) {
                    this.selectDeal(dealId);
                }
                
                // Hide dropdown after selection
                const dropdown = document.querySelector('.no-deal-state .dropdown-content');
                if (dropdown) {
                    dropdown.classList.remove('show');
                }
            });
        });
    },
    
    // Select a deal - replacement for window.selectDeal
    selectDeal: function(dealId) {
        console.log('DirectDealHandler: Selecting deal', dealId);
        
        // Get deal data from our special deals
        const deal = this.specialDeals[dealId];
        if (!deal) {
            console.error('Deal not found:', dealId);
            return;
        }
        
        // Store the current deal
        this.currentDeal = deal;
        
        // Update the UI to reflect deal selection
        this.updateUI(deal);
        
        // Expand the widget
        this.expandWidget();
        
        // Update deal store (for compatibility with old code)
        if (window.dealStore) {
            window.dealStore.currentDeal = deal;
            if (!window.dealStore.deals) {
                window.dealStore.deals = {};
            }
            window.dealStore.deals[dealId] = deal;
        } else {
            window.dealStore = {
                currentDeal: deal,
                deals: { [dealId]: deal }
            };
        }
        
        return deal;
    },
    
    // Clear the selected deal
    clearDeal: function() {
        console.log('DirectDealHandler: Clearing deal');
        
        // Clear current deal
        this.currentDeal = null;
        
        // Update UI to show no deal selected
        this.resetUI();
        
        // Update deal store (for compatibility)
        if (window.dealStore) {
            window.dealStore.currentDeal = null;
        }
    },
    
    // Update the UI when a deal is selected
    updateUI: function(deal) {
        if (!deal) return;
        
        // Set active deal state
        if (this.elements.noDealState) {
            this.elements.noDealState.classList.remove('active');
        }
        if (this.elements.activeDealState) {
            this.elements.activeDealState.classList.add('active');
        }
        
        // Update deal name in the header
        if (this.elements.dealNameElement) {
            this.elements.dealNameElement.textContent = deal.name;
        }
        
        // Update deal stage pill
        if (this.elements.dealStagePill) {
            this.elements.dealStagePill.textContent = deal.stage;
        }
        
        // Hide all "no deal selected" messages
        if (this.elements.noDealSelected) {
            this.elements.noDealSelected.forEach(el => {
                el.classList.remove('active');
            });
        }
        
        // Show deal overview
        if (this.elements.dealOverview) {
            this.elements.dealOverview.classList.add('active');
        }
        
        // Update deal info fields
        if (this.elements.companyNameElement) {
            this.elements.companyNameElement.textContent = deal.name;
        }
        if (this.elements.dealValueElement) {
            this.elements.dealValueElement.textContent = deal.value;
        }
        if (this.elements.dealStageElement) {
            this.elements.dealStageElement.textContent = deal.stage;
        }
        if (this.elements.closeDateElement) {
            this.elements.closeDateElement.textContent = deal.closeDate;
        }
        
        // Set active tab to Overview
        this.setActiveTab('overview');
    },
    
    // Reset UI when no deal is selected
    resetUI: function() {
        // Show no deal state
        if (this.elements.noDealState) {
            this.elements.noDealState.classList.add('active');
        }
        if (this.elements.activeDealState) {
            this.elements.activeDealState.classList.remove('active');
        }
        
        // Show "no deal selected" messages
        if (this.elements.noDealSelected) {
            this.elements.noDealSelected.forEach(el => {
                el.classList.add('active');
            });
        }
        
        // Hide deal overview
        if (this.elements.dealOverview) {
            this.elements.dealOverview.classList.remove('active');
        }
        
        // Collapse widget to standard size
        this.collapseWidget();
    },
    
    // Set active tab
    setActiveTab: function(tabName) {
        // Clear active status from all tabs
        if (this.elements.dealTabs) {
            this.elements.dealTabs.forEach(tab => {
                tab.classList.remove('active');
            });
        }
        
        // Hide all tab contents
        if (this.elements.tabContents) {
            this.elements.tabContents.forEach(content => {
                content.classList.remove('active');
            });
        }
        
        // Set active status for selected tab
        const selectedTab = document.querySelector(`.deal-tab-btn[data-dealtab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Show selected tab content
        const selectedContent = document.querySelector(`.deal-tab-content.${tabName}-tab`);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // If files tab is active, render files
        if (tabName === 'files') {
            this.renderFiles();
        }
    },
    
    // Handle tab click
    handleTabClick: function(tabElement) {
        if (!this.currentDeal) return;
        
        const tabName = tabElement.getAttribute('data-dealtab');
        if (tabName) {
            this.setActiveTab(tabName);
        }
    },
    
    // Expand widget to show deal content
    expandWidget: function() {
        if (this.elements.widget) {
            // Set widget to expanded-plus mode
            this.elements.widget.className = 'widget-expanded-plus';
            
            // Set widget dimensions
            Object.assign(this.elements.widget.style, {
                width: '900px',
                height: '600px'
            });
            
            // Ensure content pane is visible
            if (this.elements.contentPane) {
                Object.assign(this.elements.contentPane.style, {
                    width: '400px',
                    display: 'block',
                    visibility: 'visible',
                    opacity: '1'
                });
            }
        }
    },
    
    // Collapse widget to standard size
    collapseWidget: function() {
        if (this.elements.widget) {
            // Set widget to default expanded mode
            this.elements.widget.className = 'widget-expanded';
        }
    },
    
    // Handle file uploads
    handleFileUpload: function(files) {
        console.log('DirectDealHandler: Handling file upload, files:', files);
        
        // If no deal is selected, select the first deal
        if (!this.currentDeal) {
            console.log('No deal selected, selecting first deal');
            this.selectDeal('deal-1');
        }
        
        // Check if we have files
        if (!files || files.length === 0) {
            console.error('No files provided to handleFileUpload');
            return;
        }
        
        // Process each file
        Array.from(files).forEach(file => {
            const fileData = {
                id: 'f' + Date.now() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.name.split('.').pop().toLowerCase(),
                size: this.formatFileSize(file.size),
                date: new Date().toISOString().split('T')[0]
            };
            
            console.log('Adding file to current deal:', fileData);
            
            // Add file to current deal
            if (!this.currentDeal.files) {
                this.currentDeal.files = [];
            }
            this.currentDeal.files.push(fileData);
            
            // Add to history
            if (!this.currentDeal.history) {
                this.currentDeal.history = [];
            }
            this.currentDeal.history.push({
                id: 'h' + Date.now(),
                title: 'File uploaded',
                date: new Date().toISOString().split('T')[0],
                description: `File "${file.name}" was uploaded to the deal`
            });
        });
        
        // Show success message
        console.log('Files successfully added to deal');
        
        // Switch to files tab and update UI
        this.setActiveTab('files');
        
        // Ensure widget is expanded
        this.expandWidget();
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
    
    // Render files in the files tab
    renderFiles: function() {
        console.log('DirectDealHandler: Rendering files');
        
        if (!this.currentDeal || !this.elements.filesList) return;
        
        // Get files from current deal
        const files = this.currentDeal.files || [];
        
        // Update files count in tab
        const filesTab = document.querySelector('.deal-tab-btn[data-dealtab="files"]');
        if (filesTab) {
            filesTab.textContent = `Files (${files.length})`;
        }
        
        // Show files list
        if (this.elements.dealFiles) {
            this.elements.dealFiles.classList.add('active');
        }
        
        // Show no files message if no files
        if (files.length === 0) {
            if (this.elements.noFilesMessage) {
                this.elements.noFilesMessage.style.display = 'block';
            }
            this.elements.filesList.innerHTML = '';
            return;
        }
        
        // Hide no files message
        if (this.elements.noFilesMessage) {
            this.elements.noFilesMessage.style.display = 'none';
        }
        
        // Generate HTML for files
        const filesHTML = files.map(file => `
            <div class="file-item">
                <div class="file-icon">📄</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">${file.size} • ${file.date}</div>
                </div>
            </div>
        `).join('');
        
        // Update files list
        this.elements.filesList.innerHTML = filesHTML;
        
        console.log('Files rendered:', files.length);
    },
    
    // Format file size for display
    formatFileSize: function(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return Math.round((bytes / (1024 * 1024)) * 10) / 10 + ' MB';
    }
};

// Make some functions globally available for debugging
window.DirectDealHandler = DirectDealHandler; 