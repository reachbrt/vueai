# Changelog

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
