#!/usr/bin/env node

/**
 * Test script for Predictive Input - Full Sentence Predictions
 */

import { PredictionEngine } from './packages/predictive-input/src/utils/predictionEngine.ts';

console.log('🧪 Testing Predictive Input - Full Sentence Predictions\n');
console.log('='.repeat(70));

const engine = new PredictionEngine('en');

console.log('\n✅ Prediction engine created');
console.log('📊 Testing WITHOUT training (using common words/phrases)...\n');

const testCases = [
  { input: 'I am', desc: 'Common phrase start' },
  { input: 'thank', desc: 'Gratitude' },
  { input: 'how are', desc: 'Question' },
  { input: 'please', desc: 'Polite request' },
  { input: 'I would like', desc: 'Formal request' },
  { input: 'looking forward', desc: 'Email closing' },
  { input: 'what is', desc: 'Question' },
  { input: 'can you', desc: 'Request' }
];

let passed = 0;

for (let i = 0; i < testCases.length; i++) {
  const test = testCases[i];
  console.log(`\n${i + 1}. Input: "${test.input}" (${test.desc})`);
  
  const predictions = engine.predict({
    previousText: test.input,
    currentWord: '',
    cursorPosition: test.input.length
  }, { maxPredictions: 5, minConfidence: 0.01 });

  console.log(`   Found: ${predictions.length} predictions`);
  
  if (predictions.length > 0) {
    console.log('   Top 5:');
    predictions.slice(0, 5).forEach((p, idx) => {
      console.log(`      ${idx + 1}. "${test.input} ${p.text}" (${(p.confidence * 100).toFixed(1)}%)`);
    });
    console.log('   ✅ PASS');
    passed++;
  } else {
    console.log('   ❌ FAIL - No predictions');
  }
}

console.log('\n' + '='.repeat(70));
console.log(`\n📊 Results: ${passed}/${testCases.length} passed (${((passed/testCases.length)*100).toFixed(1)}%)`);

// Test with training
console.log('\n\n' + '='.repeat(70));
console.log('📚 Testing WITH training...\n');

const trainingText = `
I am writing to inform you about the meeting.
I am looking forward to hearing from you.
Thank you for your time and consideration.
Please let me know if you have questions.
I would like to schedule a call next week.
Can you please send me the details?
`;

console.log('🎓 Training...');
await engine.train(trainingText);
console.log('✅ Training complete!\n');

const trainedTests = [
  { input: 'I am', desc: 'Trained phrase' },
  { input: 'thank you', desc: 'Trained gratitude' },
  { input: 'please let', desc: 'Trained request' }
];

let trainedPassed = 0;

for (let i = 0; i < trainedTests.length; i++) {
  const test = trainedTests[i];
  console.log(`\n${i + 1}. Input: "${test.input}" (${test.desc})`);
  
  const predictions = engine.predict({
    previousText: test.input,
    currentWord: '',
    cursorPosition: test.input.length
  }, { maxPredictions: 5, minConfidence: 0.01 });

  console.log(`   Found: ${predictions.length} predictions`);
  
  if (predictions.length > 0) {
    console.log('   Top 5:');
    predictions.slice(0, 5).forEach((p, idx) => {
      console.log(`      ${idx + 1}. "${test.input} ${p.text}" (${(p.confidence * 100).toFixed(1)}%)`);
    });
    console.log('   ✅ PASS');
    trainedPassed++;
  } else {
    console.log('   ❌ FAIL');
  }
}

console.log('\n' + '='.repeat(70));
console.log('\n🎉 FINAL RESULTS:');
console.log(`   Without Training: ${passed}/${testCases.length} (${((passed/testCases.length)*100).toFixed(1)}%)`);
console.log(`   With Training: ${trainedPassed}/${trainedTests.length} (${((trainedPassed/trainedTests.length)*100).toFixed(1)}%)`);
console.log('\n' + '='.repeat(70));
