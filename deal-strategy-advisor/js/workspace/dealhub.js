// dealhub.js - Dealhub app functionality (proposal management)

const dealhubApp = {
    // Track initialization state
    initialized: false,
    
    // Proposal data (would come from API in real implementation)
    proposals: [
        {
            id: 'proposal-1',
            name: 'Acme Corp Enterprise Agreement',
            status: 'draft',
            amount: '$75,000',
            createdDate: '2024-03-10',
            expirationDate: '2024-04-10',
            deal: 'deal-1',
            client: 'Acme Corp',
            contact: 'John Smith',
            sections: [
                { title: 'Executive Summary', complete: true },
                { title: 'Solution Overview', complete: true },
                { title: 'Implementation Plan', complete: true },
                { title: 'Pricing and Terms', complete: false },
                { title: 'Service Level Agreement', complete: false }
            ],
            content: `
                <h3>Acme Corp Enterprise Agreement</h3>
                <div class="proposal-metadata">
                    <p><strong>Client:</strong> Acme Corp</p>
                    <p><strong>Date:</strong> March 10, 2024</p>
                    <p><strong>Amount:</strong> $75,000</p>
                    <p><strong>Valid Until:</strong> April 10, 2024</p>
                </div>
                <div class="proposal-sections">
                    <h4>Executive Summary</h4>
                    <p>This proposal outlines our enterprise solution for Acme Corp's cloud migration needs. Our comprehensive approach addresses the key requirements identified during our discovery process, including enhanced security, scalability, and seamless integration with existing systems.</p>
                    
                    <h4>Solution Overview</h4>
                    <p>Our solution includes the following components:</p>
                    <ul>
                        <li>Enterprise SSO integration</li>
                        <li>Cloud infrastructure migration</li>
                        <li>Custom reporting dashboard</li>
                        <li>API integration with legacy systems</li>
                    </ul>
                    
                    <h4>Implementation Plan</h4>
                    <p>The implementation will be conducted in four phases over a 12-week period:</p>
                    <ol>
                        <li>Planning and Design (2 weeks)</li>
                        <li>Infrastructure Setup (3 weeks)</li>
                        <li>Migration and Integration (5 weeks)</li>
                        <li>Testing and Deployment (2 weeks)</li>
                    </ol>
                    
                    <h4>Pricing and Terms</h4>
                    <p>[This section is incomplete]</p>
                    
                    <h4>Service Level Agreement</h4>
                    <p>[This section is incomplete]</p>
                </div>
            `
        },
        {
            id: 'proposal-2',
            name: 'TechStart SaaS Implementation',
            status: 'sent',
            amount: '$45,000',
            createdDate: '2024-03-05',
            expirationDate: '2024-04-05',
            deal: 'deal-2',
            client: 'TechStart',
            contact: 'Mike Johnson',
            sections: [
                { title: 'Executive Summary', complete: true },
                { title: 'Solution Overview', complete: true },
                { title: 'Implementation Plan', complete: true },
                { title: 'Pricing and Terms', complete: true },
                { title: 'Service Level Agreement', complete: true }
            ],
            content: `
                <h3>TechStart SaaS Implementation</h3>
                <div class="proposal-metadata">
                    <p><strong>Client:</strong> TechStart</p>
                    <p><strong>Date:</strong> March 5, 2024</p>
                    <p><strong>Amount:</strong> $45,000</p>
                    <p><strong>Valid Until:</strong> April 5, 2024</p>
                </div>
                <div class="proposal-sections">
                    <h4>Executive Summary</h4>
                    <p>This proposal details our SaaS implementation solution for TechStart's growing operational needs. Our platform will provide the scalability and flexibility required to support your rapid growth while ensuring seamless integration with your existing workflow.</p>
                    
                    <h4>Solution Overview</h4>
                    <p>Our solution includes:</p>
                    <ul>
                        <li>Core SaaS platform setup</li>
                        <li>User onboarding and training</li>
                        <li>Custom dashboard development</li>
                        <li>Data migration from legacy systems</li>
                    </ul>
                    
                    <h4>Implementation Plan</h4>
                    <p>The implementation will follow our proven 6-week methodology:</p>
                    <ol>
                        <li>Discovery and Planning (1 week)</li>
                        <li>Platform Configuration (2 weeks)</li>
                        <li>Data Migration (1 week)</li>
                        <li>Integration and Testing (1 week)</li>
                        <li>Training and Go-Live (1 week)</li>
                    </ol>
                    
                    <h4>Pricing and Terms</h4>
                    <p>The total investment for this implementation is $45,000, which includes:</p>
                    <ul>
                        <li>Platform setup and configuration: $20,000</li>
                        <li>Data migration: $10,000</li>
                        <li>Custom development: $10,000</li>
                        <li>Training and support: $5,000</li>
                    </ul>
                    <p>Payment terms: 50% upon contract signing, 30% at midpoint, 20% upon completion.</p>
                    
                    <h4>Service Level Agreement</h4>
                    <p>We guarantee 99.9% uptime for the platform with the following support levels:</p>
                    <ul>
                        <li>Critical issues: Response within 1 hour, resolution within 4 hours</li>
                        <li>High priority: Response within 4 hours, resolution within 1 business day</li>
                        <li>Medium priority: Response within 8 hours, resolution within 2 business days</li>
                        <li>Low priority: Response within 24 hours, resolution within 5 business days</li>
                    </ul>
                </div>
            `
        },
        {
            id: 'proposal-3',
            name: 'GlobalRetail POS Upgrade',
            status: 'in-review',
            amount: '$120,000',
            createdDate: '2024-03-08',
            expirationDate: '2024-04-08',
            deal: 'deal-3',
            client: 'GlobalRetail',
            contact: 'Robert Chen',
            sections: [
                { title: 'Executive Summary', complete: true },
                { title: 'Solution Overview', complete: true },
                { title: 'Implementation Plan', complete: true },
                { title: 'Pricing and Terms', complete: true },
                { title: 'Service Level Agreement', complete: true }
            ],
            content: `
                <h3>GlobalRetail POS Upgrade Proposal</h3>
                <div class="proposal-metadata">
                    <p><strong>Client:</strong> GlobalRetail</p>
                    <p><strong>Date:</strong> March 8, 2024</p>
                    <p><strong>Amount:</strong> $120,000</p>
                    <p><strong>Valid Until:</strong> April 8, 2024</p>
                </div>
                <div class="proposal-sections">
                    <h4>Executive Summary</h4>
                    <p>This proposal outlines our comprehensive approach to upgrading GlobalRetail's point-of-sale systems across all 25 locations. Our solution will modernize your retail operations, improve customer experience, and provide valuable insights through enhanced analytics capabilities.</p>
                    
                    <h4>Solution Overview</h4>
                    <p>Our POS upgrade solution includes:</p>
                    <ul>
                        <li>Modern cloud-based POS software deployment</li>
                        <li>Hardware upgrades at all locations</li>
                        <li>Integration with inventory management systems</li>
                        <li>Customer loyalty program enhancements</li>
                        <li>Advanced analytics and reporting</li>
                    </ul>
                    
                    <h4>Implementation Plan</h4>
                    <p>The implementation will be conducted using a phased approach over 12 weeks:</p>
                    <ol>
                        <li>Planning and Configuration (2 weeks)</li>
                        <li>Pilot Deployment - Flagship Store (2 weeks)</li>
                        <li>Evaluation and Adjustments (1 week)</li>
                        <li>Phased Rollout - All Locations (6 weeks)</li>
                        <li>Post-Implementation Review (1 week)</li>
                    </ol>
                    
                    <h4>Pricing and Terms</h4>
                    <p>The total investment for this upgrade is $120,000:</p>
                    <ul>
                        <li>Software licenses: $45,000</li>
                        <li>Hardware upgrades: $35,000</li>
                        <li>Implementation services: $30,000</li>
                        <li>Training: $10,000</li>
                    </ul>
                    <p>Payment schedule: 30% upon signing, 40% at pilot completion, 30% upon final deployment.</p>
                    
                    <h4>Service Level Agreement</h4>
                    <p>Our comprehensive SLA includes:</p>
                    <ul>
                        <li>24/7 support for critical issues</li>
                        <li>Guaranteed 99.95% uptime for POS systems</li>
                        <li>On-site support within 4 hours for hardware failures</li>
                        <li>Quarterly system health checks and optimization</li>
                    </ul>
                </div>
            `
        }
    ],
    
    // Initialize Dealhub app
    initialize: function() {
        if (this.initialized) return;
        
        this.populateProposalList();
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('Dealhub app initialized');
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Listen for deal selection events
        document.addEventListener('dealSelected', (e) => {
            // Highlight proposals related to selected deal
            this.highlightDealProposals(e.detail.dealId);
        });
        
        // Action buttons
        const editBtn = document.querySelector('.preview-actions .edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const selectedProposal = this.getSelectedProposal();
                if (selectedProposal) {
                    this.editProposal(selectedProposal);
                } else {
                    alert('Please select a proposal to edit');
                }
            });
        }
        
        const sendBtn = document.querySelector('.preview-actions .send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                const selectedProposal = this.getSelectedProposal();
                if (selectedProposal) {
                    this.sendProposal(selectedProposal);
                } else {
                    alert('Please select a proposal to send');
                }
            });
        }
        
        const downloadBtn = document.querySelector('.preview-actions .download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const selectedProposal = this.getSelectedProposal();
                if (selectedProposal) {
                    this.downloadProposal(selectedProposal);
                } else {
                    alert('Please select a proposal to download');
                }
            });
        }
    },
    
    // Populate proposal list
    populateProposalList: function() {
        const proposalItems = document.querySelector('.proposal-items');
        if (!proposalItems) return;
        
        // Clear existing items
        proposalItems.innerHTML = '';
        
        // Add proposals to list
        this.proposals.forEach(proposal => {
            const proposalItem = document.createElement('div');
            proposalItem.className = 'proposal-item';
            proposalItem.setAttribute('data-proposal-id', proposal.id);
            
            if (proposal.deal) {
                proposalItem.setAttribute('data-deal-id', proposal.deal);
            }
            
            // Get progress percentage
            const completeSections = proposal.sections.filter(section => section.complete).length;
            const progress = Math.round((completeSections / proposal.sections.length) * 100);
            
            // Format status for display
            let statusDisplay;
            switch(proposal.status) {
                case 'draft':
                    statusDisplay = `<span class="status-draft">Draft</span>`;
                    break;
                case 'sent':
                    statusDisplay = `<span class="status-sent">Sent</span>`;
                    break;
                case 'in-review':
                    statusDisplay = `<span class="status-review">In Review</span>`;
                    break;
                case 'accepted':
                    statusDisplay = `<span class="status-accepted">Accepted</span>`;
                    break;
                case 'rejected':
                    statusDisplay = `<span class="status-rejected">Rejected</span>`;
                    break;
                default:
                    statusDisplay = `<span>${proposal.status}</span>`;
            }
            
            proposalItem.innerHTML = `
                <div class="proposal-header">
                    <h3>${proposal.name}</h3>
                    <div class="proposal-status">${statusDisplay}</div>
                </div>
                <div class="proposal-details">
                    <div class="proposal-client">${proposal.client}</div>
                    <div class="proposal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">${progress}% Complete</div>
                    </div>
                </div>
                <div class="proposal-amount">${proposal.amount}</div>
                <div class="proposal-date">Expires: ${proposal.expirationDate}</div>
            `;
            
            // Add click event
            proposalItem.addEventListener('click', () => {
                this.selectProposal(proposal.id);
            });
            
            proposalItems.appendChild(proposalItem);
        });
        
        // Select first proposal by default
        if (this.proposals.length > 0) {
            this.selectProposal(this.proposals[0].id);
        } else {
            // Show empty state
            this.showEmptyState();
        }
    },
    
    // Show empty state when no proposals exist
    showEmptyState: function() {
        const previewContent = document.querySelector('.preview-content');
        if (previewContent) {
            previewContent.innerHTML = `
                <div class="empty-state">
                    <h3>No Proposals Available</h3>
                    <p>Create a new proposal to get started</p>
                    <button class="create-proposal-btn">Create Proposal</button>
                </div>
            `;
            
            const createBtn = previewContent.querySelector('.create-proposal-btn');
            if (createBtn) {
                createBtn.addEventListener('click', () => {
                    this.createNewProposal();
                });
            }
        }
    },
    
    // Select a proposal and show preview
    selectProposal: function(proposalId) {
        // Get proposal data
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) return;
        
        // Update selected state in UI
        document.querySelectorAll('.proposal-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`.proposal-item[data-proposal-id="${proposalId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        // Show preview
        this.displayProposalPreview(proposal);
    },
    
    // Display proposal preview
    displayProposalPreview: function(proposal) {
        const previewContent = document.querySelector('.preview-content');
        if (!previewContent) return;
        
        // Update preview content
        previewContent.innerHTML = proposal.content;
        
        // Enable/disable action buttons based on status
        const editBtn = document.querySelector('.preview-actions .edit-btn');
        const sendBtn = document.querySelector('.preview-actions .send-btn');
        
        if (editBtn) {
            editBtn.disabled = proposal.status !== 'draft';
        }
        
        if (sendBtn) {
            sendBtn.disabled = proposal.status !== 'draft';
        }
    },
    
    // Get currently selected proposal
    getSelectedProposal: function() {
        const selectedItem = document.querySelector('.proposal-item.selected');
        if (!selectedItem) return null;
        
        const proposalId = selectedItem.getAttribute('data-proposal-id');
        return this.proposals.find(p => p.id === proposalId);
    },
    
    // Edit a proposal
    editProposal: function(proposal) {
        alert(`Edit "${proposal.name}" functionality would go here`);
        // In a real implementation, this would open the proposal editor
    },
    
    // Send a proposal
    sendProposal: function(proposal) {
        alert(`Send "${proposal.name}" to ${proposal.contact} functionality would go here`);
        // In a real implementation, this would show a send dialog
    },
    
    // Download a proposal
    downloadProposal: function(proposal) {
        alert(`Download "${proposal.name}" functionality would go here`);
        // In a real implementation, this would generate a PDF
    },
    
    // Create a new proposal
    createNewProposal: function() {
        alert('Create new proposal functionality would go here');
        // In a real implementation, this would open the proposal creator
    },
    
    // Highlight proposals related to a deal
    highlightDealProposals: function(dealId) {
        // Remove highlight from all proposals
        document.querySelectorAll('.proposal-item').forEach(item => {
            item.classList.remove('deal-highlight');
        });
        
        // Add highlight to proposals related to the deal
        document.querySelectorAll(`.proposal-item[data-deal-id="${dealId}"]`).forEach(item => {
            item.classList.add('deal-highlight');
        });
        
        // If there's a related proposal, select it
        const relatedProposal = this.proposals.find(p => p.deal === dealId);
        if (relatedProposal) {
            this.selectProposal(relatedProposal.id);
        }
    }
};

// Export the module
export default dealhubApp;

// Expose to window for legacy compatibility
window.dealhubApp = dealhubApp; 