import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, RefreshCw, Maximize } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { AiChatWindow } from "@/packages/vueai-chatbot/components/AiChatWindow";
import { useChatEngine } from "@/packages/vueai-chatbot/hooks/useChatEngine";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ProviderSelector, { type AIProvider } from "@/components/ProviderSelector";

export default function Chatbot() {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [provider, setProvider] = useState<AIProvider>('claude');
  const [model, setModel] = useState<string>('claude-3-haiku');

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

  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    resetConversation 
  } = useChatEngine({
    provider: provider,
    model: model,
    systemPrompt: "You're a helpful AI assistant that specializes in Vue.js and AI components. Help users understand how to use the @vueai/chatbot package."
  });

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      sendMessage(userInput);
      setUserInput("");
    }
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
            <h1 className="text-2xl font-bold text-foreground">@vueai/chatbot</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center">
                <Star className="mr-1 h-3 w-3" /> 
                286
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                v1.0.0-beta
              </Badge>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            A Vue 3 component for building AI-powered chat interfaces that works with OpenAI, Claude, and other LLM providers. Perfect for customer support, chatbots, and interactive AI applications.
          </p>
        </div>

        {/* Live Demo */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Live Demo</h2>
          
          <Card className="shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="9" r="3"></circle>
                  <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"></path>
                </svg>
                <h3 className="font-medium">AI Chat Demo</h3>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                  onClick={resetConversation}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <div className="h-80 overflow-y-auto p-4 bg-muted/20">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start mb-4 text-sm ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 ${msg.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {msg.role === 'user' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 8V4H8"></path>
                          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                          <path d="M2 14h2"></path>
                          <path d="M20 14h2"></path>
                          <path d="M15 13v2"></path>
                          <path d="M9 13v2"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className={`${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } rounded-lg py-2 px-3 max-w-[85%]`}>
                    <p className={msg.role === 'user' ? 'text-primary-foreground' : 'text-foreground'}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start mb-4 text-sm">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8"></path>
                        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                        <path d="M2 14h2"></path>
                        <path d="M20 14h2"></path>
                        <path d="M15 13v2"></path>
                        <path d="M9 13v2"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg py-2 px-3 max-w-[85%]">
                    <p className="text-foreground">Thinking...</p>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-r-none"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  className="rounded-l-none"
                  onClick={handleSendMessage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                </Button>
              </div>
              <div className="mt-4">
                <ProviderSelector
                  value={provider}
                  onChange={(newProvider) => {
                    setProvider(newProvider);
                    resetConversation();
                  }}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {provider === 'ollama' 
                    ? 'Using local Ollama installation. No API key needed.'
                    : 'Works without API keys using our fallback provider. For best results, set up environment variables with valid API keys.'}
                </p>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <div>Powered by @vueai/chatbot</div>
                  <div>Model: {model}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Features */}
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
                  Seamlessly switch between OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek and other AI providers for your chat interface.
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
                  Works even without API keys, automatically using fallback mechanisms to provide responses without interruption.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Markdown Support</h3>
                </div>
                <p className="text-muted-foreground">
                  Rich text formatting with Markdown support for code blocks, lists, tables, and more in chat responses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 2v20M2 5h20M2 19h20"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">System Prompts</h3>
                </div>
                <p className="text-muted-foreground">
                  Customize AI behavior with system prompts to create specialized assistants tailored to your use case.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Streaming Responses</h3>
                </div>
                <p className="text-muted-foreground">
                  Real-time streaming of AI responses for a more natural and engaging conversation experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                      <path d="M12 2v2"></path>
                      <path d="M12 22v-2"></path>
                      <path d="m17 20.66-1-1.73"></path>
                      <path d="M11 10.27 7 3.34"></path>
                      <path d="m20.66 17-1.73-1"></path>
                      <path d="m3.34 7 1.73 1"></path>
                      <path d="M14 12h8"></path>
                      <path d="M2 12h2"></path>
                      <path d="m20.66 7-1.73 1"></path>
                      <path d="m3.34 17 1.73-1"></path>
                      <path d="m17 3.34-1 1.73"></path>
                      <path d="m7 20.66 1-1.73"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Customizable UI</h3>
                </div>
                <p className="text-muted-foreground">
                  Extensive styling options and component-based architecture for seamless integration with your Vue application.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Implementation Example</h2>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">AiChatWindow Component</h3>
              
              <CodeBlock 
                title="Multi-Provider Component Usage" 
                code={`<template>
  <div>
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
    </div>
    
    <AiChatWindow
      :apiConfig="apiConfig"
      :initialMessages="initialMessages"
      :systemPrompt="systemPrompt"
      @send="handleSend"
    />
  </div>
</template>

<script setup>
import { AiChatWindow } from '@vueai/chatbot'
import { ref, computed } from 'vue'

const selectedProvider = ref('openai')
const selectedModel = ref('gpt-4o')

// Update model when provider changes
function handleProviderChange() {
  switch(selectedProvider.value) {
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
}

const apiConfig = computed(() => ({
  provider: selectedProvider.value,
  apiKey: getApiKey(selectedProvider.value),
  model: selectedModel.value
}))

function getApiKey(provider) {
  // Get API key from environment variables
  switch(provider) {
    case 'openai':
      return import.meta.env.VITE_OPENAI_API_KEY
    case 'claude':
      return import.meta.env.VITE_ANTHROPIC_API_KEY
    case 'gemini':
      return import.meta.env.VITE_GEMINI_API_KEY
    case 'huggingface':
      return import.meta.env.VITE_HUGGINGFACE_API_KEY
    case 'deepseek':
      return import.meta.env.VITE_DEEPSEEK_API_KEY
    case 'ollama':
      return 'local' // Ollama doesn't need an API key
  }
}

const systemPrompt = 'You are a helpful assistant'
const initialMessages = ref([
  { role: 'assistant', content: 'Hello! How can I help you today?' }
])

function handleSend(message) {
  console.log('New message:', message)
}
</script>`} 
              />
              
              <h3 className="text-lg font-medium text-foreground mt-8 mb-4">Component Props</h3>
              
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th className="px-4 py-2">Prop</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Default</th>
                    <th className="px-4 py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted/60">
                    <td className="px-4 py-3 font-medium">apiConfig</td>
                    <td className="px-4 py-3 font-mono text-xs">Object</td>
                    <td className="px-4 py-3 font-mono text-xs">required</td>
                    <td className="px-4 py-3">Configuration object for the AI provider</td>
                  </tr>
                  <tr className="border-b border-muted/60">
                    <td className="px-4 py-3 font-medium">initialMessages</td>
                    <td className="px-4 py-3 font-mono text-xs">Array</td>
                    <td className="px-4 py-3 font-mono text-xs">[]</td>
                    <td className="px-4 py-3">Initial messages to display in the chat</td>
                  </tr>
                  <tr className="border-b border-muted/60">
                    <td className="px-4 py-3 font-medium">systemPrompt</td>
                    <td className="px-4 py-3 font-mono text-xs">String</td>
                    <td className="px-4 py-3 font-mono text-xs">""</td>
                    <td className="px-4 py-3">System prompt to establish AI behavior</td>
                  </tr>
                  <tr className="border-b border-muted/60">
                    <td className="px-4 py-3 font-medium">streaming</td>
                    <td className="px-4 py-3 font-mono text-xs">Boolean</td>
                    <td className="px-4 py-3 font-mono text-xs">true</td>
                    <td className="px-4 py-3">Whether to stream the AI response</td>
                  </tr>
                </tbody>
              </table>
              
              <h3 className="text-lg font-medium text-foreground mt-8 mb-4">Events</h3>
              
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th className="px-4 py-2">Event</th>
                    <th className="px-4 py-2">Payload</th>
                    <th className="px-4 py-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted/60">
                    <td className="px-4 py-3 font-medium">send</td>
                    <td className="px-4 py-3 font-mono text-xs">{ "{message: string}" }</td>
                    <td className="px-4 py-3">Emitted when user sends a message</td>
                  </tr>
                  <tr className="border-b border-muted/60">
                    <td className="px-4 py-3 font-medium">response</td>
                    <td className="px-4 py-3 font-mono text-xs">{ "{message: Message}" }</td>
                    <td className="px-4 py-3">Emitted when AI responds</td>
                  </tr>
                  <tr className="border-b border-muted/60">
                    <td className="px-4 py-3 font-medium">error</td>
                    <td className="px-4 py-3 font-mono text-xs">{ "{error: Error}" }</td>
                    <td className="px-4 py-3">Emitted when an error occurs</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
}
