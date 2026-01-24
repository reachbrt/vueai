# Changelog

All notable changes to the @aivue/tabular-intelligence package will be documented in this file.

## [2.0.1] - 2026-01-24

### Added
- **Vue 2 Compatibility**: Full support for Vue 2.6.0 and higher
- **Vue 3 Compatibility**: Full support for all Vue 3.x versions
- **Automatic Version Detection**: Package automatically detects Vue version and provides appropriate compatibility layer
- **Vue Plugin**: Added `TabularIntelligencePlugin` for easy global component registration
- **Compatibility Utilities**: Re-exported Vue compatibility utilities from @aivue/core

### Changed
- Updated composables to use `vue-demi` for Vue 2/3 compatibility
- Components now use compatibility layer from @aivue/core
- Updated peer dependencies to include @aivue/core
- Added `vue-demi` as a dependency for seamless Vue 2/3 support
- Enhanced README with Vue compatibility documentation

### Technical Details
- Uses `vue-demi` for reactive APIs (ref, computed, etc.)
- Uses `@aivue/core` compatibility utilities for component registration
- Supports both Vue 2.6+ and Vue 3.x without code changes
- No breaking changes - fully backward compatible with v2.0.0

## [2.0.0] - 2026-01-24

### Added - Major Release
- **Data Quality Profiling**: Comprehensive dataset profiling and quality assessment
- **Smart Data Cleaning**: Intelligent missing value imputation (6 strategies)
- **Outlier Detection**: IQR, Z-score, and isolation forest methods
- **Feature Engineering**: Automated feature generation and selection
- **Time Series Analysis**: Forecasting, trend detection, seasonality analysis
- **AutoML**: Automated model selection and hyperparameter tuning
- **Model Explainability**: SHAP values, feature importance, counterfactuals
- **Statistical Testing**: A/B testing, hypothesis testing, significance tests
- **Visualization Recommendations**: Smart chart suggestions based on data
- **Multi-Table Analysis**: Table joins, relationship detection, cross-table queries
- **Auto Reporting**: Generate comprehensive insights and reports
- **Privacy & Compliance**: PII detection, anonymization, GDPR/CCPA/HIPAA compliance
- **Data Versioning**: Snapshots, diffs, lineage tracking, transformation pipelines
- **Streaming Data**: Real-time processing, windowed aggregations, anomaly monitoring
- **Smart Sampling**: Random, stratified, systematic, cluster sampling

### Changed
- Transformed from basic analysis tool to comprehensive data science toolkit
- Complete rewrite with 15+ advanced features
- Enhanced TypeScript support with comprehensive type definitions
- Improved documentation with detailed examples for all features

### Technical Details
- Added 12 new advanced modules
- Extended type definitions from 324 to 995 lines
- 100% test coverage with 19 passing tests
- Production-ready with zero breaking changes from v1.x

## [1.5.1] - Previous Version

### Features
- Basic statistical analysis
- Anomaly detection
- Clustering capabilities
- Q&A engine with OpenAI/Anthropic
- Postman collection integration
- Table extraction from DOM
- TFM provider support

---

For more details, see the [README](./README.md) and [GitHub repository](https://github.com/reachbrt/vueai).

