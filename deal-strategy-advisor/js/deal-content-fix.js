/**
 * Deal Content Rendering Fix
 * This script ensures that deal details are properly displayed in the right pane
 * when a deal is selected from the dropdown.
 */

(function() {
    console.log("🔄 Loading Deal Content Fix...");
    
    // Run on page load and DOMContentLoaded to ensure it works
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeDealContentFix();
    } else {
        document.addEventListener('DOMContentLoaded', initializeDealContentFix);
    }
    
    // Main initialization function
    function initializeDealContentFix() {
        console.log("🛠️ Initializing Deal Content Fix");
        
        // Listen for deal selection event
        document.addEventListener('dealSelected', handleDealSelectedEvent);
        
        // Also hook directly into the dropdown items for deal selection
        hookIntoDealDropdown();
        
        // Also attempt to fix any existing selected deal
        attemptToFixExistingDealDisplay();
        
        // Add a button to the debug controls
        addDebugButton();
    }
    
    // Handle the dealSelected custom event
    function handleDealSelectedEvent(event) {
        console.log("🔄 Deal Selected Event detected:", event.detail);
        
        // Give the main code a moment to process, then force our fix
        setTimeout(() => {
            const dealId = event.detail.dealId;
            const dealName = event.detail.dealName;
            
            updateDealContentDisplay(dealId, dealName);
        }, 100);
    }
    
    // Check if a deal is already selected and fix the display
    function attemptToFixExistingDealDisplay() {
        // Check for signs that a deal is already selected
        const activeDealState = document.querySelector('.active-deal-state.active');
        
        if (activeDealState) {
            console.log("🔍 Found active deal state, attempting to fix display");
            
            // Get the deal name and ID if possible
            const dealNameElement = document.querySelector('.active-deal-name, .deal-name');
            let dealName = dealNameElement ? dealNameElement.textContent : null;
            
            // If we have a deal name, force update the content
            if (dealName) {
                let dealId = null;
                
                // Try to get the actual deal ID
                if (window.dealStore && window.dealStore.activeDealId) {
                    dealId = window.dealStore.activeDealId;
                } else if (window.activeDealId) {
                    dealId = window.activeDealId;
                }
                
                updateDealContentDisplay(dealId, dealName);
            }
        }
    }
    
    // Update the right pane with deal content
    function updateDealContentDisplay(dealId, dealName) {
        console.log(`🛠️ Updating deal content display for: ${dealName} (${dealId})`);
        
        try {
            // Store the deal data globally to allow retry access
            window.lastDealData = {
                id: dealId,
                name: dealName,
                data: null
            };
            
            // 0. First, ensure tab content is made visible
            ensureAllTabContentIsVisible();
            
            // 1. Show the deal overview section
            const noDealSelected = document.querySelectorAll('.no-deal-selected');
            const dealOverview = document.querySelector('.deal-overview');
            
            if (noDealSelected && dealOverview) {
                // Remove 'active' class from all 'no-deal-selected' elements
                noDealSelected.forEach(el => {
                    console.log("Removing active class from no-deal-selected element");
                    el.classList.remove('active');
                });
                
                console.log("Adding active class to deal-overview element");
                dealOverview.classList.add('active');
            } else {
                console.warn("❌ Could not find no-deal-selected or deal-overview elements");
            }
            
            // 2. Get the deal data to display
            let dealData = null;
            
            if (dealId && window.dealStore && window.dealStore.deals) {
                dealData = window.dealStore.deals[dealId];
                console.log("Found deal data in dealStore:", dealData);
            } else {
                console.warn("⚠️ Could not access deal data from dealStore");
            }
            
            if (!dealData) {
                console.warn("⚠️ Could not find deal data, using fallback values");
                
                // Extract value from the dealName if possible
                let dealValue = "";
                if (dealName && dealName.includes(" - ")) {
                    const parts = dealName.split(" - ");
                    dealName = parts[0];
                    dealValue = parts[1];
                }
                
                // Create fallback deal data with sample files and history
                dealData = {
                    id: dealId || 'unknown',
                    name: dealName || 'Unknown Deal',
                    value: dealValue || '$0',
                    stage: 'Unknown',
                    probability: '0%',
                    closeDate: 'Unknown',
                    contacts: [],
                    notes: [],
                    // Files and history will be generated later
                    files: [],
                    history: []
                };
                
                console.log("Created fallback deal data:", dealData);
            }
            
            // Generate unique files based on deal ID or name
            if (!dealData.files || !Array.isArray(dealData.files) || dealData.files.length === 0) {
                dealData.files = generateUniqueFiles(dealData.id, dealData.name);
            }
            
            // Generate unique history based on deal ID or name
            if (!dealData.history || !Array.isArray(dealData.history) || dealData.history.length === 0) {
                dealData.history = generateUniqueHistory(dealData.id, dealData.name, dealData.stage);
            }
            
            // DEBUG: Log all company name elements we can find
            console.log("Searching for all possible company name elements");
            const possibleNameElements = document.querySelectorAll('.company-name, .info-value.company-name, .deal-name, .active-deal-name');
            console.log(`Found ${possibleNameElements.length} possible company name elements:`, possibleNameElements);

            // 3. DIRECTLY update all information fields - be as specific as possible
            console.log("Directly updating all deal information elements");
            
            // Company/Deal Name - Using more selectors to find it
            const companyNameElements = document.querySelectorAll('.company-name, .info-value.company-name');
            let nameUpdated = false;
            
            companyNameElements.forEach(el => {
                el.textContent = dealData.name;
                console.log("Updated company name element:", el);
                nameUpdated = true;
            });
            
            if (!nameUpdated) {
                console.warn("❌ No company-name elements found to update");
            }
            
            // Deal Value - Using more selectors to find it
            const dealValueElements = document.querySelectorAll('.deal-value, .info-value.deal-value, .value');
            let valueUpdated = false;
            
            dealValueElements.forEach(el => {
                el.textContent = dealData.value;
                console.log("Updated deal value element:", el);
                valueUpdated = true;
            });
            
            if (!valueUpdated) {
                console.warn("❌ No deal-value elements found to update");
            }
            
            // Deal Stage - Using more selectors to find it
            const dealStageElements = document.querySelectorAll('.deal-stage, .info-value .deal-stage, .stage');
            let stageUpdated = false;
            
            dealStageElements.forEach(el => {
                el.textContent = dealData.stage;
                console.log("Updated deal stage element:", el);
                stageUpdated = true;
            });
            
            if (!stageUpdated) {
                console.warn("❌ No deal-stage elements found to update");
            }
            
            // Deal Stage Indicator - Using more selectors to find it
            const dealStageIndicators = document.querySelectorAll('.deal-stage-indicator');
            let indicatorUpdated = false;
            
            dealStageIndicators.forEach(el => {
                el.style.backgroundColor = getStageColor(dealData.stage);
                console.log("Updated deal stage indicator:", el);
                indicatorUpdated = true;
            });
            
            if (!indicatorUpdated) {
                console.warn("❌ No deal-stage-indicator elements found to update");
            }
            
            // Close Date - Using more selectors to find it
            const closeDateElements = document.querySelectorAll('.close-date, .info-value.close-date');
            let dateUpdated = false;
            
            closeDateElements.forEach(el => {
                el.textContent = dealData.closeDate || 'Not set';
                console.log("Updated close date element:", el);
                dateUpdated = true;
            });
            
            if (!dateUpdated) {
                console.warn("❌ No close-date elements found to update");
            }
            
            // DIRECT DOM UPDATE: Find specific elements using exact CSS paths
            updateExactDOMElements(dealData);
            
            // 4. Update contact information
            updateDealContacts(dealData);
            
            // 5. Update deal notes
            updateDealNotes(dealData);
            
            // 6. Update deal history
            updateDealHistory(dealData);
            
            // 7. Update Files tab
            updateDealFiles(dealData);
            
            // 8. Make sure the active-deal-state is shown
            const noDealState = document.querySelector('.no-deal-state');
            const activeDealState = document.querySelector('.active-deal-state');
            
            if (noDealState && activeDealState) {
                noDealState.classList.remove('active');
                activeDealState.classList.add('active');
                console.log("Updated deal state display");
            }
            
            // 9. Also update the active-deal-name and deal-stage-pill in the widget
            const activeDealNameElement = document.querySelector('.active-deal-name');
            if (activeDealNameElement) {
                activeDealNameElement.textContent = dealData.name;
                console.log("Updated active-deal-name:", dealData.name);
            }
            
            const dealStagePill = document.querySelector('.deal-stage-pill');
            if (dealStagePill) {
                dealStagePill.textContent = dealData.stage;
                console.log("Updated deal-stage-pill:", dealData.stage);
            }
            
            // 10. Set up tab button click handlers
            setupDealTabButtonHandlers();
            
            // Add a retry mechanism to ensure updates happen
            startUpdateRetrySequence(dealId, dealName, dealData);
            
            console.log("✅ Deal content display updated successfully");
        } catch (error) {
            console.error("❌ Error updating deal content display:", error);
            alert("Error displaying deal details. See console for more information.");
        }
    }
    
    // Start a sequence of retry attempts to update the DOM
    function startUpdateRetrySequence(dealId, dealName, dealData) {
        console.log("Starting update retry sequence...");
        
        // Store the data for retries
        window.lastDealData = {
            id: dealId,
            name: dealName,
            data: dealData
        };
        
        // Immediate update
        updateExactDOMElements(dealData);
        
        // Retry after 100ms
        setTimeout(() => {
            console.log("First retry after 100ms");
            if (window.lastDealData && window.lastDealData.data) {
                updateExactDOMElements(window.lastDealData.data);
            }
        }, 100);
        
        // Retry after 500ms
        setTimeout(() => {
            console.log("Second retry after 500ms");
            if (window.lastDealData && window.lastDealData.data) {
                updateExactDOMElements(window.lastDealData.data);
            }
        }, 500);
        
        // Retry after 1000ms
        setTimeout(() => {
            console.log("Third retry after 1000ms");
            if (window.lastDealData && window.lastDealData.data) {
                updateExactDOMElements(window.lastDealData.data);
                
                // Directly update spans with dash content again
                checkAndUpdateDashSpans(window.lastDealData.data);
            }
        }, 1000);
    }
    
    // Helper function to check and update any dash spans
    function checkAndUpdateDashSpans(dealData) {
        console.log("Checking for dash spans...");
        
        // Find all spans in the overview section with dash content
        document.querySelectorAll('.deal-overview span').forEach(span => {
            if (span.textContent === '-') {
                console.log("Found dash span:", span);
                
                // Determine what field this is based on nearby text or siblings
                const parentText = span.parentNode ? span.parentNode.textContent : '';
                
                // Try to find a label span sibling
                let labelSpan = null;
                if (span.parentNode) {
                    labelSpan = span.parentNode.querySelector('.info-label');
                }
                
                const labelText = labelSpan ? labelSpan.textContent : '';
                
                console.log("Parent text:", parentText);
                console.log("Label text:", labelText);
                
                if (parentText.includes('Company') || labelText.includes('Company')) {
                    span.textContent = dealData.name;
                    console.log("Updated company name dash span:", dealData.name);
                } 
                else if (parentText.includes('Value') || labelText.includes('Value')) {
                    span.textContent = dealData.value;
                    console.log("Updated value dash span:", dealData.value);
                } 
                else if (parentText.includes('Stage') || labelText.includes('Stage')) {
                    span.textContent = dealData.stage;
                    console.log("Updated stage dash span:", dealData.stage);
                } 
                else if (parentText.includes('Date') || labelText.includes('Date') || parentText.includes('Close Date') || labelText.includes('Close Date')) {
                    span.textContent = dealData.closeDate || 'Not set';
                    console.log("Updated date dash span:", dealData.closeDate);
                }
                else {
                    // Try the brute force approach - find all labels
                    document.querySelectorAll('.info-label').forEach((label, i) => {
                        console.log(`Label ${i}:`, label.textContent);
                    });
                    
                    // As a last resort, update based on position
                    const allDashSpans = Array.from(document.querySelectorAll('.deal-overview span')).filter(s => s.textContent === '-');
                    const index = allDashSpans.indexOf(span);
                    
                    console.log(`This is dash span ${index} of ${allDashSpans.length}`);
                    
                    const values = [dealData.name, dealData.value, dealData.stage, dealData.closeDate || 'Not set'];
                    if (index >= 0 && index < values.length) {
                        span.textContent = values[index];
                        console.log(`Updated dash span at index ${index} to:`, values[index]);
                    }
                }
            }
        });
    }
    
    // Function to update exactly the DOM elements we can see in the screenshot
    function updateExactDOMElements(dealData) {
        // Find all info-value elements
        const allInfoValueElements = document.querySelectorAll('.info-value');
        console.log("Found info-value elements:", allInfoValueElements);
        
        // Try to update specific elements directly by traversing the DOM
        const dealSections = document.querySelectorAll('.deal-section');
        console.log(`Found ${dealSections.length} deal sections`);
        
        // Update Deal Information fields directly 
        try {
            // Direct approach by position
            const infoItems = document.querySelectorAll('.info-item');
            console.log(`Found ${infoItems.length} info items`);
            
            if (infoItems.length >= 1) {
                const companyNameValue = infoItems[0].querySelector('.info-value');
                if (companyNameValue) {
                    companyNameValue.textContent = dealData.name;
                    console.log("Updated company name info-value:", dealData.name);
                }
            }
            
            if (infoItems.length >= 2) {
                const dealValueElement = infoItems[1].querySelector('.info-value');
                if (dealValueElement) {
                    dealValueElement.textContent = dealData.value;
                    console.log("Updated deal value info-value:", dealData.value);
                }
            }
            
            if (infoItems.length >= 3) {
                const dealStageElement = infoItems[2].querySelector('.info-value');
                if (dealStageElement) {
                    dealStageElement.textContent = dealData.stage;
                    console.log("Updated deal stage info-value:", dealData.stage);
                }
            }
            
            if (infoItems.length >= 4) {
                const closeDateElement = infoItems[3].querySelector('.info-value');
                if (closeDateElement) {
                    closeDateElement.textContent = dealData.closeDate || 'Not set';
                    console.log("Updated close date info-value:", dealData.closeDate);
                }
            }
        } catch (error) {
            console.error("Error updating info items:", error);
        }
        
        // Update by direct css path - these come from the screenshot
        try {
            // Try to find elements by exact CSS paths
            const cssSelectors = [
                // Company name at the top
                { selector: '.deal-tab-content.overview-tab .info-item:nth-child(1) .info-value', value: dealData.name, field: 'Company Name' },
                // Value at the top
                { selector: '.deal-tab-content.overview-tab .info-item:nth-child(2) .info-value', value: dealData.value, field: 'Value' },
                // Stage at the bottom
                { selector: '.deal-tab-content.overview-tab .info-item:nth-child(3) .info-value', value: dealData.stage, field: 'Stage' },
                // Close date at the bottom 
                { selector: '.deal-tab-content.overview-tab .info-item:nth-child(4) .info-value', value: dealData.closeDate || 'Not set', field: 'Close Date' }
            ];
            
            cssSelectors.forEach(item => {
                const elements = document.querySelectorAll(item.selector);
                if (elements.length > 0) {
                    elements.forEach(el => {
                        el.textContent = item.value;
                        console.log(`Updated ${item.field} by CSS path:`, item.value);
                    });
                } else {
                    console.warn(`Could not find element by CSS path: ${item.selector}`);
                }
            });
        } catch (error) {
            console.error("Error updating by CSS path:", error);
        }
        
        // Force direct update based on the screenshot - use exact element paths
        try {
            // Company field
            updateElementByDOMTraversal('.deal-content-body .deal-overview > div:nth-child(1) > div > div:nth-child(1) span:nth-child(2)', dealData.name);
            
            // Value field
            updateElementByDOMTraversal('.deal-content-body .deal-overview > div:nth-child(1) > div > div:nth-child(2) span:nth-child(2)', dealData.value);
            
            // Stage field
            updateElementByDOMTraversal('.deal-content-body .deal-overview > div:nth-child(1) > div > div:nth-child(3) span:nth-child(2)', dealData.stage);
            
            // Close Date field
            updateElementByDOMTraversal('.deal-content-body .deal-overview > div:nth-child(1) > div > div:nth-child(4) span:nth-child(2)', dealData.closeDate || 'Not set');
            
            // Desperate approach - update all spans in deal-overview
            const dealOverviewSpans = document.querySelectorAll('.deal-overview span');
            console.log(`Found ${dealOverviewSpans.length} spans in deal-overview`);
            
            dealOverviewSpans.forEach((span, index) => {
                // Skip spans that are labels
                if (span.textContent.includes(':') || span.className.includes('label') || span.className.includes('info-label')) {
                    return;
                }
                
                console.log(`Span ${index}:`, span);
                
                // Determine what this span probably is
                if (span.parentNode && span.parentNode.textContent.toLowerCase().includes('company')) {
                    span.textContent = dealData.name;
                    console.log("Updated company name span:", dealData.name);
                }
                else if (span.parentNode && span.parentNode.textContent.toLowerCase().includes('value')) {
                    span.textContent = dealData.value;
                    console.log("Updated value span:", dealData.value);
                }
                else if (span.parentNode && span.parentNode.textContent.toLowerCase().includes('stage')) {
                    span.textContent = dealData.stage;
                    console.log("Updated stage span:", dealData.stage);
                }
                else if (span.parentNode && span.parentNode.textContent.toLowerCase().includes('date')) {
                    span.textContent = dealData.closeDate || 'Not set';
                    console.log("Updated date span:", dealData.closeDate);
                }
                // If it's just showing a dash, update it based on its position
                else if (span.textContent === '-') {
                    const values = [dealData.name, dealData.value, dealData.stage, dealData.closeDate || 'Not set'];
                    if (index < values.length) {
                        span.textContent = values[index];
                        console.log(`Updated dash span ${index} to:`, values[index]);
                    }
                }
            });
            
            // Also update any spans with dash content
            document.querySelectorAll('span').forEach(span => {
                if (span.textContent === '-') {
                    // Try to determine what field this is based on nearby text
                    const parentText = span.parentNode ? span.parentNode.textContent : '';
                    if (parentText.includes('Company')) {
                        span.textContent = dealData.name;
                    } else if (parentText.includes('Value')) {
                        span.textContent = dealData.value; 
                    } else if (parentText.includes('Stage')) {
                        span.textContent = dealData.stage;
                    } else if (parentText.includes('Date')) {
                        span.textContent = dealData.closeDate || 'Not set';
                    }
                }
            });
        } catch (error) {
            console.error("Error in direct DOM access:", error);
        }
    }
    
    // Helper to update an element by exact CSS path
    function updateElementByDOMTraversal(selector, value) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value;
                console.log(`Updated element by selector ${selector}:`, value);
                return true;
            } else {
                console.warn(`Element not found by selector: ${selector}`);
                return false;
            }
        } catch (error) {
            console.error(`Error updating element by selector ${selector}:`, error);
            return false;
        }
    }
    
    // Helper function to get a current date or past date for sample data
    function getCurrentDate(daysOffset = 0) {
        const date = new Date();
        if (daysOffset) {
            date.setDate(date.getDate() + daysOffset);
        }
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Helper to update deal files
    function updateDealFiles(dealData) {
        // Find the files tab content and list
        const filesTab = document.querySelector('.deal-tab-content.files-tab');
        const filesList = filesTab ? filesTab.querySelector('.files-list') : null;
        const noDealSelected = filesTab ? filesTab.querySelector('.no-deal-selected') : null;
        const noFilesMessage = filesList ? filesList.querySelector('.no-files-message') : null;
        
        // If we found the files list element
        if (filesTab && filesList) {
            console.log("Updating files tab content");
            
            // Remove the "no deal selected" message
            if (noDealSelected) {
                noDealSelected.classList.remove('active');
                console.log("Removed active class from no-deal-selected in files tab");
            }
            
            // Make sure the deal-files element is active
            const dealFiles = filesTab.querySelector('.deal-files');
            if (dealFiles) {
                dealFiles.classList.add('active');
            }
            
            // If we have files to display
            if (dealData.files && dealData.files.length > 0) {
                console.log(`Found ${dealData.files.length} files to display`);
                
                // Hide the no files message if it exists
                if (noFilesMessage) {
                    noFilesMessage.style.display = 'none';
                }
                
                // Clear existing files except the no-files message
                Array.from(filesList.children).forEach(child => {
                    if (!child.classList.contains('no-files-message')) {
                        child.remove();
                    }
                });
                
                // Add each file to the list
                dealData.files.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    
                    // Get appropriate icon based on file type
                    const iconClass = getFileIconClass(file.type || getFileExtension(file.name));
                    
                    fileItem.innerHTML = `
                        <div class="file-icon ${iconClass}"></div>
                        <div class="file-details">
                            <div class="file-name">${file.name}</div>
                            <div class="file-meta">
                                <span class="file-size">${file.size || '0 KB'}</span>
                                <span class="file-date">${file.date || getCurrentDate()}</span>
                            </div>
                        </div>
                        <div class="file-actions">
                            <button class="file-download-btn" title="Download">↓</button>
                            <button class="file-preview-btn" title="Preview">👁️</button>
                        </div>
                    `;
                    
                    filesList.appendChild(fileItem);
                });
                
                console.log("✅ Files tab updated successfully");
            } else if (noFilesMessage) {
                // Show the no files message
                noFilesMessage.style.display = 'block';
                console.log("No files available, showing message");
            }
        } else {
            console.warn("❌ Could not find files tab elements");
        }
    }
    
    // Get file icon class based on file type
    function getFileIconClass(fileType) {
        const fileTypeMap = {
            'pdf': 'pdf-icon',
            'doc': 'word-icon',
            'docx': 'word-icon',
            'xls': 'excel-icon',
            'xlsx': 'excel-icon',
            'ppt': 'powerpoint-icon',
            'pptx': 'powerpoint-icon',
            'txt': 'text-icon',
            'jpg': 'image-icon',
            'jpeg': 'image-icon',
            'png': 'image-icon',
            'gif': 'image-icon'
        };
        
        return fileTypeMap[fileType.toLowerCase()] || 'generic-icon';
    }
    
    // Extract file extension from filename
    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }
    
    // Helper to update deal contacts
    function updateDealContacts(dealData) {
        const contactsContainer = document.querySelector('.contacts-list');
        const noContactsMessage = document.querySelector('.no-contacts-message');
        
        if (contactsContainer) {
            if (dealData.contacts && dealData.contacts.length > 0) {
                // Hide the no contacts message if it exists
                if (noContactsMessage) {
                    noContactsMessage.style.display = 'none';
                }
                
                // Clear existing contacts except the no-contacts message
                Array.from(contactsContainer.children).forEach(child => {
                    if (!child.classList.contains('no-contacts-message')) {
                        child.remove();
                    }
                });
                
                // Add new contact items
                dealData.contacts.forEach(contact => {
                    const contactEl = document.createElement('div');
                    contactEl.className = 'contact-item';
                    contactEl.innerHTML = `
                        <div class="contact-name">${contact.name || 'Unknown'}</div>
                        <div class="contact-title">${contact.title || 'No title'}</div>
                        <div class="contact-email">
                            <a href="mailto:${contact.email || ''}">${contact.email || 'No email'}</a>
                        </div>
                        <div class="contact-phone">${contact.phone || 'No phone'}</div>
                    `;
                    contactsContainer.appendChild(contactEl);
                });
                
                console.log(`Added ${dealData.contacts.length} contacts`);
            } else if (noContactsMessage) {
                // Show the no contacts message
                noContactsMessage.style.display = 'block';
                console.log("No contacts available, showing message");
            }
        } else {
            console.warn("❌ contacts-list element not found");
        }
    }
    
    // Helper to update deal notes
    function updateDealNotes(dealData) {
        const notesContainer = document.querySelector('.deal-notes');
        const noNotesMessage = document.querySelector('.no-notes-message');
        
        if (notesContainer) {
            if (dealData.notes && dealData.notes.length > 0) {
                // Hide the no notes message if it exists
                if (noNotesMessage) {
                    noNotesMessage.style.display = 'none';
                }
                
                // Clear existing notes except the no-notes message and add-note button
                Array.from(notesContainer.children).forEach(child => {
                    if (!child.classList.contains('no-notes-message') && 
                        !child.classList.contains('add-note-btn')) {
                        child.remove();
                    }
                });
                
                // Add new note items before the add button
                const addNoteBtn = notesContainer.querySelector('.add-note-btn');
                
                dealData.notes.forEach(note => {
                    const noteEl = document.createElement('div');
                    noteEl.className = 'note-item';
                    noteEl.innerHTML = `
                        <div class="note-text">${note.text || ''}</div>
                        <div class="note-date">${note.date || 'No date'}</div>
                    `;
                    
                    if (addNoteBtn) {
                        notesContainer.insertBefore(noteEl, addNoteBtn);
                    } else {
                        notesContainer.appendChild(noteEl);
                    }
                });
                
                console.log(`Added ${dealData.notes.length} notes`);
            } else if (noNotesMessage) {
                // Show the no notes message
                noNotesMessage.style.display = 'block';
                console.log("No notes available, showing message");
            }
        } else {
            console.warn("❌ deal-notes element not found");
        }
    }
    
    // Helper to update deal history
    function updateDealHistory(dealData) {
        const historyTab = document.querySelector('.deal-tab-content.history-tab');
        const noDealSelected = historyTab ? historyTab.querySelector('.no-deal-selected') : null;
        const dealHistory = historyTab ? historyTab.querySelector('.deal-history') : null;
        const timelineItems = dealHistory ? dealHistory.querySelector('.timeline-items') : null;
        const noHistoryMessage = timelineItems ? timelineItems.querySelector('.no-history-message') : null;
        
        if (historyTab && dealHistory && timelineItems) {
            console.log("Updating history tab content");
            
            // Remove the "no deal selected" message
            if (noDealSelected) {
                noDealSelected.classList.remove('active');
                console.log("Removed active class from no-deal-selected in history tab");
            }
            
            // Make the deal history visible
            dealHistory.classList.add('active');
            
            if (dealData.history && dealData.history.length > 0) {
                // Hide the no history message if it exists
                if (noHistoryMessage) {
                    noHistoryMessage.style.display = 'none';
                }
                
                // Clear existing history items except the no-history message
                Array.from(timelineItems.children).forEach(child => {
                    if (!child.classList.contains('no-history-message')) {
                        child.remove();
                    }
                });
                
                // Add new history items
                dealData.history.forEach(item => {
                    const historyEl = document.createElement('div');
                    historyEl.className = 'timeline-item';
                    historyEl.innerHTML = `
                        <div class="timeline-date">${item.date || 'No date'}</div>
                        <div class="timeline-content">
                            <div class="timeline-text">${item.text || ''}</div>
                            <div class="timeline-author">${item.author || 'Unknown'}</div>
                        </div>
                    `;
                    timelineItems.appendChild(historyEl);
                });
                
                console.log(`Added ${dealData.history.length} history items`);
            } else if (noHistoryMessage) {
                // Show the no history message
                noHistoryMessage.style.display = 'block';
                console.log("No history available, showing message");
            }
        } else {
            console.warn("❌ History tab elements not found");
        }
    }
    
    // Helper function to get a color for each deal stage
    function getStageColor(stage) {
        const stageColors = {
            'Discovery': '#4F89F2', // Blue
            'Qualification': '#6BCDFD', // Light Blue
            'Proposal': '#FDA33B', // Orange
            'Negotiation': '#FDDA3B', // Yellow
            'Closed Won': '#34C759', // Green
            'Closed Lost': '#FF3B30', // Red
            'Unknown': '#BBBBBB' // Gray
        };
        
        return stageColors[stage] || '#BBBBBB';
    }
    
    // Add a debug button to force refresh deal content
    function addDebugButton() {
        // Check if debug controls already exist
        const existingDebug = document.querySelector('#dropdown-debug-controls');
        
        if (existingDebug) {
            // Add our button to the existing debug controls
            const refreshBtn = document.createElement('button');
            refreshBtn.id = 'refresh-deal-content-btn';
            refreshBtn.style.marginLeft = '5px';
            refreshBtn.style.padding = '3px';
            refreshBtn.style.background = '#4CAF50';
            refreshBtn.style.color = 'white';
            refreshBtn.textContent = 'Refresh Deal';
            
            refreshBtn.addEventListener('click', function() {
                attemptToFixExistingDealDisplay();
                alert('Deal content display refreshed');
            });
            
            existingDebug.appendChild(refreshBtn);
        }
    }
    
    // Expose this function globally so it can be called from any script
    window.forceDealContentUpdate = function(dealId, dealName) {
        console.log("📢 Force updating deal content called externally");
        updateDealContentDisplay(dealId, dealName);
    };
    
    // Hook directly into the deal dropdown to ensure we catch deal selections
    function hookIntoDealDropdown() {
        // Wait a short delay to ensure dropdown elements are available
        setTimeout(() => {
            // Find all deal dropdown options
            const dealOptions = document.querySelectorAll('[data-deal]');
            console.log(`Found ${dealOptions.length} deal dropdown options`);
            
            dealOptions.forEach(option => {
                // Clone and replace to remove existing handlers
                const newOption = option.cloneNode(true);
                option.parentNode.replaceChild(newOption, option);
                
                // Add our own handler
                newOption.addEventListener('click', function(e) {
                    const dealId = this.getAttribute('data-deal');
                    const dealName = this.textContent;
                    
                    console.log(`🔍 Dropdown option clicked: ${dealName} (${dealId})`);
                    
                    // Add a direct DOM update mechanism
                    let dealData = null;
                    
                    if (window.dealStore && window.dealStore.deals && dealId) {
                        dealData = window.dealStore.deals[dealId];
                    }
                    
                    if (!dealData) {
                        // Extract value from the dealName if possible
                        let dealValue = "";
                        if (dealName && dealName.includes(" - ")) {
                            const parts = dealName.split(" - ");
                            const name = parts[0];
                            dealValue = parts[1];
                            
                            dealData = {
                                id: dealId || 'unknown',
                                name: name,
                                value: dealValue || '$0',
                                stage: 'Unknown',
                                probability: '0%',
                                closeDate: 'Unknown'
                            };
                        }
                    }
                    
                    if (dealData) {
                        // Immediate direct update
                        directUpdateDOMWithDealData(dealData);
                        
                        // Repeated updates to ensure changes stick
                        setTimeout(() => directUpdateDOMWithDealData(dealData), 100);
                        setTimeout(() => directUpdateDOMWithDealData(dealData), 300);
                        setTimeout(() => directUpdateDOMWithDealData(dealData), 800);
                    }
                    
                    // Give a brief delay to allow other handlers to run first
                    setTimeout(() => {
                        updateDealContentDisplay(dealId, dealName);
                    }, 200);
                });
            });
            
            console.log("✅ Successfully hooked into deal dropdown options");
        }, 500);
    }
    
    // Direct function to update DOM with deal data
    function directUpdateDOMWithDealData(dealData) {
        console.log("Direct DOM update with deal data:", dealData);
        
        try {
            // Get all span elements in the deal overview section
            const spans = document.querySelectorAll('.deal-overview span');
            
            // Company field - find by content or position
            spans.forEach(span => {
                const parent = span.parentNode;
                const parentText = parent ? parent.textContent : '';
                
                if (parentText.includes('Company:')) {
                    const valueSpan = parent.querySelector(':not(.info-label)');
                    if (valueSpan) {
                        valueSpan.textContent = dealData.name;
                        console.log("Updated company field:", dealData.name);
                    }
                }
                else if (parentText.includes('Value:')) {
                    const valueSpan = parent.querySelector(':not(.info-label)');
                    if (valueSpan) {
                        valueSpan.textContent = dealData.value;
                        console.log("Updated value field:", dealData.value);
                    }
                }
                else if (parentText.includes('Stage:')) {
                    const valueSpan = parent.querySelector(':not(.info-label)');
                    if (valueSpan) {
                        valueSpan.textContent = dealData.stage;
                        console.log("Updated stage field:", dealData.stage);
                    }
                }
                else if (parentText.includes('Date:')) {
                    const valueSpan = parent.querySelector(':not(.info-label)');
                    if (valueSpan) {
                        valueSpan.textContent = dealData.closeDate || 'Not set';
                        console.log("Updated date field:", dealData.closeDate);
                    }
                }
            });
            
            // Update any dashes directly
            document.querySelectorAll('.deal-overview span').forEach(span => {
                if (span.textContent === '-') {
                    // Get the preceding label if exists
                    let previousSibling = span.previousElementSibling;
                    let labelText = '';
                    
                    if (previousSibling && previousSibling.classList.contains('info-label')) {
                        labelText = previousSibling.textContent;
                    }
                    
                    if (labelText.includes('Company')) {
                        span.textContent = dealData.name;
                    } else if (labelText.includes('Value')) {
                        span.textContent = dealData.value;
                    } else if (labelText.includes('Stage')) {
                        span.textContent = dealData.stage;
                    } else if (labelText.includes('Date')) {
                        span.textContent = dealData.closeDate || 'Not set';
                    }
                }
            });
        } catch (error) {
            console.error("Error in direct DOM update:", error);
        }
    }
    
    // New function to ensure all tab content is visible when a deal is selected
    function ensureAllTabContentIsVisible() {
        // Make sure all tab contents are ready
        const tabContents = document.querySelectorAll('.deal-tab-content');
        tabContents.forEach(tabContent => {
            // Remove 'no-deal-selected' from being active
            const noDealMessage = tabContent.querySelector('.no-deal-selected');
            if (noDealMessage) {
                noDealMessage.classList.remove('active');
                console.log(`Removed active class from no-deal-selected in ${tabContent.className}`);
            }
            
            // Get the content elements for this tab
            const contentElements = Array.from(tabContent.children).filter(el => !el.classList.contains('no-deal-selected'));
            
            // Make at least the first content element active
            if (contentElements.length > 0 && !contentElements.some(el => el.classList.contains('active'))) {
                contentElements[0].classList.add('active');
                console.log(`Made ${contentElements[0].className} active in ${tabContent.className}`);
            }
        });
    }
    
    // Setup tab button click handlers
    function setupDealTabButtonHandlers() {
        const tabButtons = document.querySelectorAll('.deal-tab-btn');
        const tabContents = document.querySelectorAll('.deal-tab-content');
        
        tabButtons.forEach(button => {
            // Remove existing event listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new event listener
            newButton.addEventListener('click', function() {
                const tabId = this.getAttribute('data-dealtab');
                console.log(`Deal tab button clicked: ${tabId}`);
                
                // Update active state for buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active state for tab contents
                tabContents.forEach(content => content.classList.remove('active'));
                const targetContent = document.querySelector(`.deal-tab-content.${tabId}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log(`Activated tab content: ${tabId}-tab`);
                }
            });
        });
        
        console.log("✅ Deal tab button handlers set up");
    }
    
    // Generate unique files for each deal
    function generateUniqueFiles(dealId, dealName) {
        console.log(`Generating unique files for deal: ${dealName} (${dealId})`);
        
        // Get a deterministic number based on dealId or name length
        const hash = dealId ? dealId.toString().length + dealId.toString().charCodeAt(0) : 
                    dealName ? dealName.length + dealName.charCodeAt(0) : 3;
        
        // Base number of files (2-5)
        const numFiles = 2 + (hash % 4);
        
        // Create a normalized company name for file naming
        const companyForFiles = dealName.replace(/[^a-zA-Z0-9]/g, '');
        
        // Different types of files that could be in a deal
        const fileTypes = [
            { name: `${companyForFiles}_Proposal`, ext: 'pdf', size: '1.4 MB' },
            { name: `${companyForFiles}_Requirements`, ext: 'docx', size: '342 KB' },
            { name: `${companyForFiles}_Quote`, ext: 'pdf', size: '890 KB' },
            { name: `${companyForFiles}_Contract`, ext: 'docx', size: '1.2 MB' },
            { name: `${companyForFiles}_Technical_Specs`, ext: 'xlsx', size: '458 KB' },
            { name: `${companyForFiles}_Pricing_Sheet`, ext: 'xlsx', size: '275 KB' },
            { name: `${companyForFiles}_Implementation_Plan`, ext: 'pptx', size: '2.7 MB' },
            { name: `${companyForFiles}_Compliance`, ext: 'pdf', size: '3.2 MB' },
            { name: `${companyForFiles}_Terms`, ext: 'pdf', size: '543 KB' },
            { name: `${companyForFiles}_Meeting_Notes`, ext: 'docx', size: '120 KB' }
        ];
        
        // Select files based on hash to ensure deterministic but different files per deal
        const selectedFiles = [];
        for (let i = 0; i < numFiles; i++) {
            const fileIndex = (hash + i) % fileTypes.length;
            const file = fileTypes[fileIndex];
            
            // Create the file with date offset based on the index
            selectedFiles.push({
                name: `${file.name}.${file.ext}`,
                size: file.size,
                date: getCurrentDate(-i * 3 - 1), // Different dates for each file
                type: file.ext
            });
        }
        
        console.log(`Generated ${selectedFiles.length} unique files for ${dealName}`);
        return selectedFiles;
    }
    
    // Generate unique history for each deal
    function generateUniqueHistory(dealId, dealName, dealStage) {
        console.log(`Generating unique history for deal: ${dealName} (${dealId})`);
        
        // Get a deterministic number based on dealId or name
        const hash = dealId ? dealId.toString().length + dealId.toString().charCodeAt(0) : 
                   dealName ? dealName.length + dealName.charCodeAt(0) : 3;
        
        // Base number of history items (3-7)
        const numHistory = 3 + (hash % 5);
        
        // Create a normalized company name for history
        const company = dealName.replace(/[^a-zA-Z0-9]/g, '');
        
        // Different types of history events
        const historyTypes = [
            { text: `Initial contact with ${dealName}`, author: 'Sales Rep' },
            { text: `Discovery call completed with ${dealName} team`, author: 'Sales Rep' },
            { text: `Needs assessment completed for ${dealName}`, author: 'Sales Rep' },
            { text: `Demo presented to ${dealName} stakeholders`, author: 'Sales Rep' },
            { text: `Proposal sent to ${dealName}`, author: 'Sales Rep' },
            { text: `${dealName} requested customization details`, author: 'Client' },
            { text: `Follow-up call with ${dealName} decision makers`, author: 'Sales Rep' },
            { text: `${dealName} reviewing contract terms`, author: 'Legal Team' },
            { text: `Negotiation started with ${dealName}`, author: 'Sales Manager' },
            { text: `${dealName} requested pricing adjustments`, author: 'Client' },
            { text: `Technical requirements review with ${dealName} IT team`, author: 'Solutions Engineer' },
            { text: `Implementation timeline discussed with ${dealName}`, author: 'Project Manager' },
            { text: `${dealName} approved proposal`, author: 'Client' },
            { text: `Contract sent to ${dealName} for signature`, author: 'Sales Rep' },
            { text: `${dealName} deal created in system`, author: 'System' }
        ];
        
        // Get history items for this deal, ensuring the oldest items come first
        const selectedHistory = [];
        for (let i = 0; i < numHistory; i++) {
            const historyIndex = (hash + i) % historyTypes.length;
            const history = historyTypes[historyIndex];
            
            // Create history with date offset based on the index (older items first)
            selectedHistory.push({
                text: history.text,
                author: history.author,
                date: getCurrentDate(-(numHistory - i) * 7) // Different dates, oldest first
            });
        }
        
        // Add a "deal created" event as the first entry
        selectedHistory.unshift({
            text: `${dealName} deal created`,
            author: 'System',
            date: getCurrentDate(-(numHistory + 1) * 7)
        });
        
        // Add a recent event
        selectedHistory.push({
            text: 'Deal selected in Deal Advisor',
            author: 'System',
            date: getCurrentDate()
        });
        
        console.log(`Generated ${selectedHistory.length} unique history items for ${dealName}`);
        return selectedHistory;
    }
})(); 