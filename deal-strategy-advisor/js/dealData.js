/**
 * Deal Data Manager Module
 * Manages deal information, notes, contacts, files, and history
 */

// In-memory storage for demo purposes (would be replaced with API calls)
const dealStore = {
    deals: {
        'deal-1': {
            id: 'deal-1',
            name: 'Acme Corp',
            value: '$50,000',
            stage: 'Proposal',
            closeDate: '2024-05-15',
            contacts: [
                { id: 'c1', name: 'John Smith', title: 'CTO', email: 'john@acmecorp.com' }
            ],
            notes: [
                { id: 'n1', text: 'Initial discovery call went well.', date: '2024-02-10' }
            ],
            files: [
                { id: 'f1', name: 'Requirements.pdf', type: 'pdf', date: '2024-02-12', size: '540 KB' }
            ],
            history: [
                { id: 'h1', title: 'Deal created', date: '2024-02-10', description: 'Deal added to pipeline' },
                { id: 'h2', title: 'Stage updated', date: '2024-02-15', description: 'Moved to Proposal stage' }
            ]
        },
        'deal-2': {
            id: 'deal-2',
            name: 'TechStar Inc',
            value: '$75,000',
            stage: 'Negotiation',
            closeDate: '2024-04-30',
            contacts: [
                { id: 'c2', name: 'Sarah Johnson', title: 'CEO', email: 'sarah@techstar.com' },
                { id: 'c3', name: 'Mike Peterson', title: 'CFO', email: 'mike@techstar.com' }
            ],
            notes: [
                { id: 'n2', text: 'Client requested additional product features.', date: '2024-03-05' },
                { id: 'n3', text: 'Scheduled demo for next week.', date: '2024-03-07' }
            ],
            files: [
                { id: 'f2', name: 'Proposal_V2.pdf', type: 'pdf', date: '2024-03-01', size: '1.2 MB' },
                { id: 'f3', name: 'Contract_Draft.docx', type: 'docx', date: '2024-03-10', size: '850 KB' }
            ],
            history: [
                { id: 'h3', title: 'Deal created', date: '2024-02-20', description: 'Deal added to pipeline' },
                { id: 'h4', title: 'Stage updated', date: '2024-02-28', description: 'Moved to Qualification stage' },
                { id: 'h5', title: 'File added', date: '2024-03-01', description: 'Proposal_V2.pdf was uploaded' },
                { id: 'h6', title: 'Stage updated', date: '2024-03-05', description: 'Moved to Negotiation stage' }
            ]
        },
        'deal-3': {
            id: 'deal-3',
            name: 'Global Systems',
            value: '$120,000',
            stage: 'Discovery',
            closeDate: '2024-06-30',
            contacts: [
                { id: 'c4', name: 'Jane Smith', title: 'CEO', email: 'jane@globalsystems.com' }
            ],
            notes: [
                { id: 'n4', text: 'Initial meeting scheduled for next week.', date: '2024-03-15' }
            ],
            files: [
                { id: 'f4', name: 'Meeting_Agenda.docx', type: 'docx', date: '2024-03-13', size: '320 KB' }
            ],
            history: [
                { id: 'h7', title: 'Deal created', date: '2024-03-01', description: 'John Doe created this deal' },
                { id: 'h8', title: 'Call scheduled', date: '2024-03-15', description: 'Meeting added to calendar' }
            ]
        }
    },
    currentDeal: null
};

// Get all deals
export function getAllDeals() {
    return Object.values(dealStore.deals);
}

// Get a specific deal by ID
export function getDeal(dealId) {
    return dealStore.deals[dealId];
}

// Set the current active deal
export function setCurrentDeal(dealId) {
    const deal = getDeal(dealId);
    if (deal) {
        dealStore.currentDeal = dealId;
        return deal;
    }
    return null;
}

// Get the current active deal
export function getCurrentDeal() {
    if (!dealStore.currentDeal) return null;
    return getDeal(dealStore.currentDeal);
}

// Clear the current deal
export function clearCurrentDeal() {
    dealStore.currentDeal = null;
}

// NOTES MANAGEMENT
// Add a note to a deal
export function addNote(dealId, text) {
    const deal = getDeal(dealId);
    if (!deal) return false;
    
    const newNote = {
        id: `n${Date.now()}`,
        text: text,
        date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
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