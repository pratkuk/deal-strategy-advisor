/**
 * Chat Widget Module
 * Handles all chat functionality
 */

const chatWidget = {
    messages: [],
    currentDeal: null,
    contextItems: [],
    uploadedFiles: null,
    
    // Add mode switching functionality
    modes: {
        CHAT: 'Assistant',
        COMPOSER: 'Strategy',
        COACHING: 'Ask'
    },

    currentMode: 'Strategy',
    
    init: function() {
        console.log('Initializing chat widget...');
        
        // Initialize dealStore if it doesn't exist
        if (!window.dealStore) {
            console.log('Initializing dealStore in init...');
            window.dealStore = {
                deals: {},
                currentDeal: null
            };
        }
        
        this.setupEventListeners();
        this.loadInitialMessages();
        this.setupDealIntegration();
        this.initializeModeSelector();
        
        console.log('Chat widget initialization complete');
    },
    
    setupEventListeners: function() {
        console.log('Setting up event listeners...');
        
        // Send button click event
        const sendButton = document.querySelector('#deal-chat-widget .send-btn');
        if (sendButton) {
            console.log('Found send button');
            sendButton.addEventListener('click', () => this.sendMessage());
        } else {
            console.log('Send button not found');
        }
        
        // Input keypress event (for Enter key)
        const chatInput = document.querySelector('#deal-chat-widget .chat-input');
        if (chatInput) {
            console.log('Found chat input');
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        } else {
            console.log('Chat input not found');
        }
        
        // File upload button event
        const fileUploadButton = document.querySelector('#deal-chat-widget .file-upload-btn-chat');
        const fileInput = document.querySelector('#deal-chat-widget #chat-file-input');
        
        if (fileUploadButton && fileInput) {
            console.log('Found file upload button and input');
            // Remove any existing event listeners
            fileUploadButton.replaceWith(fileUploadButton.cloneNode(true));
            fileInput.replaceWith(fileInput.cloneNode(true));
            
            // Get the fresh elements after replacement
            const freshFileUploadButton = document.querySelector('#deal-chat-widget .file-upload-btn-chat');
            const freshFileInput = document.querySelector('#deal-chat-widget #chat-file-input');
            
            // Add single click handler to the button
            freshFileUploadButton.addEventListener('click', (e) => {
                e.preventDefault();
                freshFileInput.click();
            });
            
            // Add change handler to the input
            freshFileInput.addEventListener('change', (e) => {
                console.log('File input changed');
                this.handleFileUpload(e.target.files);
            });
        } else {
            console.log('File upload button or input not found');
        }
        
        // Context menu button event
        const contextMenuButton = document.querySelector('#deal-chat-widget .context-menu-button');
        if (contextMenuButton) {
            contextMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleContextMenu();
            });
        }
        
        // Click outside to close context menu
        document.addEventListener('click', (e) => {
            const contextMenu = document.querySelector('#deal-chat-widget .context-menu');
            const contextMenuButton = document.querySelector('#deal-chat-widget .context-menu-button');
            
            if (contextMenu && contextMenu.classList.contains('active')) {
                if (!contextMenu.contains(e.target) && e.target !== contextMenuButton) {
                    contextMenu.classList.remove('active');
                }
            }
        });

        console.log('Event listeners set up');
    },
    
    loadInitialMessages: function() {
        // Add welcome message
        this.addMessage({
            type: 'system',
            text: 'Welcome to Deal Strategy Advisor. Select a deal to get started or ask me a question.'
        });
    },
    
    setupDealIntegration: function() {
        // Listen for deal selection events
        document.addEventListener('dealSelected', (e) => {
            const { dealId, deal } = e.detail;
            this.handleDealSelected(dealId, deal);
        });
        
        // Listen for deal cleared events
        document.addEventListener('dealCleared', () => {
            this.handleDealCleared();
        });
    },
    
    handleDealSelected: function(dealId, deal) {
        this.currentDeal = deal;
        
        // Update context items based on deal data
        this.updateContextItems(deal);
        
        // Update deal context panel
        this.updateDealContext(deal);
        
        // Add a message showing deal selection
        this.addMessage({
            type: 'system',
            text: `You've selected the ${deal.name} deal. How can I help with this opportunity?`
        });
        
        // Show a summary of the deal
        this.addMessage({
            type: 'assistant',
            text: this.generateDealSummary(deal)
        });
        
        // Update the UI to show active deal state
        const noDealState = document.querySelector('.no-deal-state');
        if (noDealState) noDealState.classList.remove('active');
        
        const activeDealState = document.querySelector('.active-deal-state');
        if (activeDealState) {
            activeDealState.classList.add('active');
            
            // Update active deal name
            const dealNameEl = activeDealState.querySelector('.active-deal-name');
            if (dealNameEl) dealNameEl.textContent = deal.name;
            
            // Update deal stage pill
            const stagePillEl = activeDealState.querySelector('.deal-stage-pill');
            if (stagePillEl) stagePillEl.textContent = deal.stage || 'No Stage';
        }
        
        // Store in dealStore for global access
        if (window.dealStore) {
            window.dealStore.currentDeal = deal;
            if (!window.dealStore.deals) window.dealStore.deals = {};
            window.dealStore.deals[dealId] = deal;
        }
    },
    
    handleDealCleared: function() {
        this.currentDeal = null;
        this.contextItems = [];
        
        // Clear context menu
        this.updateContextMenu();
        
        // Update UI to show no deal selected
        const noDealState = document.querySelector('.no-deal-state');
        if (noDealState) noDealState.classList.add('active');
        
        const activeDealState = document.querySelector('.active-deal-state');
        if (activeDealState) activeDealState.classList.remove('active');
        
        // Add a message showing deal was cleared
        this.addMessage({
            type: 'system',
            text: 'Deal has been cleared. Select a new deal or ask a general question.'
        });
        
        // Clear from dealStore
        if (window.dealStore) {
            window.dealStore.currentDeal = null;
        }
        
        // Switch to welcome message
        const welcomeMessages = document.querySelectorAll('.welcome-message');
        welcomeMessages.forEach(msg => msg.classList.remove('active'));
        
        const noDealMessage = document.querySelector('.welcome-message.no-deal-message');
        if (noDealMessage) noDealMessage.classList.add('active');
    },
    
    generateDealSummary: function(deal) {
        if (!deal) return '';
        
        let summary = `**${deal.name} Deal Summary**\n\n`;
        summary += `• **Value**: ${deal.value}\n`;
        summary += `• **Stage**: ${deal.stage}\n`;
        summary += `• **Close Date**: ${deal.closeDate}\n\n`;
        
        if (deal.company) {
            summary += `**Company**: ${deal.company.size} ${deal.industry} company`;
            if (deal.company.location) {
                summary += ` based in ${deal.company.location}`;
            }
            summary += '\n\n';
        }
        
        if (deal.product) {
            summary += `**Product**: ${deal.product.name} (${deal.product.plan})\n\n`;
        }
        
        if (deal.contacts && deal.contacts.length > 0) {
            const keyContacts = deal.contacts
                .filter(c => c.influence === 'High' || c.role === 'Decision Maker' || c.role === 'Champion')
                .slice(0, 2);
            
            if (keyContacts.length > 0) {
                summary += '**Key Contacts**: ';
                summary += keyContacts.map(c => `${c.name} (${c.title})`).join(', ');
                summary += '\n\n';
            }
        }
        
        if (deal.timeline) {
            if (deal.timeline.firstContact && deal.timeline.expectedClose) {
                const firstContactDate = new Date(deal.timeline.firstContact);
                const expectedCloseDate = new Date(deal.timeline.expectedClose);
                const cycleDays = Math.round((expectedCloseDate - firstContactDate) / (1000 * 60 * 60 * 24));
                
                summary += `**Sales Cycle**: Approximately ${cycleDays} days from first contact to expected close\n\n`;
            }
        }
        
        if (deal.competitiveLandscape && deal.competitiveLandscape.competitors) {
            summary += `**Competition**: ${deal.competitiveLandscape.competitors.join(', ')}\n\n`;
        }
        
        if (deal.notes && deal.notes.length > 0) {
            summary += `**Latest Note**: ${deal.notes[0].text.slice(0, 100)}...\n\n`;
        }
        
        summary += `How can I help you with this opportunity?`;
        
        return summary;
    },
    
    updateContextItems: function(deal) {
        if (!deal) {
            this.contextItems = [];
            return;
        }
        
        // Build context items from deal data
        this.contextItems = [];
        
        // Company info
        if (deal.company) {
            this.contextItems.push({
                type: 'company',
                title: 'Company Info',
                text: `${deal.name} is a ${deal.company.size} ${deal.industry} company based in ${deal.company.location}. Annual revenue: ${deal.company.revenue}.`
            });
            
            if (deal.company.description) {
                this.contextItems.push({
                    type: 'company',
                    title: 'Company Description',
                    text: deal.company.description
                });
            }
        }
        
        // Deal value and stage
        this.contextItems.push({
            type: 'deal',
            title: 'Deal Value & Stage',
            text: `This deal is valued at ${deal.value} and is currently in the ${deal.stage} stage with an expected close date of ${deal.closeDate}.`
        });
        
        // Product info
        if (deal.product) {
            this.contextItems.push({
                type: 'product',
                title: 'Product Details',
                text: `${deal.product.name} (${deal.product.plan}) with ${deal.product.seats}. Implementation timeline: ${deal.product.implementation}.`
            });
        }
        
        // Financials
        if (deal.financials) {
            this.contextItems.push({
                type: 'financials',
                title: 'Financial Details',
                text: `Base price: ${deal.financials.basePrice}, Implementation: ${deal.financials.implementation}, Add-ons: ${deal.financials.addons}. ${deal.financials.discount ? 'Discount: ' + deal.financials.discount : ''}`
            });
            
            if (deal.financials.roi) {
                this.contextItems.push({
                    type: 'financials',
                    title: 'ROI',
                    text: deal.financials.roi
                });
            }
        }
        
        // Competitive landscape
        if (deal.competitiveLandscape) {
            if (deal.competitiveLandscape.competitors && deal.competitiveLandscape.competitors.length > 0) {
                this.contextItems.push({
                    type: 'competitive',
                    title: 'Competitors',
                    text: `Competing against: ${deal.competitiveLandscape.competitors.join(', ')}.`
                });
            }
            
            if (deal.competitiveLandscape.incumbent) {
                this.contextItems.push({
                    type: 'competitive',
                    title: 'Incumbent',
                    text: `Current solution: ${deal.competitiveLandscape.incumbent}`
                });
            }
            
            if (deal.competitiveLandscape.differentiators && deal.competitiveLandscape.differentiators.length > 0) {
                this.contextItems.push({
                    type: 'competitive',
                    title: 'Differentiators',
                    text: `Key differentiators: ${deal.competitiveLandscape.differentiators.join(', ')}.`
                });
            }
        }
        
        // Decision criteria
        if (deal.decisionCriteria && deal.decisionCriteria.length > 0) {
            this.contextItems.push({
                type: 'criteria',
                title: 'Decision Criteria',
                text: `Key decision criteria: ${deal.decisionCriteria.join(', ')}.`
            });
        }
        
        // Key contacts
        if (deal.contacts && deal.contacts.length > 0) {
            // Decision maker
            const decisionMakers = deal.contacts.filter(c => c.role === 'Decision Maker' || c.role === 'Approver');
            if (decisionMakers.length > 0) {
                decisionMakers.forEach(dm => {
                    this.contextItems.push({
                        type: 'contact',
                        title: `${dm.role}: ${dm.name}`,
                        text: `${dm.title}. Email: ${dm.email}, Phone: ${dm.phone}. ${dm.notes || ''}`
                    });
                });
            }
            
            // Champion
            const champions = deal.contacts.filter(c => c.role === 'Champion');
            if (champions.length > 0) {
                champions.forEach(champ => {
                    this.contextItems.push({
                        type: 'contact',
                        title: `Champion: ${champ.name}`,
                        text: `${champ.title}. Email: ${champ.email}, Phone: ${champ.phone}. ${champ.notes || ''}`
                    });
                });
            }
        }
        
        // Recent notes
        if (deal.notes && deal.notes.length > 0) {
            // Get the 3 most recent notes
            const recentNotes = [...deal.notes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
            
            recentNotes.forEach(note => {
                this.contextItems.push({
                    type: 'note',
                    title: `Note (${note.date})`,
                    text: note.text
                });
            });
        }
        
        // Update the context menu
        this.updateContextMenu();
    },
    
    sendMessage: function() {
        const chatInput = document.querySelector('#deal-chat-widget .chat-input');
        if (!chatInput) return;
        
        const text = chatInput.value.trim();
        if (text === '') return;
        
        // Add user message to UI
        this.addMessage({
            type: 'user',
            text: text
        });
        
        // Clear input
        chatInput.value = '';
        
        // Process message and respond
        this.processMessage(text);
    },
    
    processMessage: function(message) {
        // Check if this is a new deal creation request
        const dealMatch = message.match(/create (?:a )?new deal(?: for| with)? ([^,.]+)/i);
        if (dealMatch && this.uploadedFiles) {
            const dealName = dealMatch[1].trim();
            const newDeal = this.handleNewDealCreation(dealName, this.uploadedFiles);
            
            // Clear uploaded files after deal creation
            this.uploadedFiles = null;
            
            // Handle the newly created deal
            this.handleDealSelected(newDeal.id, newDeal);
            return;
        }
        
        // Add user message
        this.addMessage({
            type: 'user',
            text: message
        });
        
        // Process message based on current mode
        switch(this.currentMode) {
            case 'Assistant':
                this.processChatMessage(message);
                break;
            case 'Strategy':
                this.processComposerMessage(message);
                break;
            case 'Ask':
                this.processCoachingMessage(message);
                break;
        }
    },
    
    processChatMessage: function(message) {
        // Handle regular chat interaction
            if (this.currentDeal) {
                    this.addMessage({
                        type: 'assistant',
                text: `I'll help you with ${message} for ${this.currentDeal.name}.`
            });
                } else {
                    this.addMessage({
                        type: 'assistant',
                text: "Please select a deal first or create a new one to get started."
            });
        }
    },
    
    processComposerMessage: function(message) {
        if (!this.currentDeal) {
            this.addMessage({
                type: 'system',
                text: "Please select a deal first to use the composer mode."
            });
            return;
        }
        
                this.addMessage({
                    type: 'assistant',
            text: `I'll help you compose content for ${this.currentDeal.name} based on your request: ${message}`
        });
    },
    
    processCoachingMessage: function(message) {
        if (!this.currentDeal) {
            this.addMessage({
                type: 'system',
                text: "Please select a deal first to receive coaching."
            });
            return;
        }
        
        this.addMessage({
            type: 'assistant',
            text: `Here's my coaching advice for ${this.currentDeal.name} regarding: ${message}`
        });
    },
    
    respondWithContacts: function() {
        if (!this.currentDeal || !this.currentDeal.contacts) return;
        
        let response = `**Key Stakeholders for ${this.currentDeal.name}**\n\n`;
        
        this.currentDeal.contacts.forEach(contact => {
            response += `**${contact.name}** (${contact.title})\n`;
            response += `• Role: ${contact.role || 'N/A'}\n`;
            response += `• Influence: ${contact.influence || 'N/A'}\n`;
            response += `• Email: ${contact.email}\n`;
            if (contact.phone) response += `• Phone: ${contact.phone}\n`;
            if (contact.notes) response += `• Notes: ${contact.notes}\n`;
            response += '\n';
        });
        
        this.addMessage({
            type: 'assistant',
            text: response
        });
    },
    
    respondWithCompetitiveInfo: function() {
        if (!this.currentDeal || !this.currentDeal.competitiveLandscape) return;
        
        const comp = this.currentDeal.competitiveLandscape;
        let response = `**Competitive Landscape for ${this.currentDeal.name}**\n\n`;
        
        if (comp.competitors && comp.competitors.length > 0) {
            response += `**Main Competitors:**\n• ${comp.competitors.join('\n• ')}\n\n`;
        }
        
        if (comp.incumbent) {
            response += `**Incumbent Solution:**\n${comp.incumbent}\n\n`;
        }
        
        if (comp.differentiators && comp.differentiators.length > 0) {
            response += `**Our Differentiators:**\n• ${comp.differentiators.join('\n• ')}\n\n`;
        }
        
        if (comp.challenges && comp.challenges.length > 0) {
            response += `**Competitive Challenges:**\n• ${comp.challenges.join('\n• ')}\n\n`;
        }
        
        this.addMessage({
            type: 'assistant',
            text: response
        });
    },
    
    respondWithTimeline: function() {
        if (!this.currentDeal || !this.currentDeal.timeline) return;
        
        const timeline = this.currentDeal.timeline;
        let response = `**Deal Timeline for ${this.currentDeal.name}**\n\n`;
        
        for (const [key, value] of Object.entries(timeline)) {
            const formattedKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
            
            response += `• **${formattedKey}**: ${value}\n`;
        }
        
        // Add any relevant history items
        if (this.currentDeal.history && this.currentDeal.history.length > 0) {
            response += '\n**Key Milestones:**\n';
            
            // Get the 5 most recent history items
            const recentHistory = [...this.currentDeal.history]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            recentHistory.reverse().forEach(item => {
                response += `• ${item.date}: ${item.title} - ${item.description}\n`;
            });
        }
        
        this.addMessage({
            type: 'assistant',
            text: response
        });
    },
    
    respondWithChallenges: function() {
        if (!this.currentDeal) return;
        
        let response = `**Key Challenges for ${this.currentDeal.name}**\n\n`;
        
        // Competitive challenges
        if (this.currentDeal.competitiveLandscape && this.currentDeal.competitiveLandscape.challenges) {
            response += '**Competitive Challenges:**\n';
            this.currentDeal.competitiveLandscape.challenges.forEach(challenge => {
                response += `• ${challenge}\n`;
            });
            response += '\n';
        }
        
        // Extract challenges from notes
        if (this.currentDeal.notes && this.currentDeal.notes.length > 0) {
            const challengeRelatedNotes = this.currentDeal.notes.filter(note => 
                note.text.toLowerCase().includes('challenge') || 
                note.text.toLowerCase().includes('concern') || 
                note.text.toLowerCase().includes('issue') ||
                note.text.toLowerCase().includes('risk') ||
                note.text.toLowerCase().includes('worry')
            );
            
            if (challengeRelatedNotes.length > 0) {
                response += '**Issues Mentioned in Notes:**\n';
                challengeRelatedNotes.forEach(note => {
                    response += `• ${note.date}: ${note.text.slice(0, 100)}...\n`;
                });
                response += '\n';
            }
        }
        
        // Decision criteria as opportunities to address challenges
        if (this.currentDeal.decisionCriteria && this.currentDeal.decisionCriteria.length > 0) {
            response += '**Success Criteria to Address:**\n';
            this.currentDeal.decisionCriteria.forEach(criteria => {
                response += `• ${criteria}\n`;
            });
        }
        
        this.addMessage({
            type: 'assistant',
            text: response
        });
    },
    
    respondWithFinancials: function() {
        if (!this.currentDeal) return;
        
        let response = `**Financial Overview for ${this.currentDeal.name}**\n\n`;
        
        response += `**Deal Value:** ${this.currentDeal.value}\n\n`;
        
        if (this.currentDeal.financials) {
            const fin = this.currentDeal.financials;
            response += '**Pricing Breakdown:**\n';
            response += `• Base Price: ${fin.basePrice}\n`;
            if (fin.implementation) response += `• Implementation: ${fin.implementation}\n`;
            if (fin.addons) response += `• Add-ons: ${fin.addons}\n`;
            if (fin.discount) response += `• Discount: ${fin.discount}\n`;
            response += '\n';
            
            if (fin.payment) response += `**Payment Terms:** ${fin.payment}\n\n`;
            if (fin.roi) response += `**ROI Analysis:** ${fin.roi}\n\n`;
        }
        
        // Product details that impact pricing
        if (this.currentDeal.product) {
            const prod = this.currentDeal.product;
            response += '**Product Configuration:**\n';
            response += `• Product: ${prod.name}\n`;
            response += `• Plan: ${prod.plan}\n`;
            response += `• Licenses: ${prod.seats}\n`;
            response += `• Term: ${prod.term}\n`;
            if (prod.addons && prod.addons.length > 0) {
                response += `• Add-ons: ${prod.addons.join(', ')}\n`;
            }
        }
        
        this.addMessage({
            type: 'assistant',
            text: response
        });
    },
    
    addMessage: function(message) {
        // Add message to internal array
        this.messages.push(message);
        
        // Add message to UI
        const chatMessagesContainer = document.querySelector('#deal-chat-widget .chat-messages');
        if (!chatMessagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.type}-message`;
        
        let messageContent = message.text;
        
        // Convert markdown-style formatting to HTML
        messageContent = messageContent
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
        
        messageElement.innerHTML = `
            <div class="message-content">${messageContent}</div>
        `;
        
        chatMessagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        
        // Hide null state message if visible
        const nullStateMessage = document.querySelector('#deal-chat-widget .null-state-message');
        if (nullStateMessage) {
            nullStateMessage.style.display = 'none';
        }
    },
    
    toggleContextMenu: function() {
        const contextMenu = document.querySelector('#deal-chat-widget .context-menu');
        if (contextMenu) {
            contextMenu.classList.toggle('active');
        }
    },
    
    updateContextMenu: function() {
        const contextMenu = document.querySelector('#deal-chat-widget .context-menu');
        if (!contextMenu) return;
        
        if (this.contextItems.length === 0) {
            contextMenu.innerHTML = `
                <div class="context-menu-header">Deal Context</div>
                <div class="context-menu-empty">No deal selected. Please select a deal to view context.</div>
            `;
            return;
        }
        
        let menuContent = `<div class="context-menu-header">Deal Context</div>`;
        
        // Group items by type
        const groupedItems = this.contextItems.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = [];
            }
            acc[item.type].push(item);
            return acc;
        }, {});
        
        // Add items to menu
        for (const [type, items] of Object.entries(groupedItems)) {
            menuContent += `<div class="context-group-heading">${this.formatContextType(type)}</div>`;
            
            items.forEach(item => {
                menuContent += `
                    <div class="context-item" data-type="${item.type}">
                        <div class="context-item-title">${item.title}</div>
                        <div class="context-item-insert" data-text="${this.escapeHtml(item.text)}">Insert</div>
                    </div>
                `;
            });
        }
        
        contextMenu.innerHTML = menuContent;
        
        // Add event listeners for insert buttons
        const insertButtons = contextMenu.querySelectorAll('.context-item-insert');
        insertButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const text = e.target.getAttribute('data-text');
                if (text) {
                    this.insertContextIntoInput(text);
                    contextMenu.classList.remove('active');
                }
            });
        });
    },
    
    formatContextType: function(type) {
        const typeLabels = {
            'company': 'Company Information',
            'deal': 'Deal Details',
            'product': 'Product Information',
            'financials': 'Financial Information',
            'competitive': 'Competitive Information',
            'criteria': 'Decision Criteria',
            'contact': 'Key Contacts',
            'note': 'Recent Notes'
        };
        
        return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
    },
    
    insertContextIntoInput: function(text) {
        const chatInput = document.querySelector('#deal-chat-widget .chat-input');
        if (!chatInput) return;
        
        const cursorPos = chatInput.selectionStart;
        const inputValue = chatInput.value;
        const newValue = inputValue.slice(0, cursorPos) + text + inputValue.slice(cursorPos);
        
        chatInput.value = newValue;
        chatInput.focus();
        chatInput.selectionStart = cursorPos + text.length;
        chatInput.selectionEnd = cursorPos + text.length;
    },
    
    escapeHtml: function(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    
    triggerFileUpload: function() {
        const fileInput = document.querySelector('#deal-chat-widget #chat-file-input');
        if (fileInput) {
            fileInput.click();
        }
    },
    
    handleFileUpload: function(files) {
        try {
            if (!files || files.length === 0) {
                console.error('No files provided to handleFileUpload');
                this.addMessage({
                    type: 'system',
                    text: '❌ No files were selected. Please try again.'
                });
                return;
            }
            
            console.log('Starting file upload process...', {
                fileCount: files.length,
                firstFileName: files[0].name,
                firstFileSize: files[0].size
            });
            
            // Store the uploaded files for reference
            this.uploadedFiles = Array.from(files);
            
            // Add a processing message
        this.addMessage({
                type: 'system',
                text: '⚙️ Processing uploaded files...'
            });
            
            // If we have a current deal, add files to it
            if (window.dealStore && window.dealStore.currentDeal) {
                // Dispatch fileUploaded event for deal content to handle
                const event = new CustomEvent('fileUploaded', {
                    detail: { files: files }
                });
                document.dispatchEvent(event);
                
                // Add success message
                this.addMessage({
                    type: 'system',
                    text: `✅ Added ${files.length} file(s) to the current deal.`
                });
            } else {
                // Create a new deal from the files
                console.log('Creating new deal from files...');
                const dealName = this.extractDealName(files[0].name) || 'New Deal';
                console.log('Extracted deal name:', dealName);
                
                const newDeal = {
                    id: 'deal-' + Date.now(),
                    name: dealName,
                    value: this.extractDealValue(files) || 'TBD',
                    stage: 'Discovery',
                    closeDate: new Date().toISOString().split('T')[0],
                    company: {
                        name: dealName.split(' ')[0],
                        size: 'Enterprise',
                        industry: 'Technology',
                        location: 'United States'
                    },
                    files: Array.from(files).map(file => ({
                        id: 'f' + Date.now() + Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        type: file.name.split('.').pop().toLowerCase(),
                        date: new Date().toISOString().split('T')[0],
                        size: this.formatFileSize(file.size)
                    })),
                    notes: [{
                        id: 'n' + Date.now(),
                        date: new Date().toISOString().split('T')[0],
                        text: 'Deal created from uploaded files'
                    }],
                    history: [{
                        id: 'h' + Date.now(),
                        title: 'Deal created',
                        date: new Date().toISOString().split('T')[0],
                        description: 'Deal automatically created from uploaded files'
                    }]
                };
                
                // Add deal to dealStore
                if (!window.dealStore) {
                    window.dealStore = {
                        deals: {},
                        currentDeal: null
                    };
                }
                window.dealStore.deals[newDeal.id] = newDeal;
                window.dealStore.currentDeal = newDeal.id;
                
                // Update dropdown
                const dropdownContent = document.querySelector('.deal-context-bar .dropdown-content');
                if (dropdownContent) {
                    const existingOption = dropdownContent.querySelector(`[data-deal="${newDeal.id}"]`);
                    if (existingOption) {
                        existingOption.remove();
                    }
                    
                    // Add the new deal option
                    const newOption = document.createElement('a');
                    newOption.href = '#';
                    newOption.setAttribute('data-deal', newDeal.id);
                    newOption.textContent = `${dealName} - ${newDeal.value}`;
                    
                    // Add click handler to the new option
                    newOption.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (typeof window.selectDeal === 'function') {
                            window.selectDeal(newDeal.id);
                        }
                    });
                    
                    dropdownContent.appendChild(newOption);
                }
                
                // Add success message
                this.addMessage({
                    type: 'system',
                    text: `✅ Created new deal "${dealName}" from uploaded files.`
                });
                
                // Dispatch deal selected event
                const event = new CustomEvent('dealSelected', { 
                    detail: { dealId: newDeal.id, deal: newDeal } 
                });
                document.dispatchEvent(event);
            }
            
            // Clear uploaded files reference
            this.uploadedFiles = null;
            
        } catch (error) {
            console.error('Error in handleFileUpload:', error);
            this.addMessage({
                type: 'system',
                text: '❌ Sorry, there was an error processing the files. Please try again.'
            });
            this.uploadedFiles = null;
        }
    },
    
    extractDealName: function(fileName) {
        // Remove file extension and common prefixes/suffixes
        let name = fileName.split('.')[0]
            .replace(/(proposal|quote|contract|agreement|doc|_|-)/gi, ' ')
            .trim()
            .split(' ')
            .filter(word => word.length > 1) // Remove single characters
            .join(' ');
        
        // Capitalize first letter of each word
        return name.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
    
    extractDealValue: function(files) {
        // In a real implementation, this would analyze file contents
        // For now, return a placeholder value
        return '$250,000';
    },
    
    formatFileSize: function(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    switchMode: function(mode) {
        if (!this.modes[mode.toUpperCase()]) {
            console.error('Invalid mode:', mode);
            return;
        }
        
        this.currentMode = mode;
        
        // Update mode selector button
        const modeBtn = document.querySelector('.mode-selector-btn');
        if (modeBtn) {
            modeBtn.textContent = mode;
        }
        
        // Update UI based on mode
        const chatTab = document.querySelector('.chat-tab');
        const composerTab = document.querySelector('.composer-tab');
        const coachingTab = document.querySelector('.coaching-tab');
        
        // Hide all tabs first
        [chatTab, composerTab, coachingTab].forEach(tab => {
            if (tab) tab.classList.remove('active');
        });
        
        // Show the selected tab
        switch(mode.toUpperCase()) {
            case 'CHAT':
                if (chatTab) chatTab.classList.add('active');
                break;
            case 'COMPOSER':
                if (composerTab) composerTab.classList.add('active');
                break;
            case 'COACHING':
                if (coachingTab) coachingTab.classList.add('active');
                break;
        }
        
        // Dispatch mode change event
        document.dispatchEvent(new CustomEvent('widgetModeChanged', {
            detail: { mode: mode }
        }));
    },

    initializeModeSelector: function() {
        const modeSelector = document.querySelector('.widget-mode-selector');
        if (!modeSelector) return;
        
        const modeBtn = modeSelector.querySelector('.mode-selector-btn');
        const modeDropdown = modeSelector.querySelector('.dropdown-content');
        
        if (modeBtn && modeDropdown) {
            // Add click handler for mode button
            modeBtn.addEventListener('click', () => {
                modeDropdown.classList.toggle('show');
            });
            
            // Add click handlers for mode options
            modeDropdown.querySelectorAll('a').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const mode = e.target.getAttribute('data-mode');
                    if (mode) {
                        this.switchMode(mode);
                        modeDropdown.classList.remove('show');
                    }
                });
            });
        }
    },

    updateDealContext: function(deal) {
        if (!deal) return;
        
        // Update deal context panel
        const contextPanel = document.querySelector('.deal-context-panel');
        if (!contextPanel) return;
        
        // Update deal header
        const dealHeader = contextPanel.querySelector('.deal-header');
        if (dealHeader) {
            dealHeader.innerHTML = `
                <div class="deal-title">
                    <h3>${deal.name}</h3>
                    <span class="deal-stage">${deal.stage}</span>
                </div>
                <div class="deal-value">${deal.value}</div>
            `;
        }
        
        // Update key metrics
        const metricsSection = contextPanel.querySelector('.deal-metrics');
        if (metricsSection) {
            metricsSection.innerHTML = `
                <div class="metric">
                    <label>Close Date</label>
                    <value>${deal.closeDate}</value>
                </div>
                <div class="metric">
                    <label>Company Size</label>
                    <value>${deal.company ? deal.company.size : 'N/A'}</value>
                </div>
                <div class="metric">
                    <label>Industry</label>
                    <value>${deal.industry || 'N/A'}</value>
                </div>
            `;
        }
        
        // Update quick actions based on current mode
        const actionsSection = contextPanel.querySelector('.quick-actions');
        if (actionsSection) {
            let actions = '';
            switch(this.currentMode) {
                case 'Assistant':
                    actions = `
                        <button class="action-btn" data-action="view-files">View Files (${deal.files.length})</button>
                        <button class="action-btn" data-action="add-note">Add Note</button>
                    `;
                    break;
                case 'Strategy':
                    actions = `
                        <button class="action-btn" data-action="draft-email">Draft Email</button>
                        <button class="action-btn" data-action="create-proposal">Create Proposal</button>
                    `;
                    break;
                case 'Ask':
                    actions = `
                        <button class="action-btn" data-action="deal-strategy">Deal Strategy</button>
                        <button class="action-btn" data-action="competitive-analysis">Competitive Analysis</button>
                    `;
                    break;
            }
            actionsSection.innerHTML = actions;
            
            // Add event listeners to action buttons
            actionsSection.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.target.getAttribute('data-action');
                    this.handleContextAction(action, deal);
                });
            });
        }
    },

    handleContextAction: function(action, deal) {
        switch(action) {
            case 'view-files':
                this.addMessage({
                    type: 'system',
                    text: `Here are the files for ${deal.name}:`,
                    files: deal.files
                });
                break;
            case 'add-note':
                // Show note input UI
                this.showAddNoteDialog(deal);
                break;
            case 'draft-email':
            this.addMessage({
                type: 'assistant',
                    text: `I'll help you draft an email for ${deal.name}. What would you like to communicate?`
                });
                break;
            case 'create-proposal':
                this.addMessage({
                    type: 'assistant',
                    text: `Let's create a proposal for ${deal.name}. I'll help you structure it based on their requirements.`
                });
                break;
            case 'deal-strategy':
                this.addMessage({
                    type: 'assistant',
                    text: `Let's analyze the strategy for ${deal.name}. I'll provide insights based on the deal information.`
                });
                break;
            case 'competitive-analysis':
                this.addMessage({
                    type: 'assistant',
                    text: `I'll help you analyze the competitive landscape for ${deal.name} based on their industry and requirements.`
                });
                break;
        }
    },

    showAddNoteDialog: function(deal) {
        // Implementation of showAddNoteDialog method
    }
};

// Make chatWidget globally available
window.chatWidget = chatWidget; 