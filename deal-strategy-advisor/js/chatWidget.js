/**
 * Chat Widget Module - Improved Implementation
 * A modular, extensible chat widget architecture for Deal Strategy Advisor
 */

// Core widget namespace
const ChatWidget = (function() {
    'use strict';

    // Private variables and utility methods
    const SELECTORS = {
        widget: '#deal-chat-widget',
        chatInput: '#deal-chat-widget .chat-input',
        sendButton: '#deal-chat-widget .send-btn',
        chatMessages: '#deal-chat-widget .chat-messages',
        fileUploadBtn: '#deal-chat-widget .file-upload-btn-chat',
        fileInput: '#deal-chat-widget #chat-file-input',
        contextMenuBtn: '#deal-chat-widget .context-menu-button',
        contextMenu: '#deal-chat-widget .context-menu',
        modeSelector: '.widget-mode-selector',
        modeSelectorBtn: '.mode-selector-btn',
        modeSelectorDropdown: '.widget-mode-selector .dropdown-content',
        noDealState: '.no-deal-state',
        activeDealState: '.active-deal-state',
        dealContextPanel: '.deal-context-panel',
        nullStateMessage: '#deal-chat-widget .null-state-message'
    };

    // Internal state
    const state = {
        messages: [],
        currentDeal: null,
        contextItems: [],
        uploadedFiles: null,
        modes: {
            CHAT: 'Assistant',
            COMPOSER: 'Strategy',
            COACHING: 'Ask'
        },
        currentMode: 'Strategy',
        eventHandlers: {}
    };

    // DOM Element Cache
    const elements = {};

    // Utility functions
    const utils = {
        cacheElements: function() {
            // Cache DOM elements for better performance
            Object.keys(SELECTORS).forEach(key => {
                elements[key] = document.querySelector(SELECTORS[key]);
            });
            console.log('DOM elements cached:', Object.keys(elements).filter(k => elements[k]));
        },
        
        formatMarkdown: function(text) {
            if (!text) return '';
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n/g, '<br>');
        },
        
        escapeHtml: function(text) {
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },
        
        formatFileSize: function(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        },

        ensureDealStore: function() {
            if (!window.dealStore) {
                console.log('Initializing dealStore');
                window.dealStore = {
                    deals: {},
                    currentDeal: null
                };
            }
            return window.dealStore;
        },
        
        getElement: function(selector) {
            return document.querySelector(selector);
        },
        
        publish: function(eventName, data) {
            const event = new CustomEvent(eventName, { detail: data });
            document.dispatchEvent(event);
            console.log(`Event published: ${eventName}`, data);
        },
        
        subscribe: function(eventName, handler) {
            document.addEventListener(eventName, handler);
            
            // Store handler reference for potential cleanup
            if (!state.eventHandlers[eventName]) {
                state.eventHandlers[eventName] = [];
            }
            state.eventHandlers[eventName].push(handler);
        },
        
        unsubscribe: function(eventName, handler) {
            document.removeEventListener(eventName, handler);
            
            // Remove from stored handlers
            if (state.eventHandlers[eventName]) {
                state.eventHandlers[eventName] = state.eventHandlers[eventName]
                    .filter(h => h !== handler);
            }
        }
    };

    // UI Module - Handles all DOM interactions
    const UI = {
        initialize: function() {
            utils.cacheElements();
        },
        
        setupEventListeners: function() {
            console.log('Setting up UI event listeners...');
            
            // Send button
            if (elements.sendButton) {
                elements.sendButton.addEventListener('click', () => MessageHandler.sendMessage());
            }
            
            // Chat input - Enter key
            if (elements.chatInput) {
                elements.chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        MessageHandler.sendMessage();
                    }
                });
            }
            
            // File upload
            if (elements.fileUploadBtn && elements.fileInput) {
                // Replace to remove any existing listeners
                elements.fileUploadBtn.replaceWith(elements.fileUploadBtn.cloneNode(true));
                elements.fileInput.replaceWith(elements.fileInput.cloneNode(true));
                
                // Re-cache the fresh elements
                elements.fileUploadBtn = document.querySelector(SELECTORS.fileUploadBtn);
                elements.fileInput = document.querySelector(SELECTORS.fileInput);
                
                // Add new listeners
                elements.fileUploadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    elements.fileInput.click();
                });
                
                elements.fileInput.addEventListener('change', (e) => {
                    FileHandler.handleFileUpload(e.target.files);
                });
            }
            
            // Context menu
            if (elements.contextMenuBtn) {
                elements.contextMenuBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    ContextMenu.toggle();
                });
            }
            
            // Click outside to close context menu
            document.addEventListener('click', (e) => {
                if (elements.contextMenu && elements.contextMenu.classList.contains('active')) {
                    if (!elements.contextMenu.contains(e.target) && e.target !== elements.contextMenuBtn) {
                        elements.contextMenu.classList.remove('active');
                    }
                }
            });
            
            console.log('UI event listeners set up');
        },
        
        addMessage: function(message) {
            // Add message to internal array
            state.messages.push(message);
            
            // Add message to UI
            if (!elements.chatMessages) return;
            
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${message.type}-message`;
            
            // Convert markdown-style formatting to HTML
            const messageContent = utils.formatMarkdown(message.text);
            
            messageElement.innerHTML = `
                <div class="message-content">${messageContent}</div>
            `;
            
            elements.chatMessages.appendChild(messageElement);
            
            // Scroll to bottom
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
            
            // Hide null state message if visible
            if (elements.nullStateMessage) {
                elements.nullStateMessage.style.display = 'none';
            }
        },
        
        clearInput: function() {
            if (elements.chatInput) {
                elements.chatInput.value = '';
            }
        },
        
        insertTextAtCursor: function(text) {
            if (!elements.chatInput) return;
            
            const cursorPos = elements.chatInput.selectionStart;
            const inputValue = elements.chatInput.value;
            const newValue = inputValue.slice(0, cursorPos) + text + inputValue.slice(cursorPos);
            
            elements.chatInput.value = newValue;
            elements.chatInput.focus();
            elements.chatInput.selectionStart = cursorPos + text.length;
            elements.chatInput.selectionEnd = cursorPos + text.length;
        },
        
        updateDealState: function(deal) {
            if (!deal) {
                // No deal selected state
                if (elements.noDealState) elements.noDealState.classList.add('active');
                if (elements.activeDealState) elements.activeDealState.classList.remove('active');
                
                // Show welcome message
                const welcomeMessages = document.querySelectorAll('.welcome-message');
                welcomeMessages.forEach(msg => msg.classList.remove('active'));
                
                const noDealMessage = document.querySelector('.welcome-message.no-deal-message');
                if (noDealMessage) noDealMessage.classList.add('active');
            } else {
                // Deal selected state
                if (elements.noDealState) elements.noDealState.classList.remove('active');
                if (elements.activeDealState) {
                    elements.activeDealState.classList.add('active');
                    
                    // Update active deal name
                    const dealNameEl = elements.activeDealState.querySelector('.active-deal-name');
                    if (dealNameEl) dealNameEl.textContent = deal.name;
                    
                    // Update deal stage pill
                    const stagePillEl = elements.activeDealState.querySelector('.deal-stage-pill');
                    if (stagePillEl) stagePillEl.textContent = deal.stage || 'No Stage';
                }
            }
        },
        
        updateDealContextPanel: function(deal) {
            if (!deal || !elements.dealContextPanel) return;
            
            // Update deal header
            const dealHeader = elements.dealContextPanel.querySelector('.deal-header');
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
            const metricsSection = elements.dealContextPanel.querySelector('.deal-metrics');
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
            UI.updateContextActions(deal);
        },
        
        updateContextActions: function(deal) {
            if (!deal || !elements.dealContextPanel) return;
            
            const actionsSection = elements.dealContextPanel.querySelector('.quick-actions');
            if (!actionsSection) return;
            
            let actions = '';
            switch(state.currentMode) {
                case 'Assistant':
                    actions = `
                        <button class="action-btn" data-action="view-files">View Files (${deal.files ? deal.files.length : 0})</button>
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
                    DealIntegration.handleContextAction(action, deal);
                });
            });
        },
        
        updateModeDisplay: function(mode) {
            // Update mode selector button
            const modeBtn = document.querySelector('.mode-selector-btn');
            if (modeBtn) {
                modeBtn.textContent = mode;
            }
            
            // Update visible tab
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
                case 'ASSISTANT':
                    if (chatTab) chatTab.classList.add('active');
                    break;
                case 'COMPOSER':
                case 'STRATEGY':
                    if (composerTab) composerTab.classList.add('active');
                    break;
                case 'COACHING':
                case 'ASK':
                    if (coachingTab) coachingTab.classList.add('active');
                    break;
            }
        }
    };

    // Message Handler - Manages message processing and display
    const MessageHandler = {
        sendMessage: function() {
            if (!elements.chatInput) return;
            
            const text = elements.chatInput.value.trim();
            if (text === '') return;
            
            // Add user message to UI
            UI.addMessage({
                type: 'user',
                text: text
            });
            
            // Clear input
            UI.clearInput();
            
            // Process message and respond
            this.processMessage(text);
        },
        
        processMessage: function(message) {
            // Check if this is a new deal creation request
            const dealMatch = message.match(/create (?:a )?new deal(?: for| with)? ([^,.]+)/i);
            if (dealMatch && state.uploadedFiles) {
                const dealName = dealMatch[1].trim();
                const newDeal = FileHandler.handleNewDealCreation(dealName, state.uploadedFiles);
                
                // Clear uploaded files after deal creation
                state.uploadedFiles = null;
                
                // Handle the newly created deal
                DealIntegration.handleDealSelected(newDeal.id, newDeal);
                return;
            }
            
            // Process message based on current mode
            switch(state.currentMode) {
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
            if (state.currentDeal) {
                UI.addMessage({
                    type: 'assistant',
                    text: `I'll help you with ${message} for ${state.currentDeal.name}.`
                });
                
                // Check for special keywords
                this.checkForSpecialInstructions(message);
            } else {
                UI.addMessage({
                    type: 'assistant',
                    text: "Please select a deal first or create a new one to get started."
                });
            }
        },
        
        processComposerMessage: function(message) {
            if (!state.currentDeal) {
                UI.addMessage({
                    type: 'system',
                    text: "Please select a deal first to use the composer mode."
                });
                return;
            }
            
            UI.addMessage({
                type: 'assistant',
                text: `I'll help you compose content for ${state.currentDeal.name} based on your request: ${message}`
            });
        },
        
        processCoachingMessage: function(message) {
            if (!state.currentDeal) {
                UI.addMessage({
                    type: 'system',
                    text: "Please select a deal first to receive coaching."
                });
                return;
            }
            
            UI.addMessage({
                type: 'assistant',
                text: `Here's my coaching advice for ${state.currentDeal.name} regarding: ${message}`
            });
        },
        
        checkForSpecialInstructions: function(message) {
            const lowerMessage = message.toLowerCase();
            
            // Check for contacts request
            if (lowerMessage.includes('contacts') || 
                lowerMessage.includes('stakeholders') || 
                lowerMessage.includes('people')) {
                this.respondWithContacts();
                return true;
            }
            
            // Check for competitive info request
            if (lowerMessage.includes('competitor') || 
                lowerMessage.includes('competition') || 
                lowerMessage.includes('differentiator')) {
                this.respondWithCompetitiveInfo();
                return true;
            }
            
            // Check for timeline request
            if (lowerMessage.includes('timeline') || 
                lowerMessage.includes('schedule') || 
                lowerMessage.includes('when')) {
                this.respondWithTimeline();
                return true;
            }
            
            // Check for challenges request
            if (lowerMessage.includes('challenge') || 
                lowerMessage.includes('problem') || 
                lowerMessage.includes('issue') ||
                lowerMessage.includes('risk')) {
                this.respondWithChallenges();
                return true;
            }
            
            // Check for financial info request
            if (lowerMessage.includes('financial') || 
                lowerMessage.includes('pricing') || 
                lowerMessage.includes('cost') ||
                lowerMessage.includes('price') ||
                lowerMessage.includes('roi')) {
                this.respondWithFinancials();
                return true;
            }
            
            return false;
        },
        
        respondWithContacts: function() {
            if (!state.currentDeal || !state.currentDeal.contacts) return;
            
            let response = `**Key Stakeholders for ${state.currentDeal.name}**\n\n`;
            
            state.currentDeal.contacts.forEach(contact => {
                response += `**${contact.name}** (${contact.title})\n`;
                response += `• Role: ${contact.role || 'N/A'}\n`;
                response += `• Influence: ${contact.influence || 'N/A'}\n`;
                response += `• Email: ${contact.email}\n`;
                if (contact.phone) response += `• Phone: ${contact.phone}\n`;
                if (contact.notes) response += `• Notes: ${contact.notes}\n`;
                response += '\n';
            });
            
            UI.addMessage({
                type: 'assistant',
                text: response
            });
        },
        
        respondWithCompetitiveInfo: function() {
            if (!state.currentDeal || !state.currentDeal.competitiveLandscape) return;
            
            const comp = state.currentDeal.competitiveLandscape;
            let response = `**Competitive Landscape for ${state.currentDeal.name}**\n\n`;
            
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
            
            UI.addMessage({
                type: 'assistant',
                text: response
            });
        },
        
        respondWithTimeline: function() {
            if (!state.currentDeal || !state.currentDeal.timeline) return;
            
            const timeline = state.currentDeal.timeline;
            let response = `**Deal Timeline for ${state.currentDeal.name}**\n\n`;
            
            for (const [key, value] of Object.entries(timeline)) {
                const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                
                response += `• **${formattedKey}**: ${value}\n`;
            }
            
            // Add any relevant history items
            if (state.currentDeal.history && state.currentDeal.history.length > 0) {
                response += '\n**Key Milestones:**\n';
                
                // Get the 5 most recent history items
                const recentHistory = [...state.currentDeal.history]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5);
                
                recentHistory.reverse().forEach(item => {
                    response += `• ${item.date}: ${item.title} - ${item.description}\n`;
                });
            }
            
            UI.addMessage({
                type: 'assistant',
                text: response
            });
        },
        
        respondWithChallenges: function() {
            if (!state.currentDeal) return;
            
            let response = `**Key Challenges for ${state.currentDeal.name}**\n\n`;
            
            // Competitive challenges
            if (state.currentDeal.competitiveLandscape && state.currentDeal.competitiveLandscape.challenges) {
                response += '**Competitive Challenges:**\n';
                state.currentDeal.competitiveLandscape.challenges.forEach(challenge => {
                    response += `• ${challenge}\n`;
                });
                response += '\n';
            }
            
            // Extract challenges from notes
            if (state.currentDeal.notes && state.currentDeal.notes.length > 0) {
                const challengeRelatedNotes = state.currentDeal.notes.filter(note => 
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
            if (state.currentDeal.decisionCriteria && state.currentDeal.decisionCriteria.length > 0) {
                response += '**Success Criteria to Address:**\n';
                state.currentDeal.decisionCriteria.forEach(criteria => {
                    response += `• ${criteria}\n`;
                });
            }
            
            UI.addMessage({
                type: 'assistant',
                text: response
            });
        },
        
        respondWithFinancials: function() {
            if (!state.currentDeal) return;
            
            let response = `**Financial Overview for ${state.currentDeal.name}**\n\n`;
            
            response += `**Deal Value:** ${state.currentDeal.value}\n\n`;
            
            if (state.currentDeal.financials) {
                const fin = state.currentDeal.financials;
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
            if (state.currentDeal.product) {
                const prod = state.currentDeal.product;
                response += '**Product Configuration:**\n';
                response += `• Product: ${prod.name}\n`;
                response += `• Plan: ${prod.plan}\n`;
                response += `• Licenses: ${prod.seats}\n`;
                response += `• Term: ${prod.term}\n`;
                if (prod.addons && prod.addons.length > 0) {
                    response += `• Add-ons: ${prod.addons.join(', ')}\n`;
                }
            }
            
            UI.addMessage({
                type: 'assistant',
                text: response
            });
        },
        
        loadInitialMessages: function() {
            // Add welcome message
            UI.addMessage({
                type: 'system',
                text: 'Welcome to Deal Strategy Advisor. Select a deal to get started or ask me a question.'
            });
        }
    };

    // Deal Integration - Handles all deal-related functionality
    const DealIntegration = {
        initialize: function() {
            this.setupDealIntegration();
        },
        
        setupDealIntegration: function() {
            // Listen for deal selection events
            utils.subscribe('dealSelected', (e) => {
                const { dealId, deal } = e.detail;
                this.handleDealSelected(dealId, deal);
            });
            
            // Listen for deal cleared events
            utils.subscribe('dealCleared', () => {
                this.handleDealCleared();
            });
        },
        
        handleDealSelected: function(dealId, deal) {
            // Store the current deal
            state.currentDeal = deal;
            
            // Update context items based on deal data
            this.updateContextItems(deal);
            
            // Update deal context panel
            UI.updateDealContextPanel(deal);
            
            // Add a message showing deal selection
            UI.addMessage({
                type: 'system',
                text: `You've selected the ${deal.name} deal. How can I help with this opportunity?`
            });
            
            // Show a summary of the deal
            UI.addMessage({
                type: 'assistant',
                text: this.generateDealSummary(deal)
            });
            
            // Update the UI to show active deal state
            UI.updateDealState(deal);
            
            // Store in dealStore for global access
            const dealStore = utils.ensureDealStore();
            dealStore.currentDeal = deal;
            if (!dealStore.deals) dealStore.deals = {};
            dealStore.deals[dealId] = deal;
            
            console.log('Deal selected:', dealId);
        },
        
        handleDealCleared: function() {
            state.currentDeal = null;
            state.contextItems = [];
            
            // Clear context menu
            ContextMenu.update();
            
            // Update UI to show no deal selected
            UI.updateDealState(null);
            
            // Add a message showing deal was cleared
            UI.addMessage({
                type: 'system',
                text: 'Deal has been cleared. Select a new deal or ask a general question.'
            });
            
            // Clear from dealStore
            const dealStore = utils.ensureDealStore();
            dealStore.currentDeal = null;
            
            console.log('Deal cleared');
        },
        
        generateDealSummary: function(deal) {
            if (!deal) return '';
            
            let summary = `**${deal.name} Deal Summary**\n\n`;
            summary += `• **Value**: ${deal.value}\n`;
            summary += `• **Stage**: ${deal.stage}\n`;
            summary += `• **Close Date**: ${deal.closeDate}\n\n`;
            
            if (deal.company) {
                summary += `**Company**: ${deal.company.size} ${deal.industry || ''} company`;
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
                const latestNote = [...deal.notes].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                if (latestNote) {
                    summary += `**Latest Note**: ${latestNote.text.slice(0, 100)}...\n\n`;
                }
            }
            
            summary += `How can I help you with this opportunity?`;
            
            return summary;
        },
        
        updateContextItems: function(deal) {
            if (!deal) {
                state.contextItems = [];
                return;
            }
            
            // Build context items from deal data
            state.contextItems = [];
            
            // Company info
            if (deal.company) {
                state.contextItems.push({
                    type: 'company',
                    title: 'Company Info',
                    text: `${deal.name} is a ${deal.company.size} ${deal.industry || ''} company based in ${deal.company.location || 'N/A'}. Annual revenue: ${deal.company.revenue || 'N/A'}.`
                });
                
                if (deal.company.description) {
                    state.contextItems.push({
                        type: 'company',
                        title: 'Company Description',
                        text: deal.company.description
                    });
                }
            }
            
            // Deal value and stage
            state.contextItems.push({
                type: 'deal',
                title: 'Deal Value & Stage',
                text: `This deal is valued at ${deal.value} and is currently in the ${deal.stage} stage with an expected close date of ${deal.closeDate}.`
            });
            
            // Product info
            if (deal.product) {
                state.contextItems.push({
                    type: 'product',
                    title: 'Product Details',
                    text: `${deal.product.name} (${deal.product.plan}) with ${deal.product.seats}. Implementation timeline: ${deal.product.implementation}.`
                });
            }
            
            // Financials
            if (deal.financials) {
                state.contextItems.push({
                    type: 'financials',
                    title: 'Financial Details',
                    text: `Base price: ${deal.financials.basePrice}, Implementation: ${deal.financials.implementation}, Add-ons: ${deal.financials.addons}. ${deal.financials.discount ? 'Discount: ' + deal.financials.discount : ''}`
                });
                
                if (deal.financials.roi) {
                    state.contextItems.push({
                        type: 'financials',
                        title: 'ROI',
                        text: deal.financials.roi
                    });
                }
            }
            
            // Competitive landscape
            if (deal.competitiveLandscape) {
                if (deal.competitiveLandscape.competitors && deal.competitiveLandscape.competitors.length > 0) {
                    state.contextItems.push({
                        type: 'competitive',
                        title: 'Competitors',
                        text: `Competing against: ${deal.competitiveLandscape.competitors.join(', ')}.`
                    });
                }
                
                if (deal.competitiveLandscape.incumbent) {
                    state.contextItems.push({
                        type: 'competitive',
                        title: 'Incumbent',
                        text: `Current solution: ${deal.competitiveLandscape.incumbent}`
                    });
                }
                
                if (deal.competitiveLandscape.differentiators && deal.competitiveLandscape.differentiators.length > 0) {
                    state.contextItems.push({
                        type: 'competitive',
                        title: 'Differentiators',
                        text: `Key differentiators: ${deal.competitiveLandscape.differentiators.join(', ')}.`
                    });
                }
            }
            
            // Decision criteria
            if (deal.decisionCriteria && deal.decisionCriteria.length > 0) {
                state.contextItems.push({
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
                        state.contextItems.push({
                            type: 'contact',
                            title: `${dm.role}: ${dm.name}`,
                            text: `${dm.title}. Email: ${dm.email}, Phone: ${dm.phone || 'N/A'}. ${dm.notes || ''}`
                        });
                    });
                }
                
                // Champion
                const champions = deal.contacts.filter(c => c.role === 'Champion');
                if (champions.length > 0) {
                    champions.forEach(champ => {
                        state.contextItems.push({
                            type: 'contact',
                            title: `Champion: ${champ.name}`,
                            text: `${champ.title}. Email: ${champ.email}, Phone: ${champ.phone || 'N/A'}. ${champ.notes || ''}`
                        });
                    });
                }
            }
            
            // Recent notes
            if (deal.notes && deal.notes.length > 0) {
                // Get the 3 most recent notes
                const recentNotes = [...deal.notes]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3);
                
                recentNotes.forEach(note => {
                    state.contextItems.push({
                        type: 'note',
                        title: `Note (${note.date})`,
                        text: note.text
                    });
                });
            }
            
            // Update the context menu
            ContextMenu.update();
        },
        
        handleContextAction: function(action, deal) {
            if (!deal) return;
            
            switch(action) {
                case 'view-files':
                    UI.addMessage({
                        type: 'system',
                        text: `Here are the files for ${deal.name}:`,
                        files: deal.files || []
                    });
                    break;
                case 'add-note':
                    // Show note input UI
                    this.showAddNoteDialog(deal);
                    break;
                case 'draft-email':
                    UI.addMessage({
                        type: 'assistant',
                        text: `I'll help you draft an email for ${deal.name}. What would you like to communicate?`
                    });
                    break;
                case 'create-proposal':
                    UI.addMessage({
                        type: 'assistant',
                        text: `Let's create a proposal for ${deal.name}. I'll help you structure it based on their requirements.`
                    });
                    break;
                case 'deal-strategy':
                    UI.addMessage({
                        type: 'assistant',
                        text: `Let's analyze the strategy for ${deal.name}. I'll provide insights based on the deal information.`
                    });
                    break;
                case 'competitive-analysis':
                    UI.addMessage({
                        type: 'assistant',
                        text: `I'll help you analyze the competitive landscape for ${deal.name} based on their industry and requirements.`
                    });
                    break;
            }
        },
        
        showAddNoteDialog: function(deal) {
            // In the future, this could be implemented with a modal dialog
            UI.addMessage({
                type: 'system',
                text: `To add a note to ${deal.name}, please type it below and start with "Add note: " followed by your note text.`
            });
        }
    };

    // Context Menu - Manages the context menu functionality
    const ContextMenu = {
        initialize: function() {
            // Setup event handlers
            this.setupEventHandlers();
        },
        
        setupEventHandlers: function() {
            // Event delegation for insert buttons (added dynamically)
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('context-item-insert')) {
                    const text = e.target.getAttribute('data-text');
                    if (text) {
                        UI.insertTextAtCursor(text);
                        this.toggle(false); // hide after insert
                    }
                }
            });
        },
        
        toggle: function(force) {
            if (!elements.contextMenu) return;
            
            if (typeof force === 'boolean') {
                // Explicitly set the state
                if (force) {
                    elements.contextMenu.classList.add('active');
                } else {
                    elements.contextMenu.classList.remove('active');
                }
            } else {
                // Toggle current state
                elements.contextMenu.classList.toggle('active');
            }
        },
        
        update: function() {
            if (!elements.contextMenu) return;
            
            if (state.contextItems.length === 0) {
                elements.contextMenu.innerHTML = `
                    <div class="context-menu-header">Deal Context</div>
                    <div class="context-menu-empty">No deal selected. Please select a deal to view context.</div>
                `;
                return;
            }
            
            let menuContent = `<div class="context-menu-header">Deal Context</div>`;
            
            // Group items by type
            const groupedItems = state.contextItems.reduce((acc, item) => {
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
                            <div class="context-item-insert" data-text="${utils.escapeHtml(item.text)}">Insert</div>
                        </div>
                    `;
                });
            }
            
            elements.contextMenu.innerHTML = menuContent;
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
        }
    };

    // File Handler - Manages file uploads and processing
    const FileHandler = {
        initialize: function() {
            // Setup file drop zone if needed
        },
        
        handleFileUpload: function(files) {
            try {
                if (!files || files.length === 0) {
                    console.error('No files provided to handleFileUpload');
                    UI.addMessage({
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
                state.uploadedFiles = Array.from(files);
                
                // Add a processing message
                UI.addMessage({
                    type: 'system',
                    text: '⚙️ Processing uploaded files...'
                });
                
                // If we have a current deal, add files to it
                if (state.currentDeal) {
                    this.addFilesToDeal(files, state.currentDeal);
                } else {
                    // Suggest creating a new deal from the files
                    UI.addMessage({
                        type: 'system',
                        text: `Would you like to create a new deal from these files? If so, type "create new deal for [company name]".`
                    });
                }
                
            } catch (error) {
                console.error('Error in handleFileUpload:', error);
                UI.addMessage({
                    type: 'system',
                    text: '❌ Sorry, there was an error processing the files. Please try again.'
                });
                state.uploadedFiles = null;
            }
        },
        
        addFilesToDeal: function(files, deal) {
            if (!deal) return;
            
            // Ensure files array exists
            if (!deal.files) deal.files = [];
            
            // Process each file
            const newFiles = Array.from(files).map(file => ({
                id: 'f' + Date.now() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.name.split('.').pop().toLowerCase(),
                date: new Date().toISOString().split('T')[0],
                size: utils.formatFileSize(file.size)
            }));
            
            // Add files to deal
            deal.files.push(...newFiles);
            
            // Add to history
            if (!deal.history) deal.history = [];
            deal.history.push({
                id: 'h' + Date.now(),
                title: 'Files uploaded',
                date: new Date().toISOString().split('T')[0],
                description: `${files.length} file(s) were uploaded to the deal`
            });
            
            // Log before dispatch
            console.log('About to dispatch fileUploaded event', { files });
            
            // Dispatch fileUploaded event for deal content to handle
            // Use both CustomEvent and direct function call to ensure it works
            utils.publish('fileUploaded', { files: files });
            
            // Direct call to DealContent if available
            if (window.DealContent && typeof window.DealContent.handleFileUploaded === 'function') {
                console.log('Directly calling DealContent.handleFileUploaded');
                window.DealContent.handleFileUploaded(files);
            }
            
            // HARD FIX:
            // Directly update the files tab in the deal content panel
            setTimeout(() => {
                console.log('HARD FIX: Forcing file panel update...');
                this.forceUpdateFilesPanel(deal);
            }, 500); // Small delay to ensure DOM is ready
            
            // Add success message
            UI.addMessage({
                type: 'system',
                text: `✅ Added ${files.length} file(s) to the deal.`
            });
            
            // Clear uploaded files reference
            state.uploadedFiles = null;
        },
        
        // HARD FIX: Directly update the files panel without relying on events
        forceUpdateFilesPanel: function(deal) {
            if (!deal || !deal.files) return;
            
            console.log('HARD FIX: Executing direct files panel update for', deal.id);
            
            try {
                // 1. Ensure the deal content pane is visible and expanded
                const dealContentPane = document.querySelector('.deal-content-pane');
                if (dealContentPane) {
                    Object.assign(dealContentPane.style, {
                        width: '400px',
                        display: 'block',
                        visibility: 'visible',
                        opacity: '1'
                    });
                }
                
                // 2. Switch to files tab
                const filesTab = document.querySelector('.deal-tab-btn[data-dealtab="files"]');
                if (filesTab) {
                    // Remove active class from all tabs
                    document.querySelectorAll('.deal-tab-btn').forEach(tab => 
                        tab.classList.remove('active'));
                    // Add active class to files tab
                    filesTab.classList.add('active');
                    
                    // Update the tab text with file count
                    filesTab.textContent = `Files (${deal.files.length})`;
                }
                
                // 3. Show the files tab content
                const tabContents = document.querySelectorAll('.deal-tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                const filesContent = document.querySelector('.deal-tab-content.files-tab');
                if (filesContent) {
                    filesContent.classList.add('active');
                    
                    // 4. Update the files list
                    const filesList = filesContent.querySelector('.files-list');
                    if (filesList) {
                        // Remove "no files" message if it exists
                        const noFilesMsg = filesContent.querySelector('.no-files-message');
                        if (noFilesMsg) noFilesMsg.remove();
                        
                        // Generate HTML for file items
                        const filesHTML = deal.files.map(file => `
                            <div class="file-item">
                                <div class="file-icon">📄</div>
                                <div class="file-info">
                                    <div class="file-name">${file.name}</div>
                                    <div class="file-meta">${file.size} • ${file.date}</div>
                                </div>
                            </div>
                        `).join('');
                        
                        // Update the list
                        filesList.innerHTML = filesHTML;
                        console.log('HARD FIX: Files list updated with', deal.files.length, 'files');
                    } else {
                        console.error('HARD FIX: Files list element not found');
                    }
                } else {
                    console.error('HARD FIX: Files tab content not found');
                }
                
                // 5. Ensure entire widget is properly expanded
                const widget = document.getElementById('deal-chat-widget');
                if (widget) {
                    widget.className = 'widget-expanded-plus';
                    Object.assign(widget.style, {
                        width: '900px',
                        height: '600px'
                    });
                }
                
                console.log('HARD FIX: Files panel update completed successfully');
            } catch (err) {
                console.error('HARD FIX ERROR:', err);
            }
        },
        
        handleNewDealCreation: function(dealName, files) {
            if (!files || files.length === 0) {
                throw new Error('No files provided for deal creation');
            }
            
            console.log('Creating new deal from files...', { dealName });
            
            // Create a new deal object
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
                    size: utils.formatFileSize(file.size)
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
            const dealStore = utils.ensureDealStore();
            dealStore.deals[newDeal.id] = newDeal;
            
            // Update dropdown (this should be handled by a proper event system)
            this.updateDealDropdown(newDeal);
            
            // Add success message
            UI.addMessage({
                type: 'system',
                text: `✅ Created new deal "${dealName}" from uploaded files.`
            });
            
            // Dispatch deal selected event
            utils.publish('dealSelected', { dealId: newDeal.id, deal: newDeal });
            
            return newDeal;
        },
        
        updateDealDropdown: function(newDeal) {
            const dropdownContent = document.querySelector('.deal-context-bar .dropdown-content');
            if (!dropdownContent) return;
            
            const existingOption = dropdownContent.querySelector(`[data-deal="${newDeal.id}"]`);
            if (existingOption) {
                existingOption.remove();
            }
            
            // Add the new deal option
            const newOption = document.createElement('a');
            newOption.href = '#';
            newOption.setAttribute('data-deal', newDeal.id);
            newOption.textContent = `${newDeal.name} - ${newDeal.value}`;
            
            // Add click handler to the new option
            newOption.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.selectDeal === 'function') {
                    window.selectDeal(newDeal.id);
                }
            });
            
            dropdownContent.appendChild(newOption);
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
            // For demonstration, return a placeholder value
            return '$' + Math.floor(Math.random() * 900000 + 100000).toLocaleString(); // Random value between $100k and $1M
        }
    };

    // Mode Switcher - Handles switching between widget modes
    const ModeSwitcher = {
        initialize: function() {
            this.setupEventListeners();
        },
        
        setupEventListeners: function() {
            const modeSelector = elements.modeSelector;
            if (!modeSelector) return;
            
            const modeBtn = modeSelector.querySelector(SELECTORS.modeSelectorBtn);
            const modeDropdown = modeSelector.querySelector(SELECTORS.modeSelectorDropdown);
            
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
        
        switchMode: function(mode) {
            const normalizedMode = mode.toUpperCase();
            
            if (!state.modes[normalizedMode]) {
                console.error('Invalid mode:', mode);
                return;
            }
            
            const previousMode = state.currentMode;
            state.currentMode = state.modes[normalizedMode];
            
            // Update UI
            UI.updateModeDisplay(state.currentMode);
            
            // If we have a deal, update the context actions
            if (state.currentDeal) {
                UI.updateContextActions(state.currentDeal);
            }
            
            // Dispatch mode change event
            utils.publish('widgetModeChanged', {
                previousMode: previousMode,
                currentMode: state.currentMode
            });
            
            console.log(`Mode switched from ${previousMode} to ${state.currentMode}`);
        }
    };

    // Public API
    return {
        // Core initialization
        init: function() {
            console.log('Initializing chat widget with new modular architecture...');
            
            // Ensure deal store exists
            utils.ensureDealStore();
            
            // Initialize UI
            UI.initialize();
            UI.setupEventListeners();
            
            // Initialize all modules
            DealIntegration.initialize();
            ContextMenu.initialize();
            FileHandler.initialize();
            ModeSwitcher.initialize();
            
            // Load initial messages
            MessageHandler.loadInitialMessages();
            
            console.log('Chat widget initialization complete');
        },
        
        // Public methods for external access
        addMessage: function(message) {
            UI.addMessage(message);
        },
        
        getMessages: function() {
            return [...state.messages];
        },
        
        getCurrentDeal: function() {
            return state.currentDeal;
        },
        
        getCurrentMode: function() {
            return state.currentMode;
        },
        
        setMode: function(mode) {
            ModeSwitcher.switchMode(mode);
        },
        
        handleDealSelected: function(dealId, deal) {
            DealIntegration.handleDealSelected(dealId, deal);
        },
        
        handleDealCleared: function() {
            DealIntegration.handleDealCleared();
        },
        
        // Extensibility hooks for plugins
        registerPlugin: function(pluginName, pluginDefinition) {
            if (typeof pluginDefinition !== 'object' || !pluginDefinition.init) {
                console.error('Invalid plugin format for:', pluginName);
                return false;
            }
            
            console.log(`Registering plugin: ${pluginName}`);
            
            try {
                // Initialize the plugin
                pluginDefinition.init(this, {
                    utils,
                    state,
                    UI,
                    MessageHandler,
                    DealIntegration,
                    ContextMenu,
                    FileHandler,
                    ModeSwitcher
                });
                
                console.log(`Plugin ${pluginName} registered successfully`);
                return true;
            } catch (error) {
                console.error(`Error initializing plugin ${pluginName}:`, error);
                return false;
            }
        }
    };
})();

// Make ChatWidget globally available
window.chatWidget = ChatWidget;

// EMERGENCY FIX: Add global helper functions for manual file handling if needed
window.emergencyAddFile = function(dealId, fileName, fileSize) {
    console.log('EMERGENCY: Adding file via emergency function', {dealId, fileName, fileSize});
    
    try {
        // Get the deal
        const dealStore = window.dealStore || {};
        const deal = dealStore.deals && dealStore.deals[dealId];
        
        if (!deal) {
            console.error('EMERGENCY: Deal not found', dealId);
            return false;
        }
        
        // Create a mock file object
        const fileData = {
            id: 'emergency-' + Date.now(),
            name: fileName || 'emergency-file.pdf',
            type: (fileName || 'file.pdf').split('.').pop().toLowerCase(),
            size: fileSize || '100 KB',
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add file to deal
        if (!deal.files) deal.files = [];
        deal.files.push(fileData);
        
        // Try multiple update methods
        
        // 1. Via ChatWidget
        if (window.chatWidget && window.chatWidget.FileHandler) {
            window.chatWidget.FileHandler.forceUpdateFilesPanel(deal);
        }
        
        // 2. Via DealContent
        if (window.DealContent) {
            if (window.DealContent.handleFileUploaded) {
                // Create a fake FileList with a single File
                const blob = new Blob(['emergency file content'], { type: 'application/pdf' });
                const file = new File([blob], fileData.name, { type: 'application/pdf' });
                const fileList = {
                    0: file,
                    length: 1,
                    item: function(i) { return this[i]; }
                };
                window.DealContent.handleFileUploaded(fileList);
            }
            
            if (window.DealContent.renderFiles) {
                window.DealContent.renderFiles();
            }
            
            if (window.DealContent.selectTab) {
                window.DealContent.selectTab('files');
            }
        }
        
        // 3. Direct DOM manipulation as last resort
        setTimeout(() => {
            const filesTab = document.querySelector('.deal-tab-btn[data-dealtab="files"]');
            if (filesTab) {
                filesTab.textContent = `Files (${deal.files.length})`;
                filesTab.click(); // Force a click on the files tab
            }
        }, 100);
        
        console.log('EMERGENCY: File added successfully');
        return true;
    } catch (err) {
        console.error('EMERGENCY: Error adding file', err);
        return false;
    }
};

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.chatWidget) {
        window.chatWidget.init();
    }
}); 