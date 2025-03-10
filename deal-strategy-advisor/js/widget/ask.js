// ask.js - Handles the Ask tab functionality (formerly Composer tab)
import dealsModule from '../data/deals.js';

const askModule = {
    // Track initialization state
    initialized: false,
    activeDeal: null,
    
    // Track uploaded files
    uploadedFiles: [],
    
    // Initialize the ask functionality
    initialize: function() {
        if (this.initialized) return;
        
        this.setupFileUpload();
        this.setupNotes();
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('Ask module initialized');
    },
    
    // Activate the ask tab (called when tab is selected)
    activate: function() {
        // Focus notes textarea when tab is activated
        setTimeout(() => {
            const composerNotes = document.getElementById('composerNotes');
            if (composerNotes) {
                composerNotes.focus();
            }
        }, 100);
    },
    
    // Set up file upload functionality
    setupFileUpload: function() {
        const fileDropArea = document.querySelector('.file-drop-area');
        const fileInput = document.querySelector('.file-input');
        const fileList = document.querySelector('.file-list');
        
        if (!fileDropArea || !fileInput || !fileList) return;
        
        // Handle file selection via button
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        
        fileDropArea.addEventListener('dragenter', () => {
            fileDropArea.classList.add('highlight');
        });
        
        fileDropArea.addEventListener('dragleave', () => {
            fileDropArea.classList.remove('highlight');
        });
        
        fileDropArea.addEventListener('drop', (e) => {
            fileDropArea.classList.remove('highlight');
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFiles(files);
        });
        
        // Analyze button
        const analyzeBtn = document.querySelector('.analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzeContext();
            });
        }
        
        // Clear button
        const clearBtn = document.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearContext();
            });
        }
    },
    
    // Set up notes functionality
    setupNotes: function() {
        const notesTextarea = document.getElementById('composerNotes');
        const contextMenuBtn = document.getElementById('composerContextMenuBtn');
        
        if (!notesTextarea || !contextMenuBtn) return;
        
        // Auto-save notes periodically
        notesTextarea.addEventListener('input', this.debounce(() => {
            this.saveNotes(notesTextarea.value);
        }, 1000));
        
        // Context menu button
        contextMenuBtn.addEventListener('click', () => {
            // Show context menu (this would be defined in context.js)
            if (typeof window.contextModule !== 'undefined') {
                window.contextModule.showMenu('composerNotes');
            }
        });
    },
    
    // Set up event listeners for deal changes
    setupEventListeners: function() {
        // Listen for deal changes
        document.addEventListener('widgetDealChanged', (e) => {
            this.activeDeal = e.detail.deal;
            this.updateForDeal();
        });
        
        // Listen for deal clearing
        document.addEventListener('widgetDealCleared', () => {
            this.activeDeal = null;
            this.updateForNullState();
        });
    },
    
    // Handle uploaded files
    handleFiles: function(files) {
        if (!files || files.length === 0) return;
        
        // Process each file
        Array.from(files).forEach(file => {
            // Check file type
            const validTypes = ['.pdf', '.docx', '.txt', '.eml'];
            const fileName = file.name.toLowerCase();
            const isValidType = validTypes.some(type => fileName.endsWith(type));
            
            if (!isValidType) {
                alert(`File type not supported: ${file.name}. Please upload PDF, DOCX, TXT, or EML files.`);
                return;
            }
            
            // Check file size (10 MB limit)
            const maxSize = 10 * 1024 * 1024; // 10 MB
            if (file.size > maxSize) {
                alert(`File too large: ${file.name}. Maximum file size is 10 MB.`);
                return;
            }
            
            // Add file to list
            this.addFileToList(file);
        });
    },
    
    // Add file to the displayed list
    addFileToList: function(file) {
        const fileList = document.querySelector('.file-list');
        if (!fileList) return;
        
        // Create unique ID for this file
        const fileId = 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // Add to our file tracking
        this.uploadedFiles.push({
            id: fileId,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date()
        });
        
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = 'file-item';
        listItem.setAttribute('data-file-id', fileId);
        
        // Format file size for display
        const fileSize = this.formatFileSize(file.size);
        
        // Get file type icon based on extension
        const fileIcon = this.getFileTypeIcon(file.name);
        
        listItem.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${fileIcon}</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize}</span>
            </div>
            <button class="remove-file" title="Remove file">×</button>
        `;
        
        // Add remove button functionality
        const removeBtn = listItem.querySelector('.remove-file');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFile(fileId);
            });
        }
        
        // Add click to preview functionality
        listItem.addEventListener('click', () => {
            this.previewFile(fileId);
        });
        
        fileList.appendChild(listItem);
        
        // Update UI to show we have files
        document.querySelector('.uploaded-files').classList.add('has-files');
    },
    
    // Remove file from list
    removeFile: function(fileId) {
        // Remove from our tracking
        this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== fileId);
        
        // Remove from UI
        const fileItem = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
        if (fileItem) {
            fileItem.remove();
        }
        
        // If no more files, update UI
        if (this.uploadedFiles.length === 0) {
            document.querySelector('.uploaded-files').classList.remove('has-files');
        }
    },
    
    // Preview a file
    previewFile: function(fileId) {
        const file = this.uploadedFiles.find(f => f.id === fileId);
        if (!file) return;
        
        alert(`Preview for ${file.name} would be shown here. In a real implementation, this would show file contents in a modal.`);
    },
    
    // Format file size for display
    formatFileSize: function(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    },
    
    // Get icon for file type
    getFileTypeIcon: function(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        switch(extension) {
            case 'pdf':
                return '📄';
            case 'docx':
            case 'doc':
                return '📝';
            case 'txt':
                return '📃';
            case 'eml':
                return '✉️';
            default:
                return '📎';
        }
    },
    
    // Analyze the current context (files + notes)
    analyzeContext: function() {
        // In a real implementation, this would send the files and notes to an API
        const notesTextarea = document.getElementById('composerNotes');
        const notes = notesTextarea ? notesTextarea.value : '';
        
        if (this.uploadedFiles.length === 0 && (!notes || notes.trim() === '')) {
            alert('Please add files or notes to analyze.');
            return;
        }
        
        const fileNames = this.uploadedFiles.map(file => file.name).join(', ');
        
        let message = 'Analyzing context:\n';
        if (this.uploadedFiles.length > 0) {
            message += `- ${this.uploadedFiles.length} files: ${fileNames}\n`;
        }
        if (notes && notes.trim() !== '') {
            message += `- Notes: ${notes.length} characters\n`;
        }
        
        alert(message + '\nThis would send data to an AI for analysis in a real implementation.');
        
        // After analysis, switch to the Agent tab to show results
        if (typeof window.widgetModule !== 'undefined') {
            window.widgetModule.switchTab('agent');
        }
    },
    
    // Clear all context (files + notes)
    clearContext: function() {
        // Clear uploaded files
        this.uploadedFiles = [];
        
        // Clear UI
        const fileList = document.querySelector('.file-list');
        if (fileList) {
            fileList.innerHTML = '';
        }
        
        // Clear notes
        const notesTextarea = document.getElementById('composerNotes');
        if (notesTextarea) {
            notesTextarea.value = '';
        }
        
        // Update UI
        document.querySelector('.uploaded-files').classList.remove('has-files');
        
        // Save empty notes
        this.saveNotes('');
    },
    
    // Save notes to storage
    saveNotes: function(notes) {
        // In a real implementation, this would save to a database or API
        // Here we'll just use localStorage for demonstration
        if (!this.activeDeal) return;
        
        try {
            localStorage.setItem(`notes_${this.activeDeal.id}`, notes);
            console.log('Notes saved for deal:', this.activeDeal.id);
        } catch (e) {
            console.error('Error saving notes:', e);
        }
    },
    
    // Load notes from storage
    loadNotes: function() {
        if (!this.activeDeal) return '';
        
        try {
            return localStorage.getItem(`notes_${this.activeDeal.id}`) || '';
        } catch (e) {
            console.error('Error loading notes:', e);
            return '';
        }
    },
    
    // Update UI for active deal
    updateForDeal: function() {
        if (!this.activeDeal) return;
        
        // Update deal name display
        document.querySelectorAll('.deal-name').forEach(el => {
            el.textContent = this.activeDeal.name;
        });
        
        // Show active deal state, hide null state
        document.querySelectorAll('.no-deal-state').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelectorAll('.active-deal-state').forEach(el => {
            el.classList.add('active');
        });
        
        // Load notes for this deal
        const notesTextarea = document.getElementById('composerNotes');
        if (notesTextarea) {
            notesTextarea.value = this.loadNotes();
        }
    },
    
    // Update UI for null state (no deal selected)
    updateForNullState: function() {
        // Show null state, hide active deal state
        document.querySelectorAll('.active-deal-state').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelectorAll('.no-deal-state').forEach(el => {
            el.classList.add('active');
        });
        
        // Clear notes
        const notesTextarea = document.getElementById('composerNotes');
        if (notesTextarea) {
            notesTextarea.value = '';
        }
    },
    
    // Debounce function to limit how often a function is called
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
};

// Export the module
export default askModule;

// Expose to window for legacy compatibility
window.askModule = askModule; 