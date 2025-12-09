# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2025-12-09

### 🎯 Enhanced - Chat & Filter Functionality

#### Chat Can Now Execute Filters
- **Filter Execution in Chat** - Chat window can now actually apply filters to the table (not just explain them)
- **Smart Filter Detection** - Automatically detects filter requests using keywords (show, filter, find, search, where, get, display, list)
- **Concise Responses** - Chat responses are now brief and user-friendly (no SQL queries)
- **Row Count Display** - Shows number of matching rows after filter is applied
- **Seamless Integration** - Chat uses the same `aiQuery` composable as the AI search input

#### Improved Type Conversion
- **Better Numeric Handling** - Improved type conversion for numeric comparisons (price > 100 now works correctly)
- **Case-Insensitive Matching** - All string comparisons are now case-insensitive
- **Enhanced Operators** - Better handling of 'in', 'between', and 'regex' operators
- **Type Safety** - Added proper type checking and conversion for all filter operators

#### Better User Feedback
- **Loading States** - Shows "⏳ Processing..." while AI is analyzing queries
- **Filter Status Display** - Shows "🤖 AI Filter Active: [explanation]" when filter is applied
- **Error Handling** - Clear error messages with alerts when AI search fails
- **Console Logging** - Helpful console messages with emojis for debugging

#### UI Enhancements
- **Disabled Input During Loading** - Input field is disabled while processing
- **Loading Button State** - Search button changes to loading state with visual feedback
- **Filter Info Panel** - Green gradient panel showing active filter explanation
- **Better Placeholders** - More helpful placeholder text in search input

### 🐛 Fixed
- Fixed numeric filter comparisons (e.g., "price > 100" now works correctly)
- Fixed chat not applying filters to table
- Fixed chat showing SQL queries instead of user-friendly responses
- Fixed missing loading states during AI operations
- Fixed case-sensitive string matching issues

### 🎨 Improved
- Enhanced system prompts for more concise AI responses
- Better visual feedback for all AI operations
- Improved error messages and user guidance
- More intuitive chat interaction flow

---

## [2.0.0] - 2025-12-07

### 🚀 Major Release - AI-Native Transformation

This is a **major release** that transforms `@aivue/smart-datatable` into the world's first truly AI-native datatable component.

### ✨ Added - AI-Native Features

#### Natural Language Querying
- **AI Search Mode** - Users can type natural language queries like "show orders from India last 30 days where total > 500"
- **Query to Filter Conversion** - LLM automatically converts queries to structured filter definitions
- **Smart Suggestions** - AI-powered query suggestions based on table schema
- **Filter Visualization** - Clear indication when AI filters are active

#### Auto-Insights & Summaries
- **One-Click Insights** - Generate comprehensive AI analysis with single button click
- **Structured Insights** - Categorized insights (trends, outliers, patterns, recommendations, predictions)
- **Contextual Analysis** - Generate insights for selected rows only
- **Confidence Scores** - Each insight includes AI confidence level
- **Actionable Recommendations** - AI suggests specific actions based on data patterns

#### AI Row Agents
- **Row-Level AI Operations** - Execute AI tasks on individual rows or selections
- **Configurable Agents** - Define custom agents with prompt templates
- **Built-in Agents** - Explain records, generate content, predict outcomes
- **Batch Processing** - Execute agents on multiple rows simultaneously
- **Custom Handlers** - Hook into agent results for custom processing

#### AI Data Transformations
- **Intelligent Data Cleaning** - AI-powered data standardization and normalization
- **Column Transformations** - Transform entire columns with AI (e.g., standardize country names)
- **Row Enrichment** - Add missing data, translate text, categorize free-form content
- **Preview Mode** - Review AI transformations before applying
- **Undo Support** - Cancel transformations before committing

#### Chat Interface
- **Conversational Queries** - New `SmartDatatableChat` component for natural conversations
- **Context-Aware** - Chat understands table schema and current data
- **Multi-Turn Conversations** - Maintains conversation history
- **Query Suggestions** - Smart suggestions based on table content

#### OpenAPI Integration
- **Auto-Column Inference** - Generate column definitions from OpenAPI schemas
- **Schema Parsing** - AI reads OpenAPI specs and suggests optimal table configuration
- **Query Building** - Convert natural language to API query parameters
- **Remote Data Support** - Seamless integration with REST APIs

### 🔧 Added - Composables & Utilities

- **`useAiTableQuery`** - Natural language to filter conversion
- **`useAiInsights`** - Generate and manage AI insights
- **`useAiRowAgents`** - Execute row-level AI operations
- **`useAiTransformations`** - AI-powered data transformations
- **`useOpenApiIntegration`** - OpenAPI schema integration

### 📦 Added - TypeScript Types

- Comprehensive type definitions for all AI features
- `AIProvider`, `AIProviderConfig` - Provider abstraction
- `TableSchema`, `ColumnSchema` - Schema definitions
- `AISearchConfig`, `AISearchResult` - Search types
- `AIInsightsConfig`, `AIInsight` - Insights types
- `RowAgent`, `RowAgentResult` - Row agent types
- `AITransformation`, `TransformationResult` - Transformation types
- `OpenAPIConfig`, `OpenAPIOperation` - OpenAPI types

### 🎨 Added - UI Enhancements

- AI search mode indicator with visual feedback
- Insights panel with categorized display
- Row agent dropdown menu with icons
- AI filter active indicator
- Chat panel integration
- Enhanced loading states for AI operations

### 📚 Added - Documentation

- Comprehensive README with all AI features
- Three integration levels (Zero-Config, Config-Driven, Advanced)
- Complete API reference
- Usage examples for each AI feature
- Migration guide from v1.x

### 🔄 Changed

- **BREAKING**: `columns` prop is now optional (can be auto-generated)
- **BREAKING**: AI client responses now return string directly (not `response.content`)
- Enhanced `filteredData` computed to support AI filters
- Improved schema building with type inference
- Better error handling for AI operations

### 🐛 Fixed

- Fixed AIClient response handling in useSmartDataTable
- Improved type detection for auto-generated columns
- Better handling of null/undefined values in transformations

### 📖 Documentation

- Updated README with comprehensive AI features documentation
- Added examples for all three integration levels
- Documented all new composables and types
- Added troubleshooting guide

---

## [1.0.0] - 2025-12-02

### Added
- Initial release of @aivue/smart-datatable
- AI-powered intelligent sorting and filtering
- Natural language search capabilities
- Smart column detection and type inference
- Data insights and analytics
- Export functionality (CSV, JSON, Excel)
- Pagination with intelligent page size suggestions
- Responsive design with mobile support
- Customizable themes and styling
- Multi-select and bulk actions
- Column visibility controls
- Advanced filtering with AI suggestions

