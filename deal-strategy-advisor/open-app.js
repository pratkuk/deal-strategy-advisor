// open-app.js - Open the application in the default browser
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

// Get the path to the index.html file
const indexPath = path.join(__dirname, 'index.html');
const absolutePath = path.resolve(indexPath);
const fileUrl = `file://${absolutePath}`;

// Determine the open command based on the operating system
let command;
switch (os.platform()) {
    case 'darwin': // macOS
        command = `open "${absolutePath}"`;
        break;
    case 'win32': // Windows
        command = `start "" "${absolutePath}"`;
        break;
    default: // Linux and others
        command = `xdg-open "${absolutePath}"`;
}

// Execute the command to open the file in the default browser
console.log(`Opening ${fileUrl} in your default browser...`);
exec(command, (error) => {
    if (error) {
        console.error(`Error opening the file: ${error}`);
        console.log('Try opening the file manually in your browser:');
        console.log(fileUrl);
        return;
    }
    console.log('Application opened successfully!');

    // Provide some testing instructions
    console.log('\n===== TESTING INSTRUCTIONS =====');
    console.log('1. You should see the Deal Strategy Advisor application in your browser.');
    console.log('2. The styling should now be applied correctly.');
    console.log('3. Note that there might be issues with ES modules when opening directly from file system.');
    console.log('   This is due to browser security restrictions.');
    console.log('4. For full functionality, use a local server:');
    console.log('   - Use the Python server: python -m http.server');
    console.log('   - Or install serve: npm install -g serve && serve .');
}); 