// workspace.js - Main controller for the sales workspace tabs

// Import app modules (to be created)
import hubspotApp from './hubspot.js';
import gmailApp from './gmail.js';
import calendarApp from './calendar.js';
import dealhubApp from './dealhub.js';

const workspaceModule = {
    // Currently active tab
    activeTab: 'hubspot',
    
    // Initialize workspace tabs
    initialize: function() {
        console.log('Initializing workspace tabs');
        
        // Set up tab switching
        document.querySelectorAll('.workspace-tabs .tab').forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            console.log('Found workspace tab:', tabName);
            
            tab.addEventListener('click', () => {
                console.log('Tab clicked:', tabName);
                this.activateTab(tabName);
            });
        });
        
        // Set default active tab
        this.activateTab(this.activeTab);
        
        console.log('Workspace module initialized');
    },
    
    // Activate a workspace tab
    activateTab: function(tabName) {
        console.log('Activating tab:', tabName);
        
        // Update active tab
        this.activeTab = tabName;
        
        // Update tab UI
        document.querySelectorAll('.workspace-tabs .tab').forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update content UI
        let contentFound = false;
        document.querySelectorAll('.workspace-content').forEach(content => {
            const contentId = content.getAttribute('id');
            const expectedId = `${tabName}-content`;
            console.log(`Checking content: ${contentId} against expected: ${expectedId}`);
            
            if (contentId === expectedId) {
                content.classList.add('active');
                contentFound = true;
                console.log(`Activated content: ${contentId}`);
            } else {
                content.classList.remove('active');
            }
        });
        
        if (!contentFound) {
            console.error(`No content found for tab: ${tabName}`);
        }
        
        // Initialize specific app content if needed
        switch(tabName) {
            case 'hubspot':
                if (hubspotApp) {
                    hubspotApp.initialize();
                }
                break;
            case 'gmail':
                if (gmailApp) {
                    gmailApp.initialize();
                }
                break;
            case 'calendar':
                if (calendarApp) {
                    calendarApp.initialize();
                }
                break;
            case 'dealhub':
                if (dealhubApp) {
                    dealhubApp.initialize();
                }
                break;
        }
        
        console.log(`Tab activation complete for: ${tabName}`);
    }
};

// Export the module
export default workspaceModule;

// Expose to window for legacy compatibility if needed
window.workspaceModule = workspaceModule; 