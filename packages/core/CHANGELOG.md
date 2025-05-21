# Changelog

All notable changes to the @aivue/core package will be documented in this file.

## [1.3.4] - 2025-05-21

### Fixed
- Added proper Ollama API integration
- Fixed JSON parsing for Ollama's streaming response format
- Updated model defaults to work with latest Ollama models (llama3.2)
- Improved error handling for Ollama API calls

## [1.3.2] - 2025-05-15

### Added
- Support for Ollama local models
- Enhanced streaming capabilities
- Improved error handling

## [1.1.2] - 2023-07-25

### Fixed
- Improved package structure and exports
- Enhanced build configuration
- Fixed module resolution issues
- Added better compatibility with different build tools

## [1.1.1] - 2023-07-20

### Fixed
- Fixed the "This is a simulated streaming response from the AI" issue
- Implemented proper API calls to OpenAI and other providers
- Added fallback responses when no API key is provided
- Improved error handling for API calls

## [1.1.0] - 2023-07-15

### Added
- Vue 2 compatibility: The package now works with both Vue 2.6+ and Vue 3.x
- Comprehensive compatibility layer that automatically detects Vue version
- New utility functions for cross-version compatibility:
  - `createNode`: Create VNodes in both Vue 2 and Vue 3
  - `createCompatComponent`: Create components that work in both Vue 2 and Vue 3
  - `registerCompatComponent`: Register components globally in both Vue 2 and Vue 3
  - `createCompatPlugin`: Create plugins that work in both Vue 2 and Vue 3
  - `installCompatPlugin`: Install plugins in both Vue 2 and Vue 3
  - `createReactiveState`: Create reactive state in both Vue 2 and Vue 3
  - `createCompatRef`: Create refs that work in both Vue 2 and Vue 3

### Changed
- Updated peer dependencies to support both Vue 2 and Vue 3
- Improved documentation with examples for both Vue 2 and Vue 3
- Enhanced error handling for better cross-version compatibility

## [1.0.1] - 2023-06-30

### Added
- Initial release with support for Vue 3
- Basic AI client implementation
- Support for multiple AI providers
- Streaming response support
