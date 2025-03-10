/**
 * Chat Widget Module
 * Handles all chat functionality
 */

const chatWidget = {
    messages: [],
    currentDeal: null,
    contextItems: [],
    
    init: function() {
        console.log('Initializing chat widget...');
        this.setupEventListeners();
        this.loadInitialMessages();
        this.setupDealIntegration();
    },
    
    setupEventListeners: function() {
        // Send button click event
        const sendButton = document.querySelector('.send-btn');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        // Input keypress event (for Enter key)
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Context menu button event
        const contextMenuButton = document.querySelector('.context-menu-button');
        if (contextMenuButton) {
            contextMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleContextMenu();
            });
        }
        
        // File upload button event
        const fileUploadButton = document.querySelector('.file-upload-btn-chat');
        if (fileUploadButton) {
            fileUploadButton.addEventListener('click', () => {
                this.triggerFileUpload();
            });
        }
        
        // File input change event
        const fileInput = document.querySelector('#chat-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
        
        // Click outside to close context menu
        document.addEventListener('click', (e) => {
            const contextMenu = document.querySelector('.context-menu');
            const contextMenuButton = document.querySelector('.context-menu-button');
            
            if (contextMenu && contextMenu.classList.contains('active')) {
                if (!contextMenu.contains(e.target) && e.target !== contextMenuButton) {
                    contextMenu.classList.remove('active');
                }
            }
        });
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
    },
    
    handleDealCleared: function() {
        this.currentDeal = null;
        this.contextItems = [];
        
        // Clear context menu
        this.updateContextMenu();
        
        // Add a message showing deal was cleared
        this.addMessage({
            type: 'system',
            text: 'Deal has been cleared. Select a new deal or ask a general question.'
        });
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
        const chatInput = document.querySelector('.chat-input');
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
    
    processMessage: function(text) {
        // Here you would typically send the message to an AI backend
        // For now, we'll simulate some basic responses
        
        setTimeout(() => {
            if (this.currentDeal) {
                if (text.toLowerCase().includes('summary')) {
                    this.addMessage({
                        type: 'assistant',
                        text: this.generateDealSummary(this.currentDeal)
                    });
                } else if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('stakeholder')) {
                    this.respondWithContacts();
                } else if (text.toLowerCase().includes('competitor') || text.toLowerCase().includes('competition')) {
                    this.respondWithCompetitiveInfo();
                } else if (text.toLowerCase().includes('timeline') || text.toLowerCase().includes('schedule')) {
                    this.respondWithTimeline();
                } else if (text.toLowerCase().includes('challenge') || text.toLowerCase().includes('risk')) {
                    this.respondWithChallenges();
                } else if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost') || text.toLowerCase().includes('value')) {
                    this.respondWithFinancials();
                } else {
                    this.addMessage({
                        type: 'assistant',
                        text: `I'm analyzing the ${this.currentDeal.name} deal. What specific aspects would you like insights on? (e.g., stakeholders, competition, timeline, challenges, or financials)`
                    });
                }
            } else {
                this.addMessage({
                    type: 'assistant',
                    text: 'Please select a deal first to get specific insights, or ask me a general sales question.'
                });
            }
        }, 1000);
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
        const chatMessagesContainer = document.querySelector('.chat-messages');
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
        const nullStateMessage = document.querySelector('.null-state-message');
        if (nullStateMessage) {
            nullStateMessage.style.display = 'none';
        }
    },
    
    toggleContextMenu: function() {
        const contextMenu = document.querySelector('.context-menu');
        if (contextMenu) {
            contextMenu.classList.toggle('active');
        }
    },
    
    updateContextMenu: function() {
        const contextMenu = document.querySelector('.context-menu');
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
        const chatInput = document.querySelector('.chat-input');
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
        const fileInput = document.querySelector('#chat-file-input');
        if (fileInput) {
            fileInput.click();
        }
    },
    
    handleFileUpload: function(files) {
        if (!files || files.length === 0) return;
        
        // For demo purposes, just display a message
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        
        this.addMessage({
            type: 'user',
            text: `[Uploaded files: ${fileNames}]`
        });
        
        setTimeout(() => {
            this.addMessage({
                type: 'assistant',
                text: `I've received your files: ${fileNames}. I'll analyze these documents in the context of your deal.`
            });
        }, 1000);
    }
};

// Export the chat widget to the global scope
window.chatWidget = chatWidget; 