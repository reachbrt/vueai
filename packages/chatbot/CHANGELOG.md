# Changelog

All notable changes to the @aivue/chatbot package will be documented in this file.

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
