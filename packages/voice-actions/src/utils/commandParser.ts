/**
 * Command Parser Utility
 * Provides utilities for parsing and matching voice commands
 */

export interface ParsedCommand {
  command: string;
  intent: string;
  entities: Record<string, any>;
  confidence: number;
}

/**
 * Parse a voice command into structured data
 */
export function parseCommand(text: string): ParsedCommand {
  const normalized = text.toLowerCase().trim();
  
  // Extract intent
  const intent = extractIntent(normalized);
  
  // Extract entities
  const entities = extractEntities(normalized);
  
  return {
    command: text,
    intent,
    entities,
    confidence: 1.0
  };
}

/**
 * Extract intent from command text
 */
function extractIntent(text: string): string {
  const intentPatterns: Record<string, RegExp[]> = {
    navigate: [/go to/i, /open/i, /navigate to/i, /show me/i],
    search: [/search for/i, /find/i, /look for/i, /lookup/i],
    create: [/create/i, /add/i, /new/i, /make/i],
    delete: [/delete/i, /remove/i, /clear/i],
    update: [/update/i, /edit/i, /change/i, /modify/i],
    play: [/play/i, /start/i],
    pause: [/pause/i, /stop/i],
    help: [/help/i, /what can/i, /how do/i]
  };

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some(pattern => pattern.test(text))) {
      return intent;
    }
  }

  return 'unknown';
}

/**
 * Extract entities from command text
 */
function extractEntities(text: string): Record<string, any> {
  const entities: Record<string, any> = {};

  // Extract numbers
  const numberMatch = text.match(/\d+/);
  if (numberMatch) {
    entities.number = parseInt(numberMatch[0]);
  }

  // Extract quoted strings
  const quotedMatch = text.match(/"([^"]+)"/);
  if (quotedMatch) {
    entities.quoted = quotedMatch[1];
  }

  // Extract time expressions
  const timeMatch = text.match(/(\d+)\s*(second|minute|hour|day)s?/i);
  if (timeMatch) {
    entities.time = {
      value: parseInt(timeMatch[1]),
      unit: timeMatch[2].toLowerCase()
    };
  }

  return entities;
}

/**
 * Match command against a pattern
 */
export function matchCommand(text: string, pattern: string | RegExp): string[] | null {
  if (pattern instanceof RegExp) {
    const match = text.match(pattern);
    return match ? Array.from(match) : null;
  }

  const regex = new RegExp(pattern, 'i');
  const match = text.match(regex);
  return match ? Array.from(match) : null;
}

/**
 * Calculate similarity between two strings (0-1)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Find best matching command from a list
 */
export function findBestMatch(
  text: string,
  commands: Array<{ pattern: string | RegExp; description?: string }>
): { index: number; confidence: number } | null {
  let bestMatch: { index: number; confidence: number } | null = null;

  commands.forEach((cmd, index) => {
    const match = matchCommand(text, cmd.pattern);
    if (match) {
      const confidence = match[0].length / text.length;
      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = { index, confidence };
      }
    }
  });

  return bestMatch;
}

