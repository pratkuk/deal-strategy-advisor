# Testing the Deal Strategy Advisor

This document explains how to test the Deal Strategy Advisor application to ensure all functionality is working as expected.

## Prerequisites

1. Node.js installed on your system
2. A modern web browser (Chrome, Firefox, Safari, or Edge)

## Running the Tests

### Automated Tests

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to http://localhost:3000 (or whatever URL your serve command provides)

3. Open the browser's developer console (F12 or Ctrl+Shift+I in most browsers)

4. You should see automated test results in the console:
   ```
   ===== DEAL STRATEGY ADVISOR - AUTOMATED TESTS =====
   
   ----- Test Suite: Deals Module -----
   ✅ PASS: getAllDeals returns an array
   ✅ PASS: getAllDeals returns non-empty array
   ...
   
   ===== TEST SUMMARY =====
   Total tests: XX
   Passed: XX
   Failed: XX
   ```

5. Review the results and fix any failed tests before proceeding.

### Manual Testing

After the automated tests pass, follow the manual testing plan in `test-plan.md`. This includes:

1. **Workspace Module Tests** - Testing each tab and app functionality
2. **Widget Module Tests** - Testing the floating widget and its tabs
3. **Integration Tests** - Testing how different modules interact
4. **User Flow Tests** - Testing common user scenarios

## Test Mode

When testing, you'll see a "TESTING MODE" indicator in the top-right corner of the application. This indicates that the application is running with test instrumentation enabled.

## Debugging Tips

1. **Console Logging**: Add `console.log()` statements to troubleshoot specific functions
2. **Breakpoints**: Use the browser's developer tools to set breakpoints in your code
3. **Network Tab**: Check the network tab to verify module loading
4. **localStorage**: Inspect localStorage in the Application tab to see saved data

## Common Issues

1. **Module Import Errors**: Make sure your module paths are correct and ES modules are properly configured
2. **DOM Manipulation Errors**: Check if elements exist before trying to manipulate them
3. **Event Handling Issues**: Verify that event listeners are attached to the correct elements
4. **Data Integration Problems**: Ensure deal data is being properly shared between modules

## Next Steps After Testing

After successfully testing the application:

1. Implement the CSS files based on testing feedback
2. Address any functional issues discovered during testing
3. Perform end-to-end testing after CSS implementation
4. Prepare for deployment

## Making Changes to Tests

If you need to modify the tests:

1. Edit `js/test.js` for automated tests
2. Edit `test-plan.md` for manual testing procedures

Remember to run the tests after each significant change to ensure everything continues to work as expected. 