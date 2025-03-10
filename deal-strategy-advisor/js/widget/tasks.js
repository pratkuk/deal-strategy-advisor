// tasks.js - Handles the Tasks tab functionality (formerly Coaching tab)
import dealsModule from '../data/deals.js';

const tasksModule = {
    // Track initialization state
    initialized: false,
    activeDeal: null,
    
    // Task data (would come from API in real implementation)
    tasks: [
        {
            id: 'task-1',
            title: 'Schedule technical discussion with Acme Corp',
            status: 'pending',
            priority: 'high',
            dueDate: '2024-03-20',
            dealId: 'deal-1',
            assignee: 'You',
            description: 'Set up a call with the IT team to discuss integration requirements in more detail.'
        },
        {
            id: 'task-2',
            title: 'Prepare implementation timeline for TechStart',
            status: 'completed',
            priority: 'medium',
            dueDate: '2024-03-15',
            dealId: 'deal-2',
            assignee: 'You',
            description: 'Create detailed timeline showing implementation phases and resource allocation.'
        },
        {
            id: 'task-3',
            title: 'Follow up with GlobalRetail legal team',
            status: 'pending',
            priority: 'high',
            dueDate: '2024-03-18',
            dealId: 'deal-3',
            assignee: 'You',
            description: 'Send email to legal team addressing their concerns about the SLA terms.'
        },
        {
            id: 'task-4',
            title: 'Prepare ROI analysis for Acme Corp',
            status: 'pending',
            priority: 'medium',
            dueDate: '2024-03-25',
            dealId: 'deal-1',
            assignee: 'You',
            description: 'Create detailed ROI analysis showing 3-year benefit projection.'
        },
        {
            id: 'task-5',
            title: 'Schedule follow-up with TechStart decision maker',
            status: 'pending',
            priority: 'high',
            dueDate: '2024-03-19',
            dealId: 'deal-2',
            assignee: 'Sales Manager',
            description: 'Arrange meeting with CTO to address competitive concerns.'
        }
    ],
    
    // Initialize tasks functionality
    initialize: function() {
        if (this.initialized) return;
        
        this.setupEventListeners();
        this.setupNotesSection();
        
        this.initialized = true;
        console.log('Tasks module initialized');
    },
    
    // Activate the tasks tab (called when tab is selected)
    activate: function() {
        // Update task list in case it changed
        if (this.activeDeal) {
            this.updateTasksForDeal();
        }
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Listen for deal changes
        document.addEventListener('widgetDealChanged', (e) => {
            this.activeDeal = e.detail.deal;
            this.updateUIforActiveDeal();
        });
        
        // Listen for deal clearing
        document.addEventListener('widgetDealCleared', () => {
            this.activeDeal = null;
            this.updateUIforNullState();
        });
        
        // Save notes button
        const saveNotesBtn = document.querySelector('.save-notes-btn');
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => {
                this.saveTaskNotes();
            });
        }
    },
    
    // Set up notes section
    setupNotesSection: function() {
        const notesTextarea = document.getElementById('coachingNotes');
        const contextMenuBtn = document.getElementById('coachingContextMenuBtn');
        
        if (!notesTextarea || !contextMenuBtn) return;
        
        // Auto-save notes periodically
        notesTextarea.addEventListener('input', this.debounce(() => {
            this.saveTaskNotes(false); // Don't show saved confirmation
        }, 2000));
        
        // Context menu button
        contextMenuBtn.addEventListener('click', () => {
            // Show context menu (defined in context.js)
            if (typeof window.contextModule !== 'undefined') {
                window.contextModule.showMenu('coachingNotes');
            }
        });
    },
    
    // Update UI for active deal
    updateUIforActiveDeal: function() {
        if (!this.activeDeal) return;
        
        // Update deal name displays
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
        
        // Update coaching insights
        this.updateCoachingInsights();
        
        // Update tasks for this deal
        this.updateTasksForDeal();
        
        // Load notes for this deal
        const notesTextarea = document.getElementById('coachingNotes');
        if (notesTextarea) {
            notesTextarea.value = this.loadTaskNotes();
        }
    },
    
    // Update UI for null state (no deal selected)
    updateUIforNullState: function() {
        // Show null state, hide active deal state
        document.querySelectorAll('.active-deal-state').forEach(el => {
            el.classList.remove('active');
        });
        
        document.querySelectorAll('.no-deal-state').forEach(el => {
            el.classList.add('active');
        });
        
        // Clear notes
        const notesTextarea = document.getElementById('coachingNotes');
        if (notesTextarea) {
            notesTextarea.value = '';
        }
    },
    
    // Update coaching insights
    updateCoachingInsights: function() {
        if (!this.activeDeal) return;
        
        // Get insights from deals module
        const insights = dealsModule.getDealInsights(this.activeDeal.id);
        if (!insights) return;
        
        // Update playbook deviations
        const playbookContent = document.querySelector('.playbook-content');
        if (playbookContent && insights.playbookDeviations && insights.playbookDeviations.length > 0) {
            const deviationsList = insights.playbookDeviations.map(d => `<li>${d}</li>`).join('');
            playbookContent.innerHTML = `<ul>${deviationsList}</ul>`;
        } else if (playbookContent) {
            playbookContent.innerHTML = '<p>No playbook deviations detected.</p>';
        }
        
        // Update improvement areas
        const improvementContent = document.querySelector('.improvement-content');
        if (improvementContent && insights.riskFactors && insights.riskFactors.length > 0) {
            const risksList = insights.riskFactors.map(r => `<li>${r}</li>`).join('');
            improvementContent.innerHTML = `<ul>${risksList}</ul>`;
        } else if (improvementContent) {
            improvementContent.innerHTML = '<p>No areas for improvement identified.</p>';
        }
        
        // Update recommended actions
        const actionsContent = document.querySelector('.actions-content');
        if (actionsContent && insights.recommendations && insights.recommendations.length > 0) {
            const actionsList = insights.recommendations.map(a => `<li>${a}</li>`).join('');
            actionsContent.innerHTML = `<ul>${actionsList}</ul>`;
        } else if (actionsContent) {
            actionsContent.innerHTML = '<p>No specific actions recommended at this time.</p>';
        }
    },
    
    // Update tasks for the current deal
    updateTasksForDeal: function() {
        if (!this.activeDeal) return;
        
        // Find tasks for this deal
        const dealTasks = this.tasks.filter(task => task.dealId === this.activeDeal.id);
        
        // Add tasks section if it doesn't exist
        const coachingSection = document.querySelector('.coaching-section');
        if (!coachingSection) return;
        
        // Check if tasks section already exists
        let tasksSection = coachingSection.querySelector('.tasks-section');
        if (!tasksSection) {
            // Create tasks section
            tasksSection = document.createElement('div');
            tasksSection.className = 'tasks-section';
            tasksSection.innerHTML = '<h3>Tasks</h3>';
            
            // Insert before notes container
            const notesContainer = coachingSection.querySelector('.coaching-notes-container');
            if (notesContainer) {
                coachingSection.insertBefore(tasksSection, notesContainer);
            } else {
                coachingSection.appendChild(tasksSection);
            }
        }
        
        // Create task list
        let taskList = tasksSection.querySelector('.task-list');
        if (!taskList) {
            taskList = document.createElement('div');
            taskList.className = 'task-list';
            tasksSection.appendChild(taskList);
        }
        
        // Clear existing tasks
        taskList.innerHTML = '';
        
        // Add create task button
        const createTaskBtn = document.createElement('button');
        createTaskBtn.className = 'create-task-btn';
        createTaskBtn.textContent = 'Create New Task';
        createTaskBtn.addEventListener('click', () => {
            this.createNewTask();
        });
        taskList.appendChild(createTaskBtn);
        
        // If no tasks, show empty state
        if (dealTasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-tasks';
            emptyState.textContent = 'No tasks available for this deal.';
            taskList.appendChild(emptyState);
            return;
        }
        
        // Add tasks to list
        dealTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.status} ${task.priority}`;
            taskItem.setAttribute('data-task-id', task.id);
            
            // Format due date
            const dueDate = new Date(task.dueDate);
            const formattedDate = dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            // Create status checkbox
            const statusCheck = document.createElement('input');
            statusCheck.type = 'checkbox';
            statusCheck.checked = task.status === 'completed';
            statusCheck.className = 'task-status';
            statusCheck.addEventListener('change', (e) => {
                this.updateTaskStatus(task.id, e.target.checked ? 'completed' : 'pending');
            });
            
            // Assemble task item
            taskItem.innerHTML = `
                <div class="task-header">
                    <div class="task-status-title">
                        <div class="task-title">${task.title}</div>
                    </div>
                    <div class="task-meta">
                        <span class="task-due-date">Due: ${formattedDate}</span>
                        <span class="task-assignee">Assigned to: ${task.assignee}</span>
                        <span class="task-priority-indicator ${task.priority}">${task.priority}</span>
                    </div>
                </div>
                <div class="task-description">${task.description}</div>
                <div class="task-actions">
                    <button class="edit-task-btn">Edit</button>
                    <button class="delete-task-btn">Delete</button>
                </div>
            `;
            
            // Insert checkbox at the beginning of the task-status-title div
            const statusTitleDiv = taskItem.querySelector('.task-status-title');
            statusTitleDiv.insertBefore(statusCheck, statusTitleDiv.firstChild);
            
            // Add event listeners for actions
            const editBtn = taskItem.querySelector('.edit-task-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.editTask(task.id);
                });
            }
            
            const deleteBtn = taskItem.querySelector('.delete-task-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteTask(task.id);
                });
            }
            
            // Add expand/collapse functionality
            const taskHeader = taskItem.querySelector('.task-header');
            if (taskHeader) {
                taskHeader.addEventListener('click', (e) => {
                    // Don't toggle when clicking checkbox or buttons
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                    
                    taskItem.classList.toggle('expanded');
                });
            }
            
            taskList.appendChild(taskItem);
        });
    },
    
    // Update task status
    updateTaskStatus: function(taskId, status) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        // Update task status
        this.tasks[taskIndex].status = status;
        
        // Update UI
        const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
        if (taskItem) {
            taskItem.classList.remove('completed', 'pending');
            taskItem.classList.add(status);
        }
        
        // In a real implementation, this would also update the server
        console.log(`Task ${taskId} status updated to ${status}`);
    },
    
    // Create a new task
    createNewTask: function() {
        if (!this.activeDeal) return;
        
        // In a real implementation, this would show a modal
        alert('Create new task functionality would go here. In a real implementation, this would show a form to create a new task.');
        
        // For demonstration, let's create a sample task
        const newTask = {
            id: 'task-' + Date.now(),
            title: 'New Task',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date().toISOString().split('T')[0],
            dealId: this.activeDeal.id,
            assignee: 'You',
            description: 'This is a sample task created for demonstration purposes.'
        };
        
        // Add task to list
        this.tasks.push(newTask);
        
        // Update UI
        this.updateTasksForDeal();
    },
    
    // Edit a task
    editTask: function(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // In a real implementation, this would show a modal
        alert(`Edit task "${task.title}" functionality would go here. In a real implementation, this would show a form to edit the task.`);
    },
    
    // Delete a task
    deleteTask: function(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        // Confirm deletion
        if (!confirm(`Are you sure you want to delete the task "${this.tasks[taskIndex].title}"?`)) {
            return;
        }
        
        // Remove task from list
        this.tasks.splice(taskIndex, 1);
        
        // Update UI
        this.updateTasksForDeal();
        
        // In a real implementation, this would also update the server
        console.log(`Task ${taskId} deleted`);
    },
    
    // Save task notes to storage
    saveTaskNotes: function(showConfirmation = true) {
        // In a real implementation, this would save to a database or API
        // Here we'll just use localStorage for demonstration
        if (!this.activeDeal) return;
        
        const notesTextarea = document.getElementById('coachingNotes');
        if (!notesTextarea) return;
        
        try {
            localStorage.setItem(`task_notes_${this.activeDeal.id}`, notesTextarea.value);
            console.log('Task notes saved for deal:', this.activeDeal.id);
            
            if (showConfirmation) {
                // Show saved confirmation
                const saveBtn = document.querySelector('.save-notes-btn');
                if (saveBtn) {
                    saveBtn.classList.add('saved');
                    setTimeout(() => {
                        saveBtn.classList.remove('saved');
                    }, 2000);
                }
            }
        } catch (e) {
            console.error('Error saving task notes:', e);
        }
    },
    
    // Load task notes from storage
    loadTaskNotes: function() {
        if (!this.activeDeal) return '';
        
        try {
            return localStorage.getItem(`task_notes_${this.activeDeal.id}`) || '';
        } catch (e) {
            console.error('Error loading task notes:', e);
            return '';
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
export default tasksModule;

// Expose to window for legacy compatibility
window.tasksModule = tasksModule; 