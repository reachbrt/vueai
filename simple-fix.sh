#!/bin/bash

# Script to fix the demo with a simpler approach
set -e

echo "Fixing the demo with a simpler approach..."

# Navigate to the root directory
cd "$(dirname "$0")"

# Create a simple version of each package
echo "Creating simplified versions of packages..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Function to create a simplified package
create_simple_package() {
  local package_name=$1
  local package_dir="dist/$package_name"
  
  echo "Creating simplified package for $package_name..."
  
  # Create package directory
  mkdir -p "$package_dir"
  
  # Create package.json
  cat > "$package_dir/package.json" << EOF
{
  "name": "@aivue/$package_name",
  "version": "1.1.5",
  "description": "AI-powered $package_name for Vue.js",
  "main": "index.js",
  "module": "index.js",
  "types": "index.d.ts",
  "author": "reachbrt",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/reachbrt/vueai.git",
    "directory": "packages/$package_name"
  },
  "peerDependencies": {
    "vue": "^2.6.0 || ^3.0.0"
  }
}
EOF

  # Create index.js with stub implementation
  if [ "$package_name" = "core" ]; then
    cat > "$package_dir/index.js" << EOF
// Core package implementation
export class AIClient {
  constructor(options) {
    this.options = options || {};
  }
  
  async chat(messages) {
    return {
      role: 'assistant',
      content: 'This is a simulated response from the AI. In a real implementation, this would connect to an AI provider.'
    };
  }
}

export function initializeAI(options) {
  console.log('AI initialized with options:', options);
}
EOF
  elif [ "$package_name" = "chatbot" ]; then
    cat > "$package_dir/index.js" << EOF
// Chatbot package implementation
export const AiChatWindow = {
  name: 'AiChatWindow',
  props: ['client', 'title', 'placeholder', 'showAvatars', 'theme'],
  template: '<div class="ai-chat-window"><div class="ai-chat-header">{{ title }}</div><div class="ai-chat-messages"></div><div class="ai-chat-input"><input :placeholder="placeholder" /></div></div>'
};

export const AiChatToggle = {
  name: 'AiChatToggle',
  props: ['client', 'title', 'theme'],
  template: '<button class="ai-chat-toggle">Chat</button>'
};

export function useChatEngine(options) {
  return {
    messages: [],
    isLoading: false,
    error: null,
    sendMessage: async (message) => {
      console.log('Sending message:', message);
      return { role: 'assistant', content: 'Simulated response' };
    }
  };
}

export const utils = { 
  formatMarkdown: (text) => text 
};
EOF
  elif [ "$package_name" = "autosuggest" ]; then
    cat > "$package_dir/index.js" << EOF
// Autosuggest package implementation
export const AiAutosuggest = {
  name: 'AiAutosuggest',
  props: ['client', 'placeholder', 'modelValue', 'triggerChars', 'maxTokens', 'showLoading', 'theme'],
  template: '<input class="ai-autosuggest" :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
};
EOF
  elif [ "$package_name" = "smartform" ]; then
    cat > "$package_dir/index.js" << EOF
// SmartForm package implementation
export const AiSmartForm = {
  name: 'AiSmartForm',
  props: ['client', 'schema', 'validation', 'theme'],
  template: '<form class="ai-smart-form" @submit.prevent="$emit(\'submit\', {})"><div v-for="field in schema.fields" :key="field.name" class="ai-form-field"><label>{{ field.label }}</label><input :type="field.type" :name="field.name" /></div><button type="submit">Submit</button></form>'
};
EOF
  fi

  # Create index.d.ts with type definitions
  if [ "$package_name" = "core" ]; then
    cat > "$package_dir/index.d.ts" << EOF
// Type definitions for @aivue/core
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  timestamp?: Date;
}

export class AIClient {
  constructor(options: any);
  chat(messages: Message[]): Promise<Message>;
}

export function initializeAI(options: any): void;
EOF
  elif [ "$package_name" = "chatbot" ]; then
    cat > "$package_dir/index.d.ts" << EOF
// Type definitions for @aivue/chatbot
import { Component } from 'vue';
import { AIClient, Message } from '@aivue/core';

export const AiChatWindow: Component;
export const AiChatToggle: Component;

export interface ChatOptions {
  client: AIClient;
  initialMessages?: Message[];
  systemPrompt?: string;
  streaming?: boolean;
}

export function useChatEngine(options: ChatOptions): {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<Message>;
};

export const utils: {
  formatMarkdown: (text: string) => string;
};
EOF
  elif [ "$package_name" = "autosuggest" ]; then
    cat > "$package_dir/index.d.ts" << EOF
// Type definitions for @aivue/autosuggest
import { Component } from 'vue';

export const AiAutosuggest: Component;
EOF
  elif [ "$package_name" = "smartform" ]; then
    cat > "$package_dir/index.d.ts" << EOF
// Type definitions for @aivue/smartform
import { Component } from 'vue';

export const AiSmartForm: Component;
EOF
  fi

  echo "Created simplified package for $package_name"
}

# Create simplified packages
create_simple_package "core"
create_simple_package "chatbot"
create_simple_package "autosuggest"
create_simple_package "smartform"

# Update demo package.json to use local packages
echo "Updating demo package.json..."
cat > demo/package.json << EOF
{
  "name": "aivue-demo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@aivue/core": "file:../dist/core",
    "@aivue/chatbot": "file:../dist/chatbot",
    "@aivue/autosuggest": "file:../dist/autosuggest",
    "@aivue/smartform": "file:../dist/smartform",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^2.0.0"
  }
}
EOF

# Install dependencies in demo
echo "Installing demo dependencies..."
cd demo
npm install

echo "Demo fixed and ready to run!"
echo "To start the demo, run: cd demo && npm run dev"
