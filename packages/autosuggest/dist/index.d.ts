interface SuggestionItem {
    text: string;
    score: number;
}
interface AutosuggestOptions {
    provider: string;
    apiKey?: string;
    model?: string;
    context?: string;
    debounce?: number;
    maxSuggestions?: number;
}
interface UseAutosuggestResult {
    suggestions: SuggestionItem[];
    isLoading: boolean;
    error: Error | null;
    search: (query: string) => Promise<void>;
    clearSuggestions: () => void;
}
declare function useAutosuggest(options: AutosuggestOptions): UseAutosuggestResult;
declare const Autosuggest: {
    name: string;
};
declare const _default: {
    useAutosuggest: typeof useAutosuggest;
    Autosuggest: {
        name: string;
    };
};

export { Autosuggest, type AutosuggestOptions, type SuggestionItem, type UseAutosuggestResult, _default as default, useAutosuggest };
