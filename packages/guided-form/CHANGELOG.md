# Changelog

All notable changes to @aivue/guided-form will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-24

### Added

#### 🎯 Core Features
- **One-Question-at-a-Time Flow** - Guided conversational form experience
- **JSON Schema-Based** - Define entire form structure with a single JSON schema
- **Vue 2 & 3 Compatible** - Works seamlessly with Vue 2.6+ and Vue 3.x
- **TypeScript Support** - Full TypeScript definitions for all APIs

#### 🤖 AI-Powered Assistance
- **OpenAI Integration** - GPT-3.5 and GPT-4 support
- **Anthropic Integration** - Claude models support
- **Custom AI Providers** - Bring your own AI endpoint
- **Multiple Assistance Types**:
  - Explain questions in simple terms
  - Rewrite questions for clarity
  - Suggest example answers
  - Validate user input with AI feedback

#### ⌨️ Keyboard Navigation
- **Enter to Advance** - Press Enter to go to next question
- **Numeric Shortcuts** - Press 1-9 to select options
- **Tab Navigation** - Tab/Shift+Tab to navigate
- **Configurable** - Enable/disable individual shortcuts

#### 📱 Mobile-First Design
- **Responsive Layout** - Works on all screen sizes
- **Large Tap Targets** - Easy to use on mobile devices
- **Sticky Navigation** - Always-visible Next/Back buttons
- **Virtual Keyboard Friendly** - Optimized for mobile input

#### 💾 Save & Resume
- **LocalStorage Adapter** - Persist across browser sessions
- **SessionStorage Adapter** - Cleared when tab closes
- **Memory Adapter** - In-memory storage for testing
- **Custom Adapter** - Implement your own storage solution
- **Resume Tokens** - Generate shareable resume links

#### 🔄 Conditional Logic
- **Visibility Conditions** - Show/hide steps based on answers
- **Conditional Jumps** - Skip steps dynamically
- **Multiple Operators** - equals, notEquals, contains, greaterThan, lessThan, isEmpty, isNotEmpty
- **AND/OR Logic** - Combine multiple conditions

#### ✅ Advanced Validation
- **Field-Level Validation** - Validate individual fields
- **Step-Level Validation** - Validate entire steps
- **Built-in Rules**:
  - required, minLength, maxLength
  - min, max (for numbers)
  - pattern (regex)
  - email, url
- **Custom Error Messages** - Friendly validation feedback
- **Real-time Validation** - Validate as user types

#### 🎨 Rich Input Types
- **Text Inputs**: text, textarea, number, email, tel, url
- **Date/Time**: date, time, datetime
- **Selection**: select, multiselect, radio, checkbox
- **Special**: rating, file, yesno, slider, color

#### 🎯 Progress Tracking
- **Visual Progress Bar** - Show completion percentage
- **Step Counter** - "Step X of Y" indicator
- **Completed Steps** - Track which steps are done
- **Visited Steps** - Track user navigation history

#### 🛠️ Developer Experience
- **Composable API** - `useGuidedForm()` composable
- **Component API** - `<GuidedFormContainer>` component
- **Engine API** - `GuidedFormEngine` class for headless usage
- **Event Hooks** - onStepChange, onAnswerChange, onComplete, onSave, onResume
- **Comprehensive Types** - Full TypeScript support

#### 🎨 Styling
- **Tailwind CSS** - Modern utility-first styling
- **Customizable Theme** - Override colors and styles
- **Smooth Animations** - Slide-in, slide-out, fade-in effects
- **Accessible** - ARIA labels and keyboard navigation

### Technical Details

- **Package Size**: ~29KB (minified), ~7.5KB (gzipped)
- **Dependencies**: vue-demi, @aivue/core
- **Build System**: Vite with TypeScript
- **CSS Framework**: Tailwind CSS
- **License**: MIT

### Documentation

- Comprehensive README with examples
- TypeScript definitions for all APIs
- Inline code documentation
- Example schemas and usage patterns

### Credits

Created by [Bharat Kumar Subramanian](https://www.linkedin.com/in/bharatkumarsubramanian/)

Special thanks to:
- **Manoj** - Main guidance and mentorship
- **Thiru** - AI sessions and teaching

---

Part of the [@aivue](https://github.com/reachbrt/vueai) ecosystem - AI-powered Vue.js components

