# Release Notes: AIVue v1.0.0

## Overview

This major release marks the official rebranding of our Vue.js AI component library from `@reachbrt/vueai-*` to `@aivue/*`. All packages have been renamed and published under the new `@aivue` organization on npm.

## Breaking Changes

- Renamed all packages from `@reachbrt/vueai-*` to `@aivue/*`:
  - `@reachbrt/vueai-core` → `@aivue/core`
  - `@reachbrt/vueai-chatbot` → `@aivue/chatbot`
  - `@reachbrt/vueai-autosuggest` → `@aivue/autosuggest`
  - `@reachbrt/vueai-smartform` → `@aivue/smartform`
- Reset version numbers to 1.0.0 for all packages
- Updated all import statements and dependencies to use the new package names

## Enhancements

- Added npm provenance support for enhanced security
- Improved package metadata with comprehensive repository information
- Set up GitHub Actions workflow for automated publishing
- Enhanced documentation with npm badges and installation instructions
- Updated all README files with the new package names and links

## Infrastructure Improvements

- Configured proper npm organization scope permissions
- Added GitHub Actions workflow for automated releases
- Enhanced package.json files with registry and provenance settings
- Improved repository linking between GitHub and npm

## Migration Guide

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

## Package Links

- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Core AI functionality for Vue.js components
- [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot) - AI-powered chat components for Vue.js
- [@aivue/autosuggest](https://www.npmjs.com/package/@aivue/autosuggest) - AI-powered suggestion components for Vue.js
- [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform) - AI-powered form validation for Vue.js

## What's Next

- Enhanced documentation and examples
- New features and components
- Performance optimizations
- Expanded AI provider support
