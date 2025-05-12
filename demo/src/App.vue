<template>
  <div class="app">
    <!-- Hero Section with GSAP Animation -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-logo" ref="heroLogo">
          <span class="logo-text">AI<span class="logo-accent">Vue</span></span>
        </div>
        <h1 class="hero-title" ref="heroTitle">Modern AI Components for Vue.js</h1>
        <p class="hero-subtitle" ref="heroSubtitle">Enhance your Vue applications with powerful AI capabilities</p>

        <!-- Package Cards -->
        <div class="package-cards" ref="packageCards">
          <div class="package-card chatbot">
            <div class="package-icon">💬</div>
            <div class="package-details">
              <h3>@aivue/chatbot</h3>
              <p>AI-powered chat interfaces</p>
              <span class="package-version">v1.4.9</span>
            </div>
          </div>

          <div class="package-card autosuggest">
            <div class="package-icon">✨</div>
            <div class="package-details">
              <h3>@aivue/autosuggest</h3>
              <p>Smart input suggestions</p>
              <span class="package-version">v1.2.9</span>
            </div>
          </div>

          <div class="package-card smartform">
            <div class="package-icon">📝</div>
            <div class="package-details">
              <h3>@aivue/smartform</h3>
              <p>Intelligent form validation</p>
              <span class="package-version">v1.2.9</span>
            </div>
          </div>

          <div class="package-card core">
            <div class="package-icon">🔷</div>
            <div class="package-details">
              <h3>@aivue/core</h3>
              <p>Core AI functionality</p>
              <span class="package-version">v1.2.9</span>
            </div>
          </div>
        </div>

        <div class="hero-cta" ref="heroCta">
          <a href="https://github.com/reachbrt/vueai" target="_blank" class="hero-button">
            <span class="button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </span>
            GitHub
          </a>
          <a href="#demo" class="hero-button primary" @click.prevent="scrollToDemo">
            <span class="button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
            Try Demo
          </a>
        </div>
      </div>

      <div class="hero-visual" ref="heroVisual">
        <div class="hero-backdrop"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
          <div class="shape shape-6"></div>
        </div>
        <div class="hero-illustration">
          <img src="./assets/images/hero-illustration.svg" alt="AI Components Illustration" />
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section" ref="featuresSection">
      <h2 class="section-title">Features</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index" ref="featureCards">
          <div class="feature-icon" :class="feature.icon"></div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <div id="demo" class="demo-section">
      <!-- Elegant Tabs Navigation -->
      <div class="elegant-tabs-container" ref="tabsContainer">
        <div class="tabs-header">
          <div class="tabs-logo">
            <span class="logo-text">AI<span class="logo-accent">Vue</span></span>
          </div>
          <div class="tabs-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="setActiveTab(tab.id)"
              :class="['tab-button', { active: activeTab === tab.id }]"
              ref="tabButtons"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              {{ tab.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- API Key Configuration Section -->
      <div class="api-key-section">
        <div class="api-key-container">
          <div class="api-key-header">
            <div class="api-key-title">
              <h3>API Key Configuration</h3>
              <span class="api-key-subtitle">Required for all components</span>
            </div>
            <div class="api-key-badge" :class="{ 'badge-success': hasValidApiKey, 'badge-warning': !hasValidApiKey }">
              {{ hasValidApiKey ? 'API Ready' : 'API Key Required' }}
            </div>
          </div>

          <div class="api-key-input">
            <label for="apiKey">OpenAI API Key:</label>
            <div class="input-with-icon">
              <input
                type="password"
                id="apiKey"
                v-model="apiKey"
                placeholder="Enter your OpenAI API key"
                @input="updateApiKey"
              />
              <span class="input-icon" v-if="hasValidApiKey">✓</span>
              <span class="input-icon error" v-else-if="apiKey">✗</span>
            </div>
          </div>

          <div class="api-key-status" :class="{ 'api-key-valid': hasValidApiKey, 'api-key-invalid': !hasValidApiKey && apiKey }">
            <span v-if="hasValidApiKey">✓ API Key set</span>
            <span v-else-if="apiKey">✗ Invalid API Key format</span>
            <span v-else>No API Key provided</span>
          </div>

          <div class="api-key-info">
            <div class="info-icon">ℹ️</div>
            <div class="info-content">
              <p>To use this demo, you need to provide your own OpenAI API key.</p>
              <p>Your API key is stored only in your browser's memory and is never sent to our servers.</p>
              <p>Get an API key at <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Package Info Banner -->
      <div v-if="activeTab !== 'all'" class="package-banner">
        <div class="package-info">
          <h2 class="package-name">{{ currentPackage.name }}</h2>
          <div class="package-description">{{ currentPackage.description }}</div>
          <div class="package-badges">
            <span class="package-badge version">v{{ currentPackage.version }}</span>
            <span class="package-badge npm">npm install {{ currentPackage.npmName }}</span>
            <a :href="currentPackage.github" target="_blank" class="package-badge github">GitHub</a>
          </div>
        </div>
        <div class="package-features">
          <div v-for="(feature, index) in currentPackage.features" :key="index" class="feature-item">
            <div class="feature-icon" v-html="feature.icon"></div>
            <div class="feature-text">{{ feature.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <main>
      <section v-if="activeTab === 'all'">
        <div class="welcome-section" ref="welcomeSection">
          <h2 class="welcome-title">Welcome to Vue AI Components</h2>
          <p class="welcome-description">
            Explore our suite of AI-powered Vue components designed to enhance your applications with intelligent features.
            Each component is fully customizable, easy to integrate, and works with multiple AI providers.
          </p>

          <div class="welcome-cards" ref="welcomeCards">
            <div class="welcome-card" v-for="(tab, index) in tabs.filter(t => t.id !== 'all')" :key="tab.id">
              <div class="welcome-card-icon">{{ tab.icon }}</div>
              <h3 class="welcome-card-title">{{ tab.name }}</h3>
              <p class="welcome-card-description">
                {{ getWelcomeDescription(tab.id) }}
              </p>
              <a href="#" class="welcome-card-link" @click.prevent="setActiveTab(tab.id)">
                Explore {{ tab.name }} <span>→</span>
              </a>
            </div>
          </div>

          <div class="welcome-github">
            <a href="https://github.com/reachbrt/vueai" target="_blank" class="github-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'chatbot'" class="component-section">
        <div class="demo-container">
          <div class="component-hero">
            <div class="component-hero-content">
              <h2 class="component-hero-title">AI Chatbot</h2>
              <p class="component-hero-description">
                Integrate powerful conversational AI into your Vue applications with customizable chat interfaces.
                Support for streaming responses, markdown formatting, and multiple themes.
              </p>
              <div class="component-hero-features">
                <div class="hero-feature"><span class="feature-icon">💬</span> Conversational UI</div>
                <div class="hero-feature"><span class="feature-icon">🔄</span> Streaming Responses</div>
                <div class="hero-feature"><span class="feature-icon">📝</span> Markdown Support</div>
                <div class="hero-feature"><span class="feature-icon">🎨</span> Multiple Themes</div>
              </div>
            </div>
            <div class="component-hero-image">
              <img src="./assets/images/chatbot-illustration.svg" alt="AI Chatbot Illustration" />
            </div>
          </div>

          <div v-if="!hasValidApiKey" class="api-key-warning">
            Please enter a valid OpenAI API key above to use the chatbot.
          </div>
          <div v-else>
            <div class="component-demo-header">
              <h3>Chat Options</h3>
              <div class="component-actions">
                <button @click="resetChatOptions" class="action-button">
                  <span class="action-icon">↺</span> Reset Options
                </button>
              </div>
            </div>

            <div class="options-grid">
              <div class="option-group">
                <label for="chatTitle">Title:</label>
                <input type="text" id="chatTitle" v-model="chatOptions.title" class="styled-input" />
              </div>

              <div class="option-group">
                <label for="chatPlaceholder">Placeholder:</label>
                <input type="text" id="chatPlaceholder" v-model="chatOptions.placeholder" class="styled-input" />
              </div>

              <div class="option-group">
                <label for="chatTheme">Theme:</label>
                <select id="chatTheme" v-model="chatOptions.theme" class="styled-select">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                </select>
              </div>

              <div class="option-group">
                <label for="chatModel">Model:</label>
                <select id="chatModel" v-model="chatOptions.model" class="styled-select">
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>

              <div class="option-group checkbox">
                <div class="styled-checkbox">
                  <input type="checkbox" id="chatAvatars" v-model="chatOptions.showAvatars" />
                  <label for="chatAvatars">Show Avatars</label>
                </div>
              </div>

              <div class="option-group checkbox">
                <div class="styled-checkbox">
                  <input type="checkbox" id="chatStreaming" v-model="chatOptions.streaming" />
                  <label for="chatStreaming">Enable Streaming</label>
                </div>
              </div>

              <div class="option-group checkbox">
                <div class="styled-checkbox">
                  <input type="checkbox" id="chatFullHeight" v-model="chatOptions.fullHeight" />
                  <label for="chatFullHeight">Full Height</label>
                </div>
              </div>

              <div class="option-group checkbox">
                <div class="styled-checkbox">
                  <input type="checkbox" id="chatMarkdown" v-model="chatOptions.markdown" />
                  <label for="chatMarkdown">Enable Markdown</label>
                </div>
              </div>
            </div>

            <div class="option-group full-width">
              <label for="chatSystemPrompt">System Prompt:</label>
              <textarea
                id="chatSystemPrompt"
                v-model="chatOptions.systemPrompt"
                rows="3"
                class="styled-textarea"
              ></textarea>
            </div>

            <div class="component-demo-header">
              <h3>Chat Window Component</h3>
              <div class="component-code">
                <code>import { AiChatWindow } from '@aivue/chatbot';</code>
              </div>
            </div>

            <div class="chat-container" :class="{ 'full-height': chatOptions.fullHeight }">
              <AiChatWindow
                :client="aiClient"
                :title="chatOptions.title"
                :placeholder="chatOptions.placeholder"
                :show-avatars="chatOptions.showAvatars"
                :theme="chatOptions.theme"
                :streaming="chatOptions.streaming"
                :markdown="chatOptions.markdown"
                :system-prompt="chatOptions.systemPrompt"
              />
            </div>

            <div class="component-demo-header">
              <h3>Chat Toggle Component</h3>
              <div class="component-code">
                <code>import { AiChatToggle } from '@aivue/chatbot';</code>
              </div>
            </div>

            <p class="component-description">
              Click the button in the bottom-right corner to toggle a floating chat window.
              This component is perfect for adding chat support to your website without taking up space.
            </p>

            <AiChatToggle
              :client="aiClient"
              :title="chatOptions.title"
              :placeholder="chatOptions.placeholder"
              :show-avatars="chatOptions.showAvatars"
              :theme="chatOptions.theme"
              :streaming="chatOptions.streaming"
              :markdown="chatOptions.markdown"
              :system-prompt="chatOptions.systemPrompt"
            />
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'autosuggest'" class="component-section">
        <div class="demo-container">
          <div class="component-hero">
            <div class="component-hero-content">
              <h2 class="component-hero-title">AI Autosuggest</h2>
              <p class="component-hero-description">
                Enhance user input with AI-powered suggestions that adapt to context and user behavior.
                Perfect for search boxes, form inputs, and any text entry field.
              </p>
              <div class="component-hero-features">
                <div class="hero-feature"><span class="feature-icon">✨</span> Smart Suggestions</div>
                <div class="hero-feature"><span class="feature-icon">⚡</span> Real-time Updates</div>
                <div class="hero-feature"><span class="feature-icon">🔍</span> Context-aware</div>
                <div class="hero-feature"><span class="feature-icon">🎛️</span> Customizable</div>
              </div>
            </div>
            <div class="component-hero-image">
              <img src="./assets/images/autosuggest-illustration.svg" alt="AI Autosuggest Illustration" />
            </div>
          </div>

          <div v-if="!hasValidApiKey" class="api-key-warning">
            Please enter a valid OpenAI API key above to use the autosuggest component.
          </div>
          <div v-else>
            <div class="component-demo-header">
              <h3>Autosuggest Component</h3>
              <div class="component-code">
                <code>import { AiAutosuggest } from '@aivue/autosuggest';</code>
              </div>
            </div>

            <p class="component-description">
              The Autosuggest component provides AI-powered suggestions as users type, enhancing the input experience with contextual recommendations.
            </p>

            <AutosuggestDemo :aiClient="aiClient" />
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'smartform'" class="component-section">
        <div class="demo-container">
          <div class="component-hero">
            <div class="component-hero-content">
              <h2 class="component-hero-title">AI Smart Form</h2>
              <p class="component-hero-description">
                Create intelligent forms with AI validation, suggestions, and data analysis capabilities.
                Includes the "Fix with AI" feature to automatically correct form errors.
              </p>
              <div class="component-hero-features">
                <div class="hero-feature"><span class="feature-icon">📝</span> Smart Forms</div>
                <div class="hero-feature"><span class="feature-icon">✅</span> AI Validation</div>
                <div class="hero-feature"><span class="feature-icon">🪄</span> Fix with AI</div>
                <div class="hero-feature"><span class="feature-icon">💡</span> Intelligent Feedback</div>
              </div>
            </div>
            <div class="component-hero-image">
              <img src="./assets/images/smartform-illustration.svg" alt="AI Smart Form Illustration" />
            </div>
          </div>

          <div v-if="!hasValidApiKey" class="api-key-warning">
            Please enter a valid OpenAI API key above to use the smart form component.
          </div>
          <div v-else>
            <div class="component-demo-header">
              <h3>Smart Form Component</h3>
              <div class="component-code">
                <code>import { AiSmartForm } from '@aivue/smartform';</code>
              </div>
            </div>

            <p class="component-description">
              The Smart Form component provides AI-powered form validation and analysis, helping users complete forms with intelligent feedback.
              When validation errors occur, the "Fix with AI" button appears to automatically correct the form data.
            </p>

            <SmartFormDemo :aiClient="aiClient" />
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'typescript'" class="component-section">
        <div class="demo-container">
          <div class="component-demo-header">
            <h3>TypeScript Integration</h3>
            <div class="component-code">
              <code>import { AIClient } from '@aivue/core';</code>
            </div>
          </div>

          <p class="component-description">
            All @aivue packages are built with TypeScript and provide comprehensive type definitions for better developer experience.
          </p>

          <TypeScriptExample />
        </div>
      </section>
    </main>

    <footer class="elegant-footer" ref="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">AIVue</div>
          <p class="footer-description">
            A suite of AI-powered Vue components designed to enhance your applications with intelligent features.
            Each component is fully customizable, easy to integrate, and works with multiple AI providers.
          </p>
          <div class="footer-social">
            <a href="https://github.com/reachbrt/vueai" target="_blank" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="https://www.npmjs.com/org/aivue" target="_blank" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M0 0h24v24H0z" stroke="none" />
                <path d="M4 10v6h16v-6" />
                <path d="M12 14v2" />
                <path d="M8 14v2" />
                <path d="M16 14v2" />
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="footer-links-title">Components</h3>
          <div class="footer-links">
            <a href="#" @click.prevent="setActiveTab('chatbot')" class="footer-link">
              <span>💬</span> AI Chatbot
            </a>
            <a href="#" @click.prevent="setActiveTab('autosuggest')" class="footer-link">
              <span>✨</span> AI Autosuggest
            </a>
            <a href="#" @click.prevent="setActiveTab('smartform')" class="footer-link">
              <span>📝</span> AI Smart Form
            </a>
            <a href="#" @click.prevent="setActiveTab('typescript')" class="footer-link">
              <span>🔷</span> TypeScript Support
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="footer-links-title">Resources</h3>
          <div class="footer-links">
            <a href="https://github.com/reachbrt/vueai/wiki" target="_blank" class="footer-link">
              <span>📚</span> Documentation
            </a>
            <a href="https://github.com/reachbrt/vueai/issues" target="_blank" class="footer-link">
              <span>🐛</span> Report Issues
            </a>
            <a href="https://github.com/reachbrt/vueai/wiki/Contributing" target="_blank" class="footer-link">
              <span>🤝</span> Contributing
            </a>
            <a href="https://www.npmjs.com/org/aivue" target="_blank" class="footer-link">
              <span>📦</span> NPM Packages
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-copyright">
          © 2025 AIVue. Created by <a href="https://github.com/reachbrt" target="_blank" style="color: #60a5fa; text-decoration: none;">reachbrt</a>
        </div>
        <div class="footer-legal">
          <a href="https://github.com/reachbrt/vueai/blob/main/LICENSE" target="_blank" class="legal-link">MIT License</a>
          <a href="https://github.com/reachbrt/vueai" target="_blank" class="legal-link">GitHub</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AutosuggestDemo from './components/AutosuggestDemo.vue';
import SmartFormDemo from './components/SmartFormDemo.vue';
import TypeScriptExample from './components/TypeScriptExample.vue';
import { AiChatWindow, AiChatToggle } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default {
  name: 'App',
  components: {
    NavBar,
    AutosuggestDemo,
    SmartFormDemo,
    TypeScriptExample,
    AiChatWindow,
    AiChatToggle
  },
  data() {
    return {
      activeTab: 'all',
      apiKey: '',
      aiClient: null,
      hasValidApiKey: false,
      chatOptions: {
        title: 'AI Assistant',
        placeholder: 'Ask me anything...',
        theme: 'light',
        model: 'gpt-3.5-turbo',
        showAvatars: true,
        streaming: true,
        fullHeight: false,
        markdown: true,
        systemPrompt: 'You are a helpful AI assistant. Answer questions concisely and accurately.'
      },
      tabs: [
        {
          id: 'all',
          name: 'Overview',
          icon: '🏠'
        },
        {
          id: 'chatbot',
          name: 'Chatbot',
          icon: '💬'
        },
        {
          id: 'autosuggest',
          name: 'Autosuggest',
          icon: '✨'
        },
        {
          id: 'smartform',
          name: 'Smart Form',
          icon: '📝'
        },
        {
          id: 'typescript',
          name: 'TypeScript',
          icon: '🔷'
        }
      ],
      packages: {
        chatbot: {
          name: '@aivue/chatbot',
          npmName: '@aivue/chatbot',
          version: '1.4.9',
          description: 'AI-powered chat components for Vue.js applications with streaming, markdown support, and customizable UI.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/chatbot',
          features: [
            { icon: '💬', text: 'Conversational UI' },
            { icon: '🔄', text: 'Streaming Responses' },
            { icon: '📝', text: 'Markdown Support' },
            { icon: '🎨', text: 'Multiple Themes' },
            { icon: '📱', text: 'Responsive Design' },
            { icon: '🔌', text: 'Easy Integration' }
          ]
        },
        autosuggest: {
          name: '@aivue/autosuggest',
          npmName: '@aivue/autosuggest',
          version: '1.2.9',
          description: 'AI-powered suggestion components for Vue.js that enhance user input with contextual suggestions.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/autosuggest',
          features: [
            { icon: '✨', text: 'Smart Suggestions' },
            { icon: '⚡', text: 'Real-time Updates' },
            { icon: '🔍', text: 'Context-aware' },
            { icon: '🎛️', text: 'Customizable Options' },
            { icon: '🧠', text: 'AI-powered' },
            { icon: '🔌', text: 'Simple Integration' }
          ]
        },
        smartform: {
          name: '@aivue/smartform',
          npmName: '@aivue/smartform',
          version: '1.2.9',
          description: 'AI-powered form validation and analysis for Vue.js applications with intelligent feedback.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/smartform',
          features: [
            { icon: '📝', text: 'Smart Forms' },
            { icon: '✅', text: 'AI Validation' },
            { icon: '📊', text: 'Data Analysis' },
            { icon: '💡', text: 'Intelligent Feedback' },
            { icon: '🛠️', text: 'Customizable Fields' },
            { icon: '🔌', text: 'Easy Integration' }
          ]
        },
        typescript: {
          name: 'TypeScript Support',
          npmName: '@aivue/core',
          version: '1.2.8',
          description: 'Full TypeScript support with comprehensive type definitions for all components and APIs.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/core',
          features: [
            { icon: '🔷', text: 'TypeScript Support' },
            { icon: '📘', text: 'Type Definitions' },
            { icon: '🧩', text: 'Intellisense' },
            { icon: '🔒', text: 'Type Safety' },
            { icon: '📚', text: 'Documentation' },
            { icon: '🔌', text: 'Easy Integration' }
          ]
        }
      },
      features: [
        {
          title: 'AI Chatbot',
          description: 'Integrate conversational AI into your Vue applications with customizable chat interfaces.',
          icon: 'icon-chat'
        },
        {
          title: 'AI Autosuggest',
          description: 'Enhance user input with AI-powered suggestions that adapt to context and user behavior.',
          icon: 'icon-suggest'
        },
        {
          title: 'AI Smart Forms',
          description: 'Create intelligent forms with AI validation, suggestions, and data analysis capabilities.',
          icon: 'icon-form'
        },
        {
          title: 'TypeScript Support',
          description: 'Full TypeScript support with type definitions for all components and APIs.',
          icon: 'icon-typescript'
        },
        {
          title: 'Vue 2 & 3 Compatible',
          description: 'Works seamlessly with both Vue 2 and Vue 3 applications.',
          icon: 'icon-vue'
        },
        {
          title: 'Customizable Themes',
          description: 'Multiple built-in themes and extensive styling options to match your application design.',
          icon: 'icon-theme'
        }
      ]
    }
  },
  created() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Check for API key in localStorage
    const savedApiKey = localStorage.getItem('aivue_api_key');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
      this.updateApiKey();
    }
  },

  mounted() {
    // Initialize GSAP animations
    this.initHeroAnimation();
    this.initFeaturesAnimation();
    this.initWelcomeAnimation();
    this.initTabsAnimation();
    this.initFooterAnimation();
  },

  computed: {
    currentPackage() {
      return this.packages[this.activeTab] || {};
    }
  },
  methods: {
    updateApiKey() {
      // Simple validation for OpenAI API key format (starts with 'sk-')
      if (this.apiKey && this.apiKey.startsWith('sk-') && this.apiKey.length > 20) {
        this.hasValidApiKey = true;

        // Create a new AI client with the provided API key
        this.aiClient = new AIClient({
          provider: 'openai',
          apiKey: this.apiKey,
          model: this.chatOptions.model
        });

        // Save API key to localStorage
        localStorage.setItem('aivue_api_key', this.apiKey);
      } else {
        this.hasValidApiKey = false;

        // Create a fallback client
        this.aiClient = new AIClient({
          provider: 'fallback',
          model: 'gpt-3.5-turbo'
        });
      }
    },

    resetChatOptions() {
      this.chatOptions = {
        title: 'AI Assistant',
        placeholder: 'Ask me anything...',
        theme: 'light',
        model: 'gpt-3.5-turbo',
        showAvatars: true,
        streaming: true,
        fullHeight: false,
        markdown: true,
        systemPrompt: 'You are a helpful AI assistant. Answer questions concisely and accurately.'
      };

      // Update the AI client with the new model
      if (this.hasValidApiKey) {
        this.aiClient = new AIClient({
          provider: 'openai',
          apiKey: this.apiKey,
          model: this.chatOptions.model
        });
      }
    },

    scrollToDemo(event) {
      const demoSection = document.getElementById('demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
      }
    },

    initHeroAnimation() {
      // Hero section animation timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Logo animation
      heroTl.from(this.$refs.heroLogo, {
        opacity: 0,
        y: 30,
        duration: 0.8
      });

      // Animate hero title
      heroTl.from(this.$refs.heroTitle, {
        y: 50,
        opacity: 0,
        duration: 1
      }, "-=0.4");

      // Animate hero subtitle
      heroTl.from(this.$refs.heroSubtitle, {
        y: 30,
        opacity: 0,
        duration: 1
      }, '-=0.7');

      // Package cards animation with stagger
      heroTl.from('.package-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1
      }, "-=0.7");

      // Animate CTA buttons
      heroTl.from(this.$refs.heroCta, {
        y: 20,
        opacity: 0,
        duration: 0.8
      }, '-=0.4');

      // Animate hero visual
      heroTl.from('.hero-illustration', {
        opacity: 0,
        scale: 0.9,
        duration: 1
      }, '-=0.8');

      // Animate floating shapes
      gsap.to('.shape-1', {
        y: -20,
        x: 10,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.shape-2', {
        y: 20,
        x: -15,
        rotation: -8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.2
      });

      gsap.to('.shape-3', {
        y: -15,
        x: -10,
        rotation: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
      });

      gsap.to('.shape-4', {
        y: 25,
        x: 15,
        rotation: -5,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.7
      });

      gsap.to('.shape-5', {
        y: 10,
        x: -10,
        rotation: 20,
        duration: 7.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3
      });

      gsap.to('.shape-6', {
        y: -10,
        x: 10,
        rotation: -20,
        duration: 8.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.6
      });

      // Hover animations for package cards
      const packageCards = document.querySelectorAll('.package-card');
      packageCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -5,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            duration: 0.3
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            duration: 0.3
          });
        });
      });
    },

    initFeaturesAnimation() {
      // Features section animation
      gsap.from(this.$refs.featuresSection, {
        scrollTrigger: {
          trigger: this.$refs.featuresSection,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1
      });

      // Staggered animation for feature cards
      gsap.from(this.$refs.featureCards, {
        scrollTrigger: {
          trigger: this.$refs.featuresSection,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15
      });
    },

    initWelcomeAnimation() {
      if (this.$refs.welcomeSection) {
        // Welcome section animation
        gsap.from(this.$refs.welcomeSection, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out'
        });

        // Welcome cards staggered animation
        if (this.$refs.welcomeCards) {
          gsap.from('.welcome-card', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power3.out'
          });

          // Add hover animations for welcome cards
          const welcomeCards = document.querySelectorAll('.welcome-card');
          welcomeCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
              gsap.to(card, {
                y: -5,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                duration: 0.3
              });
            });

            card.addEventListener('mouseleave', () => {
              gsap.to(card, {
                y: 0,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                duration: 0.3
              });
            });
          });
        }
      }
    },

    initTabsAnimation() {
      if (this.$refs.tabsContainer) {
        // Tabs container animation
        gsap.from(this.$refs.tabsContainer, {
          y: -20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        });

        // Add scroll behavior for tabs
        window.addEventListener('scroll', () => {
          const scrollY = window.scrollY;
          if (scrollY > 100) {
            gsap.to(this.$refs.tabsContainer, {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '0.5rem 0',
              duration: 0.3
            });
          } else {
            gsap.to(this.$refs.tabsContainer, {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              padding: '0.75rem 0',
              duration: 0.3
            });
          }
        });
      }
    },

    initFooterAnimation() {
      if (this.$refs.footer) {
        // Footer animation
        gsap.from(this.$refs.footer, {
          scrollTrigger: {
            trigger: this.$refs.footer,
            start: 'top 90%',
            end: 'bottom 100%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out'
        });

        // Footer sections staggered animation
        gsap.from('.footer-section', {
          scrollTrigger: {
            trigger: this.$refs.footer,
            start: 'top 85%',
            end: 'bottom 100%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    },

    setActiveTab(tabId) {
      // Animate tab change
      const oldTab = this.activeTab;
      this.activeTab = tabId;

      // Scroll to top of the section
      setTimeout(() => {
        const demoSection = document.getElementById('demo');
        if (demoSection) {
          demoSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Initialize welcome animations if switching to welcome tab
        if (tabId === 'all') {
          this.initWelcomeAnimation();
        }
      }, 100);
    },

    getWelcomeDescription(tabId) {
      const descriptions = {
        'chatbot': 'Integrate powerful conversational AI into your Vue applications with customizable chat interfaces.',
        'autosuggest': 'Enhance user input with AI-powered suggestions that adapt to context and user behavior.',
        'smartform': 'Create intelligent forms with AI validation, suggestions, and data analysis capabilities.',
        'typescript': 'Full TypeScript support with comprehensive type definitions for all components and APIs.'
      };

      return descriptions[tabId] || '';
    }
  }
}
</script>

<style>
/* Base Styles */
body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  color: #0f172a;
  line-height: 1.6;
}

.app {
  width: 100%;
  overflow-x: hidden;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  margin-top: 0;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #334155;
}

p {
  margin-bottom: 1.5rem;
  color: #475569;
}

/* Hero Section */
.hero-section {
  display: flex;
  min-height: 90vh;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #475569;
  margin-bottom: 2.5rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.hero-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid #2563eb;
}

.hero-button.primary {
  background-color: #2563eb;
  color: white;
}

.hero-button.primary:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.hero-button:not(.primary) {
  background-color: transparent;
  color: #2563eb;
}

.hero-button:not(.primary):hover {
  background-color: rgba(37, 99, 235, 0.1);
  transform: translateY(-2px);
}

.hero-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

/* Floating Shapes */
.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.shape {
  position: absolute;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  opacity: 0.6;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  top: 20%;
  right: 15%;
  filter: blur(30px);
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #8b5cf6, #6d28d9);
  bottom: 20%;
  right: 25%;
  filter: blur(25px);
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #ec4899, #be185d);
  top: 30%;
  right: 30%;
  filter: blur(20px);
}

.shape-4 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #14b8a6, #0f766e);
  bottom: 30%;
  right: 10%;
  filter: blur(15px);
}

/* Features Section */
.features-section {
  padding: 6rem 2rem;
  background-color: white;
  text-align: center;
}

.section-title {
  position: relative;
  display: inline-block;
  margin-bottom: 3rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #2563eb;
  height: 60px;
  width: 60px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #eff6ff;
}

.icon-chat::before { content: '💬'; }
.icon-suggest::before { content: '✨'; }
.icon-form::before { content: '📝'; }
.icon-typescript::before { content: '🔷'; }
.icon-vue::before { content: '🟢'; }
.icon-theme::before { content: '🎨'; }

.feature-card h3 {
  margin-bottom: 1rem;
  color: #1e293b;
}

.feature-card p {
  color: #64748b;
  margin-bottom: 0;
}

/* Demo Section */
.demo-section {
  padding: 2rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Elegant Tabs */
.elegant-tabs-container {
  margin-bottom: 2rem;
}

.tabs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.tabs-logo {
  font-size: 1.8rem;
  font-weight: 700;
}

.logo-text {
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-accent {
  color: #7c3aed;
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #f1f5f9;
  color: #334155;
}

.tab-button.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.tab-icon {
  font-size: 1.2rem;
}

/* Package Banner */
.package-banner {
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.package-info {
  margin-bottom: 1.5rem;
}

.package-name {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.package-description {
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.package-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.package-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.package-badge.version {
  background-color: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.package-badge.npm {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
  font-family: monospace;
}

.package-badge.github {
  background-color: #1e293b;
  color: white;
  text-decoration: none;
}

.package-features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.feature-icon {
  font-size: 1.5rem;
}

.feature-text {
  font-weight: 500;
  color: #334155;
}

/* API Key Section Enhancements */
.api-key-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.api-key-title {
  display: flex;
  flex-direction: column;
}

.api-key-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.api-key-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-success {
  background-color: #ecfdf5;
  color: #065f46;
}

.badge-warning {
  background-color: #fff7ed;
  color: #9a3412;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
  font-weight: bold;
}

.input-icon.error {
  color: #ef4444;
}

.api-key-info {
  display: flex;
  gap: 1rem;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.info-icon {
  font-size: 1.5rem;
}

.info-content p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

/* Component Demo Styles */
.component-section {
  margin-bottom: 3rem;
}

.component-demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.component-demo-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
  border-bottom: none;
  padding-bottom: 0;
}

.component-code {
  background-color: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  color: #334155;
}

.component-description {
  margin-bottom: 2rem;
  color: #475569;
  font-size: 1.1rem;
  line-height: 1.6;
}

.component-actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #e2e8f0;
}

.action-icon {
  font-size: 1.1rem;
}

/* Styled Form Elements */
.styled-input,
.styled-select,
.styled-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.styled-input:focus,
.styled-select:focus,
.styled-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.styled-textarea {
  resize: vertical;
  min-height: 100px;
}

.styled-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.styled-checkbox input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.25rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

/* API Key Section Styles */
.api-key-section {
  margin-bottom: 30px;
}

.api-key-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-left: 4px solid #2563eb;
}

.api-key-input {
  margin-bottom: 15px;
}

.api-key-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #334155;
}

.api-key-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.api-key-input input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.api-key-status {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f1f5f9;
  color: #64748b;
  font-weight: 500;
}

.api-key-valid {
  background-color: #ecfdf5;
  color: #065f46;
}

.api-key-invalid {
  background-color: #fef2f2;
  color: #b91c1c;
}

.api-key-info {
  background-color: #f8fafc;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #64748b;
}

.api-key-info p {
  margin: 5px 0;
}

.api-key-info a {
  color: #2563eb;
  text-decoration: none;
}

.api-key-info a:hover {
  text-decoration: underline;
}

.api-key-warning {
  background-color: #fff7ed;
  color: #9a3412;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #f59e0b;
  margin-bottom: 20px;
  font-weight: 500;
}

/* Chat Options Styles */
.chat-options {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.option-group {
  display: flex;
  flex-direction: column;
}

.option-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.option-group.full-width {
  grid-column: 1 / -1;
  margin-bottom: 15px;
}

.option-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #334155;
}

.option-group input[type="text"],
.option-group select,
.option-group textarea {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.option-group input[type="text"]:focus,
.option-group select:focus,
.option-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.option-group textarea {
  resize: vertical;
  min-height: 80px;
}

.reset-button {
  padding: 8px 16px;
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #e2e8f0;
}

.chat-container {
  height: 500px;
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.chat-container.full-height {
  height: 700px;
}

.chat-toggle-demo {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.demo-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
}

section {
  margin-bottom: 40px;
}

footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
}

footer a {
  color: #2563eb;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
