/**
 * Text sentiment analysis utilities
 */

export interface SentimentResult {
  emotion: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited' | 'confused';
  confidence: number;
  intensity: number; // 0-1
  keywords: string[];
}

// Emotion keyword dictionaries
const EMOTION_KEYWORDS = {
  positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect', 'awesome', 'happy', 'thanks', 'thank you'],
  negative: ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'poor', 'disappointing', 'sad', 'angry'],
  frustrated: ['ugh', 'argh', 'wtf', 'seriously', 'again', 'still', 'broken', 'not working', 'error', 'fail', 'stuck', 'help'],
  excited: ['wow', 'yay', 'yes', 'finally', 'awesome', 'cool', 'nice', 'sweet'],
  confused: ['what', 'how', 'why', 'huh', 'confused', 'don\'t understand', 'unclear', '???', 'idk']
};

/**
 * Analyze text sentiment
 */
export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length === 0) {
    return {
      emotion: 'neutral',
      confidence: 1,
      intensity: 0,
      keywords: []
    };
  }

  const lowerText = text.toLowerCase();
  
  // Count emotion keywords
  const scores: Record<string, number> = {
    positive: 0,
    negative: 0,
    frustrated: 0,
    excited: 0,
    confused: 0
  };

  const foundKeywords: string[] = [];

  Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        scores[emotion]++;
        foundKeywords.push(keyword);
      }
    });
  });

  // Check for excessive punctuation (frustration indicator)
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;

  if (exclamationCount > 2 || capsRatio > 0.5) {
    scores.frustrated += 2;
  }

  if (questionCount > 2) {
    scores.confused += 1;
  }

  // Determine dominant emotion
  let maxScore = 0;
  let dominantEmotion: SentimentResult['emotion'] = 'neutral';

  Object.entries(scores).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion as SentimentResult['emotion'];
    }
  });

  // Calculate confidence and intensity
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0.5;
  const intensity = Math.min(maxScore / 5, 1);

  return {
    emotion: dominantEmotion,
    confidence,
    intensity,
    keywords: foundKeywords
  };
}

/**
 * Analyze sentiment with AI (optional enhancement)
 */
export async function analyzeSentimentWithAI(text: string, aiClient?: any): Promise<SentimentResult> {
  if (!aiClient) {
    return analyzeSentiment(text);
  }

  try {
    const prompt = `Analyze the emotional sentiment of this text and respond with JSON only:
Text: "${text}"

Respond with: {"emotion": "positive|negative|neutral|frustrated|excited|confused", "confidence": 0-1, "intensity": 0-1, "keywords": []}`;

    const response = await aiClient.chat(prompt);
    const result = typeof response === 'string' ? JSON.parse(response) : response;
    
    return {
      emotion: result.emotion || 'neutral',
      confidence: result.confidence || 0.5,
      intensity: result.intensity || 0.5,
      keywords: result.keywords || []
    };
  } catch (error) {
    console.warn('AI sentiment analysis failed, falling back to keyword analysis:', error);
    return analyzeSentiment(text);
  }
}

