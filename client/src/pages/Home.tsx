import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Info } from "lucide-react";
import { VueAILogo } from "@/components/ui/icons";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

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
            <h1 className="text-2xl font-bold text-foreground">@vueai/core</h1>
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
            A collection of Vue 3 components for building AI-powered interfaces that work with OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek and other LLM providers. Includes fallback mechanisms for when API keys are unavailable. Perfect for customer support, chatbots, auto-suggestions, and AI-enhanced forms.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <h3 className="text-lg font-medium text-foreground">Installation</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <CodeBlock 
                  title="npm" 
                  code="npm install @vueai/chatbot" 
                />
                <div className="mt-3">
                  <CodeBlock 
                    title="yarn" 
                    code="yarn add @vueai/chatbot" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
                <h3 className="text-lg font-medium text-foreground">Compatibility</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                    <span>Vue 3.x</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                    <span>Nuxt 3.x</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                    <span>Vite, Vue CLI, Webpack</span>
                  </li>
                  <li className="flex items-center">
                    <Info className="text-blue-500 mr-2 h-5 w-5" />
                    <span>Vue 2 (with @vue/composition-api)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <h3 className="text-lg font-medium text-foreground">Key Features</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="text-purple-500 mr-2 h-5 w-5" />
                    <span>Multi-provider support (OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek)</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-purple-500 mr-2 h-5 w-5" />
                    <span>Automatic fallback mechanisms</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-purple-500 mr-2 h-5 w-5" />
                    <span>Conversation history management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-purple-500 mr-2 h-5 w-5" />
                    <span>Streaming responses with Markdown</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-purple-500 mr-2 h-5 w-5" />
                    <span>File attachments & PDF parsing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Start</h2>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Basic Implementation</h3>
              
              <CodeBlock 
                title="App.vue" 
                code={`<script setup>
import { AiChatWindow } from '@vueai/chatbot';
import { ref } from 'vue';

// API configuration
const apiConfig = {
  provider: 'openai', // or 'claude', 'azure-openai', etc.
  apiKey: 'your-api-key', // or use environment variables
  model: 'gpt-4o', // model identifier
};

// Optional system prompt
const systemPrompt = 'You are a helpful customer support agent.';

// Optional initial messages
const initialMessages = ref([
  { role: 'system', content: systemPrompt },
  { role: 'assistant', content: 'Hello! How can I help you today?' }
]);

// Handle message submission
const handleSend = (message) => {
  console.log('User sent:', message);
};
</script>

<template>
  <div>
    <AiChatWindow
      :apiConfig="apiConfig"
      :initialMessages="initialMessages"
      :systemPrompt="systemPrompt"
      @send="handleSend"
    />
  </div>
</template>`} 
              />
              
              <h3 className="text-lg font-medium text-foreground mt-8 mb-4">Using the Composable</h3>
              
              <CodeBlock 
                title="CustomChat.vue" 
                code={`<script setup>
import { useChatEngine } from '@vueai/chatbot';
import { ref } from 'vue';

// Initialize chat engine with options
const { 
  messages, 
  isLoading, 
  error, 
  sendMessage,
  resetConversation 
} = useChatEngine({
  provider: 'claude',
  apiKey: 'your-claude-api-key',
  model: 'claude-3-haiku',
  systemPrompt: 'You are a helpful assistant'
});

const userInput = ref('');

const handleSubmit = () => {
  if (!userInput.value.trim()) return;
  sendMessage(userInput.value);
  userInput.value = '';
};
</script>

<template>
  <div class="chat-container">
    <!-- Messages display -->
    <div class="messages">
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        :class="['message', msg.role]"
      >
        {{ msg.content }}
      </div>
      <div v-if="isLoading" class="loading">AI is thinking...</div>
    </div>
    
    <!-- Input form -->
    <div class="input-area">
      <input 
        v-model="userInput" 
        @keyup.enter="handleSubmit"
        placeholder="Type a message..."
      />
      <button @click="handleSubmit">Send</button>
    </div>
  </div>
</template>`} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Monorepo Structure */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Monorepo Structure</h2>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                The VueAI packages are organized in a monorepo structure using Bit or Lerna for component management. This allows for shared code, consistent versioning, and simplified dependency management.
              </p>
              
              <CodeBlock 
                title="Directory Structure" 
                code={`vueai-monorepo/
├── packages/
│   ├── chatbot/           # @vueai/chatbot
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── AiChatWindow.vue
│   │   │   ├── composables/
│   │   │   │   └── useChatEngine.ts
│   │   │   └── index.ts
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── autosuggest/       # @vueai/autosuggest
│   ├── smartform/         # @vueai/smartform
│   └── core/              # @vueai/core (shared logic)
│       ├── src/
│       │   ├── ai-client.ts
│       │   ├── providers/
│       │   │   ├── openai.ts
│       │   │   ├── claude.ts
│       │   │   ├── gemini.ts
│       │   │   ├── huggingface.ts
│       │   │   ├── ollama.ts
│       │   │   ├── deepseek.ts
│       │   │   └── fallback.ts
│       │   └── index.ts
│       └── package.json
│
├── .bit/                 # Bit configuration
└── workspace.json        # Monorepo config`} 
              />
              
              <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Shared Core Package</h3>
              <p className="text-muted-foreground mb-4">
                The <code className="bg-muted px-1 rounded">@vueai/core</code> package provides shared AI functionality used by all components:
              </p>
              
              <CodeBlock 
                title="packages/core/src/ai-client.ts" 
                code={`export class AIClient {
  private options: AIClientOptions;
  private provider: any;
  private useFallback: boolean = false;

  constructor(options: AIClientOptions) {
    this.options = options;
    this.provider = this._resolveProvider(options.provider);
  }

  private _providerNeedsApiKey(providerName: string): boolean {
    return providerName !== 'local' && providerName !== 'ollama';
  }

  private _resolveProvider(providerName: string) {
    // If the provider needs an API key but none is provided, use fallback
    if (this._providerNeedsApiKey(providerName) && !this.getProviderApiKey(providerName)) {
      console.warn(\`No API key for \${providerName}, using fallback provider\`);
      this.useFallback = true;
      return new FallbackProvider();
    }

    // Otherwise use the requested provider
    switch (providerName) {
      case 'openai':
        return new OpenAIProvider(this.options);
      case 'claude':
        return new ClaudeProvider(this.options);
      case 'gemini':
        return new GeminiProvider(this.options);
      case 'huggingface':
        return new HuggingFaceProvider(this.options);
      case 'ollama':
        return new OllamaProvider(this.options);
      case 'deepseek':
        return new DeepSeekProvider(this.options);
      default:
        console.warn(\`Provider \${providerName} not supported, using fallback\`);
        this.useFallback = true;
        return new FallbackProvider();
    }
  }

  private getProviderApiKey(provider: string): string {
    return this.options.apiKey || '';
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<Message> {
    return this.provider.chat(messages, options);
  }
  
  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    return this.provider.streamChat(messages, callbacks);
  }
  
  async embeddings(text: string | string[]): Promise<number[][]> {
    return this.provider.embeddings(text);
  }
}`} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Building & Publishing */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Building & Publishing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30">
                <h3 className="text-lg font-medium text-foreground">Vite Configuration</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <CodeBlock 
                  title="vite.config.ts" 
                  code={`import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ['src'] })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueAIChatbot',
      fileName: (format) => \`vueai-chatbot.\${format}.js\`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', '@vueai/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@vueai/core': 'VueAICore'
        }
      }
    }
  }
});`} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30">
                <h3 className="text-lg font-medium text-foreground">Package Configuration</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <CodeBlock 
                  title="package.json" 
                  code={`{
  "name": "@vueai/chatbot",
  "version": "1.0.0-beta",
  "description": "AI-powered chat components for Vue.js",
  "type": "module",
  "main": "dist/vueai-chatbot.umd.js",
  "module": "dist/vueai-chatbot.es.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    "./": {
      "import": "./dist/vueai-chatbot.es.js",
      "require": "./dist/vueai-chatbot.umd.js"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "vue": "^3.3.0",
    "@vueai/core": "^1.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vite-plugin-dts": "^3.5.2",
    "vitest": "^0.34.4"
  }
}`} 
                />
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30">
              <h3 className="text-lg font-medium text-foreground">GitHub Actions Workflow</h3>
            </CardHeader>
            <CardContent className="pt-6">
              <CodeBlock 
                title=".github/workflows/publish.yml" 
                code={`name: Publish
on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build packages
        run: npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Publish to npm
        run: npm publish --access public --workspace @vueai/chatbot
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}`} 
              />
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="outline" className="text-blue-700 dark:text-blue-400">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  View Full Documentation
                </Button>
                <Button variant="outline" className="text-green-700 dark:text-green-400">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  View on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
}
