# Changelog

All notable changes to the @aivue/chatbot package will be documented in this file.

## [2.0.0] - 2025-01-14

### 🚀 **MAJOR RELEASE: Enhanced AI Chatbot with Advanced Features**

This is a major release that introduces comprehensive advanced features while maintaining full backward compatibility.

### ✨ **New Features**

#### **Priority 1: Essential Features**
- **🗄️ Database Integration** - Optional storage with localStorage, Supabase, Firebase, MongoDB, PostgreSQL
- **👤 User Authentication & Sessions** - User profiles, session management, multi-user support
- **💾 Enhanced Chat History** - Persistent conversations with threading and organization
- **📎 Advanced File Upload** - Support for PDFs, documents, images, audio with drag & drop

#### **Priority 2: User Experience**
- **🧵 Conversation Threading** - Organize chats by topics with auto-threading
- **⚡ Quick Actions & Workflows** - Pre-defined prompts and custom actions
- **🎤 Voice Integration** - Speech-to-text input and text-to-speech responses
- **🎨 Advanced Theming** - Dark/light themes, custom avatars, enhanced UI components

#### **Priority 3: Advanced Features**
- **🤖 Multi-Model Support** - Switch between AI providers with auto-selection and load balancing
- **📊 Analytics Dashboard** - Usage metrics, conversation insights, performance tracking
- **🔗 Integration Hub** - Ready for calendar, email, and other service integrations
- **👥 Collaborative Features** - Shared conversations, team workspaces, real-time collaboration

### 🆕 **New Components**
- **AiChatWindowEnhanced** - Feature-rich chat component with all advanced capabilities
- **Enhanced Message Interface** - Support for reactions, attachments, metadata, sentiment analysis
- **Voice Provider System** - Browser Web Speech API and OpenAI Whisper integration
- **Storage Provider System** - Pluggable storage backends with unified interface
- **Analytics Provider System** - Usage tracking and insights with export capabilities
- **Multi-Model Manager** - Intelligent model selection and performance optimization

### 🔧 **Enhanced APIs**

All new features are **optional** and **backward compatible**. Existing code works unchanged.

### 🎯 **Key Benefits**

1. **✅ Backward Compatible** - Existing code works without changes
2. **🔧 Progressive Enhancement** - Add features as needed
3. **🚀 Production Ready** - Enterprise-grade features for real applications
4. **🎨 Modern UI/UX** - Beautiful, accessible, responsive design
5. **📱 Mobile Optimized** - Works perfectly on all devices
6. **🔒 Privacy Focused** - Local storage options, no data lock-in
7. **⚡ Performance Optimized** - Smart caching, lazy loading, efficient rendering

### 🔄 **Migration Guide**

**No migration needed!** All existing code continues to work. To use new features:

1. **Update package**: `npm install @aivue/chatbot@latest`
2. **Use enhanced component**: `<AiChatWindowEnhanced>` (optional)
3. **Add features gradually**: Configure only the features you need

## [1.5.4] - 2025-05-21

### Changed
- Updated dependency on @aivue/core to version 1.3.4
- Improved compatibility with Ollama models

## [1.5.2] - 2025-05-15

### Added
- Support for Ollama local models
- Enhanced streaming capabilities
- Improved error handling

## [1.1.2] - 2023-07-25

### Fixed
- Fixed missing distribution files issue
- Resolved dependency conflicts with @aivue/core
- Improved module resolution for better compatibility with Webpack and Vite
- Enhanced build configuration to include all necessary files
- Added proper exports field for better module resolution
- Fixed package structure to ensure all components are properly exported

## [1.1.1] - 2023-07-20

### Added
- Added demo mode that works without an API key
- Added customizable demo responses based on keywords
- Added better error handling for API calls

### Fixed
- Fixed the "This is a simulated streaming response from the AI" issue
- Fixed component registration issues
- Improved error feedback when API calls fail

## [1.1.0] - 2023-07-15

### Added
- Vue 2 compatibility: The package now works with both Vue 2.6+ and Vue 3.x
- New `AiChatToggle` component: Intercom-like floating chat button that expands into a chat window
  - Supports positioning at top or bottom of the screen
  - Can be used with default chat window or custom content
  - Includes customizable toggle button and icons
- Improved compatibility with all Vue 3 versions including 3.0.4

### Changed
- Updated peer dependencies to support both Vue 2 and Vue 3
- Now using the compatibility layer from @aivue/core
- Improved documentation with examples for both Vue 2 and Vue 3
- Enhanced error handling for better cross-version compatibility

## [1.0.2] - 2023-07-01

### Fixed
- Fixed component registration issues
- Improved error handling in useChatEngine composable

## [1.0.1] - 2023-06-30

### Added
- Initial release with support for Vue 3
- AiChatWindow component
- useChatEngine composable
- Markdown formatting utilities
