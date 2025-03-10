/**
 * Deal Content UI Module
 * Handles UI interactions for the deal content pane
 */

import * as DealData from './dealData.js';

// Cache UI elements for performance
let dealContentPane;
let dealTabBtns;
let dealTabContents;
let addNoteBtn;
let uploadFileBtn;
let noDealElements;
let dealOverviewEl;
let dealSections = {};

// Initialize the deal content UI
export function init() {
    console.log('Initializing deal content UI');
    
    // Cache DOM elements
    dealContentPane = document.querySelector('.deal-content-pane');
    dealTabBtns = document.querySelectorAll('.deal-tab-btn');
    dealTabContents = document.querySelectorAll('.deal-tab-content');
    addNoteBtn = document.querySelector('.add-note-btn');
    uploadFileBtn = document.querySelector('.upload-file-btn');
    noDealElements = document.querySelectorAll('.no-deal-selected');
    dealOverviewEl = document.querySelector('.deal-overview');
    
    // Cache deal section elements
    dealSections = {
        companyName: document.querySelector('.company-name'),
        dealValue: document.querySelector('.deal-value'),
        dealStage: document.querySelector('.deal-stage'),
        dealStageIndicator: document.querySelector('.deal-stage-indicator'),
        closeDate: document.querySelector('.close-date'),
        contactsList: document.querySelector('.contacts-list'),
        notesList: document.querySelector('.deal-notes'),
        filesList: document.querySelector('.files-list'),
        timeline: document.querySelector('.timeline-items'),
        // Edit form elements
        editDealBtn: document.querySelector('.edit-deal-btn'),
        dealInfoView: document.querySelector('.deal-info-view'),
        dealInfoEdit: document.querySelector('.deal-info-edit'),
        editCompanyInput: document.querySelector('.edit-company'),
        editValueInput: document.querySelector('.edit-value'),
        editStageSelect: document.querySelector('.edit-stage'),
        editDateInput: document.querySelector('.edit-date'),
        saveDealBtn: document.querySelector('.save-btn'),
        cancelDealBtn: document.querySelector('.cancel-btn')
    };
    
    // Initialize tab navigation
    dealTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dealTab = this.getAttribute('data-dealtab');
            
            // Update active tab UI
            dealTabBtns.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update content visibility
            dealTabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const tabContent = document.querySelector(`.${dealTab}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // Add note button event listener
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', showAddNoteDialog);
    }
    
    // Upload file button event listener
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', handleFileUpload);
    }
    
    // Setup edit deal info functionality
    if (dealSections.editDealBtn) {
        dealSections.editDealBtn.addEventListener('click', showEditDealForm);
    }
    
    if (dealSections.saveDealBtn) {
        dealSections.saveDealBtn.addEventListener('click', saveDealChanges);
    }
    
    if (dealSections.cancelDealBtn) {
        dealSections.cancelDealBtn.addEventListener('click', cancelDealEdit);
    }
    
    // Listen for deal selection events from the main app
    document.addEventListener('dealSelected', handleDealSelected);
    
    // Listen for deal cleared events
    document.addEventListener('dealCleared', handleDealCleared);
    
    // Set up clear deal button
    const clearDealBtn = document.querySelector('.clear-deal-btn');
    if (clearDealBtn) {
        clearDealBtn.addEventListener('click', function() {
            DealData.clearCurrentDeal();
            document.dispatchEvent(new CustomEvent('dealCleared'));
        });
    }
}

/**
 * Handle when a deal is selected
 */
function handleDealSelected(event) {
    const dealId = event.detail.dealId;
    
    // Set as current deal in the data store
    const deal = DealData.setCurrentDeal(dealId);
    if (!deal) return;
    
    console.log('Deal Content: Deal selected:', dealId, deal.name);
    
    // Hide no deal selected elements
    noDealElements.forEach(el => el.classList.remove('active'));
    
    // Populate deal data in the UI
    populateDealData(deal);
    
    // Make sure the deal content is visible
    showDealContent();
}

/**
 * Show deal content by activating tabs and expanding if needed
 */
function showDealContent() {
    const widget = document.getElementById('deal-chat-widget');
    const dealContentPane = document.querySelector('.deal-content-pane');
    
    if (widget && dealContentPane) {
        // If not already in expanded-plus mode, try to expand
        if (!widget.classList.contains('widget-expanded-plus')) {
            // If widget is collapsed, expand it first
            if (widget.classList.contains('widget-collapsed')) {
                widget.classList.remove('widget-collapsed');
                widget.classList.add('widget-expanded');
                widget.style.height = '500px';
            }
            
            // Expand to show deal content
            widget.classList.remove('widget-expanded');
            widget.classList.add('widget-expanded-plus');
            widget.style.width = '700px';
            widget.style.height = '500px';
            
            // Show deal content pane
            dealContentPane.style.display = 'block';
            
            // Ensure chat pane is visible too
            const chatPane = widget.querySelector('.chat-pane');
            if (chatPane) chatPane.style.display = 'block';
        }
    }
}

// Handle when a deal is cleared
function handleDealCleared() {
    // Reset UI to no deal state
    noDealElements.forEach(el => el.classList.add('active'));
    
    // Clear all content areas
    dealSections.companyName.textContent = '-';
    dealSections.dealValue.textContent = '-';
    dealSections.dealStage.textContent = '-';
    dealSections.closeDate.textContent = '-';
    dealSections.contactsList.innerHTML = '<p class="no-contacts-message">No contacts added</p>';
    dealSections.notesList.innerHTML = '';
    const addNoteBtn = document.createElement('button');
    addNoteBtn.className = 'add-note-btn';
    addNoteBtn.textContent = '+ Add Note';
    addNoteBtn.addEventListener('click', showAddNoteDialog);
    dealSections.notesList.appendChild(addNoteBtn);
    dealSections.filesList.innerHTML = '<p class="no-files-message">No files uploaded</p>';
    dealSections.timeline.innerHTML = '<p class="no-history-message">No history available</p>';
}

/**
 * Populate deal data in the UI
 */
function populateDealData(deal) {
    console.log('Populating deal data:', deal.id, deal.name);
    
    // Format deal data for display
    const formattedDeal = DealData.formatDealData(deal);
    
    // Update basic deal info
    dealSections.companyName.textContent = formattedDeal.name;
    dealSections.dealValue.textContent = formattedDeal.value;
    dealSections.dealStage.textContent = formattedDeal.stage;
    dealSections.closeDate.textContent = formattedDeal.closeDate;
    
    // Update stage indicator
    updateStageIndicator(formattedDeal.stage);
    
    // Update contacts list
    renderContacts(formattedDeal.contacts);
    
    // Update notes
    renderNotes(formattedDeal.notes);
    
    // Update files
    renderFiles(formattedDeal.files);
    console.log('Rendered files:', formattedDeal.files.length);
    
    // Update history timeline
    renderTimeline(formattedDeal.history);
    console.log('Rendered timeline items:', formattedDeal.history.length);
    
    // Also update the form fields for editing
    if (dealSections.editCompanyInput) {
        dealSections.editCompanyInput.value = formattedDeal.name;
    }
    
    if (dealSections.editValueInput) {
        dealSections.editValueInput.value = formattedDeal.value;
    }
    
    if (dealSections.editStageSelect) {
        // Try to match the stage in the select options
        const options = Array.from(dealSections.editStageSelect.options);
        const matchingOption = options.find(option => 
            option.value.toLowerCase() === formattedDeal.stage.toLowerCase()
        );
        
        if (matchingOption) {
            dealSections.editStageSelect.value = matchingOption.value;
        } else {
            // If no match, try to add the current stage as an option
            const newOption = document.createElement('option');
            newOption.value = formattedDeal.stage;
            newOption.textContent = formattedDeal.stage;
            dealSections.editStageSelect.appendChild(newOption);
            dealSections.editStageSelect.value = formattedDeal.stage;
        }
    }
    
    if (dealSections.editDateInput) {
        // Try to convert the date format if needed
        try {
            const dateParts = formattedDeal.closeDate.split('-');
            if (dateParts.length === 3) {
                // Assuming the format is already YYYY-MM-DD
                dealSections.editDateInput.value = formattedDeal.closeDate;
            } else {
                // Try to convert from other formats
                const date = new Date(formattedDeal.closeDate);
                if (!isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    dealSections.editDateInput.value = `${year}-${month}-${day}`;
                }
            }
        } catch (e) {
            console.error("Error formatting date:", e);
            dealSections.editDateInput.value = "";
        }
    }
}

// Update the stage indicator color based on the stage
function updateStageIndicator(stage) {
    if (!dealSections.dealStageIndicator) return;
    
    // Remove all existing stage classes
    dealSections.dealStageIndicator.className = 'deal-stage-indicator';
    
    // Add the appropriate class based on stage
    const stageKey = stage.toLowerCase().replace(' ', '-');
    if (stageKey === 'discovery') {
        dealSections.dealStageIndicator.classList.add('discovery');
    } else if (stageKey === 'qualification') {
        dealSections.dealStageIndicator.classList.add('qualification');
    } else if (stageKey === 'proposal') {
        dealSections.dealStageIndicator.classList.add('proposal');
    } else if (stageKey === 'negotiation') {
        dealSections.dealStageIndicator.classList.add('negotiation');
    } else if (stageKey === 'closed-won') {
        dealSections.dealStageIndicator.classList.add('closed-won');
    } else if (stageKey === 'closed-lost') {
        dealSections.dealStageIndicator.classList.add('closed-lost');
    }
}

// Show the edit deal form
function showEditDealForm() {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    // Hide view mode and show edit mode
    dealSections.dealInfoView.classList.add('hidden');
    dealSections.dealInfoEdit.classList.add('active');
}

// Save deal changes
function saveDealChanges() {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    // Get values from form
    const updates = {
        name: dealSections.editCompanyInput.value.trim(),
        value: dealSections.editValueInput.value.trim(),
        stage: dealSections.editStageSelect.value,
        closeDate: dealSections.editDateInput.value
    };
    
    // Validate
    if (!updates.name || !updates.value) {
        alert("Company name and value are required");
        return;
    }
    
    // Update deal info
    if (DealData.updateDealInfo(currentDeal.id, updates)) {
        // Also update stage if it changed
        if (updates.stage !== currentDeal.stage) {
            DealData.updateDealStage(currentDeal.id, updates.stage);
        }
        
        // Refresh UI with the updated deal
        populateDealData(DealData.getCurrentDeal());
        
        // Hide edit form
        cancelDealEdit();
    }
}

// Cancel deal edit
function cancelDealEdit() {
    // Hide edit mode and show view mode
    dealSections.dealInfoView.classList.remove('hidden');
    dealSections.dealInfoEdit.classList.remove('active');
}

// Render contacts list
function renderContacts(contacts) {
    dealSections.contactsList.innerHTML = '';
    
    if (contacts.length === 0) {
        const noContactsMsg = document.createElement('p');
        noContactsMsg.className = 'no-contacts-message';
        noContactsMsg.textContent = 'No contacts added';
        dealSections.contactsList.appendChild(noContactsMsg);
        return;
    }
    
    contacts.forEach(contact => {
        const contactEl = createContactElement(contact);
        dealSections.contactsList.appendChild(contactEl);
    });
    
    // Add "Add Contact" button
    const addContactBtn = document.createElement('button');
    addContactBtn.className = 'add-contact-btn';
    addContactBtn.textContent = '+ Add Contact';
    addContactBtn.addEventListener('click', showAddContactDialog);
    dealSections.contactsList.appendChild(addContactBtn);
}

// Create contact element
function createContactElement(contact) {
    const contactEl = document.createElement('div');
    contactEl.className = 'contact-item';
    contactEl.dataset.id = contact.id;
    
    contactEl.innerHTML = `
        <div class="contact-avatar">${contact.name.charAt(0)}</div>
        <div class="contact-details">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-title">${contact.title}</div>
            <div class="contact-email">${contact.email}</div>
        </div>
        <button class="contact-action email-btn" title="Email Contact">✉</button>
        <button class="contact-action remove-btn" title="Remove Contact">×</button>
    `;
    
    // Add event listeners
    const removeBtn = contactEl.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeContact(contact.id);
    });
    
    const emailBtn = contactEl.querySelector('.email-btn');
    emailBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // In a real app, this would open an email composer
        alert(`Composing email to ${contact.email}`);
    });
    
    return contactEl;
}

// Remove a contact
function removeContact(contactId) {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    if (confirm('Are you sure you want to remove this contact?')) {
        if (DealData.removeContact(currentDeal.id, contactId)) {
            // Refresh contacts display
            renderContacts(DealData.getCurrentDeal().contacts);
        }
    }
}

// Render notes
function renderNotes(notes) {
    dealSections.notesList.innerHTML = '';
    
    if (notes.length === 0) {
        const noNotesMsg = document.createElement('p');
        noNotesMsg.className = 'no-notes-message';
        noNotesMsg.textContent = 'No notes added';
        dealSections.notesList.appendChild(noNotesMsg);
    } else {
        notes.forEach(note => {
            const noteEl = createNoteElement(note);
            dealSections.notesList.appendChild(noteEl);
        });
    }
    
    // Add "Add Note" button
    const addNoteBtn = document.createElement('button');
    addNoteBtn.className = 'add-note-btn';
    addNoteBtn.textContent = '+ Add Note';
    addNoteBtn.addEventListener('click', showAddNoteDialog);
    dealSections.notesList.appendChild(addNoteBtn);
}

// Create note element
function createNoteElement(note) {
    const noteEl = document.createElement('div');
    noteEl.className = 'note-item';
    noteEl.dataset.id = note.id;
    
    noteEl.innerHTML = `
        <div class="note-text">${note.text}</div>
        <div class="note-meta">
            <div class="note-date">${note.date}</div>
            <button class="note-remove-btn" title="Remove Note">×</button>
        </div>
    `;
    
    // Add event listener for remove button
    const removeBtn = noteEl.querySelector('.note-remove-btn');
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeNote(note.id);
    });
    
    return noteEl;
}

// Remove a note
function removeNote(noteId) {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    if (confirm('Are you sure you want to remove this note?')) {
        if (DealData.removeNote(currentDeal.id, noteId)) {
            // Refresh notes display
            renderNotes(DealData.formatDealData(DealData.getCurrentDeal()).notes);
        }
    }
}

/**
 * Render files
 */
function renderFiles(files) {
    if (!dealSections.filesList) {
        console.error("Files list element not found");
        return;
    }
    
    console.log("Rendering files:", files.length);
    
    dealSections.filesList.innerHTML = '';
    
    if (files.length === 0) {
        const noFilesMsg = document.createElement('p');
        noFilesMsg.className = 'no-files-message';
        noFilesMsg.textContent = 'No files uploaded';
        dealSections.filesList.appendChild(noFilesMsg);
        return;
    }
    
    files.forEach(file => {
        const fileEl = createFileElement(file);
        dealSections.filesList.appendChild(fileEl);
    });
}

// Create file element
function createFileElement(file) {
    const fileEl = document.createElement('div');
    fileEl.className = 'file-item';
    fileEl.dataset.id = file.id;
    
    // Determine icon based on file type
    let icon = '📄';
    if (file.type === 'pdf' || file.name.endsWith('.pdf')) icon = '📕';
    if (file.type === 'docx' || file.name.endsWith('.docx')) icon = '📘';
    if (file.type === 'xlsx' || file.name.endsWith('.xlsx')) icon = '📗';
    if (file.type === 'pptx' || file.name.endsWith('.pptx')) icon = '📙';
    
    fileEl.innerHTML = `
        <div class="file-icon">${icon}</div>
        <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-info">${file.date} · ${file.size}</div>
        </div>
        <button class="file-action download-btn" title="Download File">↓</button>
        <button class="file-action remove-btn" title="Remove File">×</button>
    `;
    
    // Add event listeners
    const downloadBtn = fileEl.querySelector('.download-btn');
    downloadBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // In a real app, this would trigger a download
        alert(`Downloading ${file.name}`);
    });
    
    const removeBtn = fileEl.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeFile(file.id);
    });
    
    return fileEl;
}

// Remove a file
function removeFile(fileId) {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    if (confirm('Are you sure you want to remove this file?')) {
        if (DealData.removeFile(currentDeal.id, fileId)) {
            // Refresh files display
            renderFiles(DealData.formatDealData(DealData.getCurrentDeal()).files);
        }
    }
}

/**
 * Render timeline
 */
function renderTimeline(historyItems) {
    if (!dealSections.timeline) {
        console.error("Timeline element not found");
        return;
    }
    
    console.log("Rendering timeline:", historyItems.length);
    
    dealSections.timeline.innerHTML = '';
    
    if (historyItems.length === 0) {
        const noHistoryMsg = document.createElement('p');
        noHistoryMsg.className = 'no-history-message';
        noHistoryMsg.textContent = 'No history available';
        dealSections.timeline.appendChild(noHistoryMsg);
        return;
    }
    
    historyItems.forEach(item => {
        const itemEl = createTimelineElement(item);
        dealSections.timeline.appendChild(itemEl);
    });
}

// Create timeline element
function createTimelineElement(item) {
    const timelineEl = document.createElement('div');
    timelineEl.className = 'timeline-item';
    timelineEl.dataset.id = item.id;
    
    timelineEl.innerHTML = `
        <div class="timeline-point"></div>
        <div class="timeline-content">
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-description">${item.description}</div>
        </div>
    `;
    
    return timelineEl;
}

// Show dialog to add a note
function showAddNoteDialog() {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    const noteText = prompt('Enter note text:');
    if (noteText && noteText.trim() !== '') {
        const newNote = DealData.addNote(currentDeal.id, noteText.trim());
        if (newNote) {
            // Refresh notes display
            renderNotes(DealData.formatDealData(DealData.getCurrentDeal()).notes);
        }
    }
}

// Show dialog to add a contact
function showAddContactDialog() {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    const name = prompt('Contact name:');
    if (!name || name.trim() === '') return;
    
    const title = prompt('Contact title:');
    if (!title || title.trim() === '') return;
    
    const email = prompt('Contact email:');
    if (!email || email.trim() === '') return;
    
    const newContact = DealData.addContact(currentDeal.id, name.trim(), title.trim(), email.trim());
    if (newContact) {
        // Refresh contacts display
        renderContacts(DealData.getCurrentDeal().contacts);
    }
}

// Handle file upload
function handleFileUpload() {
    const currentDeal = DealData.getCurrentDeal();
    if (!currentDeal) return;
    
    // Create a temporary input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.docx,.txt,.xlsx,.pptx';
    
    // Trigger click to open file dialog
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            console.log('Files selected:', this.files.length);
            
            // Process each file
            Array.from(this.files).forEach(file => {
                // Extract file extension
                const fileName = file.name;
                const fileType = fileName.split('.').pop().toLowerCase();
                
                // Format file size
                let fileSize;
                if (file.size < 1024) {
                    fileSize = `${file.size} B`;
                } else if (file.size < 1024 * 1024) {
                    fileSize = `${Math.round(file.size / 1024)} KB`;
                } else {
                    fileSize = `${Math.round(file.size / (1024 * 1024) * 10) / 10} MB`;
                }
                
                // Add file to deal
                DealData.addFile(currentDeal.id, fileName, fileType, fileSize);
            });
            
            // Refresh files display
            renderFiles(DealData.formatDealData(DealData.getCurrentDeal()).files);
        }
    });
}

// Function to render deal overview content with performance optimizations
function renderDealOverview(deal) {
    if (!deal) return '';
    
    try {
        // Basic deal summary - lightweight rendering
        let html = `
            <div class="deal-overview-container">
                <div class="overview-section">
                    <h3>Deal Summary</h3>
                    <div class="deal-summary">
                        <div class="deal-summary-item">
                            <div class="label">Deal Value:</div>
                            <div class="value">${deal.value || 'N/A'}</div>
                        </div>
                        <div class="deal-summary-item">
                            <div class="label">Stage:</div>
                            <div class="value">${deal.stage || 'N/A'}</div>
                        </div>
                        <div class="deal-summary-item">
                            <div class="label">Close Date:</div>
                            <div class="value">${deal.closeDate || 'N/A'}</div>
                        </div>
                        <div class="deal-summary-item">
                            <div class="label">Industry:</div>
                            <div class="value">${deal.industry || 'N/A'}</div>
                        </div>
                    </div>
                </div>`;

        // Company information - with safe checks
        if (deal.company) {
            html += `
                <div class="overview-section">
                    <h3>Company Information</h3>
                    <div class="company-info">
                        <div class="info-grid">`;
                        
            // Safely add company properties
            const companyProps = [
                { label: 'Company Size', value: deal.company.size },
                { label: 'Annual Revenue', value: deal.company.revenue },
                { label: 'Location', value: deal.company.location },
                { label: 'Founded', value: deal.company.founded },
                { label: 'Website', value: deal.company.website },
                { label: 'Segment', value: deal.company.segment }
            ];
            
            companyProps.forEach(prop => {
                html += `
                    <div class="info-item">
                        <div class="label">${prop.label}:</div>
                        <div class="value">${prop.value || 'N/A'}</div>
                    </div>`;
            });
            
            html += `</div>`;
            
            // Description if available
            if (deal.company.description) {
                html += `
                    <div class="description-item">
                        <div class="label">Description:</div>
                        <div class="value">${deal.company.description}</div>
                    </div>`;
            }
            
            html += `</div></div>`;
        }
        
        // Add remaining sections with performance limits (max items)
        
        // Contacts section - limit to 10 contacts to prevent freezing on large datasets
        const maxContacts = 10;
        html += `
            <div class="overview-section">
                <h3>Key Contacts ${deal.contacts.length > maxContacts ? `(showing ${maxContacts} of ${deal.contacts.length})` : ''}</h3>
                <div class="contacts-info">`;
                
        // Get a limited subset of contacts
        const displayContacts = deal.contacts.slice(0, maxContacts);
        
        displayContacts.forEach(contact => {
            html += `
                <div class="contact-card">
                    <div class="contact-header">
                        <h4>${contact.name || 'No Name'}</h4>
                        <div class="contact-title">${contact.title || 'No Title'}</div>
                    </div>
                    <div class="contact-details">
                        <div class="contact-detail">
                            <span class="icon">📧</span>
                            <span>${contact.email || 'No Email'}</span>
                        </div>`;
                        
            if (contact.phone) {
                html += `
                    <div class="contact-detail">
                        <span class="icon">📱</span>
                        <span>${contact.phone}</span>
                    </div>`;
            }
            
            if (contact.role) {
                html += `
                    <div class="contact-detail">
                        <span class="icon">👤</span>
                        <span>Role: ${contact.role}</span>
                    </div>`;
            }
            
            if (contact.influence) {
                html += `
                    <div class="contact-detail">
                        <span class="icon">⚖️</span>
                        <span>Influence: ${contact.influence}</span>
                    </div>`;
            }
            
            html += `</div>`;
            
            if (contact.notes) {
                html += `
                    <div class="contact-notes">
                        <div class="notes-label">Notes:</div>
                        <div class="notes-text">${contact.notes}</div>
                    </div>`;
            }
            
            html += `</div>`;
        });
        
        html += `</div></div>`;
        
        // Close the main container
        html += `</div>`;
        
        return html;
    } catch (error) {
        console.error('Error rendering deal overview:', error);
        return '<div class="error-message">Error loading deal overview. Please try again.</div>';
    }
}

// Function to render deal files content
function renderDealFiles(deal) {
    if (!deal || !deal.files || deal.files.length === 0) {
        return '<div class="no-files-message">No files available for this deal.</div>';
    }
    
    return `
        <div class="files-container">
            <div class="files-list">
                ${deal.files.map(file => `
                <div class="file-item">
                    <div class="file-icon">${getFileIcon(file.type)}</div>
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-meta">
                            <span class="file-date">${file.date}</span> • 
                            <span class="file-size">${file.size}</span>
                            ${file.author ? ` • <span class="file-author">Added by ${file.author}</span>` : ''}
                        </div>
                        ${file.description ? `<div class="file-description">${file.description}</div>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Helper function to get file icon based on type
function getFileIcon(type) {
    const icons = {
        'pdf': '📄',
        'docx': '📝',
        'xlsx': '📊',
        'pptx': '📑',
        'txt': '📃',
        'csv': '📋',
        'zip': '🗜️',
        'jpg': '🖼️',
        'png': '🖼️'
    };
    
    return icons[type] || '📄';
}

// Function to render deal notes content
function renderDealNotes(deal) {
    if (!deal || !deal.notes || deal.notes.length === 0) {
        return '<div class="no-notes-message">No notes available for this deal.</div>';
    }
    
    const sortedNotes = [...deal.notes].sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Sort by date descending (newest first)
    });
    
    return `
        <div class="notes-container">
            <div class="notes-list">
                ${sortedNotes.map(note => `
                <div class="note-item">
                    <div class="note-header">
                        <div class="note-date">${formatDateForDisplay(note.date)}</div>
                        ${note.author ? `<div class="note-author">by ${note.author}</div>` : ''}
                    </div>
                    <div class="note-content">${note.text}</div>
                </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Function to render deal history content
function renderDealHistory(deal) {
    if (!deal || !deal.history || deal.history.length === 0) {
        return '<div class="no-history-message">No history available for this deal.</div>';
    }
    
    const sortedHistory = [...deal.history].sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Sort by date descending (newest first)
    });
    
    return `
        <div class="history-container">
            <div class="timeline">
                ${sortedHistory.map(item => `
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${formatDateForDisplay(item.date)}</div>
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-description">${item.description}</div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Helper function to format dates for display
function formatDateForDisplay(dateString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}

// Function to render deal tabs content with error protection
function renderDealTabs(deal) {
    if (!deal) return '';
    
    try {
        // Inline rendering of tabs to avoid excessive function calls
        const tabsHTML = `
            <div class="deal-tabs">
                <div class="tab active" data-tab="overview">Overview</div>
                <div class="tab" data-tab="files">Files (${deal.files ? deal.files.length : 0})</div>
                <div class="tab" data-tab="notes">Notes (${deal.notes ? deal.notes.length : 0})</div>
                <div class="tab" data-tab="history">History (${deal.history ? deal.history.length : 0})</div>
            </div>
            <div class="tab-content">
                <div class="tab-pane active" id="overview">
                    <div class="loading-indicator">Loading overview...</div>
                </div>
                <div class="tab-pane" id="files">
                    <div class="loading-indicator">Select tab to load files</div>
                </div>
                <div class="tab-pane" id="notes">
                    <div class="loading-indicator">Select tab to load notes</div>
                </div>
                <div class="tab-pane" id="history">
                    <div class="loading-indicator">Select tab to load history</div>
                </div>
            </div>
        `;
        
        // Load the overview tab content after a brief delay to avoid freezing the UI
        setTimeout(() => {
            try {
                const overviewTab = document.getElementById('overview');
                if (overviewTab) {
                    overviewTab.innerHTML = renderDealOverview(deal);
                }
            } catch (error) {
                console.error('Error loading overview tab content:', error);
            }
        }, 100);
        
        return tabsHTML;
    } catch (error) {
        console.error('Error rendering deal tabs:', error);
        return '<div class="error-message">Error loading deal tabs. Please try again.</div>';
    }
}

// Function to initialize deal content tab listeners with error handling
function initDealTabListeners() {
    // Set up deal tab switching with deferred loading to avoid performance issues
    document.addEventListener('click', function(event) {
        try {
            if (event.target.classList.contains('deal-tab-btn')) {
                const tabName = event.target.getAttribute('data-dealtab');
                console.log('Deal tab clicked:', tabName);
                
                // Update active tab UI
                document.querySelectorAll('.deal-tab-btn').forEach(tab => {
                    tab.classList.remove('active');
                });
                event.target.classList.add('active');
                
                // Update content
                document.querySelectorAll('.deal-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const contentToShow = document.querySelector(`.${tabName}-tab`);
                if (contentToShow) {
                    contentToShow.classList.add('active');
                    
                    // Lazy load content when tab is clicked to improve performance
                    if (tabName !== 'overview' && dealStore && dealStore.currentDeal) {
                        const deal = dealStore.deals[dealStore.currentDeal];
                        if (deal) {
                            // Show loading indicator
                            contentToShow.innerHTML = '<div class="loading-indicator">Loading content...</div>';
                            
                            // Load content after a slight delay to avoid freezing the UI
                            setTimeout(() => {
                                try {
                                    switch (tabName) {
                                        case 'files':
                                            contentToShow.innerHTML = renderDealFiles(deal);
                                            break;
                                        case 'notes':
                                            contentToShow.innerHTML = renderDealNotes(deal);
                                            break;
                                        case 'history':
                                            contentToShow.innerHTML = renderDealHistory(deal);
                                            break;
                                    }
                                } catch (error) {
                                    console.error(`Error loading ${tabName} tab content:`, error);
                                    contentToShow.innerHTML = `<div class="error-message">Error loading ${tabName}. Please try again.</div>`;
                                }
                            }, 50);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in tab click handler:', error);
        }
    });
    
    console.log('Deal tab listeners initialized');
}

// Export the functions to window for global access
window.dealContent = {
    renderDealTabs,
    renderDealOverview,
    renderDealFiles,
    renderDealNotes,
    renderDealHistory,
    initDealTabListeners
}; 

// CRITICAL: Also expose critical functions directly on window
window.renderDealOverview = renderDealOverview;
window.renderDealFiles = renderDealFiles;
window.renderDealHistory = renderDealHistory;
window.renderDealNotes = renderDealNotes;
window.initDealTabListeners = initDealTabListeners;

console.log('dealContent.js: Functions successfully exposed to window object'); 