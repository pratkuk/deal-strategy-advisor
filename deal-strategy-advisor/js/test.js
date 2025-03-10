// test.js - Automated tests for Deal Strategy Advisor
// This script will run a series of tests to verify core functionality

console.log('===== DEAL STRATEGY ADVISOR - AUTOMATED TESTS =====');

// Track test results
const testResults = {
    passed: 0,
    failed: 0,
    total: 0
};

// Test utility functions
function assert(condition, message) {
    testResults.total++;
    if (condition) {
        console.log('✅ PASS: ' + message);
        testResults.passed++;
    } else {
        console.error('❌ FAIL: ' + message);
        testResults.failed++;
    }
}

function runTestSuite(suiteName, tests) {
    console.log(`\n----- Test Suite: ${suiteName} -----`);
    tests.forEach(test => {
        try {
            test();
        } catch (error) {
            console.error(`❌ FAIL: Unexpected error in test: ${error.message}`);
            testResults.failed++;
            testResults.total++;
        }
    });
}

// ===== DATA MODULE TESTS =====
function testDealsModule() {
    if (typeof dealsModule === 'undefined') {
        console.error('❌ FAIL: dealsModule not found. Make sure it is exported to window.');
        testResults.failed++;
        testResults.total++;
        return;
    }

    // Test getting all deals
    const allDeals = dealsModule.getAllDeals();
    assert(Array.isArray(allDeals), 'getAllDeals returns an array');
    assert(allDeals.length > 0, 'getAllDeals returns non-empty array');

    // Test getting deal by ID
    const deal = dealsModule.getDealById('deal-1');
    assert(deal !== undefined, 'getDealById returns a deal for valid ID');
    assert(deal.id === 'deal-1', 'getDealById returns correct deal object');
    
    const invalidDeal = dealsModule.getDealById('non-existent-deal');
    assert(invalidDeal === undefined, 'getDealById returns undefined for invalid ID');

    // Test getting deals by stage
    const stageDeals = dealsModule.getDealsByStage('Qualification');
    assert(Array.isArray(stageDeals), 'getDealsByStage returns an array');
    
    // Test getting deal stages
    const stages = dealsModule.getDealStages();
    assert(Array.isArray(stages), 'getDealStages returns an array');
    assert(stages.length > 0, 'getDealStages returns non-empty array');
    assert(stages[0].hasOwnProperty('name'), 'getDealStages returns objects with name property');
    assert(stages[0].hasOwnProperty('count'), 'getDealStages returns objects with count property');
    
    // Test getting deal insights
    const insights = dealsModule.getDealInsights('deal-1');
    assert(insights !== null, 'getDealInsights returns data for valid ID');
    assert(insights.hasOwnProperty('recommendations'), 'getDealInsights includes recommendations');
    
    // Test getting deal reference data
    const referenceData = dealsModule.getDealReferenceData('deal-1');
    assert(Array.isArray(referenceData), 'getDealReferenceData returns an array');
    assert(referenceData.length > 0, 'getDealReferenceData returns non-empty array');
    assert(referenceData[0].hasOwnProperty('label'), 'Reference data items have label property');
    assert(referenceData[0].hasOwnProperty('value'), 'Reference data items have value property');
}

// ===== WORKSPACE MODULE TESTS =====
function testWorkspaceModule() {
    if (typeof workspaceModule === 'undefined') {
        console.error('❌ FAIL: workspaceModule not found. Make sure it is exported to window.');
        testResults.failed++;
        testResults.total++;
        return;
    }

    // Test workspace module properties
    assert(typeof workspaceModule.activeTab === 'string', 'workspaceModule has activeTab property');
    assert(typeof workspaceModule.initialize === 'function', 'workspaceModule has initialize method');
    assert(typeof workspaceModule.activateTab === 'function', 'workspaceModule has activateTab method');
    
    // Test tab activation (mock test)
    const originalTab = workspaceModule.activeTab;
    const testTab = (originalTab === 'hubspot') ? 'gmail' : 'hubspot';
    
    // Store original document.querySelectorAll to restore it later
    const originalQuerySelectorAll = document.querySelectorAll;
    
    // Mock document.querySelectorAll to prevent actual DOM manipulation during tests
    document.querySelectorAll = function(selector) {
        return {
            forEach: function(callback) {
                // Mock elements for testing
                const mockElements = [
                    { 
                        getAttribute: () => testTab,
                        classList: {
                            add: () => {},
                            remove: () => {}
                        }
                    },
                    { 
                        getAttribute: () => originalTab,
                        classList: {
                            add: () => {},
                            remove: () => {}
                        }
                    }
                ];
                
                mockElements.forEach(callback);
            }
        };
    };
    
    // Test activation
    try {
        workspaceModule.activateTab(testTab);
        assert(workspaceModule.activeTab === testTab, 'activateTab changes activeTab property');
        
        // Restore original tab and document.querySelectorAll
        workspaceModule.activeTab = originalTab;
        document.querySelectorAll = originalQuerySelectorAll;
    } catch (error) {
        // Restore document.querySelectorAll even if test fails
        document.querySelectorAll = originalQuerySelectorAll;
        throw error;
    }
}

// ===== WIDGET MODULE TESTS =====
function testWidgetModule() {
    if (typeof widgetModule === 'undefined') {
        console.error('❌ FAIL: widgetModule not found. Make sure it is exported to window.');
        testResults.failed++;
        testResults.total++;
        return;
    }

    // Test widget module properties
    assert(typeof widgetModule.currentTab === 'string', 'widgetModule has currentTab property');
    assert(widgetModule.activeDeal === null || typeof widgetModule.activeDeal === 'object', 
           'widgetModule has activeDeal property');
    assert(typeof widgetModule.initialize === 'function', 'widgetModule has initialize method');
    assert(typeof widgetModule.switchTab === 'function', 'widgetModule has switchTab method');
    assert(typeof widgetModule.setActiveDeal === 'function', 'widgetModule has setActiveDeal method');
    assert(typeof widgetModule.clearActiveDeal === 'function', 'widgetModule has clearActiveDeal method');
    
    // Test tab switching (mock test)
    const originalTab = widgetModule.currentTab;
    const testTab = (originalTab === 'agent') ? 'ask' : 'agent';
    
    // Store original methods to restore them later
    const originalQuerySelectorAll = document.querySelectorAll;
    
    // Mock document.querySelectorAll to prevent actual DOM manipulation during tests
    document.querySelectorAll = function(selector) {
        return {
            forEach: function(callback) {
                // Mock elements for testing
                const mockElements = [
                    { 
                        getAttribute: () => testTab,
                        classList: {
                            add: () => {},
                            remove: () => {},
                            contains: () => true
                        }
                    }
                ];
                
                mockElements.forEach(callback);
            }
        };
    };
    
    // Mock querySelector to return null to skip DOM manipulation
    const originalQuerySelector = document.querySelector;
    document.querySelector = function() {
        return null;
    };
    
    // Test tab switching
    try {
        widgetModule.switchTab(testTab);
        assert(widgetModule.currentTab === testTab, 'switchTab changes currentTab property');
        
        // Restore original states
        widgetModule.currentTab = originalTab;
        document.querySelectorAll = originalQuerySelectorAll;
        document.querySelector = originalQuerySelector;
    } catch (error) {
        // Restore original states even if test fails
        document.querySelectorAll = originalQuerySelectorAll;
        document.querySelector = originalQuerySelector;
        throw error;
    }
}

// ===== AGENT MODULE TESTS =====
function testAgentModule() {
    if (typeof agentModule === 'undefined') {
        console.error('❌ FAIL: agentModule not found. Make sure it is exported to window.');
        testResults.failed++;
        testResults.total++;
        return;
    }

    // Test agent module properties
    assert(typeof agentModule.initialized === 'boolean', 'agentModule has initialized property');
    assert(typeof agentModule.initialize === 'function', 'agentModule has initialize method');
    assert(typeof agentModule.activate === 'function', 'agentModule has activate method');
    assert(typeof agentModule.sendChatMessage === 'function', 'agentModule has sendChatMessage method');
    assert(typeof agentModule.processMessage === 'function', 'agentModule has processMessage method');
    
    // Since most of the agent methods rely on DOM manipulation, we'll test them more thoroughly
    // during manual testing. For now, we just check that the module structure is correct.
}

// ===== ASK MODULE TESTS =====
function testAskModule() {
    if (typeof askModule === 'undefined') {
        console.error('❌ FAIL: askModule not found. Make sure it is exported to window.');
        testResults.failed++;
        testResults.total++;
        return;
    }

    // Test ask module properties
    assert(typeof askModule.initialized === 'boolean', 'askModule has initialized property');
    assert(Array.isArray(askModule.uploadedFiles), 'askModule has uploadedFiles array');
    assert(typeof askModule.initialize === 'function', 'askModule has initialize method');
    assert(typeof askModule.activate === 'function', 'askModule has activate method');
    assert(typeof askModule.handleFiles === 'function', 'askModule has handleFiles method');
    assert(typeof askModule.addFileToList === 'function', 'askModule has addFileToList method');
    assert(typeof askModule.analyzeContext === 'function', 'askModule has analyzeContext method');
    assert(typeof askModule.saveNotes === 'function', 'askModule has saveNotes method');
    assert(typeof askModule.loadNotes === 'function', 'askModule has loadNotes method');
    
    // Test utility functions that don't require DOM manipulation
    const formattedSize = askModule.formatFileSize(1500);
    assert(typeof formattedSize === 'string', 'formatFileSize returns a string');
    assert(formattedSize.includes('KB'), 'formatFileSize formats bytes to KB correctly');
    
    const pdfIcon = askModule.getFileTypeIcon('document.pdf');
    assert(typeof pdfIcon === 'string', 'getFileTypeIcon returns a string');
    assert(pdfIcon === '📄', 'getFileTypeIcon returns correct icon for PDF');
    
    const docIcon = askModule.getFileTypeIcon('document.docx');
    assert(docIcon === '📝', 'getFileTypeIcon returns correct icon for DOCX');
    
    const txtIcon = askModule.getFileTypeIcon('document.txt');
    assert(txtIcon === '📃', 'getFileTypeIcon returns correct icon for TXT');
    
    const emlIcon = askModule.getFileTypeIcon('message.eml');
    assert(emlIcon === '✉️', 'getFileTypeIcon returns correct icon for EML');
    
    const unknownIcon = askModule.getFileTypeIcon('unknown.xyz');
    assert(unknownIcon === '📎', 'getFileTypeIcon returns default icon for unknown types');
}

// ===== TASKS MODULE TESTS =====
function testTasksModule() {
    if (typeof tasksModule === 'undefined') {
        console.error('❌ FAIL: tasksModule not found. Make sure it is exported to window.');
        testResults.failed++;
        testResults.total++;
        return;
    }

    // Test tasks module properties
    assert(typeof tasksModule.initialized === 'boolean', 'tasksModule has initialized property');
    assert(Array.isArray(tasksModule.tasks), 'tasksModule has tasks array');
    assert(typeof tasksModule.initialize === 'function', 'tasksModule has initialize method');
    assert(typeof tasksModule.activate === 'function', 'tasksModule has activate method');
    assert(typeof tasksModule.updateCoachingInsights === 'function', 'tasksModule has updateCoachingInsights method');
    assert(typeof tasksModule.updateTasksForDeal === 'function', 'tasksModule has updateTasksForDeal method');
    assert(typeof tasksModule.updateTaskStatus === 'function', 'tasksModule has updateTaskStatus method');
    assert(typeof tasksModule.saveTaskNotes === 'function', 'tasksModule has saveTaskNotes method');
    assert(typeof tasksModule.loadTaskNotes === 'function', 'tasksModule has loadTaskNotes method');
    
    // Test if tasks array has expected structure
    const task = tasksModule.tasks[0];
    assert(task.hasOwnProperty('id'), 'Task has id property');
    assert(task.hasOwnProperty('title'), 'Task has title property');
    assert(task.hasOwnProperty('status'), 'Task has status property');
    assert(task.hasOwnProperty('dealId'), 'Task has dealId property');
    assert(task.hasOwnProperty('description'), 'Task has description property');
    
    // Test task filtering by deal (doesn't require DOM)
    const dealId = task.dealId;
    const dealTasks = tasksModule.tasks.filter(t => t.dealId === dealId);
    assert(dealTasks.length > 0, 'Can filter tasks by dealId');
}

// ===== CONTEXT MODULE TESTS =====
function testContextModule() {
    if (typeof contextModule === 'undefined') {
        console.error('❌ FAIL: contextModule not found. Make sure it is exported to window.');
        testResults.failed++;
        testResults.total++;
        return;
    }

    // Test context module properties
    assert(typeof contextModule.initialize === 'function', 'contextModule has initialize method');
    assert(typeof contextModule.showMenu === 'function', 'contextModule has showMenu method');
    assert(typeof contextModule.hideMenu === 'function', 'contextModule has hideMenu method');
    assert(typeof contextModule.populateContextMenu === 'function', 'contextModule has populateContextMenu method');
    assert(typeof contextModule.insertReference === 'function', 'contextModule has insertReference method');
}

// Run the tests
window.addEventListener('load', function() {
    console.log('Running automated tests...');
    
    // Delay execution slightly to ensure all modules are loaded
    setTimeout(() => {
        runTestSuite('Deals Module', [testDealsModule]);
        runTestSuite('Workspace Module', [testWorkspaceModule]);
        runTestSuite('Widget Module', [testWidgetModule]);
        runTestSuite('Agent Module', [testAgentModule]);
        runTestSuite('Ask Module', [testAskModule]);
        runTestSuite('Tasks Module', [testTasksModule]);
        runTestSuite('Context Module', [testContextModule]);
        
        // Print summary
        console.log('\n===== TEST SUMMARY =====');
        console.log(`Total tests: ${testResults.total}`);
        console.log(`Passed: ${testResults.passed}`);
        console.log(`Failed: ${testResults.failed}`);
        
        // Provide guidance on next steps
        console.log('\n===== NEXT STEPS =====');
        if (testResults.failed > 0) {
            console.log('Automated tests revealed issues that need to be addressed.');
            console.log('Review the failures above and fix them before continuing.');
        } else {
            console.log('Automated tests passed!');
            console.log('Continue with the manual testing outlined in test-plan.md');
        }
        console.log('After automated and manual testing, continue with CSS implementation.');
    }, 500);
}); 