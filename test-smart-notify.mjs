/**
 * Smart Notify Package - Programmatic API Testing
 */

import fs from 'fs';

console.log('🧪 Smart Notify Package - Programmatic API Testing\n');
console.log('='.repeat(60));

const results = { total: 0, passed: 0, failed: 0, tests: [] };

function test(name, fn) {
  results.total++;
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASSED' });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAILED', error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

console.log('\n📊 Test Suite 1: Package Structure');
console.log('-'.repeat(60));

test('Package.json exists', () => {
  const pkg = JSON.parse(fs.readFileSync('./packages/smart-notify/package.json', 'utf-8'));
  if (pkg.name !== '@aivue/smart-notify') throw new Error('Invalid package name');
  if (!pkg.version) throw new Error('No version');
});

test('Dist folder exists', () => {
  if (!fs.existsSync('./packages/smart-notify/dist')) throw new Error('No dist folder');
});

test('Main entry files exist', () => {
  const files = ['./packages/smart-notify/dist/index.js', './packages/smart-notify/dist/index.d.ts', './packages/smart-notify/dist/smart-notify.css'];
  files.forEach(f => { if (!fs.existsSync(f)) throw new Error(`Missing: ${f}`); });
});

test('TypeScript declarations valid', () => {
  const content = fs.readFileSync('./packages/smart-notify/dist/index.d.ts', 'utf-8');
  if (!content.includes('NotificationCenter')) throw new Error('Missing NotificationCenter export');
  if (!content.includes('useSmartNotify')) throw new Error('Missing useSmartNotify export');
});

console.log('\n📊 Test Suite 2: Source Files');
console.log('-'.repeat(60));

test('AI engines exist', () => {
  const engines = ['urgencyDetector', 'timingPredictor', 'groupingEngine', 'attentionMonitor'];
  engines.forEach(e => {
    if (!fs.existsSync(`./packages/smart-notify/src/ai/${e}.ts`)) throw new Error(`Missing: ${e}`);
  });
});

test('Components exist', () => {
  const comps = ['NotificationCenter', 'NotificationItem'];
  comps.forEach(c => {
    if (!fs.existsSync(`./packages/smart-notify/src/components/${c}.vue`)) throw new Error(`Missing: ${c}`);
  });
});

test('Composable exists', () => {
  const content = fs.readFileSync('./packages/smart-notify/src/composables/useSmartNotify.ts', 'utf-8');
  if (!content.includes('export function useSmartNotify')) throw new Error('useSmartNotify not exported');
});

test('Utilities exist', () => {
  if (!fs.existsSync('./packages/smart-notify/src/utils/batchingSystem.ts')) throw new Error('Missing batchingSystem');
  if (!fs.existsSync('./packages/smart-notify/src/utils/storage.ts')) throw new Error('Missing storage');
});

test('Type definitions exist', () => {
  const content = fs.readFileSync('./packages/smart-notify/src/types/index.ts', 'utf-8');
  ['Notification', 'NotificationPriority', 'UserAttention'].forEach(t => {
    if (!content.includes(t)) throw new Error(`Missing type: ${t}`);
  });
});

console.log('\n📊 Test Suite 3: Documentation');
console.log('-'.repeat(60));

test('README exists and is comprehensive', () => {
  const readme = fs.readFileSync('./packages/smart-notify/README.md', 'utf-8');
  if (readme.length < 1000) throw new Error('README too short');
  if (!readme.includes('Installation')) throw new Error('Missing Installation section');
  if (!readme.includes('Features')) throw new Error('Missing Features section');
});

test('CHANGELOG exists', () => {
  const changelog = fs.readFileSync('./packages/smart-notify/CHANGELOG.md', 'utf-8');
  if (!changelog.includes('1.0.0')) throw new Error('Missing version 1.0.0');
});

console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${results.total}`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
console.log('='.repeat(60));
console.log(results.failed === 0 ? '✅ All tests passed!' : '❌ Some tests failed');
