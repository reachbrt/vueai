/**
 * Represents a suggestion item returned by the AI
 */
export interface SuggestionItem {
  /**
   * The suggestion text
   */
  text: string;
  
  /**
   * The relevance score (0-1)
   */
  score: number;
}
