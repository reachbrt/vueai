# Changelog

## [1.2.0] - 2024-05-09

### Added
- Enhanced SmartForm with color-coded validation feedback (green, yellow, red)
- Real-time AI validation for form fields
- Improved AI analysis of submitted form data
- Added GitHub workflow for CI/CD
- Added comprehensive documentation for all packages

### Changed
- Updated package.json files with better metadata
- Improved error handling in AI client
- Enhanced OpenAI API integration with support for project API keys
- Updated README files with more examples and documentation

### Fixed
- Fixed issues with component registration in Vue 3
- Fixed validation prop type in SmartForm component
- Fixed API integration issues in the core package
- Fixed styling issues in the SmartForm component

## [1.1.5] - 2024-05-08

### Added
- Improved compatibility with Vue 2 and Vue 3
- Enhanced documentation and examples

## [1.0.2] - 2024-05-08

### Improvements

- Added full TypeScript support to the `@aivue/chatbot` package
- Fixed component registration issues in Vue 3 applications
- Updated build process to properly handle Vue components
- Improved compatibility with the `@aivue/core` package
- Enhanced documentation with TypeScript usage examples

## [1.0.1] - 2024-05-07

### Bug Fixes

- Fixed minor issues with package exports
- Updated dependencies to latest versions
- Improved documentation

## [1.0.0] - 2024-05-07

### Breaking Changes

- Renamed all packages from `@reachbrt/vueai-*` to `@aivue/*`
  - `@reachbrt/vueai-core` → `@aivue/core`
  - `@reachbrt/vueai-chatbot` → `@aivue/chatbot`
  - `@reachbrt/vueai-autosuggest` → `@aivue/autosuggest`
  - `@reachbrt/vueai-smartform` → `@aivue/smartform`
- Updated all import statements and dependencies
- Reset version numbers to 1.0.0

### Migration Guide

To migrate from the old packages to the new ones:

1. Uninstall the old packages:
   ```bash
   npm uninstall @reachbrt/vueai-core @reachbrt/vueai-chatbot @reachbrt/vueai-autosuggest @reachbrt/vueai-smartform
   ```

2. Install the new packages:
   ```bash
   npm install @aivue/core @aivue/chatbot @aivue/autosuggest @aivue/smartform
   ```

3. Update all import statements in your code:
   ```javascript
   // From
   import { AIClient } from '@reachbrt/vueai-core';
   // To
   import { AIClient } from '@aivue/core';
   ```
