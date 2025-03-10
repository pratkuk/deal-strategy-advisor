// hubspot.js - HubSpot app functionality
import dealsModule from '../data/deals.js';

const hubspotApp = {
    // Track initialization state
    initialized: false,
    
    // Initialize HubSpot app
    initialize: function() {
        if (this.initialized) return;
        
        // Initialize the pipeline board
        this.initializePipelineBoard();
        
        // Set up event listeners
        document.querySelector('.create-btn').addEventListener('click', this.showCreateDealModal.bind(this));
        document.querySelector('.view-deals').addEventListener('click', this.viewAllDeals.bind(this));
        
        this.initialized = true;
        console.log('HubSpot app initialized');
    },
    
    // Initialize the pipeline board with deals
    initializePipelineBoard: function() {
        const pipelineBoard = document.querySelector('.pipeline-board');
        if (!pipelineBoard) return;
        
        // Clear existing content
        pipelineBoard.innerHTML = '';
        
        // Get all deal stages
        const stages = dealsModule.getDealStages();
        
        // Create a column for each stage
        stages.forEach(stage => {
            const dealsInStage = dealsModule.getDealsByStage(stage.name);
            
            // Create stage column
            const stageEl = document.createElement('div');
            stageEl.className = 'stage';
            
            // Create stage header
            const stageHeader = document.createElement('div');
            stageHeader.className = 'stage-header';
            stageHeader.innerHTML = `
                <h3>${stage.name}</h3>
                <div class="deal-count">${dealsInStage.length}</div>
            `;
            
            // Create container for deals
            const stageDealsContainer = document.createElement('div');
            stageDealsContainer.className = 'stage-deals';
            
            // Add deals to the stage
            if (dealsInStage.length > 0) {
                dealsInStage.forEach(deal => {
                    const dealCard = this.createDealCard(deal);
                    stageDealsContainer.appendChild(dealCard);
                });
            } else {
                // Empty state
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-stage';
                emptyState.textContent = 'No deals in this stage';
                stageDealsContainer.appendChild(emptyState);
            }
            
            // Assemble stage column
            stageEl.appendChild(stageHeader);
            stageEl.appendChild(stageDealsContainer);
            pipelineBoard.appendChild(stageEl);
        });
    },
    
    // Create a deal card element
    createDealCard: function(deal) {
        const dealCard = document.createElement('div');
        dealCard.className = 'deal-card';
        dealCard.setAttribute('data-deal-id', deal.id);
        
        // Add status class if applicable
        if (deal.status) {
            dealCard.classList.add(deal.status);
        }
        
        // Build card content
        dealCard.innerHTML = `
            <h4>${deal.name}</h4>
            <div class="deal-info">
                <div class="deal-amount">${deal.amount}</div>
                <div class="deal-probability">${deal.probability}</div>
            </div>
            <div class="deal-status">
                <span class="${deal.status}">${deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}</span>
            </div>
        `;
        
        // Add click event to select deal
        dealCard.addEventListener('click', () => {
            this.selectDeal(deal.id);
        });
        
        return dealCard;
    },
    
    // Select a deal and update UI
    selectDeal: function(dealId) {
        // Remove selected class from all deals
        document.querySelectorAll('.deal-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to clicked deal
        const selectedCard = document.querySelector(`.deal-card[data-deal-id="${dealId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Trigger custom event for deal selection
        const deal = dealsModule.getDealById(dealId);
        if (deal) {
            const selectEvent = new CustomEvent('dealSelected', { 
                detail: { dealId: dealId, deal: deal } 
            });
            document.dispatchEvent(selectEvent);
        }
    },
    
    // Show modal to create a new deal
    showCreateDealModal: function() {
        alert('Create deal functionality would go here');
        // In a real implementation, this would show a modal form
    },
    
    // View all deals (would go to a different view in a real app)
    viewAllDeals: function() {
        alert('View all deals functionality would go here');
        // In a real implementation, this might navigate to a table view
    }
};

// Export the module
export default hubspotApp;

// Expose to window for legacy compatibility
window.hubspotApp = hubspotApp; 