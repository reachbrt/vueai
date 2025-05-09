import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Autosuggest } from "@/packages/vueai-autosuggest/components/Autosuggest";
import { useAutosuggest } from "@/packages/vueai-autosuggest/hooks/useAutosuggest";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ProviderSelector, { type AIProvider } from "@/components/ProviderSelector";

export default function AutosuggestPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [model, setModel] = useState<string>('gpt-4o');
  
  // Update model when provider changes
  useEffect(() => {
    switch(provider) {
      case 'openai':
        setModel('gpt-4o');
        break;
      case 'claude':
        setModel('claude-3-7-sonnet-20250219');
        break;
      case 'gemini':
        setModel('gemini-1.5-pro');
        break;
      case 'huggingface':
        setModel('mistralai/Mistral-7B-Instruct-v0.2');
        break;
      case 'ollama':
        setModel('llama3');
        break;
      case 'deepseek':
        setModel('deepseek-chat');
        break;
      default:
        setModel('');
    }
  }, [provider]);
  
  const { suggestions, search, isLoading, clearSuggestions } = useAutosuggest({
    provider: provider,
    model: model,
    context: 'Vue.js components and libraries'
  });
  
  // Reset suggestions when changing provider
  useEffect(() => {
    clearSuggestions();
    setQuery("");
  }, [provider, clearSuggestions]);
  
  const handleSearch = (value: string) => {
    setQuery(value);
    search(value);
  };

  const CodeBlock = ({ 
    title, 
    code,
    language = "bash"
  }: { 
    title: string; 
    code: string;
    language?: string;
  }) => {
    const handleCopyClick = async () => {
      await copyToClipboard(code);
      toast({
        title: "Copied to clipboard",
        description: "The code has been copied to your clipboard",
      });
    };

    return (
      <div className="code-block">
        <div className="code-header">
          <span>{title}</span>
          <button
            onClick={handleCopyClick}
            className="text-gray-400 hover:text-white text-sm"
            title="Copy to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          </button>
        </div>
        <div className="code-content">
          <pre>{code}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Package Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">@vueai/autosuggest</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center">
                <Star className="mr-1 h-3 w-3" /> 
                243
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                v1.0.0-beta
              </Badge>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            A Vue 3 component for building AI-powered search and suggestion interfaces that works with multiple AI providers. Perfect for search boxes, autocomplete, and semantic search applications.
          </p>
        </div>

        {/* Live Demo */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Live Demo</h2>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
              <h3 className="font-medium">AI Autosuggest Demo</h3>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="mb-4">
                <ProviderSelector
                  value={provider}
                  onChange={setProvider}
                  label="AI Provider"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {provider === 'ollama' 
                    ? 'Using local Ollama installation. No API key needed.'
                    : 'Works without API keys using our fallback provider. For best results, set up environment variables with valid API keys.'}
                </p>
              </div>
              
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for Vue.js components..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                
                {(isLoading || suggestions.length > 0) && (
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
                            onClick={() => setQuery(item.text)}
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
              
              <div className="mt-8">
                <h4 className="font-medium mb-2">Example Usage</h4>
                <CodeBlock 
                  title="Multi-Provider Component Usage" 
                  code={`<template>
  <div>
    <!-- Provider selection -->
    <div class="provider-selector mb-4">
      <label>Select Provider:</label>
      <select v-model="selectedProvider" @change="handleProviderChange">
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
        <option value="gemini">Gemini</option>
        <option value="huggingface">HuggingFace</option>
        <option value="ollama">Ollama</option>
        <option value="deepseek">DeepSeek</option>
      </select>
      
      <p class="provider-info text-sm text-gray-500 mt-1">
        {{ providerInfo }}
      </p>
    </div>
    
    <!-- Search input -->
    <div class="search-container">
      <input 
        v-model="query" 
        @input="handleSearch" 
        placeholder="Search..." 
      />
      
      <div v-if="isLoading" class="loading-indicator">
        Searching...
      </div>
      
      <div v-else-if="suggestions.length > 0" class="suggestions">
        <div 
          v-for="(item, index) in suggestions" 
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(item.text)"
        >
          {{ item.text }}
          <span class="score">{{ item.score }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAutosuggest } from '@vueai/autosuggest'
import { ref, computed, watch } from 'vue'

const query = ref('')
const selectedProvider = ref('openai')
const selectedModel = ref('gpt-4o')

// Change model when provider changes
watch(selectedProvider, (provider) => {
  switch(provider) {
    case 'openai':
      selectedModel.value = 'gpt-4o'
      break
    case 'claude':
      selectedModel.value = 'claude-3-7-sonnet-20250219'
      break
    case 'gemini':
      selectedModel.value = 'gemini-1.5-pro'
      break
    case 'huggingface':
      selectedModel.value = 'mistralai/Mistral-7B-Instruct-v0.2'
      break
    case 'ollama':
      selectedModel.value = 'llama3'
      break
    case 'deepseek':
      selectedModel.value = 'deepseek-chat'
      break
  }
  clearSuggestions()
  query.value = ''
})

// Helper info text
const providerInfo = computed(() => {
  if (selectedProvider.value === 'ollama') {
    return 'Using local Ollama installation. No API key needed.'
  } else {
    return 'API key required (or simulated responses will be used)'
  }
})

const options = computed(() => ({
  provider: selectedProvider.value,
  model: selectedModel.value,
  context: 'Vue.js components and libraries',
  debounce: 300
}))

const { 
  suggestions, 
  search, 
  isLoading, 
  clearSuggestions 
} = useAutosuggest(options)

function handleSearch() {
  if (query.value.length > 2) {
    search(query.value)
  }
}

function selectSuggestion(text) {
  query.value = text
  clearSuggestions()
}
</script>`} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Multiple AI Providers</h3>
                </div>
                <p className="text-muted-foreground">
                  Seamlessly switch between OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek and other AI providers for generating suggestions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 9V5.2M12 5.2L14.2 7.4M12 5.2L9.8 7.4"></path>
                      <path d="M5 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                      <path d="M5 22v-4.7a2 2 0 0 1 1.4-1.9l7.2-2.4a2 2 0 0 1 1.3 0l7.2 2.4a2 2 0 0 1 1.3 1.9V22"></path>
                      <path d="M19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Automatic Fallback</h3>
                </div>
                <p className="text-muted-foreground">
                  Works even without API keys, automatically using fallback mechanisms to provide suggestions without interruption.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 12h8"></path>
                      <path d="M12 8v8"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Contextual Suggestions</h3>
                </div>
                <p className="text-muted-foreground">
                  Provide domain-specific context to improve suggestion quality and relevance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Semantic Search</h3>
                </div>
                <p className="text-muted-foreground">
                  Go beyond keyword matching with true semantic understanding of search queries.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <path d="M12 11h4"></path>
                      <path d="M12 16h4"></path>
                      <path d="M8 11h.01"></path>
                      <path d="M8 16h.01"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Multi-Source Support</h3>
                </div>
                <p className="text-muted-foreground">
                  Combine suggestions from multiple data sources, including AI models and local data.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Client-Side Caching</h3>
                </div>
                <p className="text-muted-foreground">
                  Optimize performance with built-in caching of previous suggestion results.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 0 4H9.24a2 2 0 0 1-1.74-1.1L6 10"></path>
                      <path d="M6 10V5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v5"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Smart Debouncing</h3>
                </div>
                <p className="text-muted-foreground">
                  Intelligent input handling with configurable debounce to reduce API calls.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
