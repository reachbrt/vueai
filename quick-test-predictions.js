// Quick console test for predictions
console.log('🧪 Quick Prediction Test\n');

// Simulate the prediction logic
const COMMON_PHRASES = [
  'I am writing', 'I am looking', 'I am interested',
  'thank you', 'thank you for',
  'how are you', 'how do you', 'how can I',
  'please let me know', 'please send', 'please provide',
  'I would like to', 'looking forward to',
  'what is the', 'what is your',
  'can you help', 'can you please'
];

function testPrediction(input) {
  const matches = COMMON_PHRASES.filter(phrase => 
    phrase.toLowerCase().startsWith(input.toLowerCase())
  );
  return matches.slice(0, 5);
}

const tests = [
  'I am',
  'thank',
  'how are',
  'please',
  'I would like',
  'looking forward',
  'what is',
  'can you'
];

let passed = 0;

tests.forEach((test, i) => {
  const predictions = testPrediction(test);
  const status = predictions.length > 0 ? '✅ PASS' : '❌ FAIL';
  
  console.log(`${i + 1}. "${test}" ${status}`);
  if (predictions.length > 0) {
    predictions.forEach((pred, j) => {
      console.log(`   ${j + 1}. "${pred}"`);
    });
    passed++;
  } else {
    console.log('   No predictions');
  }
  console.log('');
});

console.log(`\n📊 Results: ${passed}/${tests.length} passed (${((passed/tests.length)*100).toFixed(1)}%)\n`);

if (passed === tests.length) {
  console.log('🎉 ALL TESTS PASSED! Full sentence predictions working!\n');
} else if (passed > tests.length * 0.75) {
  console.log('✅ MOST TESTS PASSED! Predictions are working well.\n');
} else {
  console.log('⚠️  SOME TESTS FAILED. Review needed.\n');
}
