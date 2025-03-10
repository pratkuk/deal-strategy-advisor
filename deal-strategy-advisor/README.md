# Deal Strategy Advisor

A modular web application that provides a unified sales workspace with an integrated deal advisor.

## Project Structure

The codebase is organized into three main sections:

1. **Sales Workspace** - Contains the four main applications:
   - Hubspot (CRM)
   - Gmail
   - Calendar
   - Dealhub (Proposal management)

2. **Deal Advisor Widget** - A floating widget with three modes:
   - Agent: Chat with an AI assistant about deals
   - Ask: Upload and analyze deal documents
   - Tasks: View deal insights and manage tasks

3. **Deal Data** - Centralized data management for deals

## Directory Structure

```
deal-strategy-advisor/
├── index.html             # Main entry point
├── css/
│   ├── main.css           # Main CSS file that imports all others
│   ├── workspace.css      # Styles for the workspace
│   ├── widget.css         # Styles for the widget
│   └── components/        # Reusable component styles
│       ├── global.css     # Global styles for all components
│       └── responsive.css # Responsive layout adjustments
├── js/
│   ├── main.js            # Main initialization
│   ├── workspace/         # Workspace modules
│   │   ├── workspace.js   # Workspace controller
│   │   ├── hubspot.js     # Hubspot app
│   │   ├── gmail.js       # Gmail app
│   │   ├── calendar.js    # Calendar app
│   │   └── dealhub.js     # Dealhub app
│   ├── widget/            # Widget modules
│   │   ├── widget.js      # Widget controller
│   │   ├── agent.js       # Agent mode (formerly Chat)
│   │   ├── ask.js         # Ask mode (formerly Composer)
│   │   ├── tasks.js       # Tasks mode (formerly Coaching)
│   │   └── context.js     # Context menu functionality
│   └── data/              # Data modules
│       └── deals.js       # Deal data and operations
├── open-app.js            # Utility script to open the app in a browser
└── assets/               
    └── images/            # Image assets
```

## Getting Started

### Prerequisites

- Node.js (v14+)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/deal-strategy-advisor.git
cd deal-strategy-advisor
```

2. Install dependencies
```bash
npm install
```

### Running the Application

There are multiple ways to run the application:

#### Option 1: Using the serve package
```bash
npm run dev
```
Then open http://localhost:3000 in your browser

#### Option 2: Direct file opening (limited functionality)
```bash
npm run open
```
This will open the application directly in your default browser.
Note: Some features may not work due to browser security restrictions when opening files directly.

#### Option 3: Using Python's built-in HTTP server
```bash
# For Python 3
python -m http.server 3000

# For Python 2
python -m SimpleHTTPServer 3000
```
Then open http://localhost:3000 in your browser

## Testing

We provide both automated and manual testing capabilities:

### Automated Tests
Open the browser's console to see the results of automated tests.

### Manual Testing
Follow the test plan in `test-plan.md` to manually test all features.

## Features

- **Unified Sales Workspace**: Switch between multiple sales applications in one interface
- **Deal Pipeline**: View and manage deals in a kanban-style board
- **AI Deal Assistant**: Get AI-powered recommendations and insights for your deals
- **Context-Aware Interactions**: Reference deal data easily in conversations and notes
- **Deal Analysis**: Identify risk factors and improvement opportunities

## Technical Details

- Built with vanilla JavaScript (ES modules)
- No external frameworks
- Uses CSS imports for modular styling
- Simulates API interactions for demonstration purposes

## Known Issues

- When opening the file directly (without a server), ES module imports may not work due to browser security restrictions
- For full functionality, always use a local server (options 1 or 3 above) 