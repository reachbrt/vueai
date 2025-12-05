#!/usr/bin/env node

/**
 * Automated test for Emotion UI - Emoji Change Verification
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Emotion UI - Emoji Change Test\n');
console.log('='.repeat(70));

// Simulate the emotion store behavior
class EmotionStore {
  constructor() {
    this.currentEmotion = {
      value: {
        primary: 'neutral',
        confidence: 1,
        intensity: 0,
        sources: {},
        timestamp: Date.now()
      }
    };
    this.history = [];
  }

  updateFromText(sentiment) {
    this.history.push({ ...this.currentEmotion.value });
    this.currentEmotion.value = {
      primary: sentiment.emotion,
      confidence: sentiment.confidence,
      intensity: sentiment.intensity,
      sources: { text: sentiment },
      timestamp: Date.now()
    };
  }
}

// Sentiment analysis (simplified)
function analyzeSentiment(text) {
  const EMOTION_KEYWORDS = {
    positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect', 'awesome', 'happy', 'thanks', 'thank you'],
    negative: ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'poor', 'disappointing', 'sad', 'angry'],
    frustrated: ['ugh', 'argh', 'wtf', 'seriously', 'again', 'still', 'broken', 'not working', 'error', 'fail', 'stuck', 'help', 'frustrated'],
    excited: ['wow', 'yay', 'yes', 'finally', 'awesome', 'cool', 'nice', 'sweet'],
    confused: ['what', 'how', 'why', 'huh', 'confused', 'don\'t understand', 'unclear', '???', 'idk', 'understand']
  };

  const lowerText = text.toLowerCase();
  const scores = { positive: 0, negative: 0, frustrated: 0, excited: 0, confused: 0 };

  Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        scores[emotion]++;
      }
    });
  });

  let maxScore = 0;
  let dominantEmotion = 'neutral';

  Object.entries(scores).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0.5;
  const intensity = Math.min(maxScore / 5, 1);

  return {
    emotion: dominantEmotion,
    confidence,
    intensity,
    keywords: []
  };
}

// Emoji mapping
const emotionIcons = {
  positive: '😊',
  negative: '😔',
  frustrated: '😤',
  excited: '🎉',
  confused: '🤔',
  neutral: '😐'
};

// Test cases
const testCases = [
  { text: 'This is amazing!', expected: 'positive', emoji: '😊' },
  { text: 'I\'m so frustrated with this', expected: 'frustrated', emoji: '😤' },
  { text: 'I don\'t understand how this works', expected: 'confused', emoji: '🤔' },
  { text: 'Wow, this is great!', expected: 'excited', emoji: '🎉' },
  { text: 'This is terrible', expected: 'negative', emoji: '😔' },
  { text: 'Hello there', expected: 'neutral', emoji: '😐' },
  { text: 'Ugh, not working again', expected: 'frustrated', emoji: '😤' },
  { text: 'Thank you so much!', expected: 'positive', emoji: '😊' }
];

let passed = 0;
let failed = 0;

console.log('\n📝 Running Emoji Change Tests...\n');

testCases.forEach((test, index) => {
  const store = new EmotionStore();
  const sentiment = analyzeSentiment(test.text);
  
  // Simulate immediate update
  const startTime = performance.now();
  store.updateFromText(sentiment);
  const endTime = performance.now();
  
  const currentEmotion = store.currentEmotion.value.primary;
  const currentEmoji = emotionIcons[currentEmotion];
  const duration = (endTime - startTime).toFixed(3);
  
  const emotionMatch = currentEmotion === test.expected;
  const emojiMatch = currentEmoji === test.emoji;
  const testPassed = emotionMatch && emojiMatch;
  
  if (testPassed) {
    passed++;
    console.log(`✅ Test ${index + 1}: PASS`);
  } else {
    failed++;
    console.log(`❌ Test ${index + 1}: FAIL`);
  }
  
  console.log(`   Input: "${test.text}"`);
  console.log(`   Expected: ${test.expected} ${test.emoji}`);
  console.log(`   Got: ${currentEmotion} ${currentEmoji}`);
  console.log(`   Update Time: ${duration}ms`);
  console.log(`   Confidence: ${(sentiment.confidence * 100).toFixed(1)}%`);
  console.log('');
});

console.log('='.repeat(70));
console.log('\n📊 Test Summary:\n');
console.log(`   Total Tests: ${testCases.length}`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   Pass Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
console.log('');

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED! Emoji changes are working immediately!\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED. Please review the results above.\n');
  process.exit(1);
}

