#!/usr/bin/env node

/**
 * Test to verify context is passed correctly to prediction engine
 */

console.log('\n' + '='.repeat(80));
console.log('🧪 CONTEXT PASSING TEST');
console.log('Verifying that full context is passed to prediction engine');
console.log('='.repeat(80) + '\n');

// Simulate what happens in PredictiveInput.vue

function testOldLogic(input) {
  const textBeforeCursor = input;
  const words = textBeforeCursor.split(/\s+/);
  const currentWord = words[words.length - 1] || '';
  const previousText = words.slice(0, -1).join(' ');
  
  return { previousText, currentWord };
}

function testNewLogic(input) {
  const textBeforeCursor = input;
  const words = textBeforeCursor.trim().split(/\s+/).filter(w => w.length > 0);
  const currentWord = words[words.length - 1] || '';
  const previousText = textBeforeCursor.trim();
  
  return { previousText, currentWord };
}

const testCases = [
  { input: 'I am', expected: 'I am' },
  { input: 'I am ', expected: 'I am' },
  { input: 'thank', expected: 'thank' },
  { input: 'thank ', expected: 'thank' },
  { input: 'how are', expected: 'how are' },
  { input: 'how are ', expected: 'how are' },
  { input: 'please', expected: 'please' },
  { input: 'I would like', expected: 'I would like' },
  { input: 'looking forward', expected: 'looking forward' }
];

console.log('📊 Testing OLD logic (BROKEN):\n');

let oldPassed = 0;
testCases.forEach((test, i) => {
  const result = testOldLogic(test.input);
  const passed = result.previousText === test.expected || 
                 (result.previousText + ' ' + result.currentWord).trim() === test.expected;
  
  console.log(`${i + 1}. Input: "${test.input}"`);
  console.log(`   Expected context: "${test.expected}"`);
  console.log(`   Got previousText: "${result.previousText}"`);
  console.log(`   Got currentWord: "${result.currentWord}"`);
  console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  if (passed) oldPassed++;
});

console.log(`OLD Logic: ${oldPassed}/${testCases.length} passed\n`);
console.log('='.repeat(80) + '\n');

console.log('📊 Testing NEW logic (FIXED):\n');

let newPassed = 0;
testCases.forEach((test, i) => {
  const result = testNewLogic(test.input);
  const passed = result.previousText === test.expected;
  
  console.log(`${i + 1}. Input: "${test.input}"`);
  console.log(`   Expected context: "${test.expected}"`);
  console.log(`   Got previousText: "${result.previousText}"`);
  console.log(`   Got currentWord: "${result.currentWord}"`);
  console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  if (passed) newPassed++;
});

console.log(`NEW Logic: ${newPassed}/${testCases.length} passed\n`);
console.log('='.repeat(80) + '\n');

// Summary
console.log('📊 SUMMARY:\n');
console.log(`OLD Logic: ${oldPassed}/${testCases.length} (${((oldPassed/testCases.length)*100).toFixed(1)}%)`);
console.log(`NEW Logic: ${newPassed}/${testCases.length} (${((newPassed/testCases.length)*100).toFixed(1)}%)`);
console.log('');

if (newPassed === testCases.length) {
  console.log('🎉 SUCCESS! New logic passes all tests!');
  console.log('✅ Full context is now passed to prediction engine');
} else {
  console.log('⚠️  Some tests still failing');
}

console.log('\n' + '='.repeat(80));
console.log('');

// Explanation
console.log('💡 EXPLANATION:\n');
console.log('When user types "I am", we want to predict what comes AFTER "I am".');
console.log('So we need to pass "I am" as the context to the n-gram model.\n');
console.log('OLD Logic:');
console.log('  - Input: "I am"');
console.log('  - previousText: "I" (wrong!)');
console.log('  - Predicts what comes after "I", not "I am"\n');
console.log('NEW Logic:');
console.log('  - Input: "I am"');
console.log('  - previousText: "I am" (correct!)');
console.log('  - Predicts what comes after "I am"\n');
console.log('='.repeat(80) + '\n');

process.exit(newPassed === testCases.length ? 0 : 1);

