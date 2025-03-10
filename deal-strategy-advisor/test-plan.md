# Testing Plan for Deal Strategy Advisor

This document outlines the testing approach for the Deal Strategy Advisor application. We'll test each module individually and then test the interactions between modules.

## Prerequisites

1. Start a local server in the project directory:
```bash
npm run dev
```

2. Open the application in your browser (typically at http://localhost:3000)

## Module Tests

### 1. Workspace Module Tests

#### Workspace Controller (workspace.js)
- [ ] Verify tab switching works correctly between all four apps (Hubspot, Gmail, Calendar, Dealhub)
- [ ] Confirm appropriate initialization of each app when its tab is selected
- [ ] Check tab styling for active/inactive states

#### Hubspot App (hubspot.js)
- [ ] Verify pipeline board displays correctly with stages and deals
- [ ] Test deal selection functionality
- [ ] Check that deal creation button triggers appropriate action

#### Gmail App (gmail.js)
- [ ] Verify email folders display correctly
- [ ] Test email selection and preview functionality
- [ ] Confirm email folder switching works properly

#### Calendar App (calendar.js)
- [ ] Check month navigation (prev/next)
- [ ] Verify event display and filtering
- [ ] Test event details viewing functionality

#### Dealhub App (dealhub.js)
- [ ] Verify proposal list displays correctly
- [ ] Test proposal selection and preview
- [ ] Check action buttons (edit, send, download) behavior

### 2. Widget Module Tests

#### Widget Controller (widget.js)
- [ ] Test widget collapse/expand functionality
- [ ] Verify drag-and-drop positioning works
- [ ] Check tab switching between Agent, Ask, and Tasks
- [ ] Test deal selection and context management

#### Agent Module (agent.js)
- [ ] Test chat input and message sending
- [ ] Verify chat history display
- [ ] Test context reference functionality (@-mention)
- [ ] Check response generation based on deal context

#### Ask Module (ask.js)
- [ ] Test file upload functionality (both button and drag-and-drop)
- [ ] Verify file validation for types and sizes
- [ ] Check notes saving functionality
- [ ] Test context analysis feature

#### Tasks Module (tasks.js)
- [ ] Verify task list displays correctly for each deal
- [ ] Test task creation, editing, and deletion
- [ ] Check task status updates
- [ ] Verify notes saving functionality
- [ ] Test coaching insights display

#### Context Menu Module (context.js)
- [ ] Verify context menu appears when @ is typed or button is clicked
- [ ] Test context menu item selection
- [ ] Check reference insertion into various input fields

### 3. Data Module Tests

#### Deals Module (deals.js)
- [ ] Verify deal data access functions
- [ ] Test deal insights and recommendations generation
- [ ] Check deal reference data formatting

## Integration Tests

### Cross-Module Interactions
- [ ] Test deal selection in Hubspot propagating to the widget
- [ ] Verify deal context updates across all widget tabs
- [ ] Test widget interaction with different workspace apps

### Error Handling
- [ ] Test behavior with invalid deals
- [ ] Check error handling for file uploads
- [ ] Verify graceful degradation when localStorage is unavailable

## User Flow Tests

### Deal Selection and Exploration
1. [ ] Select a deal in Hubspot
2. [ ] Verify widget updates with deal context
3. [ ] Switch between widget tabs and check context persistence
4. [ ] View related emails in Gmail
5. [ ] Check calendar for deal-related events
6. [ ] View proposal in Dealhub

### Document Analysis Flow
1. [ ] Select a deal
2. [ ] Switch to Ask tab
3. [ ] Upload files and add notes
4. [ ] Analyze context
5. [ ] Verify switch to Agent tab with analysis results

### Task Management Flow
1. [ ] Select a deal
2. [ ] Switch to Tasks tab
3. [ ] Create a new task
4. [ ] Mark a task as complete
5. [ ] Add task notes
6. [ ] Verify notes are saved when switching deals

## Browser Compatibility

Test the application in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Known Limitations for Current Testing

- Visual styling will be limited due to missing CSS files
- Some features may lack visual feedback without proper CSS
- Responsive design cannot be fully tested without CSS

## Next Steps After Testing

1. Implement CSS files based on testing feedback
2. Address any functional issues discovered during testing
3. Perform full end-to-end testing after CSS implementation 