# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

