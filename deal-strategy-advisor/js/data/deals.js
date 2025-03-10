// deals.js - Contains all deal-related data and functions

// Sample deal data that would normally come from an API
const dealData = [
    {
        id: 'deal-1',
        name: 'Acme Corp Enterprise Agreement',
        stage: 'Qualification',
        amount: '$75,000',
        probability: '20%',
        closeDate: '2024-06-15',
        lastActivity: '2024-03-10',
        contacts: [
            { name: 'John Smith', role: 'Decision Maker', email: 'john@acmecorp.com' },
            { name: 'Sarah Jones', role: 'Technical Evaluator', email: 'sarah@acmecorp.com' }
        ],
        status: 'active',
        notes: 'Initial discovery call scheduled for next week',
        requirements: [
            'Cloud migration support',
            'Enterprise SSO integration',
            'Custom reporting capabilities'
        ]
    },
    {
        id: 'deal-2',
        name: 'TechStart SaaS Implementation',
        stage: 'Proposal',
        amount: '$45,000',
        probability: '60%',
        closeDate: '2024-05-20',
        lastActivity: '2024-03-08',
        contacts: [
            { name: 'Mike Johnson', role: 'CTO', email: 'mike@techstart.com' },
            { name: 'Lisa Wong', role: 'Procurement', email: 'lisa@techstart.com' }
        ],
        status: 'at-risk',
        notes: 'Competitor has submitted lower bid, need to emphasize value proposition',
        requirements: [
            'API integration with existing systems',
            'User onboarding support',
            'Custom dashboard development'
        ]
    },
    {
        id: 'deal-3',
        name: 'GlobalRetail POS Upgrade',
        stage: 'Negotiation',
        amount: '$120,000',
        probability: '80%',
        closeDate: '2024-04-30',
        lastActivity: '2024-03-12',
        contacts: [
            { name: 'Robert Chen', role: 'VP Operations', email: 'robert@globalretail.com' },
            { name: 'Amanda Miller', role: 'IT Director', email: 'amanda@globalretail.com' }
        ],
        status: 'new',
        notes: 'Legal team reviewing contract terms, expect feedback by Friday',
        requirements: [
            'Multi-location deployment',
            'Legacy system data migration',
            '24/7 support SLA'
        ]
    }
];

// Deal-related utility functions
const dealsModule = {
    // Get all deals
    getAllDeals: function() {
        return dealData;
    },
    
    // Get deal by ID
    getDealById: function(dealId) {
        return dealData.find(deal => deal.id === dealId);
    },
    
    // Get deals by stage
    getDealsByStage: function(stage) {
        return dealData.filter(deal => deal.stage === stage);
    },
    
    // Get deal stages with counts
    getDealStages: function() {
        const stages = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
        return stages.map(stage => {
            const count = dealData.filter(deal => deal.stage === stage).length;
            return { name: stage, count: count };
        });
    },
    
    // Get deal insights and recommendations
    getDealInsights: function(dealId) {
        const deal = this.getDealById(dealId);
        if (!deal) return null;
        
        // Sample insights based on deal data
        return {
            riskFactors: [
                deal.stage === 'Proposal' && deal.status === 'at-risk' ? 'Competitive pressure' : null,
                Date.parse(deal.closeDate) - Date.now() < 1000 * 60 * 60 * 24 * 30 ? 'Close date approaching' : null
            ].filter(Boolean),
            
            recommendations: [
                'Schedule follow-up call with key stakeholders',
                'Share case study with similar implementation',
                'Prepare ROI analysis showing 3-year benefit projection'
            ],
            
            playbookDeviations: [
                deal.lastActivity ? Date.now() - Date.parse(deal.lastActivity) > 1000 * 60 * 60 * 24 * 7 ? 'No activity in past week' : null : null,
                !deal.contacts.some(c => c.role === 'Decision Maker') ? 'Missing decision maker contact' : null
            ].filter(Boolean)
        };
    },
    
    // Get deal reference data for context menu
    getDealReferenceData: function(dealId) {
        const deal = this.getDealById(dealId);
        if (!deal) return [];
        
        return [
            { type: 'dealName', label: 'Deal Name', value: deal.name, description: 'The name of the current deal' },
            { type: 'amount', label: 'Deal Amount', value: deal.amount, description: 'The monetary value of the deal' },
            { type: 'stage', label: 'Deal Stage', value: deal.stage, description: 'Current pipeline stage' },
            { type: 'closeDate', label: 'Close Date', value: deal.closeDate, description: 'Expected close date' },
            { type: 'contacts', label: 'Contacts', value: deal.contacts.map(c => c.name).join(', '), description: 'Key contacts associated with deal' },
            { type: 'requirements', label: 'Requirements', value: deal.requirements.join(', '), description: 'Customer requirements' }
        ];
    }
};

// Export the module
export default dealsModule; 