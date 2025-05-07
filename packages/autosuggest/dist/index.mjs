// src/index.ts
function useAutosuggest(options) {
  return {
    suggestions: [],
    isLoading: false,
    error: null,
    search: async () => {
      console.log("Search performed");
    },
    clearSuggestions: () => {
      console.log("Suggestions cleared");
    }
  };
}
var Autosuggest = {
  name: "Autosuggest"
  // Component implementation would go here
};
var index_default = {
  useAutosuggest,
  Autosuggest
};
export {
  Autosuggest,
  index_default as default,
  useAutosuggest
};
