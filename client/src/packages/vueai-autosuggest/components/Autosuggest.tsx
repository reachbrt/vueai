import React, { useState, useEffect, useRef } from 'react';
import { useAutosuggest } from '../hooks/useAutosuggest';
import { AutosuggestOptions, SuggestionItem } from '../index';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export interface AutosuggestProps extends AutosuggestOptions {
  placeholder?: string;
  className?: string;
  onSelect?: (item: SuggestionItem) => void;
  onChange?: (value: string) => void;
  value?: string;
}

export function Autosuggest({
  provider,
  apiKey,
  model,
  context,
  debounce = 300,
  maxSuggestions = 5,
  placeholder = 'Search...',
  className = '',
  onSelect,
  onChange,
  value: externalValue
}: AutosuggestProps) {
  const [query, setQuery] = useState(externalValue || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    suggestions, 
    isLoading, 
    error, 
    search,
    clearSuggestions
  } = useAutosuggest({
    provider,
    apiKey,
    model,
    context,
    debounce,
    maxSuggestions
  });
  
  // Handle outside clicks to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Sync with external value if provided
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== query) {
      setQuery(externalValue);
    }
  }, [externalValue]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (onChange) {
      onChange(value);
    }
    
    if (value.length > 2) {
      search(value);
      setShowSuggestions(true);
    } else {
      clearSuggestions();
      setShowSuggestions(false);
    }
  };
  
  const handleSelectItem = (item: SuggestionItem) => {
    setQuery(item.text);
    setShowSuggestions(false);
    
    if (onChange) {
      onChange(item.text);
    }
    
    if (onSelect) {
      onSelect(item);
    }
  };
  
  const handleFocus = () => {
    if (query.length > 2) {
      setShowSuggestions(true);
    }
  };
  
  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>
      
      {showSuggestions && (isLoading || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm">Generating suggestions...</p>
            </div>
          ) : (
            <ul>
              {suggestions.map((item, index) => (
                <li 
                  key={index} 
                  className="px-4 py-2 hover:bg-muted cursor-pointer flex justify-between"
                  onClick={() => handleSelectItem(item)}
                >
                  <span>{item.text}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 rounded-full flex items-center">
                    {item.score}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
