/**
 * Deal Context Manager Module
 * Stores and manages contextual information about deals for chat interactions
 */

import * as DealData from './dealData.js';

// Context types (for organization and filtering)
export const CONTEXT_TYPES = {
    EMAIL: 'email',
    CALL: 'call',
    MEETING: 'meeting',
    NOTE: 'note',
    DOCUMENT: 'document',
    TASK: 'task',
    INTERACTION: 'interaction'
};

// Store of deal context items
// This would normally be fetched from a backend API
const dealContextStore = {
    // Acme Corp Deal
    'deal-1': [
        {
            id: 'ctx-101',
            type: CONTEXT_TYPES.EMAIL,
            date: '2024-02-15',
            title: 'Initial outreach email',
            summary: 'Sent introduction email to John Smith about our product offering.',
            content: `
Subject: Introduction to our Software Solution

Hi John,

I hope this email finds you well. I'm reaching out from [Our Company] to introduce our sales productivity platform that might help Acme Corp streamline your sales operations.

Our solution offers:
- AI-powered deal analysis
- Integrated communication tools
- Automated follow-ups

Would you be available for a quick 15-minute call next week to discuss how we might help your team?

Best regards,
Sales Rep
            `,
            people: ['John Smith'],
            labels: ['outreach', 'introduction']
        },
        {
            id: 'ctx-102',
            type: CONTEXT_TYPES.CALL,
            date: '2024-02-20',
            title: 'Discovery call with John',
            summary: 'Initial discovery call to understand Acme Corp\'s needs.',
            content: `
Call Notes:
- John mentioned they're using a combination of spreadsheets and a basic CRM
- Current pain points: lack of visibility into deal pipeline, manual reporting
- Team of 15 sales reps, looking to grow to 25 by year-end
- Budget cycle starts in April, looking to implement something by Q3
- Key decision makers: John (CTO) and Sarah (VP Sales)
- Next steps: Schedule demo with broader team
            `,
            people: ['John Smith'],
            duration: '30 minutes',
            labels: ['discovery', 'needs-assessment']
        },
        {
            id: 'ctx-103',
            type: CONTEXT_TYPES.MEETING,
            date: '2024-03-01',
            title: 'Product demonstration',
            summary: 'Full product demonstration with Acme Corp team.',
            content: `
Meeting Notes:
- Attendees: John Smith (CTO), Sarah Johnson (VP Sales), Michael Lee (Sales Manager)
- Presented core features with focus on pipeline management and forecasting
- Sarah was particularly interested in the reporting capabilities
- Michael asked about integration with their existing tools
- Questions about implementation timeline and training requirements
- Pricing discussion initiated - they're comparing us with 2 other vendors
- Action items: Send proposal by next week, schedule follow-up with IT team
            `,
            people: ['John Smith', 'Sarah Johnson', 'Michael Lee'],
            duration: '1 hour',
            labels: ['demo', 'stakeholders']
        },
        {
            id: 'ctx-104',
            type: CONTEXT_TYPES.DOCUMENT,
            date: '2024-03-05',
            title: 'Proposal for Acme Corp',
            summary: 'Detailed proposal including pricing and implementation plan.',
            content: `
PROPOSAL SUMMARY:
- Enterprise plan: $50,000 annually
- Implementation timeline: 4-6 weeks
- Includes: Custom configuration, data migration, admin training
- Premium support package with dedicated CSM
- Optional add-ons: Advanced analytics ($10k), API access ($5k)
- Special offer: 15% discount if signed by end of quarter
            `,
            fileType: 'pdf',
            fileSize: '2.4 MB',
            labels: ['proposal', 'pricing']
        },
        {
            id: 'ctx-105',
            type: CONTEXT_TYPES.NOTE,
            date: '2024-03-10',
            title: 'Competitive situation',
            summary: 'Notes about competitive landscape for this deal.',
            content: `
Based on conversations, Acme Corp is evaluating us alongside:
- CompetitorX (incumbent, but contract ending soon)
- NewSolution (lower price point but fewer features)

Our advantages:
- Better UI/UX than CompetitorX (per John's feedback)
- More comprehensive than NewSolution
- Our integration capabilities are superior

Risks:
- Price sensitivity (Sarah mentioned budget constraints)
- Implementation timeline concerns
- Need executive buy-in from CEO
            `,
            labels: ['competitive', 'strategy']
        }
    ],
    
    // TechStar Inc Deal
    'deal-2': [
        {
            id: 'ctx-201',
            type: CONTEXT_TYPES.EMAIL,
            date: '2024-01-25',
            title: 'Introduction via LinkedIn',
            summary: 'Sarah Johnson reached out via LinkedIn showing interest.',
            content: `
Subject: Following up on LinkedIn connection

Hi Sales Rep,

Thanks for connecting on LinkedIn. As mentioned, we're currently evaluating solutions to help scale our sales operations at TechStar.

Our team has grown significantly in the past 6 months, and our current processes aren't keeping up. I'd love to learn more about how your platform might help us standardize our approach and improve visibility.

Do you have time for a call next week?

Best,
Sarah Johnson
CEO, TechStar Inc
            `,
            people: ['Sarah Johnson'],
            labels: ['inbound', 'linkedin']
        },
        {
            id: 'ctx-202',
            type: CONTEXT_TYPES.CALL,
            date: '2024-02-01',
            title: 'Initial call with Sarah',
            summary: 'First call to discuss TechStar\'s requirements.',
            content: `
Call Notes:
- TechStar is a fast-growing startup, recently raised Series B funding
- Team doubled in size to 50 employees, including 20 in sales
- Currently using basic tools and struggling with consistency
- Key requirements: pipeline visibility, forecasting, activity tracking
- Timeline: Want to implement within next 2 months
- Budget: Have allocated ~$75K for sales tools this year
- Next steps: Technical demo with their sales leadership team
            `,
            people: ['Sarah Johnson'],
            duration: '45 minutes',
            labels: ['discovery', 'requirements']
        },
        {
            id: 'ctx-203',
            type: CONTEXT_TYPES.MEETING,
            date: '2024-02-10',
            title: 'Technical demonstration',
            summary: 'Technical demo with TechStar sales leadership.',
            content: `
Meeting Notes:
- Attendees: Sarah Johnson (CEO), Mike Peterson (CFO), Alex Wong (Sales Director)
- Deep dive into platform capabilities with focus on scalability
- Discussed API integrations with their existing tech stack
- Alex had specific questions about territory management features
- Mike focused on ROI and reporting capabilities
- Overall very positive reception, especially from Alex
- Action items: Custom demo environment for their team to test, security questionnaire
            `,
            people: ['Sarah Johnson', 'Mike Peterson', 'Alex Wong'],
            duration: '1.5 hours',
            labels: ['demo', 'technical']
        },
        {
            id: 'ctx-204',
            type: CONTEXT_TYPES.EMAIL,
            date: '2024-02-15',
            title: 'Follow-up after demo',
            summary: 'Email from Sarah with feedback on the demonstration.',
            content: `
Subject: Re: Demo Follow-up

Hi Sales Rep,

Thanks for the comprehensive demo last week. The team was impressed with what they saw, particularly the analytics capabilities and ease of use.

Before we move forward, we have a few questions:
1. Can you provide more details on the onboarding process and typical timeline?
2. What level of customization is available for the sales dashboard?
3. Does your platform integrate with HubSpot Marketing?

Also, I've attached the security questionnaire from our IT department.

Looking forward to your response.

Best,
Sarah
            `,
            people: ['Sarah Johnson'],
            labels: ['follow-up', 'questions']
        },
        {
            id: 'ctx-205',
            type: CONTEXT_TYPES.DOCUMENT,
            date: '2024-02-28',
            title: 'Revised Proposal',
            summary: 'Updated proposal based on additional requirements.',
            content: `
REVISED PROPOSAL HIGHLIGHTS:
- Enterprise Plan: $75,000/year (includes all core features)
- Implementation: 3-week expedited timeline
- Custom onboarding program for all 20 sales users
- HubSpot integration included at no additional cost
- Custom dashboard development (10 hours included)
- Security package with SSO and advanced permissions
- Optional add-ons: Advanced territory management ($10K)
            `,
            fileType: 'pdf',
            fileSize: '3.1 MB',
            labels: ['proposal', 'pricing']
        },
        {
            id: 'ctx-206',
            type: CONTEXT_TYPES.INTERACTION,
            date: '2024-03-05',
            title: 'Contract negotiation call',
            summary: 'Discussion about contract terms with Mike (CFO).',
            content: `
Negotiation Notes:
- Mike requested extending payment terms to Net-60
- Discussed volume discount options for potential team growth
- They want a 2-year contract with price lock
- License true-up to happen quarterly rather than monthly
- Questions about SLA guarantees and downtime compensation
- Requested a custom termination clause related to acquisition
            `,
            people: ['Mike Peterson'],
            labels: ['negotiation', 'terms']
        },
        {
            id: 'ctx-207',
            type: CONTEXT_TYPES.NOTE,
            date: '2024-03-08',
            title: 'Deal strategy note',
            summary: 'Internal notes about closing strategy.',
            content: `
CLOSING STRATEGY:
- Timeline is critical - they want to implement before Q2 sales kickoff
- Decision committee: Sarah, Mike, Alex, plus CTO (Jason) needs to approve
- Emphasize our onboarding speed compared to competitors
- Leverage our HubSpot integration as key differentiator
- Be prepared to compromise on payment terms to secure 2-year commitment
- Final proposal needs to include ROI calculator for Mike
- CEO/founder reference call may help push deal over the line
            `,
            labels: ['strategy', 'internal']
        }
    ],
    
    // Global Systems Deal
    'deal-3': [
        {
            id: 'ctx-301',
            type: CONTEXT_TYPES.EMAIL,
            date: '2024-03-01',
            title: 'Referral introduction',
            summary: 'Introduction email from existing customer.',
            content: `
Subject: Introduction to Global Systems

Hi Sales Rep,

I wanted to introduce you to Jane Smith, CEO of Global Systems. Jane and I worked together previously, and she mentioned they're looking to upgrade their sales tech stack.

I thought your solution might be a great fit for them based on our experience.

Jane - [Sales Rep] and team have been fantastic partners for us. Their platform has helped us increase our sales efficiency by 30% in just six months.

I'll leave you two to connect.

Best,
Tom Wilson
VP Sales, [Existing Customer]
            `,
            people: ['Jane Smith', 'Tom Wilson'],
            labels: ['referral', 'introduction']
        },
        {
            id: 'ctx-302',
            type: CONTEXT_TYPES.EMAIL,
            date: '2024-03-02',
            title: 'Response to introduction',
            summary: 'Jane\'s response expressing interest in learning more.',
            content: `
Subject: Re: Introduction to Global Systems

Thanks for the introduction, Tom!

Hi Sales Rep,

It's great to connect. As Tom mentioned, we're in the process of evaluating our sales tools at Global Systems. We're a global enterprise with sales teams across 12 countries, and we're looking to standardize our approach.

Currently, we're using different tools in different regions, which creates challenges with reporting and visibility.

I'd be interested in learning more about your solution and how it might work for an organization of our size and complexity.

Could we schedule some time next week for an initial discussion?

Best regards,
Jane Smith
CEO, Global Systems
            `,
            people: ['Jane Smith'],
            labels: ['response', 'interest']
        },
        {
            id: 'ctx-303',
            type: CONTEXT_TYPES.CALL,
            date: '2024-03-10',
            title: 'Discovery call with Jane',
            summary: 'Initial discovery call to understand Global Systems needs.',
            content: `
Call Notes:
- Global Systems: Enterprise software company with 500+ employees
- Sales teams across North America, Europe, Asia, and Australia
- Current challenge: Disconnected systems, inconsistent processes
- Seeking global solution with localization capabilities
- Key needs: Multi-currency, territory management, language support
- Compliance requirements: GDPR, SOC 2, ISO 27001
- Timeline: 6-month evaluation and implementation plan
- Budget: Not specifically disclosed but "significant enterprise investment"
- Decision process: Involves leadership from each region, IT security, procurement
- Next steps: High-level presentation to broader leadership team
            `,
            people: ['Jane Smith'],
            duration: '45 minutes',
            labels: ['discovery', 'enterprise']
        },
        {
            id: 'ctx-304',
            type: CONTEXT_TYPES.NOTE,
            date: '2024-03-12',
            title: 'Deal qualification notes',
            summary: 'Internal notes on deal qualification and approach.',
            content: `
DEAL QUALIFICATION:
- Enterprise opportunity - potential ARR $120K+
- Long sales cycle expected (4-6 months)
- Multiple stakeholders across functions and regions
- Technical requirements align with our enterprise offering
- Will require executive sponsorship and security review
- Potential expansion opportunity across other departments
- Competitors likely include Salesforce, Microsoft, and Oracle

APPROACH:
- Involve our enterprise team from the beginning
- Prepare for security/compliance deep dive
- Identify champions in each region
- Focus on global reporting capabilities as key differentiator
- Prepare ROI model based on global consistency gains
            `,
            labels: ['qualification', 'strategy']
        },
        {
            id: 'ctx-305',
            type: CONTEXT_TYPES.TASK,
            date: '2024-03-15',
            title: 'Prepare for leadership presentation',
            summary: 'Tasks for upcoming leadership presentation.',
            content: `
PREPARATION TASKS:
- Create executive-level presentation (due 3/20)
- Prepare global case studies focusing on similar enterprises
- Develop high-level implementation timeline
- Draft security/compliance overview document
- Coordinate with product team for enterprise roadmap details
- Schedule pre-brief with Jane before the leadership meeting
- Research key leaders who will attend
            `,
            status: 'In Progress',
            dueDate: '2024-03-20',
            labels: ['preparation', 'presentation']
        }
    ]
};

/**
 * Get all context items for a specific deal
 * @param {string} dealId - The ID of the deal
 * @returns {Array} Array of context items or empty array if none found
 */
export function getDealContext(dealId) {
    return dealContextStore[dealId] || [];
}

/**
 * Get context items for a specific deal filtered by type
 * @param {string} dealId - The ID of the deal
 * @param {string} contextType - Type of context to filter by (from CONTEXT_TYPES)
 * @returns {Array} Filtered array of context items
 */
export function getDealContextByType(dealId, contextType) {
    const context = getDealContext(dealId);
    return context.filter(item => item.type === contextType);
}

/**
 * Get context items for a deal filtered by date range
 * @param {string} dealId - The ID of the deal
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} Filtered array of context items
 */
export function getDealContextByDateRange(dealId, startDate, endDate) {
    const context = getDealContext(dealId);
    return context.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
    });
}

/**
 * Get context items for a deal filtered by person mentioned
 * @param {string} dealId - The ID of the deal
 * @param {string} personName - Name of person to filter by
 * @returns {Array} Filtered array of context items
 */
export function getDealContextByPerson(dealId, personName) {
    const context = getDealContext(dealId);
    return context.filter(item => 
        item.people && item.people.some(person => 
            person.toLowerCase().includes(personName.toLowerCase())
        )
    );
}

/**
 * Search for specific text across all context items for a deal
 * @param {string} dealId - The ID of the deal
 * @param {string} searchText - Text to search for
 * @returns {Array} Context items containing the search text
 */
export function searchDealContext(dealId, searchText) {
    const context = getDealContext(dealId);
    const searchLower = searchText.toLowerCase();
    
    return context.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchLower)) ||
        (item.summary && item.summary.toLowerCase().includes(searchLower)) ||
        (item.content && item.content.toLowerCase().includes(searchLower))
    );
}

/**
 * Get a specific context item by ID
 * @param {string} dealId - The ID of the deal
 * @param {string} contextId - The ID of the context item
 * @returns {Object|null} The context item or null if not found
 */
export function getContextItemById(dealId, contextId) {
    const context = getDealContext(dealId);
    return context.find(item => item.id === contextId) || null;
}

/**
 * Get all context items sorted by date (newest first)
 * @param {string} dealId - The ID of the deal
 * @returns {Array} Sorted array of context items
 */
export function getTimelineSortedContext(dealId) {
    const context = getDealContext(dealId);
    return [...context].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Format a context item for display in the chat
 * @param {Object} contextItem - The context item to format
 * @returns {string} Formatted context text
 */
export function formatContextForChat(contextItem) {
    let formattedContext = `**${contextItem.title}** (${contextItem.date})\n`;
    formattedContext += `Type: ${contextItem.type}\n`;
    
    if (contextItem.summary) {
        formattedContext += `\n${contextItem.summary}\n`;
    }
    
    if (contextItem.people && contextItem.people.length > 0) {
        formattedContext += `\nPeople: ${contextItem.people.join(', ')}\n`;
    }
    
    if (contextItem.content) {
        formattedContext += `\n\`\`\`\n${contextItem.content.trim()}\n\`\`\`\n`;
    }
    
    return formattedContext;
}

/**
 * Generate a summary of all context for a deal
 * @param {string} dealId - The ID of the deal
 * @returns {string} Summary text of the deal context
 */
export function generateDealContextSummary(dealId) {
    const deal = DealData.getDeal(dealId);
    if (!deal) return 'No deal found';
    
    const context = getDealContext(dealId);
    if (!context || context.length === 0) return 'No context available for this deal';
    
    const emails = context.filter(item => item.type === CONTEXT_TYPES.EMAIL).length;
    const calls = context.filter(item => item.type === CONTEXT_TYPES.CALL).length;
    const meetings = context.filter(item => item.type === CONTEXT_TYPES.MEETING).length;
    const documents = context.filter(item => item.type === CONTEXT_TYPES.DOCUMENT).length;
    const notes = context.filter(item => item.type === CONTEXT_TYPES.NOTE).length;
    
    const latestItems = [...context].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    
    let summary = `## ${deal.name} Context Summary\n\n`;
    summary += `**Deal Value**: ${deal.value}\n`;
    summary += `**Stage**: ${deal.stage}\n`;
    summary += `**Close Date**: ${deal.closeDate}\n\n`;
    
    summary += `**Context Items**: ${context.length} total items\n`;
    summary += `- ${emails} emails\n`;
    summary += `- ${calls} calls\n`;
    summary += `- ${meetings} meetings\n`;
    summary += `- ${documents} documents\n`;
    summary += `- ${notes} notes\n\n`;
    
    summary += `**Latest Activity**:\n`;
    latestItems.forEach(item => {
        summary += `- ${item.date}: ${item.title} (${item.type})\n`;
    });
    
    return summary;
}

/**
 * Get relevant context based on a message or query
 * @param {string} dealId - The ID of the deal
 * @param {string} message - The message to find relevant context for
 * @returns {Array} Array of relevant context items
 */
export function getRelevantContext(dealId, message) {
    // This is a simple implementation - in a real system, this would use 
    // more sophisticated semantic search or NLP techniques
    
    // Extract potential keywords from the message
    const keywords = message.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3); // Only keep words longer than 3 chars
    
    if (keywords.length === 0) {
        // No significant keywords, return recent items
        return getTimelineSortedContext(dealId).slice(0, 3);
    }
    
    // Score each context item based on keyword matches
    const context = getDealContext(dealId);
    const scoredContext = context.map(item => {
        let score = 0;
        const itemText = `${item.title} ${item.summary || ''} ${item.content || ''}`.toLowerCase();
        
        keywords.forEach(keyword => {
            const regex = new RegExp(keyword, 'g');
            const matches = (itemText.match(regex) || []).length;
            score += matches;
            
            // Boost score for title matches
            if (item.title.toLowerCase().includes(keyword)) {
                score += 3;
            }
        });
        
        return { item, score };
    });
    
    // Sort by score and return the top items
    return scoredContext
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(scoredItem => scoredItem.item);
}

// Export additional utility functions as needed 