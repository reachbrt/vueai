# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-12

### Added - 🤖 AI 360° Generation
- **NEW: `Ai360Generator` Component** - Upload a single product image and generate 360° views using AI
- **OpenAI DALL-E 3 Integration** - High-quality AI-generated frames at different angles
- **Stability AI Support** - Alternative AI provider for 360° generation
- **GPT-4 Vision Analysis** - Automatic product analysis for better generation results
- **AI360Generator Utility Class** - Programmatic API for AI generation
- **Customizable Generation Options**:
  - Frame count: 12, 24, 36, or 72 frames
  - Background color: white, transparent, black, or custom
  - Quality settings: standard, high, ultra
  - Image size options
- **Real-time Progress Tracking** - Live updates during generation
- **Frame Download** - Export all generated frames
- **Interactive Preview** - View generated 360° immediately with Ai360Spin
- **API Key Management** - Secure storage in localStorage

### Enhanced
- Updated TypeScript types for AI generation features
- Extended documentation with AI generation examples
- Added comprehensive README section for AI features
- Improved package description to highlight AI capabilities

### Breaking Changes
- Major version bump to 2.0.0 due to new AI features
- New exports: `Ai360Generator` component and `AI360Generator` class
- New types: `AIProvider`, `BackgroundColor`, `AI360GeneratorConfig`, etc.

## [1.0.2] - 2025-12-09

### Changed
- Re-published package with latest build
- Updated package metadata and documentation
- Ensured compatibility with latest Vue versions

### Maintenance
- Rebuilt package with latest dependencies
- Verified npm package integrity
- Updated build configuration

## [1.0.1] - 2024-12-06

### Fixed
- Fixed demo to use real 360° product photography sequences instead of static image swaps
- Removed CORS crossOrigin setting that was causing image loading errors
- Updated demo with Scaleflex CDN 360° product images (car: 36 frames, Nike: 35 frames)
- Changed demo mode from "gif" to "frames" for proper frame sequence animation
- Added frame-rate configuration for smooth 24 FPS animation

### Changed
- Demo now showcases true 360° rotation with professional product photography
- Updated demo products to Luxury Car and Nike Sneakers with real frame sequences
- Improved demo descriptions to clarify real 360° spin functionality

## [1.0.0] - 2024-12-06

### Added
- Initial release of @aivue/360-spin
- Core `Ai360Spin` component with static/animated image switching
- Support for GIF animations
- Support for frame sequence animations
- Hover, click, and auto-play triggers
- Mobile touch and drag-to-spin functionality
- Preloading of images for better performance
- Loading indicator with customizable text
- Configurable frame rate and animation direction
- Event emissions for animation lifecycle
- TypeScript support with full type definitions
- Comprehensive documentation and examples
- Pre-built CSS classes for common use cases
- Accessibility features (keyboard navigation, ARIA labels)
- Responsive design for mobile and desktop
- Vue 2 and Vue 3 compatibility

### Features
- 🖼️ Static to animated image switching
- 🎬 GIF and frame sequence support
- 📱 Mobile drag-to-spin
- 🎯 Multiple trigger modes (hover, click, auto)
- ⚡ Image preloading
- 🎨 Customizable styling
- ♿ Accessible
- 📦 E-commerce ready

[1.0.0]: https://github.com/reachbrt/vueai/releases/tag/@aivue/360-spin@1.0.0

