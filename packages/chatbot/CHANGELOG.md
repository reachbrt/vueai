# Changelog

All notable changes to the @aivue/chatbot package will be documented in this file.

## [1.4.4] - 2023-08-14

### Fixed
- Fixed CSS inclusion in the package to ensure styles are properly loaded
- Updated CSS import path to use the correct exports field
- Improved CSS bundling to ensure compatibility with all build systems
- Enhanced documentation for running the demo

### Added
- More modern and elegant UI design with improved spacing and shadows
- Enhanced color schemes for all themes
- Improved message bubbles with better shadows and rounded corners
- Added subtle background patterns and gradients
- Enhanced toggle functionality with smooth animations

## [1.4.3] - 2023-08-13

### Changed
- Enhanced UI with more modern and elegant design
- Improved color schemes for all themes
- Better spacing, shadows, and animations
- Enhanced message bubbles and input field styling
- Improved toggle button with hover effects and animations

### Fixed
- Fixed CSS bundling to ensure styles are properly included
- Improved CSS extraction configuration
- Enhanced documentation for using the package

## [1.4.2] - 2023-08-12

### Fixed
- Improved CSS bundling to automatically include styles when importing the package
- No longer need to manually import CSS files
- Fixed CSS extraction to ensure styles are properly included in the bundle
- Simplified usage by automatically including all necessary styles

## [1.4.1] - 2023-08-11

### Fixed
- Fixed CSS not being properly included in the package
- Added separate CSS files that can be imported directly
- Improved CSS bundling for better compatibility with different build systems
- Added CSS export in package.json for easier importing

## [1.4.0] - 2023-08-10

### Added
- Enhanced UI with multiple themes: Modern, Dark, Soft, Vibrant, and Corporate
- Improved textbox and button styling with modern design
- Better message bubbles with subtle shadows and animations
- Added theme support to AiChatToggle component
- Added chat-window-container CSS for better toggle functionality
- Improved responsive design for all screen sizes

### Changed
- Updated default theme from 'light' to 'modern'
- Improved animations and transitions
- Enhanced typography and spacing
- Better color schemes for all themes

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
