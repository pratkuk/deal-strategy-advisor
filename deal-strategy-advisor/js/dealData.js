/**
 * Deal Data Manager Module
 * Manages deal information, notes, contacts, files, and history
 */

// In-memory storage for demo purposes (would be replaced with API calls)
window.dealStore = {
    deals: {
        'deal-1': {
            id: 'deal-1',
            name: 'Acme Corporation',
            value: '$52,500',
            stage: 'Proposal',
            closeDate: '2024-05-15',
            industry: 'Manufacturing',
            company: {
                size: '250-500 employees',
                revenue: '$45M annual',
                location: 'Chicago, IL',
                founded: '1985',
                website: 'acmecorp.com',
                segment: 'Mid-market',
                description: 'Leading manufacturer of industrial equipment specializing in precision machinery for automotive suppliers.'
            },
            product: {
                name: 'Enterprise Analytics Suite',
                plan: 'Professional',
                seats: '75 licenses',
                term: '2-year contract',
                implementation: '45 days',
                training: 'Included (8 sessions)',
                addons: ['API Integration Pack', 'Data Migration Service']
            },
            financials: {
                basePrice: '$35,000/yr',
                implementation: '$15,000 (one-time)',
                addons: '$7,500/yr',
                discount: '15% multi-year',
                payment: 'Annual upfront',
                roi: 'Expected 285% ROI over 3 years'
            },
            competitiveLandscape: {
                competitors: ['TechSolutions Inc.', 'DataCore Systems', 'AnalyticsNow'],
                incumbent: 'Legacy on-premise solution (EOL in 6 months)',
                differentiators: ['Industry-specific templates', 'Manufacturing integrations', 'On-site training'],
                challenges: ['Price sensitivity', 'IT resource constraints', 'Legacy data migration']
            },
            decisionCriteria: [
                'Cost reduction in reporting workflows',
                'Regulatory compliance features',
                'Mobile accessibility for floor managers',
                'Integration with ERP system (SAP)'
            ],
            timeline: {
                firstContact: '2024-01-20',
                discovery: '2024-02-05',
                demo: '2024-02-25',
                proposal: '2024-03-12',
                negotiation: '2024-04-01',
                expectedClose: '2024-05-15',
                implementation: '2024-06-01'
            },
            contacts: [
                { id: 'c1', name: 'John Smith', title: 'CTO', email: 'john.smith@acmecorp.com', phone: '(312) 555-1234', role: 'Decision Maker', influence: 'High', notes: 'Technical focus, concerned about implementation timeline and API capabilities.' },
                { id: 'c2', name: 'Rebecca Torres', title: 'Operations Director', email: 'r.torres@acmecorp.com', phone: '(312) 555-2345', role: 'Champion', influence: 'High', notes: 'Main advocate for solution, experiencing pain points with current reporting process.' },
                { id: 'c3', name: 'Michael Chen', title: 'CFO', email: 'm.chen@acmecorp.com', phone: '(312) 555-3456', role: 'Approver', influence: 'High', notes: 'Focused on ROI and cost justification. Needs detailed TCO analysis.' },
                { id: 'c4', name: 'Sarah Johnson', title: 'IT Manager', email: 's.johnson@acmecorp.com', phone: '(312) 555-4567', role: 'Influencer', influence: 'Medium', notes: 'Concerned about integration with existing systems and security compliance.' }
            ],
            notes: [
                { id: 'n1', text: 'Initial discovery call went well. Rebecca highlighted major pain points around manual reporting processes costing 25+ hrs/week across team. Looking for automation and real-time dashboard capabilities.', date: '2024-02-05', author: 'Sales Rep' },
                { id: 'n2', text: 'Technical requirements call with John and IT team. Need to focus on API capabilities for SAP integration. They require SAML SSO for authentication. Security is a major concern due to recent data breach at competitor.', date: '2024-02-15', author: 'Solutions Engineer' },
                { id: 'n3', text: 'Budget confirmed with Michael. They have $60K allocated for this fiscal year, with possibility to include implementation in this year\'s budget if we can complete by June 30.', date: '2024-02-22', author: 'Sales Rep' },
                { id: 'n4', text: 'Demo focused on manufacturing templates was well received. Rebecca asked about customizing dashboards for floor managers. Need to prepare examples of similar deployments.', date: '2024-02-25', author: 'Sales Rep' },
                { id: 'n5', text: 'Technical proof of concept showed successful API integration with test SAP instance. John impressed with data transformation capabilities. Requested additional security documentation for IT review.', date: '2024-03-08', author: 'Solutions Engineer' },
                { id: 'n6', text: 'Proposal review call scheduled for March 15th. Need to prepare implementation timeline and resource requirements. Michael requested detailed ROI calculation.', date: '2024-03-10', author: 'Sales Rep' }
            ],
            files: [
                { id: 'f1', name: 'Acme_Requirements.pdf', type: 'pdf', date: '2024-02-12', size: '540 KB', author: 'Rebecca Torres', description: 'Detailed requirements document including technical specifications and business needs' },
                { id: 'f2', name: 'Acme_Technical_Assessment.docx', type: 'docx', date: '2024-02-20', size: '725 KB', author: 'Solutions Engineer', description: 'Analysis of technical environment and integration requirements' },
                { id: 'f3', name: 'Acme_ROI_Calculator.xlsx', type: 'xlsx', date: '2024-03-02', size: '1.2 MB', author: 'Sales Rep', description: 'ROI calculator showing 3-year financial impact and cost savings' },
                { id: 'f4', name: 'Acme_Proposal_v1.pdf', type: 'pdf', date: '2024-03-12', size: '2.8 MB', author: 'Sales Rep', description: 'Complete solution proposal including implementation timeline and pricing' },
                { id: 'f5', name: 'Acme_Security_Whitepaper.pdf', type: 'pdf', date: '2024-03-14', size: '1.5 MB', author: 'Security Team', description: 'Detailed security specifications and compliance certifications' }
            ],
            history: [
                { id: 'h1', title: 'Deal created', date: '2024-01-25', description: 'Deal added to pipeline following inbound request from website' },
                { id: 'h2', title: 'Discovery call', date: '2024-02-05', description: 'Initial discovery call with Rebecca and team to understand requirements' },
                { id: 'h3', title: 'Technical assessment', date: '2024-02-15', description: 'Technical discovery call with IT team to evaluate environment' },
                { id: 'h4', title: 'Stage updated', date: '2024-02-18', description: 'Moved from Discovery to Qualification based on confirmed budget and timeline' },
                { id: 'h5', title: 'Solution demonstration', date: '2024-02-25', description: 'Presented solution capabilities to stakeholder team' },
                { id: 'h6', title: 'Technical validation', date: '2024-03-08', description: 'Completed API integration proof of concept with test environment' },
                { id: 'h7', title: 'Stage updated', date: '2024-03-10', description: 'Moved from Qualification to Proposal based on successful validation' },
                { id: 'h8', title: 'Proposal submitted', date: '2024-03-12', description: 'Formal proposal and pricing submitted to evaluation team' }
            ]
        },
        'deal-2': {
            id: 'deal-2',
            name: 'TechStar Inc',
            value: '$78,500',
            stage: 'Discovery',
            closeDate: '2024-06-30',
            industry: 'Technology',
            company: {
                size: '100-250 employees',
                revenue: '$25M annual',
                location: 'San Francisco, CA',
                founded: '2015',
                website: 'techstarinc.com',
                segment: 'Growth',
                description: 'Innovative SaaS platform provider focusing on AI-driven analytics solutions.'
            },
            product: {
                name: 'CRM Enterprise Suite',
                plan: 'Growth Scale',
                seats: '50 licenses + API users',
                term: '1-year contract with auto-renewal',
                implementation: '21 days',
                training: '4 virtual sessions + on-demand library',
                addons: ['Advanced Analytics', 'Custom Integrations', 'Premium Support']
            },
            financials: {
                basePrice: '$45,000/yr',
                implementation: '$12,500 (one-time)',
                addons: '$21,000/yr',
                discount: '0% (standard pricing)',
                payment: 'Quarterly installments',
                roi: 'Expected 325% ROI over 2 years'
            },
            competitiveLandscape: {
                competitors: ['SalesForce', 'HubSpot Enterprise', 'Monday Sales CRM'],
                incumbent: 'Mix of tools without central CRM',
                differentiators: ['API-first architecture', 'E-commerce specific workflows', 'Flexible deployment'],
                challenges: ['Competing priorities', 'Rapid growth requiring scalability', 'Technical integration complexity']
            },
            decisionCriteria: [
                'Scalability to support growth projections',
                'Developer-friendly API ecosystem',
                'Time to implementation',
                'Support for complex sales workflows'
            ],
            timeline: {
                firstContact: '2024-01-10',
                discovery: '2024-01-18',
                demo: '2024-02-05',
                proposal: '2024-02-22',
                negotiation: '2024-03-15',
                expectedClose: '2024-04-30',
                implementation: '2024-05-15'
            },
            contacts: [
                { id: 'c2', name: 'Sarah Johnson', title: 'CEO', email: 'sarah@techstarinc.com', phone: '(512) 555-1000', role: 'Approver', influence: 'High', notes: 'Focused on company growth and scaling operations efficiently. Technical background from developer role at previous startup.' },
                { id: 'c3', name: 'Mike Peterson', title: 'CFO', email: 'mike@techstarinc.com', phone: '(512) 555-1001', role: 'Economic Buyer', influence: 'High', notes: 'Detail-oriented, concerned with cash flow management and ROI. Prefers quarterly payment terms.' },
                { id: 'c4', name: 'Alex Wong', title: 'Sales Director', email: 'alex@techstarinc.com', phone: '(512) 555-1002', role: 'Champion', influence: 'High', notes: 'Experiencing pain with current disjointed systems. Needs solution urgently to support growing sales team.' },
                { id: 'c5', name: 'Jason Miller', title: 'CTO', email: 'jason@techstarinc.com', phone: '(512) 555-1003', role: 'Technical Decision Maker', influence: 'Medium', notes: 'Focused on API capabilities and integration with existing tech stack including PostgreSQL and NextJS front-end.' }
            ],
            notes: [
                { id: 'n2', text: 'Initial call with Sarah (CEO) and Alex (Sales Director). They\'ve grown from 30 to 120 employees in 18 months. Current tools can\'t scale with their growth. Using spreadsheets and basic tools with no integration, causing data silos. Need consolidated platform by Q2.', date: '2024-01-18', author: 'Sales Rep' },
                { id: 'n3', text: 'Technical discovery with Jason (CTO). Current stack: PostgreSQL, Redis, Next.js front-end, Node.js microservices. Require extensive API access and webhook support. Security requirements include SOC 2 and GDPR compliance. SSO integration with Okta required.', date: '2024-01-25', author: 'Solutions Engineer' },
                { id: 'n4', text: 'Demo for core team focused on sales workflows and integration capabilities. Alex particularly interested in pipeline visualization and reporting. Sarah asked about mobile experience. Jason impressed with API documentation and sandbox environment.', date: '2024-02-05', author: 'Sales Rep' },
                { id: 'n5', text: 'Budget discussion with Mike (CFO). They prefer OpEx model with quarterly payments to manage cash flow. Implementation needs to happen before end of Q2 to align with hiring plans. ROI calculation should focus on sales productivity improvement and data accuracy.', date: '2024-02-12', author: 'Sales Rep' },
                { id: 'n6', text: 'Technical workshop to build sample integration with their product catalog system. Jason brought two senior engineers. Successfully created proof of concept using our API. Team was impressed with developer experience and documentation.', date: '2024-02-16', author: 'Solutions Engineer' },
                { id: 'n7', text: 'Proposal review meeting. Sarah concerned about implementation timeline. Mike requested payment terms adjustment to align with revenue cycle. Alex asked about advanced reporting capabilities not covered in standard package. Need to revise proposal with these considerations.', date: '2024-02-28', author: 'Sales Rep' },
                { id: 'n8', text: 'Negotiation call with Mike and Sarah. They\'re requesting extended payment terms (Net-60) and implementation to be completed by May 15 latest. Willing to sign 18-month contract if we can accommodate. Need to discuss with finance team.', date: '2024-03-15', author: 'Sales Rep' }
            ],
            files: [
                { id: 'f2', name: 'TechStar_Requirements.docx', type: 'docx', date: '2024-01-20', size: '450 KB', author: 'Alex Wong', description: 'Sales team requirements and current process documentation' },
                { id: 'f3', name: 'TechStar_Technical_Specs.pdf', type: 'pdf', date: '2024-01-27', size: '1.1 MB', author: 'Jason Miller', description: 'Technical environment specifications and integration requirements' },
                { id: 'f4', name: 'TechStar_API_Workshop.pptx', type: 'pptx', date: '2024-02-16', size: '3.5 MB', author: 'Solutions Engineer', description: 'API integration workshop materials and code samples' },
                { id: 'f5', name: 'TechStar_ROI_Analysis.xlsx', type: 'xlsx', date: '2024-02-20', size: '920 KB', author: 'Sales Rep', description: 'ROI analysis based on current vs. future state metrics' },
                { id: 'f6', name: 'TechStar_Proposal_V1.pdf', type: 'pdf', date: '2024-02-22', size: '2.8 MB', author: 'Sales Rep', description: 'Initial proposal including pricing and implementation plan' },
                { id: 'f7', name: 'TechStar_Proposal_V2.pdf', type: 'pdf', date: '2024-03-05', size: '3.1 MB', author: 'Sales Rep', description: 'Revised proposal addressing timeline and payment concerns' },
                { id: 'f8', name: 'TechStar_Contract_Draft.docx', type: 'docx', date: '2024-03-18', size: '875 KB', author: 'Legal Team', description: 'Draft contract terms for review' }
            ],
            history: [
                { id: 'h3', title: 'Deal created', date: '2024-01-15', description: 'Deal created following introduction from mutual connection' },
                { id: 'h4', title: 'Discovery call', date: '2024-01-18', description: 'Initial discovery with Sarah and Alex to understand business needs' },
                { id: 'h5', title: 'Technical discovery', date: '2024-01-25', description: 'Technical requirements gathering with CTO and engineering team' },
                { id: 'h6', title: 'Stage updated', date: '2024-01-28', description: 'Moved from Discovery to Qualification based on confirmed need and budget' },
                { id: 'h7', title: 'Solution demonstration', date: '2024-02-05', description: 'Presented solution capabilities to key stakeholders' },
                { id: 'h8', title: 'Technical workshop', date: '2024-02-16', description: 'API integration workshop with technical team' },
                { id: 'h9', title: 'Proposal submitted', date: '2024-02-22', description: 'Initial proposal delivered to evaluation team' },
                { id: 'h10', title: 'Proposal feedback', date: '2024-02-28', description: 'Received feedback on proposal requiring revisions' },
                { id: 'h11', title: 'Revised proposal', date: '2024-03-05', description: 'Submitted updated proposal addressing feedback' },
                { id: 'h12', title: 'Stage updated', date: '2024-03-10', description: 'Moved from Proposal to Negotiation phase' },
                { id: 'h13', title: 'Contract draft', date: '2024-03-18', description: 'Initial contract draft shared for legal review' }
            ]
        },
        'deal-3': {
            id: 'deal-3',
            name: 'Global Systems',
            value: '$124,000',
            stage: 'Negotiation',
            closeDate: '2024-04-15',
            industry: 'Financial Services',
            company: {
                size: '500+ employees',
                revenue: '$100M annual',
                location: 'New York, NY',
                founded: '1990',
                website: 'globalsystems.com',
                segment: 'Enterprise',
                description: 'Global financial technology provider specializing in trading and risk management solutions.'
            },
            product: {
                name: 'Security Compliance Platform',
                plan: 'Enterprise',
                seats: '500 licenses',
                term: '3-year contract',
                implementation: '90 days',
                training: 'Comprehensive training program',
                addons: ['Advanced Threat Detection', 'Global Compliance Templates', 'Dedicated Support Team']
            },
            financials: {
                basePrice: '$85,000/yr',
                implementation: '$39,000 (one-time)',
                addons: '$65,000/yr',
                discount: '20% on 3-year term',
                payment: 'Annual',
                roi: 'Expected 400% ROI over contract term'
            },
            competitiveLandscape: {
                competitors: ['SecurityFirst Platform', 'ComplianceGuard Enterprise', 'RiskShield Pro'],
                incumbent: 'Mix of regional solutions with no global consistency',
                differentiators: ['Global compliance templates', 'Multi-jurisdiction reporting', 'Financial services focus'],
                challenges: ['Complex procurement process', 'Stringent security requirements', 'Multiple stakeholders across regions']
            },
            decisionCriteria: [
                'Global compliance capabilities',
                'Enterprise scalability',
                'Integration with existing security infrastructure',
                'Multi-region support and legal framework compatibility',
                'Audit trail and reporting capabilities'
            ],
            timeline: {
                firstContact: '2024-03-01',
                discovery: '2024-03-15',
                demo: 'Planned for 2024-04-15',
                proposal: 'Targeted for 2024-05-30',
                negotiation: 'Estimated 2024-06-15',
                expectedClose: '2024-07-31',
                implementation: 'Would begin 2024-08-15'
            },
            contacts: [
                { id: 'c4', name: 'Jane Smith', title: 'CEO', email: 'jane.smith@globalsystems.com', phone: '(212) 555-7000', role: 'Executive Sponsor', influence: 'Medium', notes: 'Interested in strategic value of global compliance solution. Limited involvement in day-to-day evaluation.' },
                { id: 'c5', name: 'Robert Chen', title: 'Global Compliance Director', email: 'r.chen@globalsystems.com', phone: '(212) 555-7001', role: 'Champion', influence: 'High', notes: 'Driving initiative to standardize compliance across all regions. Main point of contact.' },
                { id: 'c6', name: 'Elena Rodriguez', title: 'CIO', email: 'e.rodriguez@globalsystems.com', phone: '(212) 555-7002', role: 'Technical Decision Maker', influence: 'High', notes: 'Concerned about security posture and integration with existing infrastructure. Zero-trust approach to vendor solutions.' },
                { id: 'c7', name: 'David Park', title: 'CFO', email: 'd.park@globalsystems.com', phone: '(212) 555-7003', role: 'Financial Approver', influence: 'High', notes: 'Requires detailed ROI calculation and risk mitigation value proposition.' },
                { id: 'c8', name: 'Sophia Johnson', title: 'Regional Director (EMEA)', email: 's.johnson@globalsystems.com', phone: '(+44) 20-5555-7004', role: 'Key Stakeholder', influence: 'Medium', notes: 'Represents European business needs. Strong focus on GDPR compliance.' },
                { id: 'c9', name: 'Michael Wong', title: 'Regional Director (APAC)', email: 'm.wong@globalsystems.com', phone: '(+65) 5555-7005', role: 'Key Stakeholder', influence: 'Medium', notes: 'Represents Asia-Pacific business needs. Focus on regional regulatory requirements.' }
            ],
            notes: [
                { id: 'n4', text: 'Initial meeting with Robert Chen (Global Compliance Director) following industry conference introduction. Global Systems is looking to standardize compliance management across all regions. Currently using different tools in each region, creating challenges with global reporting and inconsistent processes. Board has made compliance a top priority for 2024.', date: '2024-03-01', author: 'Enterprise Account Executive' },
                { id: 'n5', text: 'Discovery call with Robert and Elena (CIO). Current environment includes multiple regional compliance systems with no centralized visibility. Regulatory requirements span 12 countries across North America, Europe, and Asia-Pacific. Need ability to manage different compliance frameworks simultaneously (SOX, GDPR, PCI-DSS, local banking regulations).', date: '2024-03-15', author: 'Enterprise Account Executive' },
                { id: 'n6', text: 'Technical discovery with Elena\'s team. Highly complex environment with strict security requirements. Need to complete security questionnaire (400+ questions) and potentially undergo penetration testing before deployment. Integration requirements include Oracle ERP, ServiceNow, and internal audit systems.', date: '2024-03-22', author: 'Solutions Architect' },
                { id: 'n7', text: 'Requirements call with regional directors from EMEA and APAC. Each region has specific regulatory needs that must be addressed. EMEA focused on GDPR and upcoming Digital Operations Resilience Act. APAC dealing with diverse requirements across Singapore, Japan, Australia. Need to consider language support for interfaces.', date: '2024-03-28', author: 'Enterprise Account Executive' },
                { id: 'n8', text: 'Initial meeting scheduled with David (CFO) for April 5th to discuss budget and ROI expectations. Robert suggests focusing on risk mitigation, potential regulatory fine avoidance, and operational efficiency gains. Current compliance processes require 15+ FTEs across regions.', date: '2024-04-01', author: 'Enterprise Account Executive' }
            ],
            files: [
                { id: 'f4', name: 'GlobalSystems_NDA.pdf', type: 'pdf', date: '2024-03-05', size: '320 KB', author: 'Legal Team', description: 'Executed mutual non-disclosure agreement' },
                { id: 'f5', name: 'GlobalSystems_Requirements_Initial.docx', type: 'docx', date: '2024-03-18', size: '1.8 MB', author: 'Robert Chen', description: 'Initial requirements document outlining global compliance needs' },
                { id: 'f6', name: 'GlobalSystems_Technical_Environment.xlsx', type: 'xlsx', date: '2024-03-25', size: '2.3 MB', author: 'Elena Rodriguez', description: 'Technical environment specifications and integration points' },
                { id: 'f7', name: 'GlobalSystems_Security_Questionnaire.xlsx', type: 'xlsx', date: '2024-03-30', size: '4.5 MB', author: 'Security Team', description: 'Comprehensive security and compliance questionnaire' },
                { id: 'f8', name: 'GlobalSystems_Regional_Requirements.pptx', type: 'pptx', date: '2024-04-01', size: '3.8 MB', author: 'Regional Directors', description: 'Region-specific compliance requirements and considerations' }
            ],
            history: [
                { id: 'h7', title: 'Initial contact', date: '2024-03-01', description: 'Initial meeting with Robert Chen at Financial Services Compliance Summit' },
                { id: 'h8', title: 'NDA executed', date: '2024-03-05', description: 'Mutual non-disclosure agreement signed by both parties' },
                { id: 'h9', title: 'Deal created', date: '2024-03-10', description: 'Deal added to pipeline following initial qualification' },
                { id: 'h10', title: 'Discovery meeting', date: '2024-03-15', description: 'Initial discovery call with compliance and IT leadership' },
                { id: 'h11', title: 'Technical discovery', date: '2024-03-22', description: 'Technical requirements gathering with IT security team' },
                { id: 'h12', title: 'Regional requirements', date: '2024-03-28', description: 'Requirements gathering with regional stakeholders' },
                { id: 'h13', title: 'Security questionnaire', date: '2024-03-30', description: 'Received comprehensive security assessment questionnaire' },
                { id: 'h14', title: 'CFO meeting scheduled', date: '2024-04-01', description: 'Upcoming budget and ROI discussion with CFO scheduled for April 5' }
            ]
        }
    },
    currentDeal: null
};

// Create mapping between dropdown values and actual deals
window.dealDropdownMap = {
    "Acme Corp - $50,000": "deal-1",
    "TechStar Inc - $75,000": "deal-2", 
    "Global Systems - $120,000": "deal-3"
};

// Function to ensure dealStore is properly initialized
function ensureDealStore() {
    console.log('Ensuring dealStore is initialized...');
    
    // Check if deals exist in dealStore
    if (!window.dealStore || !window.dealStore.deals || Object.keys(window.dealStore.deals).length === 0) {
        console.error('Deal store missing or empty, attempting to fix...');
        
        // Recreate dealStore with the correct structure if needed
        if (typeof window.originalDealStore !== 'undefined') {
            window.dealStore = window.originalDealStore;
            console.log('Restored dealStore from originalDealStore backup');
        }
    }

    console.log('DealStore deal count:', Object.keys(window.dealStore?.deals || {}).length);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure dealStore is properly set up
    ensureDealStore();
    
    // Log the available deals for debugging
    console.log('Available deals in store:', window.dealStore?.deals);
});

// Backup original dealStore in case it gets corrupted
setTimeout(function() {
    if (window.dealStore && window.dealStore.deals) {
        window.originalDealStore = JSON.parse(JSON.stringify(window.dealStore));
        console.log('Created backup of dealStore');
    }
}, 1000);

// Make functions globally available
window.dealData = {
    getAllDeals: function() {
        return Object.values(window.dealStore.deals);
    },
    
    getDeal: function(dealId) {
        return window.dealStore.deals[dealId];
    },
    
    setCurrentDeal: function(dealId) {
        window.dealStore.currentDeal = dealId;
    },
    
    getCurrentDeal: function() {
        return window.dealStore.currentDeal ? window.dealStore.deals[window.dealStore.currentDeal] : null;
    },
    
    clearCurrentDeal: function() {
        window.dealStore.currentDeal = null;
    }
};

// NOTES MANAGEMENT
// Add a note to a deal
export function addNote(dealId, text) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const newNote = {
        id: `n${Date.now()}`,
        text: text,
        date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        author: 'Sales Rep' // Assuming the author is always 'Sales Rep' for this example
    };
    
    deal.notes.push(newNote);
    
    // Also add to history
    addHistoryItem(dealId, 'Note added', `Added note: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    
    return newNote;
}

// Remove a note from a deal
export function removeNote(dealId, noteId) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const initialLength = deal.notes.length;
    deal.notes = deal.notes.filter(note => note.id !== noteId);
    
    return deal.notes.length !== initialLength;
}

// CONTACTS MANAGEMENT
// Add a contact to a deal
export function addContact(dealId, name, title, email) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const newContact = {
        id: `c${Date.now()}`,
        name: name,
        title: title,
        email: email
    };
    
    deal.contacts.push(newContact);
    
    // Also add to history
    addHistoryItem(dealId, 'Contact added', `Added ${name} as ${title}`);
    
    return newContact;
}

// Remove a contact from a deal
export function removeContact(dealId, contactId) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const initialLength = deal.contacts.length;
    deal.contacts = deal.contacts.filter(contact => contact.id !== contactId);
    
    return deal.contacts.length !== initialLength;
}

// FILES MANAGEMENT
// Add a file to a deal
export function addFile(dealId, fileName, fileType, fileSize) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const newFile = {
        id: `f${Date.now()}`,
        name: fileName,
        type: fileType,
        date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        size: fileSize
    };
    
    deal.files.push(newFile);
    
    // Also add to history
    addHistoryItem(dealId, 'File added', `${fileName} was uploaded`);
    
    return newFile;
}

// Remove a file from a deal
export function removeFile(dealId, fileId) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const initialLength = deal.files.length;
    deal.files = deal.files.filter(file => file.id !== fileId);
    
    return deal.files.length !== initialLength;
}

// HISTORY MANAGEMENT
// Add a history item to a deal
export function addHistoryItem(dealId, title, description) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const newHistoryItem = {
        id: `h${Date.now()}`,
        title: title,
        date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        description: description
    };
    
    deal.history.push(newHistoryItem);
    return newHistoryItem;
}

// Update deal stage
export function updateDealStage(dealId, stage) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const oldStage = deal.stage;
    deal.stage = stage;
    
    // Add to history
    addHistoryItem(dealId, 'Stage updated', `Moved from ${oldStage} to ${stage} stage`);
    
    return true;
}

// Update deal information
export function updateDealInfo(dealId, updates) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    // Track changes for history
    const changes = [];
    
    if (updates.name && updates.name !== deal.name) {
        changes.push(`Name changed from "${deal.name}" to "${updates.name}"`);
        deal.name = updates.name;
    }
    
    if (updates.value && updates.value !== deal.value) {
        changes.push(`Value changed from ${deal.value} to ${updates.value}`);
        deal.value = updates.value;
    }
    
    if (updates.closeDate && updates.closeDate !== deal.closeDate) {
        changes.push(`Close date changed from ${deal.closeDate} to ${updates.closeDate}`);
        deal.closeDate = updates.closeDate;
    }
    
    // Add to history if there were changes
    if (changes.length > 0) {
        addHistoryItem(dealId, 'Deal updated', changes.join(', '));
    }
    
    return true;
}

// Return formatted deal data for display
export function formatDealData(deal) {
    if (!deal) return null;
    
    return {
        id: deal.id,
        name: deal.name,
        value: deal.value,
        stage: deal.stage,
        closeDate: deal.closeDate,
        contacts: [...deal.contacts],
        notes: [...deal.notes].sort((a, b) => new Date(b.date) - new Date(a.date)), // newest first
        files: [...deal.files].sort((a, b) => new Date(b.date) - new Date(a.date)), // newest first
        history: [...deal.history].sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
    };
} 