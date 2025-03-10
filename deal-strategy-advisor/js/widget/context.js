// context.js - Handles the context menu functionality
import dealsModule from '../data/deals.js';

const contextModule = {
    // Active input element
    activeInputId: null,
    
    // Initialize context menu functionality
    initialize: function() {
        this.setupEventListeners();
        console.log('Context menu module initialized');
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Close button
        const closeBtn = document.getElementById('closeContextMenu');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideMenu();
            });
        }
        
        // Backdrop click
        const backdrop = document.getElementById('contextModalBackdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                this.hideMenu();
            });
        }
        
        // Context menu buttons
        document.querySelectorAll('.context-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetInput = e.target.closest('.chat-input-container, .composer-notes-container, .coaching-notes-container');
                if (targetInput) {
                    const inputId = targetInput.querySelector('input, textarea').id;
                    this.showMenu(inputId);
                }
            });
        });
        
        // @ symbol in inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('keyup', (e) => {
                // Show context menu when @ is typed
                if (e.key === '@') {
                    this.showMenu(e.target.id);
                }
            });
        });
        
        // Listen for deal changes
        document.addEventListener('widgetDealChanged', (e) => {
            // Update context data when deal changes
            this.updateContextData(e.detail.dealId);
        });
    },
    
    // Show the context menu
    showMenu: function(inputId) {
        if (!inputId) return;
        
        // Save active input ID
        this.activeInputId = inputId;
        
        // Get input position
        const input = document.getElementById(inputId);
        if (!input) return;
        
        // Get active deal ID from widget module
        let dealId = null;
        if (typeof window.widgetModule !== 'undefined' && window.widgetModule.activeDeal) {
            dealId = window.widgetModule.activeDeal.id;
        }
        
        // If no deal is active, show message and don't open menu
        if (!dealId) {
            alert('Please select a deal first to use context references');
            return;
        }
        
        // Position menu near input
        const menu = document.getElementById('contextMenu');
        const backdrop = document.getElementById('contextModalBackdrop');
        
        if (!menu || !backdrop) return;
        
        // Load context data
        this.populateContextMenu(dealId);
        
        // Show backdrop and menu
        backdrop.classList.add('visible');
        menu.classList.add('visible');
        
        // Position menu
        const inputRect = input.getBoundingClientRect();
        const menuTop = inputRect.bottom + 10;
        const menuLeft = inputRect.left;
        
        menu.style.top = menuTop + 'px';
        menu.style.left = menuLeft + 'px';
    },
    
    // Hide the context menu
    hideMenu: function() {
        const menu = document.getElementById('contextMenu');
        const backdrop = document.getElementById('contextModalBackdrop');
        
        if (menu) {
            menu.classList.remove('visible');
        }
        
        if (backdrop) {
            backdrop.classList.remove('visible');
        }
        
        // Clear active input
        this.activeInputId = null;
    },
    
    // Populate the context menu with data
    populateContextMenu: function(dealId) {
        const menuContent = document.querySelector('.context-menu-content');
        if (!menuContent) return;
        
        // Clear existing content
        menuContent.innerHTML = '';
        
        // Get reference data for the deal
        const referenceData = dealsModule.getDealReferenceData(dealId);
        
        if (!referenceData || referenceData.length === 0) {
            menuContent.innerHTML = '<p>No context data available</p>';
            return;
        }
        
        // Create sections for different types of data
        const sections = {
            deal: { title: 'Deal Information', items: [] },
            contacts: { title: 'Contacts', items: [] },
            requirements: { title: 'Requirements', items: [] }
        };
        
        // Sort reference data into sections
        referenceData.forEach(item => {
            if (item.type === 'contacts') {
                sections.contacts.items.push(item);
            } else if (item.type === 'requirements') {
                sections.requirements.items.push(item);
            } else {
                sections.deal.items.push(item);
            }
        });
        
        // Create HTML for each section
        Object.values(sections).forEach(section => {
            if (section.items.length === 0) return;
            
            const sectionEl = document.createElement('div');
            sectionEl.className = 'context-menu-section';
            
            // Section header
            const header = document.createElement('div');
            header.className = 'context-menu-header';
            header.textContent = section.title;
            sectionEl.appendChild(header);
            
            // Items container
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'context-menu-items';
            
            // Add items
            section.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'context-menu-item';
                itemEl.innerHTML = `
                    <div class="menu-item-label">${item.label}</div>
                    <div class="menu-item-description">${item.value}</div>
                `;
                
                // Add click event to insert reference
                itemEl.addEventListener('click', () => {
                    this.insertReference(item);
                    this.hideMenu();
                });
                
                itemsContainer.appendChild(itemEl);
            });
            
            sectionEl.appendChild(itemsContainer);
            menuContent.appendChild(sectionEl);
        });
    },
    
    // Insert a reference into the active input
    insertReference: function(item) {
        if (!this.activeInputId) return;
        
        const input = document.getElementById(this.activeInputId);
        if (!input) return;
        
        const referenceText = `@[${item.label}]`;
        
        if (input.tagName.toLowerCase() === 'input') {
            // For regular input fields
            const cursorPos = input.selectionStart;
            const textBefore = input.value.substring(0, cursorPos - 1); // Remove the @ that triggered this
            const textAfter = input.value.substring(cursorPos);
            
            input.value = textBefore + referenceText + textAfter;
            
            // Move cursor after inserted text
            const newCursorPos = textBefore.length + referenceText.length;
            input.setSelectionRange(newCursorPos, newCursorPos);
        } else if (input.tagName.toLowerCase() === 'textarea') {
            // For textareas
            const cursorPos = input.selectionStart;
            const textBefore = input.value.substring(0, cursorPos - 1); // Remove the @ that triggered this
            const textAfter = input.value.substring(cursorPos);
            
            input.value = textBefore + referenceText + textAfter;
            
            // Move cursor after inserted text
            const newCursorPos = textBefore.length + referenceText.length;
            input.setSelectionRange(newCursorPos, newCursorPos);
        }
        
        // Focus back on input
        input.focus();
    },
    
    // Update context data when deal changes
    updateContextData: function(dealId) {
        // This could update cached data or perform other operations
        // For now, we'll just use it when the menu is shown
    }
};

// Export the module
export default contextModule;

// Expose to window for legacy compatibility
window.contextModule = contextModule; 