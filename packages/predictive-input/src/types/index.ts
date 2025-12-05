export interface Prediction {
  text: string;
  confidence: number;
  type?: 'completion' | 'suggestion' | 'correction' | 'pattern';
}

