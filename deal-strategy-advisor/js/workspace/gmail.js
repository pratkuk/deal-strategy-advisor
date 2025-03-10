// gmail.js - Gmail app functionality

const gmailApp = {
    // Track initialization state
    initialized: false,
    
    // Email data (would come from API in real implementation)
    emailData: {
        inbox: [
            {
                id: 'email-1',
                sender: 'John Smith',
                subject: 'Re: Acme Corp Proposal Questions',
                snippet: 'I've reviewed the latest version and have a few additional questions about the timeline...',
                date: 'Mar 15',
                read: false,
                deal: 'deal-1',
                body: `
                    <p>Hi there,</p>
                    <p>I've reviewed the latest version of the proposal and have a few additional questions about the timeline:</p>
                    <ul>
                        <li>When can we expect the initial setup to be completed?</li>
                        <li>How long will the training phase last?</li>
                        <li>What support options are available after implementation?</li>
                    </ul>
                    <p>Also, our technical team would like to schedule a call to discuss integration requirements in more detail.</p>
                    <p>Best regards,<br>John Smith<br>VP Operations, Acme Corp</p>
                `
            },
            {
                id: 'email-2',
                sender: 'Lisa Wong',
                subject: 'TechStart Contract Review',
                snippet: 'Our legal team has reviewed the contract and has the following feedback...',
                date: 'Mar 14',
                read: true,
                deal: 'deal-2',
                body: `
                    <p>Hello,</p>
                    <p>Our legal team has reviewed the contract and has the following feedback:</p>
                    <ol>
                        <li>Section 3.2: We'd like to revise the payment terms to Net 45</li>
                        <li>Section 5.1: The SLA should specify 99.9% uptime with clearer remediation procedures</li>
                        <li>Appendix B: We need more specific data handling provisions to meet compliance requirements</li>
                    </ol>
                    <p>I've attached a document with our suggested revisions. Can we schedule a call to discuss these points?</p>
                    <p>Thank you,<br>Lisa Wong<br>Procurement, TechStart</p>
                `
            },
            {
                id: 'email-3',
                sender: 'Sarah Davis',
                subject: 'Team Meeting - Deal Strategy',
                snippet: 'Let's get together to discuss our approach for the upcoming GlobalRetail negotiation...',
                date: 'Mar 12',
                read: true,
                deal: 'deal-3',
                body: `
                    <p>Team,</p>
                    <p>Let's get together to discuss our approach for the upcoming GlobalRetail negotiation. We need to prepare our response to their latest requests and develop a negotiation strategy.</p>
                    <p>Proposed agenda:</p>
                    <ul>
                        <li>Review of current deal status and requirements</li>
                        <li>Competitive positioning</li>
                        <li>Pricing strategy and discount thresholds</li>
                        <li>Technical implementation timeline</li>
                        <li>Contract terms we can/cannot flex on</li>
                    </ul>
                    <p>I've scheduled a meeting for tomorrow at 2:00 PM in Conference Room A.</p>
                    <p>Sarah Davis<br>Sales Director</p>
                `
            }
        ],
        sent: [
            {
                id: 'email-4',
                recipient: 'John Smith',
                subject: 'Re: Acme Corp Proposal Questions',
                snippet: 'Thanks for your questions. I'd be happy to clarify the timeline details...',
                date: 'Mar 15',
                deal: 'deal-1',
                body: `
                    <p>Hi John,</p>
                    <p>Thanks for your questions. I'd be happy to clarify the timeline details:</p>
                    <ul>
                        <li>Initial setup: We can complete this within 2 weeks of contract signing</li>
                        <li>Training phase: This typically lasts 3-4 weeks, depending on your team's availability</li>
                        <li>Post-implementation support: We offer 24/7 support for the first 90 days, then our standard support package includes 8am-6pm coverage with 4-hour response times</li>
                    </ul>
                    <p>I'd be glad to arrange a call with our technical team. How does next Tuesday at 10:00 AM work for you?</p>
                    <p>Best regards,</p>
                `
            },
            {
                id: 'email-5',
                recipient: 'Amanda Miller',
                subject: 'GlobalRetail Implementation Plan',
                snippet: 'Please find attached our detailed implementation plan for the POS upgrade...',
                date: 'Mar 11',
                deal: 'deal-3',
                body: `
                    <p>Hello Amanda,</p>
                    <p>Please find attached our detailed implementation plan for the POS upgrade. The plan includes:</p>
                    <ul>
                        <li>Phase 1: Data migration and system setup (2 weeks)</li>
                        <li>Phase 2: Pilot deployment at flagship location (1 week)</li>
                        <li>Phase 3: Rollout to remaining locations (4 weeks)</li>
                        <li>Phase 4: Post-implementation review and optimization (ongoing)</li>
                    </ul>
                    <p>We've also included a resource allocation plan and risk mitigation strategy as discussed.</p>
                    <p>Please review and let me know if you have any questions or concerns.</p>
                    <p>Regards,</p>
                `
            }
        ],
        drafts: [
            {
                id: 'email-6',
                recipient: 'Mike Johnson',
                subject: 'TechStart Proposal Revision',
                snippet: 'Based on our discussion yesterday, I've revised the proposal to address your concerns...',
                date: 'Mar 13',
                deal: 'deal-2',
                body: `
                    <p>Hello Mike,</p>
                    <p>Based on our discussion yesterday, I've revised the proposal to address your concerns about the implementation timeline and resource requirements.</p>
                    <p>Key changes include:</p>
                    <ul>
                        <li>Accelerated deployment schedule (now 6 weeks instead of 8)</li>
                        <li>Reduced on-site resource requirements during Phase 2</li>
                        <li>Additional training sessions for your technical team</li>
                    </ul>
                    <p>Please let me know if these changes align with your expectations. I'm available to discuss further if needed.</p>
                    <p>Best regards,</p>
                `
            }
        ],
        'deal updates': [
            {
                id: 'email-7',
                sender: 'Deal Alert System',
                subject: 'Deal Update: Acme Corp Enterprise Agreement',
                snippet: 'The probability of closing has increased to 35% based on recent activity...',
                date: 'Mar 16',
                read: false,
                deal: 'deal-1',
                body: `
                    <p>Deal Update: Acme Corp Enterprise Agreement</p>
                    <p>The probability of closing has increased to 35% based on recent activity. Recent positive indicators include:</p>
                    <ul>
                        <li>Decision maker involvement in technical discussions</li>
                        <li>Request for implementation timeline details</li>
                        <li>Scheduled meeting with technical team</li>
                    </ul>
                    <p>Recommended actions:</p>
                    <ul>
                        <li>Prepare detailed technical implementation plan</li>
                        <li>Schedule follow-up meeting with procurement team</li>
                        <li>Share relevant case studies from similar implementations</li>
                    </ul>
                    <p>This is an automated update from your deal monitoring system.</p>
                `
            },
            {
                id: 'email-8',
                sender: 'Deal Alert System',
                subject: 'Deal Alert: TechStart SaaS Implementation',
                snippet: 'WARNING: This deal has been inactive for 5 days and is at risk...',
                date: 'Mar 16',
                read: false,
                deal: 'deal-2',
                body: `
                    <p>DEAL ALERT: TechStart SaaS Implementation</p>
                    <p>WARNING: This deal has been inactive for 5 days and is at risk. Risk factors include:</p>
                    <ul>
                        <li>No response to latest proposal revision</li>
                        <li>Competitor has recently engaged with key decision maker</li>
                        <li>Original timeline expectations may not be met</li>
                    </ul>
                    <p>Recommended immediate actions:</p>
                    <ul>
                        <li>Reach out to Mike Johnson directly via phone</li>
                        <li>Schedule an executive-level touch point</li>
                        <li>Consider revising commercial terms</li>
                    </ul>
                    <p>This is an automated alert from your deal monitoring system.</p>
                `
            }
        ]
    },
    
    // Initialize Gmail app
    initialize: function() {
        if (this.initialized) return;
        
        this.setupEventListeners();
        this.displayFolderEmails('inbox');
        
        this.initialized = true;
        console.log('Gmail app initialized');
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Folder selection
        document.querySelectorAll('.email-folders .folder').forEach(folder => {
            folder.addEventListener('click', () => {
                const folderName = folder.textContent.toLowerCase();
                this.displayFolderEmails(folderName);
                
                // Update active folder
                document.querySelectorAll('.email-folders .folder').forEach(f => {
                    f.classList.remove('active');
                });
                folder.classList.add('active');
            });
        });
        
        // Compose button
        const composeBtn = document.querySelector('.compose-btn button');
        if (composeBtn) {
            composeBtn.addEventListener('click', () => {
                this.showComposeEmail();
            });
        }
        
        // Listen for deal selection events to update email list
        document.addEventListener('dealSelected', (e) => {
            // Highlight emails related to selected deal
            this.highlightDealEmails(e.detail.dealId);
        });
    },
    
    // Display emails for a folder
    displayFolderEmails: function(folderName) {
        const emailList = document.querySelector('.email-items');
        if (!emailList) return;
        
        // Clear existing emails
        emailList.innerHTML = '';
        
        // Get emails for the selected folder
        const emails = this.emailData[folderName];
        
        if (!emails || emails.length === 0) {
            // Show empty state
            emailList.innerHTML = `
                <div class="empty-folder">
                    <p>No emails in ${folderName}</p>
                </div>
            `;
            return;
        }
        
        // Add emails to list
        emails.forEach(email => {
            const emailItem = document.createElement('div');
            emailItem.className = 'email-item';
            emailItem.setAttribute('data-email-id', email.id);
            
            if (email.deal) {
                emailItem.setAttribute('data-deal-id', email.deal);
            }
            
            if (!email.read) {
                emailItem.classList.add('unread');
            }
            
            // Different display for sent folder
            const sender = folderName === 'sent' ? 
                `To: ${email.recipient}` : 
                email.sender;
            
            emailItem.innerHTML = `
                <div class="email-sender">${sender}</div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-snippet">${email.snippet}</div>
                <div class="email-date">${email.date}</div>
            `;
            
            // Add click event to show email preview
            emailItem.addEventListener('click', () => {
                this.showEmailPreview(email, folderName);
                
                // Mark as read
                email.read = true;
                emailItem.classList.remove('unread');
                
                // Remove selected class from all emails
                document.querySelectorAll('.email-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Add selected class to clicked email
                emailItem.classList.add('selected');
            });
            
            emailList.appendChild(emailItem);
        });
        
        // Clear email preview
        const emailPreview = document.querySelector('.email-preview-content');
        if (emailPreview) {
            emailPreview.innerHTML = `
                <div class="empty-preview">
                    <p>Select an email to preview</p>
                </div>
            `;
        }
    },
    
    // Show email preview
    showEmailPreview: function(email, folderType) {
        const previewContainer = document.querySelector('.email-preview-content');
        if (!previewContainer) return;
        
        // Different display for sent/draft emails
        const isSent = folderType === 'sent' || folderType === 'drafts';
        const headerInfo = isSent ? 
            `To: ${email.recipient}` : 
            `From: ${email.sender}`;
        
        // Special display for drafts
        const draftBanner = folderType === 'drafts' ? 
            `<div class="draft-banner">DRAFT</div>` : '';
        
        previewContainer.innerHTML = `
            ${draftBanner}
            <div class="email-preview-header">
                <h2>${email.subject}</h2>
                <div class="email-preview-actions">
                    <button class="reply-btn">Reply</button>
                    <button class="forward-btn">Forward</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
            <div class="email-metadata">
                <p>${headerInfo}</p>
                <p>Date: ${email.date}</p>
                ${email.deal ? `<p>Related Deal: ${this.getDealName(email.deal)}</p>` : ''}
            </div>
            <div class="email-body">
                ${email.body}
            </div>
        `;
        
        // Add event listeners for actions
        const replyBtn = previewContainer.querySelector('.reply-btn');
        if (replyBtn) {
            replyBtn.addEventListener('click', () => {
                this.replyToEmail(email);
            });
        }
        
        const forwardBtn = previewContainer.querySelector('.forward-btn');
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => {
                this.forwardEmail(email);
            });
        }
        
        const deleteBtn = previewContainer.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteEmail(email, folderType);
            });
        }
    },
    
    // Show compose email dialog
    showComposeEmail: function() {
        alert('Compose email functionality would go here');
        // In a real implementation, this would show a compose form
    },
    
    // Reply to an email
    replyToEmail: function(email) {
        alert(`Reply to "${email.subject}" functionality would go here`);
        // In a real implementation, this would pre-fill a compose form
    },
    
    // Forward an email
    forwardEmail: function(email) {
        alert(`Forward "${email.subject}" functionality would go here`);
        // In a real implementation, this would pre-fill a compose form
    },
    
    // Delete an email
    deleteEmail: function(email, folderType) {
        alert(`Delete "${email.subject}" functionality would go here`);
        // In a real implementation, this would remove the email and update the UI
    },
    
    // Get deal name from deal ID
    getDealName: function(dealId) {
        // In a real implementation, this would use the deals module
        const dealNames = {
            'deal-1': 'Acme Corp Enterprise Agreement',
            'deal-2': 'TechStart SaaS Implementation',
            'deal-3': 'GlobalRetail POS Upgrade'
        };
        
        return dealNames[dealId] || 'Unknown Deal';
    },
    
    // Highlight emails related to a deal
    highlightDealEmails: function(dealId) {
        // Remove highlight from all emails
        document.querySelectorAll('.email-item').forEach(item => {
            item.classList.remove('deal-highlight');
        });
        
        // Add highlight to emails related to the deal
        document.querySelectorAll(`.email-item[data-deal-id="${dealId}"]`).forEach(item => {
            item.classList.add('deal-highlight');
        });
    }
};

// Export the module
export default gmailApp;

// Expose to window for legacy compatibility
window.gmailApp = gmailApp; 