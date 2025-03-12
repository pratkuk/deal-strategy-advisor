// DealContent Module
const DealContent = {
    // State
    currentDeal: null,
    
    // Cache DOM elements
    elements: {
        widget: null,
        contentPane: null,
        chatPane: null,
        tabsContainer: null,
        contentContainer: null
    },
    
    // Initialize the module
    init() {
        // Cache DOM elements
        this.elements.widget = document.getElementById('deal-chat-widget');
        this.elements.contentPane = document.querySelector('.deal-content-pane');
        this.elements.chatPane = document.querySelector('.chat-pane');
        this.elements.tabsContainer = document.querySelector('.deal-tabs');
        this.elements.contentContainer = document.querySelector('.deal-tab-content-container');
        
        // Make DealContent accessible globally for direct calls
        window.DealContent = this;
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // HARD FIX: Add direct observers for file uploads
        this.setupHardFixObservers();
        
        console.log('DealContent module initialized');
    },
    
    // Set up event listeners
    initializeEventListeners() {
        // Listen for deal selection
        document.addEventListener('dealSelected', this.handleDealSelected.bind(this));
        
        // Listen for dealCleared event
        document.addEventListener('dealCleared', this.handleDealCleared.bind(this));
        
        // Add click handler for clear deal button
        const clearDealBtn = document.querySelector('.clear-deal-btn');
        if (clearDealBtn) {
            clearDealBtn.addEventListener('click', this.clearDeal.bind(this));
        }
        
        // Listen for file uploads
        document.addEventListener('fileUploaded', (e) => {
            if (e.detail && e.detail.files) {
                this.handleFileUploaded(e.detail.files);
            }
        });
        
        // Listen for tab clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.deal-tab-btn')) {
                const tab = e.target.closest('.deal-tab-btn');
                this.handleTabClick(tab);
            }
        });
        
        // Listen for upload button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.upload-file-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.triggerFileUpload();
            }
        });
    },
    
    // HARD FIX: Setup mutation observers to detect file uploads
    setupHardFixObservers() {
        console.log('HARD FIX: Setting up file upload observers');
        
        // Watch for file input changes
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                console.log('HARD FIX: File input change detected', e.target.files);
                if (e.target.files && e.target.files.length > 0) {
                    // Schedule multiple retries to ensure files are processed
                    for (let i = 1; i <= 3; i++) {
                        setTimeout(() => {
                            console.log(`HARD FIX: Retry ${i} for file upload processing`);
                            this.handleFileUploaded(e.target.files);
                        }, i * 500); // Staggered retries at 500ms, 1000ms, and 1500ms
                    }
                }
            }, true); // Use capture to ensure we get the event first
        });
        
        // Observe DOM for new file inputs
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const fileInputs = node.querySelectorAll('input[type="file"]');
                            fileInputs.forEach(input => {
                                input.addEventListener('change', (e) => {
                                    console.log('HARD FIX: File input change detected from observer', e.target.files);
                                    if (e.target.files && e.target.files.length > 0) {
                                        this.handleFileUploaded(e.target.files);
                                    }
                                }, true);
                            });
                        }
                    });
                }
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Also add a click handler for the file upload button
        const uploadBtn = document.querySelector('.file-upload-btn-chat');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                console.log('HARD FIX: Upload button clicked');
                // Make sure deal is selected
                if (!this.currentDeal) {
                    console.log('HARD FIX: No deal selected, attempting to find current deal');
                    const dealStore = window.dealStore || {};
                    this.currentDeal = dealStore.currentDeal;
                }
            }, true);
        }
    },
    
    // Clear the current deal
    clearDeal() {
        console.log('Clearing deal');
        this.currentDeal = null;
        
        // Reset UI to "no deal selected" state
        this.resetDealUI();
        
        // Hide deal details pane
        this.collapseWidget();
        
        // Dispatch dealCleared event
        document.dispatchEvent(new CustomEvent('dealCleared'));
    },
    
    // Handle the dealCleared event
    handleDealCleared() {
        console.log('Deal cleared event received');
        this.currentDeal = null;
        this.resetDealUI();
        this.collapseWidget();
    },
    
    // Reset UI to "no deal selected" state
    resetDealUI() {
        // Show "no deal selected" messages
        const noDealSelectedElements = document.querySelectorAll('.no-deal-selected');
        noDealSelectedElements.forEach(el => el.classList.add('active'));
        
        // Hide deal overview and deal-specific content
        const dealOverview = document.querySelector('.deal-overview');
        if (dealOverview) dealOverview.classList.remove('active');
        
        const dealFiles = document.querySelector('.deal-files');
        if (dealFiles) dealFiles.classList.remove('active');
        
        const dealHistory = document.querySelector('.deal-history');
        if (dealHistory) dealHistory.classList.remove('active');
        
        // Reset active/no deal state in chat widget
        const noDealState = document.querySelector('.no-deal-state');
        if (noDealState) noDealState.classList.add('active');
        
        const activeDealState = document.querySelector('.active-deal-state');
        if (activeDealState) activeDealState.classList.remove('active');
    },
    
    // Collapse widget to standard size
    collapseWidget() {
        if (!this.elements.widget) return;
        
        // Set widget to default expanded mode without deal content
        this.elements.widget.className = 'widget-expanded';
    },
    
    // Handle deal selection
    handleDealSelected(event) {
        console.log('Deal selected event received:', event.detail);
        
        // Special handling for dropdown deals that might not match directly
        const { dealId, deal } = event.detail;
        
        // For dropdown entries - these are special cases that need direct handling
        if (dealId === 'deal-1' || dealId === 'deal-2' || dealId === 'deal-3') {
            console.log('Handling special dropdown deal:', dealId);
            
            // Create mapping for the specific deals shown in dropdown
            const specialDeals = {
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
            };
            
            // Use our special mapping if available
            const specialDeal = specialDeals[dealId];
            if (specialDeal) {
                console.log('Using special deal data for:', dealId);
                
                // Store the current deal
                this.currentDeal = specialDeal;
                
                // Expand the widget
                this.expandWidget();
                
                // Render the deal content
                this.renderSpecialDealContent(specialDeal);
                
                // Update UI to show deal is selected
                this.updateDealUI(specialDeal);
                
                console.log('Special deal selected:', dealId);
                return;
            }
        }
        
        // Regular handling for other deals
        if (deal) {
            // Store the current deal
            this.currentDeal = deal;
            
            // Expand the widget
            this.expandWidget();
            
            // Render the deal content
            this.renderDealContent(deal);
            
            // Update UI to show deal is selected
            this.updateDealUI(deal);
            
            console.log('Deal selected:', dealId);
        } else {
            console.error('No deal object provided in selection event');
        }
    },
    
    // Update UI to show deal is selected
    updateDealUI(deal) {
        if (!deal) return;
        
        // Hide "no deal selected" messages
        const noDealSelectedElements = document.querySelectorAll('.no-deal-selected');
        noDealSelectedElements.forEach(el => el.classList.remove('active'));
        
        // Show deal overview
        const dealOverview = document.querySelector('.deal-overview');
        if (dealOverview) dealOverview.classList.add('active');
        
        // Update deal information
        this.updateDealInfo(deal);
    },
    
    // Update deal information in the UI
    updateDealInfo(deal) {
        if (!deal) return;
        
        // Company name
        const companyNameEl = document.querySelector('.info-value.company-name');
        if (companyNameEl) companyNameEl.textContent = deal.name || '-';
        
        // Deal value
        const dealValueEl = document.querySelector('.info-value.deal-value');
        if (dealValueEl) dealValueEl.textContent = deal.value || '-';
        
        // Deal stage
        const dealStageEl = document.querySelector('.deal-stage');
        if (dealStageEl) dealStageEl.textContent = deal.stage || '-';
        
        // Close date
        const closeDateEl = document.querySelector('.info-value.close-date');
        if (closeDateEl) closeDateEl.textContent = deal.closeDate || '-';
    },
    
    // Expand the widget and show deal content
    expandWidget() {
        if (!this.elements.widget) return;
        
        // Set widget to expanded-plus mode
        this.elements.widget.className = 'widget-expanded-plus';
        
        // Ensure content pane is visible
        this.ensureContentPaneVisible();
    },
    
    // Ensure content pane is visible
    ensureContentPaneVisible() {
        // Set widget dimensions
        Object.assign(this.elements.widget.style, {
            width: '900px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            bottom: '0',
            right: '20px',
            zIndex: '1000',
            overflow: 'hidden',
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        });
        
        // Ensure header styling
        const header = this.elements.widget.querySelector('.widget-header');
        if (header) {
            Object.assign(header.style, {
                backgroundColor: '#4285f4',
                height: '48px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 15px',
                color: 'white',
                borderBottom: 'none',
                boxSizing: 'border-box'
            });
            
            // Ensure control buttons are visible
            const controlButtons = header.querySelectorAll('.control-btn');
            controlButtons.forEach(btn => {
                Object.assign(btn.style, {
                    visibility: 'visible',
                    opacity: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: 'white',
                    width: '30px',
                    height: '30px'
                });
            });
        }
        
        // Ensure content container
        const widgetContent = this.elements.widget.querySelector('.widget-content');
        if (widgetContent) {
            Object.assign(widgetContent.style, {
                backgroundColor: '#ffffff',
                height: 'calc(100% - 48px)',
                overflow: 'hidden'
            });
        }
        
        // Ensure panes container
        const panesContainer = this.elements.widget.querySelector('.panes-container');
        if (panesContainer) {
            Object.assign(panesContainer.style, {
                display: 'flex',
                height: '100%'
            });
        }
        
        // Set up chat pane
        if (this.elements.chatPane) {
            Object.assign(this.elements.chatPane.style, {
                width: 'calc(100% - 400px)',
                height: '100%',
                position: 'absolute',
                left: '0',
                top: '0',
                display: 'block'
            });
        }
        
        // Set up content pane
        if (this.elements.contentPane) {
            Object.assign(this.elements.contentPane.style, {
                width: '400px',
                height: '100%',
                position: 'absolute',
                right: '0',
                top: '0',
                display: 'block',
                visibility: 'visible',
                opacity: '1',
                background: '#fff',
                borderLeft: '1px solid #e0e0e0',
                overflowY: 'auto',
                padding: '0',
                boxSizing: 'border-box',
                zIndex: '100'
            });
            
            // Ensure content header styling
            const contentHeader = this.elements.contentPane.querySelector('.deal-content-header');
            if (contentHeader) {
                Object.assign(contentHeader.style, {
                    borderBottom: '1px solid #e0e0e0',
                    padding: '15px 20px',
                    backgroundColor: '#f8f9fa'
                });
            }
            
            // Ensure tabs styling
            const tabs = this.elements.contentPane.querySelector('.deal-content-tabs');
            if (tabs) {
                Object.assign(tabs.style, {
                    display: 'flex',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                });
            }
            
            // Ensure content body has padding
            const contentBody = this.elements.contentPane.querySelector('.deal-content-body');
            if (contentBody) {
                Object.assign(contentBody.style, {
                    padding: '20px'
                });
            }
            
            // Force a reflow to apply styles immediately
            this.elements.contentPane.offsetHeight;
        }
    },
    
    // Render deal content
    renderDealContent(deal) {
        if (!this.elements.contentPane || !deal) return;
        
        // Ensure the content pane is visible
        this.ensureContentPaneVisible();
        
        // Get the currently active tab
        const activeTabName = this.getActiveTabName();
        
        // Render the tab content
        this.renderTabContent(activeTabName, this.currentDeal);
    },
    
    // Get the currently active tab name
    getActiveTabName() {
        const activeTab = document.querySelector('.deal-tab-btn.active');
        return activeTab ? activeTab.getAttribute('data-dealtab') : 'overview';
    },
    
    // Handle tab clicks
    handleTabClick(tabElement) {
        if (!this.currentDeal) return;
        
        // Update active states
        const allTabs = document.querySelectorAll('.deal-tab-btn');
        allTabs.forEach(tab => tab.classList.remove('active'));
        tabElement.classList.add('active');
        
        // Get tab name
        const tabName = tabElement.getAttribute('data-dealtab');
        
        // Update content
        this.renderTabContent(tabName, this.currentDeal);
    },
    
    // Render tab content
    renderTabContent(tabName, deal) {
        if (!deal) return;
        
        // Get the tab content container
        const contentBody = document.querySelector('.deal-content-body');
        if (!contentBody) return;
        
        // Update active states for tab panes
        const allPanes = contentBody.querySelectorAll('.deal-tab-content');
        allPanes.forEach(pane => pane.classList.remove('active'));
        
        // Activate the selected tab content
        const selectedPane = contentBody.querySelector(`.${tabName}-tab`);
        if (selectedPane) {
            selectedPane.classList.add('active');
        }
        
        // Update tab counts
        this.updateTabCounts(deal);
        
        // Ensure content pane remains visible
        this.ensureContentPaneVisible();
    },
    
    // Update all tab counts
    updateTabCounts(deal) {
        if (!deal) return;
        
        // Files count
        const filesTab = document.querySelector('[data-dealtab="files"]');
        if (filesTab) {
            filesTab.textContent = `Files (${deal.files?.length || 0})`;
        }
        
        // Notes count
        const notesTab = document.querySelector('[data-dealtab="notes"]');
        if (notesTab) {
            notesTab.textContent = `Notes (${deal.notes?.length || 0})`;
        }
        
        // History count
        const historyTab = document.querySelector('[data-dealtab="history"]');
        if (historyTab) {
            historyTab.textContent = `History (${deal.history?.length || 0})`;
        }
    },
    
    // Trigger file upload
    triggerFileUpload() {
        if (!this.currentDeal) {
            console.error('No deal selected for file upload');
            return;
        }
        
        // Create a temporary input element
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.pdf,.docx,.txt,.xlsx,.pptx';
        
        // Add it to the DOM temporarily (this helps with some browser quirks)
        document.body.appendChild(input);
        
        // Handle file selection
        input.onchange = (e) => {
            if (!e.target.files.length) {
                document.body.removeChild(input);
                return;
            }
            
            // Process the files
            this.handleFileUploaded(e.target.files);
            
            // Remove the input element
            document.body.removeChild(input);
            
            // Make sure the deal content pane is visible
            setTimeout(() => this.ensureContentPaneVisible(), 0);
        };
        
        // Show file dialog
        input.click();
    },
    
    // Handle uploaded files
    handleFileUploaded(files) {
        console.log('DealContent.handleFileUploaded called', {
            files: files,
            currentDeal: this.currentDeal ? this.currentDeal.id : 'none'
        });
        
        if (!files.length) {
            console.error('No files provided to handleFileUploaded');
            return;
        }
        
        // HARD FIX: If no current deal, try to find it from dealStore
        if (!this.currentDeal) {
            console.log('HARD FIX: No current deal, checking dealStore');
            const dealStore = window.dealStore || {};
            if (dealStore.currentDeal) {
                console.log('HARD FIX: Found current deal in dealStore', dealStore.currentDeal.id);
                this.currentDeal = dealStore.currentDeal;
            } else {
                // If still no deal, try the first deal in the store
                const dealIds = dealStore.deals ? Object.keys(dealStore.deals) : [];
                if (dealIds.length > 0) {
                    console.log('HARD FIX: Using first available deal', dealIds[0]);
                    this.currentDeal = dealStore.deals[dealIds[0]];
                } else {
                    console.error('HARD FIX: No deals available in dealStore');
                    return;
                }
            }
        }
        
        // Make sure the content pane is visible before processing files
        this.ensureContentPaneVisible();
        
        // Process each file
        Array.from(files).forEach(file => {
            const fileData = {
                id: 'f' + Date.now() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.name.split('.').pop().toLowerCase(),
                size: this.formatFileSize(file.size),
                date: new Date().toISOString().split('T')[0]
            };
            
            console.log('Adding file to deal:', fileData);
            
            // Add file to deal
            if (!this.currentDeal.files) this.currentDeal.files = [];
            this.currentDeal.files.push(fileData);
            
            // Add to history
            if (!this.currentDeal.history) this.currentDeal.history = [];
            this.currentDeal.history.push({
                id: 'h' + Date.now(),
                title: 'File uploaded',
                date: new Date().toISOString().split('T')[0],
                description: `File "${file.name}" was uploaded to the deal`
            });
        });
        
        // Update all tab counts
        this.updateTabCounts(this.currentDeal);
        
        // Switch to files tab to show the uploaded files
        this.selectTab('files');
        
        // HARD FIX: Force rendering of files with retries
        setTimeout(() => {
            console.log('HARD FIX: Forcing file rendering');
            this.renderFiles();
            
            // Force visibility of file list
            const filesList = document.querySelector('.files-list');
            if (filesList) {
                filesList.style.display = 'block';
            }
            
            // Force update tab counts again
            this.updateTabCounts(this.currentDeal);
            
            // Force active class on files tab
            const filesTab = document.querySelector('.deal-tab-btn[data-dealtab="files"]');
            if (filesTab) {
                document.querySelectorAll('.deal-tab-btn').forEach(tab => 
                    tab.classList.remove('active'));
                filesTab.classList.add('active');
            }
            
            // Force active class on files content
            const tabContents = document.querySelectorAll('.deal-tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            const filesContent = document.querySelector('.deal-tab-content.files-tab');
            if (filesContent) {
                filesContent.classList.add('active');
            }
        }, 200);
        
        // Retry rendering files after a delay to ensure DOM is updated
        setTimeout(() => {
            console.log('HARD FIX: Retry rendering files');
            this.renderFiles();
        }, 500);
        
        // Final check to ensure content pane is visible
        setTimeout(() => this.ensureContentPaneVisible(), 100);
        
        // Specifically ensure widget controls are visible
        setTimeout(() => {
            const header = this.elements.widget.querySelector('.widget-header');
            if (header) {
                const controlButtons = header.querySelectorAll('.control-btn');
                controlButtons.forEach(btn => {
                    Object.assign(btn.style, {
                        visibility: 'visible !important',
                        opacity: '1 !important',
                        display: 'flex !important'
                    });
                });
            }
            
            // Force a re-render of files tab if active
            if (this.getActiveTabName() === 'files') {
                this.renderFiles();
            }
        }, 200);
    },
    
    // Helper: Format file size
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return Math.round((bytes / (1024 * 1024)) * 10) / 10 + ' MB';
    },
    
    // Render files in the files tab
    renderFiles() {
        if (!this.currentDeal || !this.currentDeal.files?.length) return;
        
        const filesPane = document.querySelector('.deal-tab-content.files-tab');
        if (!filesPane) return;
        
        const filesList = filesPane.querySelector('.files-list');
        if (!filesList) return;
        
        // Update the files list HTML
        const filesHTML = this.currentDeal.files.map(file => {
            return `
                <div class="file-item">
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-meta">${file.size} • ${file.date}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        filesList.innerHTML = filesHTML;
    },
    
    // Render content for special dropdown deals
    renderSpecialDealContent(deal) {
        if (!deal) return;
        
        console.log('Rendering special deal content for:', deal.name);
        
        // Ensure content pane is visible
        this.ensureContentPaneVisible();
        
        // Hide "no deal selected" messages
        const noDealSelectedElements = document.querySelectorAll('.no-deal-selected');
        noDealSelectedElements.forEach(el => el.classList.remove('active'));
        
        // Show deal overview
        const dealOverview = document.querySelector('.deal-overview');
        if (dealOverview) dealOverview.classList.add('active');
        
        // Company name
        const companyNameEl = document.querySelector('.info-value.company-name');
        if (companyNameEl) companyNameEl.textContent = deal.name || '-';
        
        // Deal value
        const dealValueEl = document.querySelector('.info-value.deal-value');
        if (dealValueEl) dealValueEl.textContent = deal.value || '-';
        
        // Deal stage
        const dealStageEl = document.querySelector('.deal-stage');
        if (dealStageEl) dealStageEl.textContent = deal.stage || '-';
        
        // Close date
        const closeDateEl = document.querySelector('.info-value.close-date');
        if (closeDateEl) closeDateEl.textContent = deal.closeDate || '-';
        
        // Ensure active tab content is displayed
        const activeTabName = this.getActiveTabName();
        this.renderTabContent(activeTabName, deal);
        
        // Update the active deal name in the chat widget
        const activeDealName = document.querySelector('.active-deal-name');
        if (activeDealName) activeDealName.textContent = deal.name;
        
        // Update deal stage pill
        const stagePill = document.querySelector('.deal-stage-pill');
        if (stagePill) stagePill.textContent = deal.stage;
        
        // Show active deal state
        const noDealState = document.querySelector('.no-deal-state');
        if (noDealState) noDealState.classList.remove('active');
        
        const activeDealState = document.querySelector('.active-deal-state');
        if (activeDealState) activeDealState.classList.add('active');
        
        console.log('Special deal content rendered for:', deal.name);
    },
    
    // Helper method to select a specific tab
    selectTab(tabName) {
        if (!this.elements.tabsContainer) return;
        
        console.log(`Selecting tab: ${tabName}`);
        
        // Find the tab button
        const tabBtn = this.elements.tabsContainer.querySelector(`.deal-tab-btn[data-dealtab="${tabName}"]`);
        if (!tabBtn) {
            console.error(`Tab button for ${tabName} not found`);
            return;
        }
        
        // Simulate click on the tab
        this.handleTabClick(tabBtn);
    }
};

// Initialize the module
document.addEventListener('DOMContentLoaded', () => DealContent.init());

// Export for global access
window.DealContent = DealContent; 