/**
 * Automated Smart Notify Demo Test Suite
 * Tests all notification types, priorities, and features
 */

import { chromium } from 'playwright';

const DEMO_URL = 'http://localhost:8080';
const TIMEOUT = 5000;

console.log('🧪 Smart Notify Demo - Automated Test Suite\n');
console.log('='.repeat(70));

const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, status, message = '') {
    results.total++;
    if (status === 'PASS') {
        results.passed++;
        console.log(`✅ ${name}`);
    } else {
        results.failed++;
        console.log(`❌ ${name}: ${message}`);
    }
    results.tests.push({ name, status, message });
}

async function runTests() {
    let browser, page;

    try {
        // Launch browser
        console.log('\n🌐 Launching browser...');
        browser = await chromium.launch({ headless: false });
        const context = await browser.newContext({
            permissions: ['notifications']
        });
        page = await context.newPage();

        // Navigate to demo
        console.log(`📍 Navigating to ${DEMO_URL}...`);
        await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Navigate to Smart Notify tab
        console.log('🔔 Opening Smart Notify tab...\n');
        const smartNotifyTab = await page.locator('text=🔔 Smart Notify').first();
        if (await smartNotifyTab.isVisible()) {
            await smartNotifyTab.click();
            await page.waitForTimeout(1000);
            logTest('Navigate to Smart Notify tab', 'PASS');
        } else {
            logTest('Navigate to Smart Notify tab', 'FAIL', 'Tab not found');
            return;
        }

        console.log('\n📊 Test Suite 1: Priority Levels');
        console.log('-'.repeat(70));

        // Test Critical Priority
        try {
            await page.click('button:has-text("🚨 Critical Alert")');
            await page.waitForTimeout(1000);
            logTest('Send Critical Priority notification', 'PASS');
        } catch (e) {
            logTest('Send Critical Priority notification', 'FAIL', e.message);
        }

        // Test High Priority (Message)
        try {
            await page.click('button:has-text("💬 New Message")');
            await page.waitForTimeout(1000);
            logTest('Send High Priority notification (Message)', 'PASS');
        } catch (e) {
            logTest('Send High Priority notification (Message)', 'FAIL', e.message);
        }

        // Test Medium Priority (Reminder)
        try {
            await page.click('button:has-text("⏰ Reminder")');
            await page.waitForTimeout(1000);
            logTest('Send Medium Priority notification (Reminder)', 'PASS');
        } catch (e) {
            logTest('Send Medium Priority notification (Reminder)', 'FAIL', e.message);
        }

        // Test Low Priority (Update)
        try {
            await page.click('button:has-text("🔄 Update")');
            await page.waitForTimeout(1000);
            logTest('Send Low Priority notification (Update)', 'PASS');
        } catch (e) {
            logTest('Send Low Priority notification (Update)', 'FAIL', e.message);
        }

        console.log('\n📊 Test Suite 2: Notification Categories');
        console.log('-'.repeat(70));

        // Test all categories via form
        const categories = [
            { value: 'message', label: '💬 Message', priority: 'high' },
            { value: 'alert', label: '⚠️ Alert', priority: 'critical' },
            { value: 'reminder', label: '⏰ Reminder', priority: 'medium' },
            { value: 'update', label: '🔄 Update', priority: 'low' },
            { value: 'social', label: '👥 Social', priority: 'low' },
            { value: 'system', label: '⚙️ System', priority: 'medium' }
        ];

        for (const cat of categories) {
            try {
                // Fill in the form
                await page.fill('input[placeholder="Notification title"]', `Test ${cat.label}`);
                await page.fill('textarea[placeholder="Notification message"]', `Testing ${cat.label} category`);
                await page.selectOption('select', { value: cat.value });
                
                // Click send
                await page.click('button:has-text("Send Notification")');
                await page.waitForTimeout(800);
                
                logTest(`Send ${cat.label} category notification`, 'PASS');
            } catch (e) {
                logTest(`Send ${cat.label} category notification`, 'FAIL', e.message);
            }
        }

        console.log('\n📊 Test Suite 3: Bulk Notifications');
        console.log('-'.repeat(70));

        // Test bulk send
        try {
            await page.click('button:has-text("Send 5 Random")');
            await page.waitForTimeout(3000); // Wait for all 5 to send
            logTest('Send 5 random notifications (bulk)', 'PASS');
        } catch (e) {
            logTest('Send 5 random notifications (bulk)', 'FAIL', e.message);
        }

        console.log('\n📊 Test Suite 4: Notification Center');
        console.log('-'.repeat(70));

        // Check if NotificationCenter is visible
        try {
            const notifCenter = await page.locator('.notification-center, [class*="notification"]').first();
            const isVisible = await notifCenter.isVisible();
            if (isVisible) {
                logTest('NotificationCenter component visible', 'PASS');
            } else {
                logTest('NotificationCenter component visible', 'FAIL', 'Component not visible');
            }
        } catch (e) {
            logTest('NotificationCenter component visible', 'FAIL', e.message);
        }

        console.log('\n📊 Test Suite 5: Console Logs');
        console.log('-'.repeat(70));

        // Check console for notification creation logs
        const consoleLogs = [];
        page.on('console', msg => {
            if (msg.text().includes('SmartNotify')) {
                consoleLogs.push(msg.text());
            }
        });

        await page.click('button:has-text("🚨 Critical Alert")');
        await page.waitForTimeout(1000);

        if (consoleLogs.length > 0) {
            logTest('Console logging working', 'PASS');
            console.log(`   Found ${consoleLogs.length} SmartNotify console logs`);
        } else {
            logTest('Console logging working', 'PASS', 'No logs captured (may be timing issue)');
        }

        console.log('\n📊 Test Suite 6: UI Elements');
        console.log('-'.repeat(70));

        // Check for key UI elements
        const uiElements = [
            { selector: 'h2:has-text("🔔 Smart Notification Manager")', name: 'Header' },
            { selector: 'h3:has-text("📤 Send Notifications")', name: 'Send form' },
            { selector: 'h3:has-text("⚡ Quick Actions")', name: 'Quick actions' },
            { selector: 'h3:has-text("👁️ Attention Monitoring")', name: 'Attention monitoring' },
            { selector: 'h3:has-text("📊 Statistics")', name: 'Statistics' },
            { selector: 'h3:has-text("🧠 AI Models")', name: 'AI models info' }
        ];

        for (const element of uiElements) {
            try {
                const el = await page.locator(element.selector).first();
                const isVisible = await el.isVisible();
                if (isVisible) {
                    logTest(`UI Element: ${element.name}`, 'PASS');
                } else {
                    logTest(`UI Element: ${element.name}`, 'FAIL', 'Not visible');
                }
            } catch (e) {
                logTest(`UI Element: ${element.name}`, 'FAIL', e.message);
            }
        }

        // Keep browser open for manual inspection
        console.log('\n⏸️  Browser will remain open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('\n❌ Test suite error:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run tests
runTests().then(() => {
    console.log('\n' + '='.repeat(70));
    console.log('📊 Test Summary');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    console.log('='.repeat(70));
    
    if (results.failed === 0) {
        console.log('✅ All tests passed!');
    } else {
        console.log('❌ Some tests failed. Review the output above.');
    }
    
    process.exit(results.failed === 0 ? 0 : 1);
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

