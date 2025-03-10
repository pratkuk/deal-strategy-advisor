// agent.js - Handles the Agent tab functionality (formerly Chat tab)
import dealsModule from '../data/deals.js';

const agentModule = {
    // Track initialization state
    initialized: false,
    activeDeal: null,
    
    // Initialize the agent functionality
    initialize: function() {
        if (this.initialized) return;
        
        this.setupChatInput();
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('Agent module initialized');
    },
    
    // Activate the agent tab (called when tab is selected)
    activate: function() {
        // Focus input when tab is activated
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.focus();
            }
        }, 100);
    },
    
    // Set up chat input functionality
    setupChatInput: function() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.querySelector('.chat-input-container .send-btn');
        const contextMenuBtn = document.getElementById('showContextMenuBtn');
        
        if (!chatInput || !sendBtn) return;
        
        // Send message on button click
        sendBtn.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                this.sendChatMessage(message);
                chatInput.value = '';
            }
        });
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = chatInput.value.trim();
                if (message) {
                    this.sendChatMessage(message);
                    chatInput.value = '';
                }
            }
        });
        
        // Context menu button
        if (contextMenuBtn) {
            contextMenuBtn.addEventListener('click', () => {
                // Show context menu (this would be defined in context.js)
                if (typeof window.contextModule !== 'undefined') {
                    window.contextModule.showMenu('chatInput');
                }
            });
        }
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Listen for deal changes
        document.addEventListener('widgetDealChanged', (e) => {
            this.activeDeal = e.detail.deal;
            this.updateChatForDeal();
        });
        
        // Listen for deal clearing
        document.addEventListener('widgetDealCleared', () => {
            this.activeDeal = null;
            this.updateChatForNullState();
        });
    },
    
    // Send a chat message
    sendChatMessage: function(message) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;
        
        // Create and add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = message;
        chatMessages.appendChild(userMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Process message and generate response
        this.processMessage(message);
    },
    
    // Process message and generate a response
    processMessage: function(message) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;
        
        // In a real implementation, this would call an AI API
        // For now, just simulate a response
        setTimeout(() => {
            let responseText;
            
            // If we have an active deal, include some context
            if (this.activeDeal) {
                if (message.toLowerCase().includes('status')) {
                    responseText = `The current status of ${this.activeDeal.name} is ${this.activeDeal.status}. It's in the ${this.activeDeal.stage} stage with a value of ${this.activeDeal.amount}.`;
                } else if (message.toLowerCase().includes('contacts')) {
                    const contacts = this.activeDeal.contacts.map(c => `${c.name} (${c.role})`).join(', ');
                    responseText = `The key contacts for ${this.activeDeal.name} are: ${contacts}`;
                } else if (message.toLowerCase().includes('recommend') || message.toLowerCase().includes('suggestion')) {
                    const insights = dealsModule.getDealInsights(this.activeDeal.id);
                    responseText = `Based on my analysis, I recommend: ${insights.recommendations.join(', ')}`;
                } else {
                    responseText = `I'm here to help with ${this.activeDeal.name}. You can ask about status, contacts, or request recommendations.`;
                }
            } else {
                responseText = "I don't have an active deal context. Please select a deal first, or ask me a general question.";
            }
            
            // Create and add assistant message
            const assistantMessage = document.createElement('div');
            assistantMessage.className = 'message assistant';
            assistantMessage.textContent = responseText;
            chatMessages.appendChild(assistantMessage);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000); // Simulate API delay
    },
    
    // Update chat for active deal
    updateChatForDeal: function() {
        if (!this.activeDeal) return;
        
        // Remove welcome messages
        document.querySelectorAll('.welcome-message').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show deal-specific welcome message
        const dealWelcome = document.querySelector('.welcome-message.deal-message');
        if (dealWelcome) {
            dealWelcome.classList.add('active');
            
            // Update deal name in welcome message
            const dealNameSpan = dealWelcome.querySelector('.deal-name');
            if (dealNameSpan) {
                dealNameSpan.textContent = this.activeDeal.name;
            }
        }
    },
    
    // Update chat for null state
    updateChatForNullState: function() {
        // Remove welcome messages
        document.querySelectorAll('.welcome-message').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show no-deal welcome message
        const noDealWelcome = document.querySelector('.welcome-message.no-deal-message');
        if (noDealWelcome) {
            noDealWelcome.classList.add('active');
        }
    }
};

// Export the module
export default agentModule;

// Expose to window for legacy compatibility
window.agentModule = agentModule; 