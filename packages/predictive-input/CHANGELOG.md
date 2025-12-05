# Changelog

All notable changes to @aivue/predictive-input will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-02

### Added
- 🎉 Initial release of @aivue/predictive-input
- ✨ PredictiveInput component with AI-powered text predictions
- 🧠 Pattern learning engine that learns from user's writing style
- 🌍 Multi-language support (English, Spanish, French, German, Italian, Portuguese)
- 🔒 Privacy-focused local processing - all data stays in browser
- ⚡ Offline capability after initial training
- 📊 N-gram language model (unigrams, bigrams, trigrams)
- 🎯 Context-aware predictions based on previous text
- 💾 LocalStorage persistence with auto-save
- 📤 Export/import functionality for training data
- 🎨 TrainingPanel component for custom training
- ⌨️ Keyboard navigation (Arrow keys, Tab, Enter, Esc)
- 📈 Real-time training progress tracking
- 🎨 Beautiful, customizable UI with confidence indicators
- 📦 TypeScript support with full type definitions
- 🔧 Composable API (usePredictiveInput)
- 📚 Comprehensive documentation and examples

### Features
- **Smart Predictions**: Suggests complete sentences based on writing patterns
- **Pattern Learning**: Extracts and learns common phrases (2-5 words)
- **Language Detection**: Automatically detects input language
- **Confidence Scoring**: Shows prediction reliability (0-100%)
- **Auto-Training**: Optionally trains on user input automatically
- **Data Management**: Export, import, and clear training data
- **Statistics**: View training stats (words, patterns, language)
- **Customizable**: Configurable prediction count, confidence threshold, storage key

### Technical Details
- Built with Vue 3 Composition API
- TypeScript for type safety
- Natural and Compromise libraries for NLP
- Vite for building
- LocalStorage for data persistence
- Privacy-first architecture

---

## Future Roadmap

### Planned Features
- [ ] More language support
- [ ] Cloud sync option (optional)
- [ ] Prediction analytics
- [ ] Custom dictionaries
- [ ] Emoji predictions
- [ ] Voice input integration
- [ ] Mobile optimization
- [ ] Dark mode support
- [ ] Accessibility improvements
- [ ] Performance optimizations

---

[1.0.0]: https://github.com/reachbrt/vueai/releases/tag/@aivue/predictive-input@1.0.0

