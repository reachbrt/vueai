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

          <div class="package-card emotion-ui">
            <div class="package-icon">🎭</div>
            <div class="package-details">
              <h3>@aivue/emotion-ui</h3>
              <p>Emotion-aware components</p>
              <span class="package-version">v1.0.1</span>
            </div>
          </div>

          <div class="package-card doc-intelligence">
            <div class="package-icon">📄</div>
            <div class="package-details">
              <h3>@aivue/doc-intelligence</h3>
              <p>Document processing & OCR</p>
              <span class="package-version">v1.0.1</span>
            </div>
          </div>

          <div class="package-card predictive-input">
            <div class="package-icon">🧠</div>
            <div class="package-details">
              <h3>@aivue/predictive-input</h3>
              <p>AI text predictions</p>
              <span class="package-version">v1.0.2</span>
            </div>
          </div>

          <div class="package-card smart-notify">
            <div class="package-icon">🔔</div>
            <div class="package-details">
              <h3>@aivue/smart-notify</h3>
              <p>Intelligent notifications</p>
              <span class="package-version">v1.0.0</span>
            </div>
          </div>

          <div class="package-card voice-actions">
            <div class="package-icon">🎤</div>
            <div class="package-details">
              <h3>@aivue/voice-actions</h3>
              <p>Voice command control</p>
              <span class="package-version">v1.0.0</span>
            </div>
          </div>

          <div class="package-card smart-datatable">
            <div class="package-icon">📋</div>
            <div class="package-details">
              <h3>@aivue/smart-datatable</h3>
              <p>Advanced data tables</p>
              <span class="package-version">v1.0.0</span>
            </div>
          </div>

          <div class="package-card image-caption">
            <div class="package-icon">🖼️</div>
            <div class="package-details">
              <h3>@aivue/image-caption</h3>
              <p>AI image captioning</p>
              <span class="package-version">v1.0.0</span>
            </div>
          </div>

          <div class="package-card spin360">
            <div class="package-icon">🔄</div>
            <div class="package-details">
              <h3>@aivue/360-spin</h3>
              <p>360° product viewer</p>
              <span class="package-version">v1.0.0</span>
            </div>
          </div>

          <div class="package-card analytics">
            <div class="package-icon">📊</div>
            <div class="package-details">
              <h3>@aivue/analytics</h3>
              <p>AI-powered insights</p>
              <span class="package-version">v1.0.0</span>
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
      <!-- Modern Top Navigation Layout -->
      <div class="app-layout">
        <!-- Top Navigation -->
        <header class="top-nav">
          <div class="nav-container">
            <div class="nav-brand">
              <span class="logo-text">AI<span class="logo-accent">Vue</span></span>
              <span class="logo-subtitle">AI Components for Vue.js</span>
            </div>

            <div class="nav-tabs-wrapper">
              <button
                class="nav-scroll-btn nav-scroll-left"
                @click="scrollNavLeft"
                v-show="showLeftScroll"
                aria-label="Scroll left"
              >
                <span>‹</span>
              </button>

              <nav class="nav-tabs" ref="navTabs" @scroll="handleNavScroll">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="setActiveTab(tab.id)"
                  :class="['nav-tab', { active: activeTab === tab.id }]"
                >
                  <span class="tab-icon">{{ tab.icon }}</span>
                  <span class="tab-label">{{ tab.name }}</span>
                  <span v-if="tab.id === 'chatbot'" class="tab-badge">v2.3</span>
                </button>
              </nav>

              <button
                class="nav-scroll-btn nav-scroll-right"
                @click="scrollNavRight"
                v-show="showRightScroll"
                aria-label="Scroll right"
              >
                <span>›</span>
              </button>
            </div>

            <div class="nav-actions">
              <a href="https://github.com/reachbrt/vueai" target="_blank" class="nav-action">
                <span class="action-icon">📚</span>
                <span class="action-label">Docs</span>
              </a>
              <a href="https://www.npmjs.com/org/aivue" target="_blank" class="nav-action">
                <span class="action-icon">📦</span>
                <span class="action-label">NPM</span>
              </a>
              <a href="https://github.com/reachbrt/vueai/issues" target="_blank" class="nav-action">
                <span class="action-icon">🐛</span>
                <span class="action-label">Issues</span>
              </a>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">

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
        <div class="section-header">
          <h1 class="section-title">
            <span class="section-icon">💬</span>
            AI Chatbot v2.0.0
          </h1>
          <p class="section-description">
            Next-generation AI chat with enterprise features including database storage, voice integration,
            multi-model AI, analytics, and collaborative capabilities.
          </p>
          <div class="section-meta">
            <span class="meta-badge version">
              📦 v{{ packages.chatbot.version }}
            </span>
            <a :href="`https://www.npmjs.com/package/${packages.chatbot.npmName}`" target="_blank" class="meta-badge npm">
              📦 npm install {{ packages.chatbot.npmName }}
            </a>
            <a :href="packages.chatbot.github" target="_blank" class="meta-badge github">
              🔗 GitHub
            </a>
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

              <div class="option-group checkbox">
                <div class="styled-checkbox">
                  <input type="checkbox" id="chatUseProxy" v-model="chatOptions.useProxy" />
                  <label for="chatUseProxy">Use Proxy</label>
                </div>
              </div>

              <div class="option-group" v-if="chatOptions.useProxy">
                <label for="chatProxyUrl">Proxy URL:</label>
                <input type="text" id="chatProxyUrl" v-model="chatOptions.proxyUrl" class="styled-input" />
              </div>

              <div class="option-group">
                <label for="chatLanguage">Language:</label>
                <select id="chatLanguage" v-model="chatOptions.language" @change="updateChatLanguage" class="styled-select">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                </select>
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
                :use-proxy="chatOptions.useProxy"
                :proxy-url="chatOptions.proxyUrl"
                :language="chatOptions.language"
                :texts="chatOptions.texts"
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
      </section>

      <section v-if="activeTab === 'rag'" class="component-section">
        <div class="demo-container">
          <RAGDemo />
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

      <section v-if="activeTab === 'smart-datatable'" class="component-section">
        <div class="demo-container">
          <div class="component-hero">
            <div class="component-hero-content">
              <h2 class="component-hero-title">AI Smart DataTable</h2>
              <p class="component-hero-description">
                Display and manage data with AI-powered sorting, filtering, search, and insights.
                Perfect for dashboards, admin panels, and data-heavy applications.
              </p>
              <div class="component-hero-features">
                <div class="hero-feature">
                  <span class="hero-feature-icon">🔍</span>
                  <span class="hero-feature-text">AI Search</span>
                </div>
                <div class="hero-feature">
                  <span class="hero-feature-icon">📊</span>
                  <span class="hero-feature-text">Data Insights</span>
                </div>
                <div class="hero-feature">
                  <span class="hero-feature-icon">📤</span>
                  <span class="hero-feature-text">Export Data</span>
                </div>
                <div class="hero-feature">
                  <span class="hero-feature-icon">🎨</span>
                  <span class="hero-feature-text">Customizable</span>
                </div>
              </div>
            </div>
          </div>
          <div class="component-demo">
            <SmartDataTableDemo :aiClient="aiClient" />
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'voice-actions'" class="component-section">
        <div class="demo-container">
          <div class="component-hero">
            <div class="component-hero-content">
              <h2 class="component-hero-title">AI Voice Command Controller</h2>
              <p class="component-hero-description">
                Control your application with voice commands using speech recognition, natural language processing,
                and AI-powered command execution. Perfect for hands-free operation and accessibility.
              </p>
              <div class="component-hero-features">
                <div class="hero-feature">
                  <span class="hero-feature-icon">🎤</span>
                  <span class="hero-feature-text">Speech Recognition</span>
                </div>
                <div class="hero-feature">
                  <span class="hero-feature-icon">🗣️</span>
                  <span class="hero-feature-text">Voice Feedback</span>
                </div>
                <div class="hero-feature">
                  <span class="hero-feature-icon">🤖</span>
                  <span class="hero-feature-text">AI Processing</span>
                </div>
                <div class="hero-feature">
                  <span class="hero-feature-icon">🌍</span>
                  <span class="hero-feature-text">Multi-language</span>
                </div>
              </div>
            </div>
          </div>
          <div class="component-demo">
            <VoiceActionsDemo :aiClient="aiClient" />
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'emotion-ui'" class="component-section">
        <div class="demo-container">
          <EmotionUIDemo />
        </div>
      </section>

      <section v-if="activeTab === 'doc-intelligence'" class="component-section">
        <div class="demo-container">
          <DocIntelligenceDemo />
        </div>
      </section>

      <section v-if="activeTab === 'predictive-input'" class="component-section">
        <div class="demo-container">
          <PredictiveInputDemo :aiClient="aiClient" />
        </div>
      </section>

      <section v-if="activeTab === 'smart-notify'" class="component-section">
        <div class="demo-container">
          <SmartNotifyDemo />
        </div>
      </section>

      <section v-if="activeTab === 'analytics'" class="component-section">
        <div class="demo-container">
          <AnalyticsDemo />
        </div>
      </section>

      <section v-if="activeTab === 'image-caption'" class="component-section">
        <div class="demo-container">
          <div v-if="!hasValidApiKey" class="api-key-warning">
            Please enter a valid OpenAI API key above to use the image caption component.
          </div>
          <div v-else>
            <ImageCaptionDemo :api-key="apiKey" />
          </div>
        </div>
      </section>

      <section v-if="activeTab === '360-spin'" class="component-section">
        <div class="demo-container">
          <Spin360Demo />
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

      <section v-if="activeTab === 'ollama'" class="component-section">
        <div class="demo-container">
          <OllamaDemo />
        </div>
      </section>
    

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
            <a href="#" @click.prevent="setActiveTab('emotion-ui')" class="footer-link">
              <span>🎭</span> Emotion UI
            </a>
            <a href="#" @click.prevent="setActiveTab('doc-intelligence')" class="footer-link">
              <span>📄</span> Doc Intelligence
            </a>
            <a href="#" @click.prevent="setActiveTab('predictive-input')" class="footer-link">
              <span>🧠</span> Predictive Input
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="footer-links-title">NPM Packages</h3>
          <div class="footer-links">
            <a href="https://www.npmjs.com/package/@aivue/chatbot" target="_blank" class="footer-link">
              <span>📦</span> @aivue/chatbot
            </a>
            <a href="https://www.npmjs.com/package/@aivue/autosuggest" target="_blank" class="footer-link">
              <span>📦</span> @aivue/autosuggest
            </a>
            <a href="https://www.npmjs.com/package/@aivue/smartform" target="_blank" class="footer-link">
              <span>📦</span> @aivue/smartform
            </a>
            <a href="https://www.npmjs.com/package/@aivue/emotion-ui" target="_blank" class="footer-link">
              <span>📦</span> @aivue/emotion-ui
            </a>
            <a href="https://www.npmjs.com/package/@aivue/doc-intelligence" target="_blank" class="footer-link">
              <span>📦</span> @aivue/doc-intelligence
            </a>
            <a href="https://www.npmjs.com/package/@aivue/predictive-input" target="_blank" class="footer-link">
              <span>📦</span> @aivue/predictive-input
            </a>
            <a href="https://www.npmjs.com/package/@aivue/smart-notify" target="_blank" class="footer-link">
              <span>📦</span> @aivue/smart-notify
            </a>
            <a href="https://www.npmjs.com/package/@aivue/voice-actions" target="_blank" class="footer-link">
              <span>📦</span> @aivue/voice-actions
            </a>
            <a href="https://www.npmjs.com/package/@aivue/smart-datatable" target="_blank" class="footer-link">
              <span>📦</span> @aivue/smart-datatable
            </a>
            <a href="https://www.npmjs.com/package/@aivue/image-caption" target="_blank" class="footer-link">
              <span>📦</span> @aivue/image-caption
            </a>
            <a href="https://www.npmjs.com/package/@aivue/analytics" target="_blank" class="footer-link">
              <span>📦</span> @aivue/analytics
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
              <span>📦</span> NPM Organization
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
  </main>
      </div>
    </div>
    </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AutosuggestDemo from './components/AutosuggestDemo.vue';
import SmartFormDemo from './components/SmartFormDemo.vue';
import SmartDataTableDemo from './components/SmartDataTableDemo.vue';
import VoiceActionsDemo from './components/VoiceActionsDemo.vue';
import EmotionUIDemo from './components/EmotionUIDemo.vue';
import DocIntelligenceDemo from './components/DocIntelligenceDemo.vue';
import PredictiveInputDemo from './components/PredictiveInputDemo.vue';
import SmartNotifyDemo from './components/SmartNotifyDemo.vue';
import AnalyticsDemo from './components/AnalyticsDemo.vue';
import ImageCaptionDemo from './components/ImageCaptionDemo.vue';
import RAGDemo from './components/RAGDemo.vue';
import Spin360Demo from './components/Spin360Demo.vue';

import TypeScriptExample from './components/TypeScriptExample.vue';
import OllamaDemo from './components/OllamaDemo.vue';
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
    SmartDataTableDemo,
    VoiceActionsDemo,
    EmotionUIDemo,
    DocIntelligenceDemo,
    PredictiveInputDemo,
    SmartNotifyDemo,
    AnalyticsDemo,
    ImageCaptionDemo,
    RAGDemo,
    Spin360Demo,

    TypeScriptExample,
    OllamaDemo,
    AiChatWindow,
    AiChatToggle
  },
  data() {
    return {
      activeTab: 'all',
      apiKey: '',
      aiClient: null,
      hasValidApiKey: false,
      showLeftScroll: false,
      showRightScroll: false,
      chatOptions: {
        title: 'AI Assistant',
        placeholder: 'Ask me anything...',
        theme: 'light',
        model: 'gpt-3.5-turbo',
        showAvatars: true,
        streaming: true,
        fullHeight: false,
        markdown: true,
        systemPrompt: 'You are a helpful AI assistant. Answer questions concisely and accurately.',
        useProxy: false,
        proxyUrl: '/api/chat',
        language: 'en',
        texts: {
          title: 'AI Assistant',
          placeholder: 'Ask me anything...',
          sendButton: 'Send',
          copyButton: 'Copy',
          clearButton: 'Clear Chat',
          attachButton: 'Attach file',
          voiceButton: 'Voice input',
          typing: 'Thinking...',
          error: 'An error occurred. Please try again.'
        }
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
          id: 'rag',
          name: 'RAG',
          icon: '📚'
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
          id: 'smart-datatable',
          name: 'Smart DataTable',
          icon: '📋'
        },
        {
          id: 'voice-actions',
          name: 'Voice Actions',
          icon: '🎤'
        },
        {
          id: 'emotion-ui',
          name: 'Emotion UI',
          icon: '🎭'
        },
        {
          id: 'doc-intelligence',
          name: 'Doc Intelligence',
          icon: '📄'
        },
        {
          id: 'predictive-input',
          name: 'Predictive Input',
          icon: '🧠'
        },
        {
          id: 'smart-notify',
          name: 'Smart Notify',
          icon: '🔔'
        },
        {
          id: 'analytics',
          name: 'Analytics',
          icon: '📊'
        },
        {
          id: 'image-caption',
          name: 'Image Caption',
          icon: '🖼️'
        },
        {
          id: '360-spin',
          name: '360° Spin',
          icon: '🔄'
        },
        {
          id: 'typescript',
          name: 'TypeScript',
          icon: '🔷'
        },
        {
          id: 'ollama',
          name: 'Ollama',
          icon: '🤖'
        }
      ],
      packages: {
        chatbot: {
          name: '@aivue/chatbot v2.0.0',
          npmName: '@aivue/chatbot',
          version: '2.0.0',
          description: 'Next-generation AI chat with enterprise features: database storage, voice integration, multi-model AI, analytics, and collaborative capabilities.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/chatbot',
          features: [
            { icon: '💬', text: 'Conversational UI' },
            { icon: '🗄️', text: 'Database Storage' },
            { icon: '🎤', text: 'Voice Integration' },
            { icon: '🤖', text: 'Multi-Model AI' },
            { icon: '📊', text: 'Analytics & Insights' },
            { icon: '🧵', text: 'Conversation Threading' },
            { icon: '📎', text: 'File Attachments' },
            { icon: '🔒', text: 'Privacy & Security' }
          ]
        },

        ollama: {
          name: 'Ollama Integration',
          npmName: '@aivue/core',
          version: '1.3.2',
          description: 'Connect to local Ollama models for privacy-focused AI without requiring API keys.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/core',
          features: [
            { icon: '🤖', text: 'Local AI Models' },
            { icon: '🔒', text: 'Privacy-Focused' },
            { icon: '🚀', text: 'No API Key Required' },
            { icon: '💻', text: 'Run on Your Hardware' },
            { icon: '🔄', text: 'Streaming Support' },
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
        'smart-datatable': {
          name: '@aivue/smart-datatable',
          npmName: '@aivue/smart-datatable',
          version: '1.0.0',
          description: 'AI-powered data table with intelligent sorting, filtering, search, and insights for Vue.js applications.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/smart-datatable',
          features: [
            { icon: '📋', text: 'Smart DataTable' },
            { icon: '🔍', text: 'AI Search' },
            { icon: '📊', text: 'Data Insights' },
            { icon: '📤', text: 'Export Data' },
            { icon: '🎨', text: 'Customizable' },
            { icon: '📱', text: 'Responsive' }
          ]
        },
        'voice-actions': {
          name: '@aivue/voice-actions',
          npmName: '@aivue/voice-actions',
          version: '1.0.0',
          description: 'AI-powered voice command controller with speech recognition, natural language processing, and custom actions for Vue.js.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/voice-actions',
          features: [
            { icon: '🎤', text: 'Speech Recognition' },
            { icon: '🗣️', text: 'Voice Feedback' },
            { icon: '🤖', text: 'AI Processing' },
            { icon: '🔄', text: 'Continuous Mode' },
            { icon: '🌍', text: 'Multi-language' },
            { icon: '📊', text: 'Command History' }
          ]
        },
        'emotion-ui': {
          name: '@aivue/emotion-ui',
          npmName: '@aivue/emotion-ui',
          version: '1.0.1',
          description: 'AI-powered emotion-aware UI components with real-time sentiment analysis, adaptive styling, and facial/voice emotion detection for Vue.js applications.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/emotion-ui',
          npm: 'https://www.npmjs.com/package/@aivue/emotion-ui',
          features: [
            { icon: '🎭', text: 'Emotion Detection' },
            { icon: '💬', text: 'Sentiment Analysis' },
            { icon: '🎨', text: 'Adaptive Styling' },
            { icon: '😊', text: 'Facial Analysis' },
            { icon: '🎤', text: 'Voice Analysis' },
            { icon: '🔒', text: 'Privacy-Focused' }
          ]
        },
        'doc-intelligence': {
          name: '@aivue/doc-intelligence',
          npmName: '@aivue/doc-intelligence',
          version: '1.0.1',
          description: 'AI-powered document parser and extractor for Vue 3 - Upload PDFs/images, extract structured data from invoices, receipts, forms, and IDs with OCR and entity recognition.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/doc-intelligence',
          npm: 'https://www.npmjs.com/package/@aivue/doc-intelligence',
          features: [
            { icon: '🔍', text: 'OCR Text Extraction' },
            { icon: '📋', text: 'Document Type Detection' },
            { icon: '🎯', text: 'Entity Recognition' },
            { icon: '📝', text: 'Auto-Generated Forms' },
            { icon: '🌍', text: 'Multi-Language Support' },
            { icon: '🔒', text: 'Privacy-First' }
          ]
        },
        'predictive-input': {
          name: '@aivue/predictive-input',
          npmName: '@aivue/predictive-input',
          version: '1.0.2',
          description: 'AI-powered predictive text input that learns your writing style and suggests complete sentences. Privacy-focused with local processing and offline capability.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/predictive-input',
          npm: 'https://www.npmjs.com/package/@aivue/predictive-input',
          features: [
            { icon: '🧠', text: 'Pattern Learning' },
            { icon: '🎯', text: 'Context-Aware' },
            { icon: '🌍', text: 'Multi-Language' },
            { icon: '🔒', text: 'Privacy-Focused' },
            { icon: '⚡', text: 'Offline Capable' },
            { icon: '💾', text: 'Data Export/Import' }
          ]
        },
        'smart-notify': {
          name: '@aivue/smart-notify',
          npmName: '@aivue/smart-notify',
          version: '1.0.0',
          description: 'AI-powered notification system with intelligent prioritization, timing optimization, and attention-aware delivery. Features smart batching, urgency detection, and offline learning.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/smart-notify',
          npm: 'https://www.npmjs.com/package/@aivue/smart-notify',
          features: [
            { icon: '🔔', text: 'Smart Notifications' },
            { icon: '🧠', text: 'AI Prioritization' },
            { icon: '⏰', text: 'Timing Optimization' },
            { icon: '👁️', text: 'Attention Detection' },
            { icon: '📦', text: 'Smart Batching' },
            { icon: '🔒', text: 'Privacy-Focused' }
          ]
        },
        analytics: {
          name: '@aivue/analytics',
          npmName: '@aivue/analytics',
          version: '1.0.0',
          description: 'AI-powered analytics and insights for Vue.js applications with real-time dashboards and conversation analysis.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/analytics',
          features: [
            { icon: '📊', text: 'Real-time Analytics' },
            { icon: '🤖', text: 'AI-powered Insights' },
            { icon: '💬', text: 'Conversation Analysis' },
            { icon: '📈', text: 'Performance Monitoring' },
            { icon: '📱', text: 'Beautiful Dashboards' },
            { icon: '🔒', text: 'Privacy-first Storage' }
          ]
        },
        'image-caption': {
          name: '@aivue/image-caption',
          npmName: '@aivue/image-caption',
          version: '1.0.0',
          description: 'AI-powered image captioning for Vue.js applications using OpenAI Vision models for intelligent, contextual captions.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/image-caption',
          features: [
            { icon: '🖼️', text: 'OpenAI Vision Models' },
            { icon: '🤖', text: 'GPT-4o & GPT-4 Turbo' },
            { icon: '📱', text: 'Drag & Drop Upload' },
            { icon: '🌐', text: 'URL Support' },
            { icon: '📊', text: 'Batch Processing' },
            { icon: '📈', text: 'History Tracking' }
          ]
        },
        '360-spin': {
          name: '@aivue/360-spin',
          npmName: '@aivue/360-spin',
          version: '1.0.0',
          description: 'Interactive 360-degree product image spin component for Vue.js. Perfect for e-commerce product listings, carousels, and detail pages.',
          github: 'https://github.com/reachbrt/vueai/tree/main/packages/360-spin',
          features: [
            { icon: '🔄', text: '360° Product Spin' },
            { icon: '🎬', text: 'GIF & Frame Sequence' },
            { icon: '📱', text: 'Mobile Drag-to-Spin' },
            { icon: '🛍️', text: 'E-commerce Ready' },
            { icon: '⚡', text: 'Image Preloading' },
            { icon: '🎨', text: 'Customizable Styling' }
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

  computed: {
    currentPackage() {
      return this.packages[this.activeTab] || {
        name: 'AIVue Components',
        version: '2.0.0',
        description: 'AI-powered Vue.js components for modern applications',
        npmName: '@aivue/core',
        github: 'https://github.com/reachbrt/vueai'
      };
    }
  },
  methods: {
    scrollNavLeft() {
      const navTabs = this.$refs.navTabs;
      if (navTabs) {
        navTabs.scrollBy({ left: -200, behavior: 'smooth' });
      }
    },

    scrollNavRight() {
      const navTabs = this.$refs.navTabs;
      if (navTabs) {
        navTabs.scrollBy({ left: 200, behavior: 'smooth' });
      }
    },

    handleNavScroll() {
      const navTabs = this.$refs.navTabs;
      if (!navTabs) return;

      // Check if we can scroll left
      this.showLeftScroll = navTabs.scrollLeft > 0;

      // Check if we can scroll right
      const maxScroll = navTabs.scrollWidth - navTabs.clientWidth;
      this.showRightScroll = navTabs.scrollLeft < maxScroll - 1;
    },

    checkNavScroll() {
      // Initial check for scroll buttons visibility
      this.$nextTick(() => {
        this.handleNavScroll();
      });
    },

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
        'rag': 'Retrieval-Augmented Generation: Upload documents or add URLs to create a knowledge base. The chatbot uses this information to provide accurate, context-aware responses.',
        'autosuggest': 'Enhance user input with AI-powered suggestions that adapt to context and user behavior.',
        'smartform': 'Create intelligent forms with AI validation, suggestions, and data analysis capabilities.',
        'smart-datatable': 'Display and manage data with AI-powered sorting, filtering, search, and insights for data-heavy applications.',
        'voice-actions': 'Control your application with voice commands using speech recognition, natural language processing, and AI-powered execution.',
        'emotion-ui': 'Create emotionally intelligent interfaces that adapt to user sentiment and provide empathetic responses.',
        'doc-intelligence': 'Upload PDFs/images and extract structured data from invoices, receipts, forms, and IDs with OCR and entity recognition.',
        'predictive-input': 'AI-powered text input that learns your writing style and suggests complete sentences with privacy-focused local processing.',
        'smart-notify': 'Intelligent notification system with AI-powered prioritization, timing optimization, and attention-aware delivery for reduced interruptions.',
        'analytics': 'Track user interactions, monitor AI usage, and gain valuable insights with AI-powered analytics dashboards.',
        'image-caption': 'Generate intelligent, contextual captions for images using OpenAI Vision models with drag & drop support.',
        'typescript': 'Full TypeScript support with comprehensive type definitions for all components and APIs.',
        'ollama': 'Connect to local Ollama models for privacy-focused AI without requiring API keys.'
      };

      return descriptions[tabId] || '';
    },

    updateChatLanguage() {
      // Update texts based on selected language for regular chatbot
      const languageTexts = {
        en: {
          title: 'AI Assistant',
          placeholder: 'Ask me anything...',
          sendButton: 'Send',
          copyButton: 'Copy',
          clearButton: 'Clear Chat',
          attachButton: 'Attach file',
          voiceButton: 'Voice input',
          typing: 'Thinking...',
          error: 'An error occurred. Please try again.'
        },
        es: {
          title: 'Asistente IA',
          placeholder: 'Pregúntame cualquier cosa...',
          sendButton: 'Enviar',
          copyButton: 'Copiar',
          clearButton: 'Limpiar Chat',
          attachButton: 'Adjuntar archivo',
          voiceButton: 'Entrada de voz',
          typing: 'Pensando...',
          error: 'Ocurrió un error. Inténtalo de nuevo.'
        },
        fr: {
          title: 'Assistant IA',
          placeholder: 'Demandez-moi n\'importe quoi...',
          sendButton: 'Envoyer',
          copyButton: 'Copier',
          clearButton: 'Effacer le Chat',
          attachButton: 'Joindre un fichier',
          voiceButton: 'Entrée vocale',
          typing: 'Réflexion...',
          error: 'Une erreur s\'est produite. Veuillez réessayer.'
        },
        de: {
          title: 'KI-Assistent',
          placeholder: 'Fragen Sie mich alles...',
          sendButton: 'Senden',
          copyButton: 'Kopieren',
          clearButton: 'Chat löschen',
          attachButton: 'Datei anhängen',
          voiceButton: 'Spracheingabe',
          typing: 'Denkt nach...',
          error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        },
        it: {
          title: 'Assistente IA',
          placeholder: 'Chiedimi qualsiasi cosa...',
          sendButton: 'Invia',
          copyButton: 'Copia',
          clearButton: 'Cancella Chat',
          attachButton: 'Allega file',
          voiceButton: 'Input vocale',
          typing: 'Pensando...',
          error: 'Si è verificato un errore. Riprova.'
        }
      };

      this.chatOptions.texts = languageTexts[this.chatOptions.language] || languageTexts.en;
    }
  },

  mounted() {
    // Initialize GSAP animations
    this.initHeroAnimation();
    this.initFeaturesAnimation();
    this.initWelcomeAnimation();
    this.initTabsAnimation();
    this.initFooterAnimation();

    // Check navigation scroll on mount
    this.checkNavScroll();

    // Add resize listener to update scroll buttons
    window.addEventListener('resize', this.checkNavScroll);
  },

  beforeUnmount() {
    // Clean up resize listener
    window.removeEventListener('resize', this.checkNavScroll);
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

/* App Layout */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Top Navigation Styles */
.top-nav {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  gap: 32px;
}

.nav-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.nav-brand .logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.nav-brand .logo-accent {
  color: #fbbf24;
}

.nav-brand .logo-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Navigation Tabs Wrapper */
.nav-tabs-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
}

/* Navigation Tabs */
.nav-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding: 0 8px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.nav-tabs::-webkit-scrollbar {
  display: none;
}

/* Scroll Buttons */
.nav-scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-scroll-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.nav-scroll-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.nav-scroll-left {
  left: 0;
}

.nav-scroll-right {
  right: 0;
}

/* Add fade effect on edges */
.nav-tabs-wrapper::before,
.nav-tabs-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
  z-index: 5;
  transition: opacity 0.3s ease;
}

.nav-tabs-wrapper::before {
  left: 0;
  background: linear-gradient(to right, rgba(30, 41, 59, 1), rgba(30, 41, 59, 0));
}

.nav-tabs-wrapper::after {
  right: 0;
  background: linear-gradient(to left, rgba(30, 41, 59, 1), rgba(30, 41, 59, 0));
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 12px;
  position: relative;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0; /* Prevent tabs from shrinking */
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-tab.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #3b82f6;
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-label {
  font-weight: 500;
  white-space: nowrap;
}

.tab-badge {
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Navigation Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e2e8f0;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-action:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

.action-icon {
  font-size: 1rem;
}

.action-label {
  white-space: nowrap;
}

/* Main Content */
.main-content {
  flex: 1;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  width: 100%;
  overflow-x: hidden;
}

/* API Key Section */
.api-key-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  margin: 0;
  border-bottom: 4px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.api-key-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.api-key-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.api-key-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.api-key-title h3 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.api-key-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
}

.api-key-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(10px);
}

.api-key-badge.badge-success {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.api-key-badge.badge-warning {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.api-key-input {
  margin-bottom: 20px;
}

.api-key-input label {
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 1rem;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.input-with-icon input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-with-icon input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
}

.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  color: #22c55e;
}

.input-icon.error {
  color: #ef4444;
}

.api-key-status {
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.api-key-status.api-key-valid {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.api-key-status.api-key-invalid {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.api-key-info {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.info-content p {
  margin: 0 0 8px 0;
}

.info-content p:last-child {
  margin-bottom: 0;
}

.info-content a {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
}

.info-content a:hover {
  text-decoration: underline;
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

/* Package Cards */
.package-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  max-width: 800px;
}

.package-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.package-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.package-card.chatbot {
  border-left: 4px solid #3b82f6;
}

.package-card.autosuggest {
  border-left: 4px solid #10b981;
}

.package-card.smartform {
  border-left: 4px solid #8b5cf6;
}

.package-card.analytics {
  border-left: 4px solid #f59e0b;
}

.package-card.image-caption {
  border-left: 4px solid #ec4899;
}

.package-card.core {
  border-left: 4px solid #ef4444;
}

.package-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  display: block;
}

.package-details h3 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-weight: 600;
}

.package-details p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.package-version {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-family: monospace;
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
  padding: 0;
  margin: 0;
}

/* Package Banner */
.package-banner {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 40px;
  margin: 0;
  border-bottom: 4px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.package-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  opacity: 0.5;
}

.package-info {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.package-name {
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.package-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

.package-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.package-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.package-badge.version {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.package-badge.npm {
  background: #cb3837;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.package-badge.github {
  background: #24292e;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.package-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.package-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 32px;
  position: relative;
  z-index: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feature-text {
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Component Section Styles */
.component-section {
  padding: 60px 40px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  min-height: calc(100vh - 200px);
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.component-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="triangles" width="40" height="40" patternUnits="userSpaceOnUse"><polygon points="20,5 35,35 5,35" fill="none" stroke="rgba(59,130,246,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23triangles)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
  z-index: -1;
}

/* Welcome Section */
.welcome-section {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 24px 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-description {
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.welcome-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.welcome-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.welcome-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.welcome-card-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.welcome-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.welcome-card-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.welcome-card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.welcome-card-link:hover {
  color: #2563eb;
  gap: 12px;
}

.welcome-github {
  margin-top: 48px;
}

.github-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #24292e 0%, #1a1e22 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.github-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.section-header {
  margin-bottom: 48px;
  padding: 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.section-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hexagons" width="30" height="30" patternUnits="userSpaceOnUse"><polygon points="15,2 25,8 25,22 15,28 5,22 5,8" fill="none" stroke="rgba(59,130,246,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23hexagons)"/></svg>');
  opacity: 0.5;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.section-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.section-description {
  font-size: 1.25rem;
  color: #475569;
  margin: 0 0 24px 0;
  line-height: 1.7;
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.meta-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.meta-badge.version {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
}

.meta-badge.npm {
  background: #cb3837;
  color: white;
  border: none;
}

.meta-badge.github {
  background: #24292e;
  color: white;
  border: none;
}

.demo-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.demo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="waves" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M0,25 Q12.5,10 25,25 T50,25" fill="none" stroke="rgba(59,130,246,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23waves)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
  z-index: -1;
}

/* Component Hero Sections */
.component-hero {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  align-items: center;
  margin-bottom: 48px;
  padding: 40px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.component-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" width="25" height="25" patternUnits="userSpaceOnUse"><polygon points="12.5,2 15,10 23,10 17,15 19,23 12.5,18 6,23 8,15 2,10 10,10" fill="rgba(59,130,246,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
  opacity: 0.3;
}

.component-hero-content {
  position: relative;
  z-index: 1;
}

.component-hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.component-hero-description {
  font-size: 1.125rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 24px;
}

.component-hero-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.hero-feature {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  font-weight: 500;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.hero-feature .feature-icon {
  font-size: 1.25rem;
}

.component-hero-image {
  position: relative;
  z-index: 1;
  text-align: center;
}

.component-hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.demo-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.demo-sidebar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  position: sticky;
  top: 20px;
}

.demo-sidebar h3 {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.feature-list li:last-child {
  border-bottom: none;
}

.feature-list .icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.feature-list .text {
  font-weight: 500;
  color: #374151;
}

/* API Key Warning */
.api-key-warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
  text-align: center;
  font-weight: 600;
  color: #92400e;
  position: relative;
  overflow: hidden;
}

.api-key-warning::before {
  content: '⚠️';
  font-size: 2rem;
  display: block;
  margin-bottom: 8px;
}

/* Component Demo Headers */
.component-demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.component-demo-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.component-code {
  background: #1e293b;
  color: #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
}

.component-description {
  color: #64748b;
  line-height: 1.6;
  margin: 16px 0;
  font-size: 1rem;
}

/* Options Grid */
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 24px 0;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  position: relative;
  z-index: 1;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.option-group.checkbox {
  flex-direction: row;
  align-items: center;
}

.option-group.full-width {
  grid-column: 1 / -1;
}

.option-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.styled-input,
.styled-select,
.styled-textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.styled-input:focus,
.styled-select:focus,
.styled-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.styled-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.styled-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
}

/* Chat Container */
.chat-container {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chat-container.full-height {
  height: 600px;
}

/* Action Buttons */
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.action-icon {
  font-size: 1rem;
}

/* Layout Fixes */
.app-layout {
  position: relative;
  overflow-x: hidden;
}

.sidebar {
  position: fixed;
  z-index: 1000;
}

/* Ensure content doesn't overflow */
.api-key-container,
.package-info,
.section-header,
.demo-container {
  max-width: 100%;
  box-sizing: border-box;
}

/* Responsive Design for Top Navigation */
@media (max-width: 1024px) {
  .nav-container {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .nav-tabs-wrapper {
    order: 2;
    width: 100%;
  }

  .nav-tabs {
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 8px;
  }

  .nav-actions {
    order: 3;
    gap: 12px;
  }

  .nav-tab {
    padding: 10px 16px;
    font-size: 0.875rem;
  }

  .nav-action {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .main-content {
    width: 100vw;
  }

  .component-hero {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .component-section {
    padding: 40px 20px;
  }

  .api-key-section {
    padding: 30px 20px;
  }

  .package-banner {
    padding: 30px 20px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 12px 16px;
  }

  .nav-brand .logo-text {
    font-size: 1.5rem;
  }

  .nav-brand .logo-subtitle {
    font-size: 0.7rem;
  }

  .nav-tabs {
    gap: 4px;
    padding: 0 4px;
  }

  .nav-tab {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .tab-label {
    display: none;
  }

  .nav-scroll-btn {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }

  .nav-tabs-wrapper::before,
  .nav-tabs-wrapper::after {
    width: 30px;
  }

  .nav-actions {
    gap: 8px;
  }

  .action-label {
    display: none;
  }

  .section-title {
    font-size: 2rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .component-hero-title {
    font-size: 2rem;
  }

  .section-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .demo-container {
    padding: 24px;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .component-demo-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .welcome-cards {
    grid-template-columns: 1fr;
  }

  .package-features {
    grid-template-columns: 1fr;
  }
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
