/**
 * Helper script to open the Deal Strategy Advisor application in a browser
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the index.html file path
const indexPath = path.join(__dirname, 'index.html');

// Check if the file exists
if (!fs.existsSync(indexPath)) {
  console.error('Error: index.html file not found');
  process.exit(1);
}

// Determine the command to open the file based on the operating system
let command;
const platform = os.platform();

if (platform === 'darwin') {
  // macOS
  command = `open "${indexPath}"`;
} else if (platform === 'win32') {
  // Windows
  command = `start "" "${indexPath}"`;
} else {
  // Linux and others
  command = `xdg-open "${indexPath}"`;
}

// Execute the command to open the file in the default browser
console.log('Opening Deal Strategy Advisor in your default browser...');
console.log('Note: For full functionality, consider using a server instead:');
console.log('npm run dev');
console.log('');
console.log('Testing information:');
console.log('1. If you see module import errors in the console, this is normal when opening directly');
console.log('2. For full functionality, use a server (npm run dev)');

exec(command, (error) => {
  if (error) {
    console.error(`Error opening the application: ${error.message}`);
    return;
  }
  console.log('Application opened successfully!');
}); 