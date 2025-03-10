/**
 * TAB CONTENT FIX - Forces Files and History tabs to show content
 * 
 * This script specifically targets the Files and History tabs and ensures
 * they display proper content when a deal is selected.
 */

(function() {
    console.log("📄 TAB CONTENT FIX LOADED");
    
    // Sample file data for different deals
    const sampleFiles = {
        'default': [
            { name: 'Proposal.pdf', size: '1.4 MB', date: getFormattedDate(-3), type: 'pdf' },
            { name: 'Requirements.docx', size: '342 KB', date: getFormattedDate(-5), type: 'docx' }
        ],
        'acme': [
            { name: 'AcmeCorp_Proposal.pdf', size: '1.8 MB', date: getFormattedDate(-2), type: 'pdf' },
            { name: 'AcmeCorp_Contract.docx', size: '542 KB', date: getFormattedDate(-4), type: 'docx' },
            { name: 'AcmeCorp_Pricing.xlsx', size: '275 KB', date: getFormattedDate(-7), type: 'xlsx' }
        ],
        'techstar': [
            { name: 'TechStar_Requirements.docx', size: '418 KB', date: getFormattedDate(-2), type: 'docx' },
            { name: 'TechStar_Proposal.pdf', size: '2.2 MB', date: getFormattedDate(-5), type: 'pdf' },
            { name: 'TechStar_Implementation.pptx', size: '3.5 MB', date: getFormattedDate(-8), type: 'pptx' },
            { name: 'TechStar_Api_Docs.pdf', size: '1.1 MB', date: getFormattedDate(-10), type: 'pdf' }
        ],
        'global': [
            { name: 'GlobalSystems_Contract.pdf', size: '2.7 MB', date: getFormattedDate(-1), type: 'pdf' },
            { name: 'GlobalSystems_Requirements.docx', size: '680 KB', date: getFormattedDate(-6), type: 'docx' },
            { name: 'GlobalSystems_Architecture.pptx', size: '4.1 MB', date: getFormattedDate(-9), type: 'pptx' }
        ]
    };
    
    // Sample history data for different deals
    const sampleHistory = {
        'default': [
            { date: getFormattedDate(-30), text: 'Deal created', author: 'System' },
            { date: getFormattedDate(-25), text: 'Initial contact made', author: 'Sales Rep' },
            { date: getFormattedDate(-1), text: 'Deal selected in Deal Advisor', author: 'System' }
        ],
        'acme': [
            { date: getFormattedDate(-45), text: 'Deal created in Hubspot', author: 'System' },
            { date: getFormattedDate(-40), text: 'Initial call with Acme Corp procurement team', author: 'Sales Rep' },
            { date: getFormattedDate(-30), text: 'Sent preliminary proposal to Acme Corp', author: 'Sales Rep' },
            { date: getFormattedDate(-20), text: 'Follow-up meeting with Acme Corp decision makers', author: 'Sales Manager' },
            { date: getFormattedDate(-10), text: 'Revised proposal sent to Acme Corp', author: 'Sales Rep' },
            { date: getFormattedDate(-5), text: 'Acme Corp requested implementation timeline', author: 'Client' },
            { date: getFormattedDate(-1), text: 'Deal selected in Deal Advisor', author: 'System' }
        ],
        'techstar': [
            { date: getFormattedDate(-60), text: 'Deal created', author: 'System' },
            { date: getFormattedDate(-55), text: 'Demo session with TechStar engineering team', author: 'Solutions Engineer' },
            { date: getFormattedDate(-45), text: 'TechStar requested custom integration details', author: 'Client' },
            { date: getFormattedDate(-30), text: 'Technical requirements finalized with TechStar', author: 'Solutions Engineer' },
            { date: getFormattedDate(-20), text: 'Proposal presented to TechStar leadership', author: 'Sales Rep' },
            { date: getFormattedDate(-15), text: 'TechStar requested revised pricing structure', author: 'Client' },
            { date: getFormattedDate(-10), text: 'Contract negotiations initiated', author: 'Legal Team' },
            { date: getFormattedDate(-1), text: 'Deal selected in Deal Advisor', author: 'System' }
        ],
        'global': [
            { date: getFormattedDate(-75), text: 'Initial contact with Global Systems', author: 'Sales Rep' },
            { date: getFormattedDate(-70), text: 'Needs assessment call with Global Systems IT team', author: 'Solutions Engineer' },
            { date: getFormattedDate(-60), text: 'Product demo for Global Systems leadership', author: 'Sales Manager' },
            { date: getFormattedDate(-50), text: 'Global Systems requested enterprise security documentation', author: 'Client' },
            { date: getFormattedDate(-40), text: 'Security review completed by Global Systems', author: 'Client' },
            { date: getFormattedDate(-30), text: 'Proposal presented to Global Systems board', author: 'Sales Director' },
            { date: getFormattedDate(-20), text: 'Global Systems requested implementation timeline', author: 'Client' },
            { date: getFormattedDate(-10), text: 'Implementation plan and timeline delivered', author: 'Project Manager' },
            { date: getFormattedDate(-5), text: 'Final contract negotiations', author: 'Legal Team' },
            { date: getFormattedDate(-1), text: 'Deal selected in Deal Advisor', author: 'System' }
        ]
    };
    
    // Helper function to get formatted date with offset
    function getFormattedDate(dayOffset = 0) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Get current deal
    function getCurrentDeal() {
        // Try multiple approaches to get the current deal
        
        // 1. Try to get from the active-deal-name
        const dealNameElement = document.querySelector('.active-deal-name, .deal-name');
        if (dealNameElement && dealNameElement.textContent) {
            const dealName = dealNameElement.textContent.trim();
            console.log(`📄 Current deal from UI: ${dealName}`);
            return dealName;
        }
        
        // 2. Try to get from dealStore.currentDeal
        if (window.dealStore && window.dealStore.currentDeal) {
            console.log(`📄 Current deal from dealStore: ${window.dealStore.currentDeal.name}`);
            return window.dealStore.currentDeal.name;
        }
        
        return null;
    }
    
    // Get sample files for the current deal
    function getFilesForDeal(dealName) {
        if (!dealName) return sampleFiles.default;
        
        // Convert to lowercase for comparison
        const dealLower = dealName.toLowerCase();
        
        if (dealLower.includes('acme')) {
            return sampleFiles.acme;
        } else if (dealLower.includes('techstar')) {
            return sampleFiles.techstar;
        } else if (dealLower.includes('global')) {
            return sampleFiles.global;
        } else {
            return sampleFiles.default;
        }
    }
    
    // Get sample history for the current deal
    function getHistoryForDeal(dealName) {
        if (!dealName) return sampleHistory.default;
        
        // Convert to lowercase for comparison
        const dealLower = dealName.toLowerCase();
        
        if (dealLower.includes('acme')) {
            return sampleHistory.acme;
        } else if (dealLower.includes('techstar')) {
            return sampleHistory.techstar;
        } else if (dealLower.includes('global')) {
            return sampleHistory.global;
        } else {
            return sampleHistory.default;
        }
    }
    
    // Get file icon class based on file type
    function getFileIconClass(fileType) {
        const fileTypeMap = {
            'pdf': 'pdf-icon',
            'doc': 'word-icon',
            'docx': 'word-icon',
            'xls': 'excel-icon',
            'xlsx': 'excel-icon',
            'ppt': 'powerpoint-icon',
            'pptx': 'powerpoint-icon',
            'txt': 'text-icon',
            'jpg': 'image-icon',
            'jpeg': 'image-icon',
            'png': 'image-icon',
            'gif': 'image-icon'
        };
        
        return fileTypeMap[fileType.toLowerCase()] || 'generic-icon';
    }
    
    // Fix the Files tab content
    function fixFilesTab() {
        const filesTab = document.querySelector('.deal-tab-content.files-tab');
        if (!filesTab) {
            console.log("❌ Files tab not found");
            return;
        }
        
        // Check if a deal is selected
        const activeDealState = document.querySelector('.active-deal-state.active');
        if (!activeDealState) {
            console.log("📄 No deal selected, not updating Files tab");
            return;
        }
        
        console.log("📄 Fixing Files tab content");
        
        // Get the current deal
        const dealName = getCurrentDeal();
        if (!dealName) {
            console.log("❌ Could not determine current deal name");
            return;
        }
        
        // Get sample files for this deal
        const files = getFilesForDeal(dealName);
        
        // Find no-deal-selected and hide it
        const noDealSelected = filesTab.querySelector('.no-deal-selected');
        if (noDealSelected) {
            noDealSelected.classList.remove('active');
        }
        
        // Find deal-files and show it
        const dealFiles = filesTab.querySelector('.deal-files');
        if (dealFiles) {
            dealFiles.classList.add('active');
        } else {
            console.log("❌ .deal-files element not found in Files tab");
            return;
        }
        
        // Find the files list
        const filesList = filesTab.querySelector('.files-list');
        if (!filesList) {
            console.log("❌ .files-list element not found in Files tab");
            return;
        }
        
        // Clear any existing content except no-files-message
        while (filesList.firstChild) {
            if (filesList.firstChild.classList && filesList.firstChild.classList.contains('no-files-message')) {
                break;
            }
            filesList.removeChild(filesList.firstChild);
        }
        
        // Hide no-files message if it exists
        const noFilesMessage = filesList.querySelector('.no-files-message');
        if (noFilesMessage) {
            noFilesMessage.style.display = 'none';
        }
        
        // Add file items
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Get icon class
            const iconClass = getFileIconClass(file.type);
            
            fileItem.innerHTML = `
                <div class="file-icon ${iconClass}"></div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">
                        <span class="file-size">${file.size}</span>
                        <span class="file-date">${file.date}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-download-btn" title="Download">↓</button>
                    <button class="file-preview-btn" title="Preview">👁️</button>
                </div>
            `;
            
            filesList.appendChild(fileItem);
        });
        
        console.log(`✅ Added ${files.length} files to Files tab`);
    }
    
    // Fix the History tab content
    function fixHistoryTab() {
        const historyTab = document.querySelector('.deal-tab-content.history-tab');
        if (!historyTab) {
            console.log("❌ History tab not found");
            return;
        }
        
        // Check if a deal is selected
        const activeDealState = document.querySelector('.active-deal-state.active');
        if (!activeDealState) {
            console.log("📄 No deal selected, not updating History tab");
            return;
        }
        
        console.log("📄 Fixing History tab content");
        
        // Get the current deal
        const dealName = getCurrentDeal();
        if (!dealName) {
            console.log("❌ Could not determine current deal name");
            return;
        }
        
        // Get sample history for this deal
        const history = getHistoryForDeal(dealName);
        
        // Find no-deal-selected and hide it
        const noDealSelected = historyTab.querySelector('.no-deal-selected');
        if (noDealSelected) {
            noDealSelected.classList.remove('active');
        }
        
        // Find deal-history and show it
        const dealHistory = historyTab.querySelector('.deal-history');
        if (dealHistory) {
            dealHistory.classList.add('active');
        } else {
            console.log("❌ .deal-history element not found in History tab");
            return;
        }
        
        // Find the timeline items container
        const timelineItems = historyTab.querySelector('.timeline-items');
        if (!timelineItems) {
            console.log("❌ .timeline-items element not found in History tab");
            return;
        }
        
        // Clear any existing content except no-history-message
        while (timelineItems.firstChild) {
            if (timelineItems.firstChild.classList && timelineItems.firstChild.classList.contains('no-history-message')) {
                break;
            }
            timelineItems.removeChild(timelineItems.firstChild);
        }
        
        // Hide no-history message if it exists
        const noHistoryMessage = timelineItems.querySelector('.no-history-message');
        if (noHistoryMessage) {
            noHistoryMessage.style.display = 'none';
        }
        
        // Add timeline items
        history.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-content">
                    <div class="timeline-text">${item.text}</div>
                    <div class="timeline-author">${item.author}</div>
                </div>
            `;
            
            timelineItems.appendChild(timelineItem);
        });
        
        console.log(`✅ Added ${history.length} history items to History tab`);
    }
    
    // Add a fix tabs button
    function addFixTabsButton() {
        const existingButton = document.getElementById('fix-tabs-button');
        if (existingButton) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'fix-tabs-button';
        button.textContent = 'FIX TABS';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '180px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.padding = '8px 15px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.fontWeight = 'bold';
        button.style.zIndex = '10000';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', function() {
            fixFilesTab();
            fixHistoryTab();
            alert('Files and History tabs fixed!');
        });
        
        document.body.appendChild(button);
    }
    
    // Fix tabs when tab buttons are clicked
    function addTabClickHandlers() {
        const tabButtons = document.querySelectorAll('.deal-tab-btn');
        
        tabButtons.forEach(button => {
            // Clone to remove existing handlers
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                const tabId = this.getAttribute('data-dealtab');
                console.log(`📄 Tab button clicked: ${tabId}`);
                
                // If Files tab clicked
                if (tabId === 'files') {
                    setTimeout(fixFilesTab, 100);
                }
                // If History tab clicked
                else if (tabId === 'history') {
                    setTimeout(fixHistoryTab, 100);
                }
            });
        });
    }
    
    // Initialize
    function initialize() {
        console.log("📄 Initializing tab content fix");
        
        // Fix tabs immediately
        setTimeout(function() {
            fixFilesTab();
            fixHistoryTab();
        }, 500);
        
        // Fix tabs at various intervals
        setTimeout(function() {
            fixFilesTab();
            fixHistoryTab();
        }, 1000);
        
        setTimeout(function() {
            fixFilesTab();
            fixHistoryTab();
        }, 2000);
        
        // Add tab click handlers
        addTabClickHandlers();
        
        // Add fix button
        addFixTabsButton();
        
        // Listen for deal selection events
        document.addEventListener('click', function(e) {
            // If a dropdown item with data-deal is clicked
            if (e.target.getAttribute('data-deal')) {
                console.log("📄 Deal selection detected");
                
                // Fix tabs after a short delay
                setTimeout(function() {
                    fixFilesTab();
                    fixHistoryTab();
                }, 500);
                
                setTimeout(function() {
                    fixFilesTab();
                    fixHistoryTab();
                }, 1000);
            }
        });
        
        // Also run on an interval in case of changes
        setInterval(function() {
            const filesTab = document.querySelector('.deal-tab-content.files-tab.active');
            const historyTab = document.querySelector('.deal-tab-content.history-tab.active');
            
            // Only update the active tab
            if (filesTab) {
                fixFilesTab();
            } else if (historyTab) {
                fixHistoryTab();
            }
        }, 3000);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }
})(); 