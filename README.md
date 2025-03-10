# Deal Strategy Advisor

A web-based application that provides an interactive widget for sales professionals to manage deals, access deal information, and get AI-powered assistance with their sales process.

## Features

- **Two-Pane Widget Layout**:
  - Chat interface for AI-powered assistance
  - Deal content panel with comprehensive deal information

- **Deal Management**:
  - View and edit deal information (company, value, stage, close date)
  - Manage contacts associated with deals
  - Add and view deal notes
  - Upload and manage deal-related files
  - Track deal history with an interactive timeline

- **Interactive UI**:
  - Collapsible widget that can be expanded to show deal information
  - Tabbed interface for organizing deal content
  - Responsive design that works on desktop and mobile devices

## Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Local development server (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/deal-strategy-advisor.git
   ```

2. Open the project:
   ```
   cd deal-strategy-advisor
   ```

3. Run the application:
   - Open `index.html` directly in a browser, or
   - Use a local server:
     ```
     # Using Python
     python -m http.server
     
     # Using Node.js http-server
     npx http-server
     ```

## Usage

1. The widget appears in the bottom right corner of the workspace
2. Click the expand button (☰) to view the deal content panel
3. Select a deal from the dropdown to load deal information
4. Navigate between the Overview, Files, and History tabs to view different aspects of the deal
5. Use the edit buttons to modify deal information, add notes, contacts, or upload files

## Project Structure

- `index.html` - Main HTML file
- `css/` - Stylesheets
  - `main.css` - Global styles
  - `widget.css` - Widget-specific styles
- `js/` - JavaScript modules
  - `main.js` - Main application code
  - `dealData.js` - Deal data management
  - `dealContent.js` - Deal content UI handling
  - `test.js` - Testing utilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography 