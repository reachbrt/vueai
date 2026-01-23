# Changelog

All notable changes to @aivue/mcp will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-18

### Added

#### Core Features
- **MCPClient** - Framework-agnostic MCP client implementation
  - JSON-RPC 2.0 protocol support
  - HTTP and SSE transport layers
  - Connection management with automatic reconnection
  - Event-driven architecture for real-time updates

#### MCP Protocol Support
- **Tools** - List and execute tools from MCP servers
  - `listTools()` - Get all available tools
  - `callTool()` - Execute tools with arguments
  - Tool schema validation support

- **Resources** - Access and manage resources
  - `listResources()` - Get all available resources
  - `readResource()` - Read resource contents
  - `subscribeResource()` - Subscribe to resource updates
  - `unsubscribeResource()` - Unsubscribe from updates

- **Prompts** - Work with server prompts
  - `listPrompts()` - Get all available prompts
  - `getPrompt()` - Retrieve prompts with arguments

#### Vue Integration
- **useMCP Composable** - Reactive Vue composable
  - Reactive state management
  - Automatic cleanup on unmount
  - Error handling
  - Loading states

- **MCPToolExecutor Component** - UI component for tool execution
  - Interactive tool selection
  - Dynamic form generation from tool schemas
  - Result display with multiple content types
  - Error handling and validation

#### Developer Experience
- **TypeScript Support** - Full type definitions
  - Complete type coverage
  - IntelliSense support
  - Type-safe API

- **Event System** - Comprehensive event handling
  - Connection events (connected, disconnected)
  - List change events (tools, resources, prompts)
  - Resource update events
  - Error events
  - Wildcard event listener support

#### Documentation
- Comprehensive README with examples
- API documentation
- Usage examples
- TypeScript type definitions
- Inline code documentation

#### Testing
- Unit tests for core functionality
- Test coverage for client methods
- Configuration validation tests

#### Build & Distribution
- ES Module and CommonJS builds
- CSS bundling
- TypeScript declarations
- Source maps

### Configuration Options
- Custom timeout settings
- Retry configuration
- Custom headers support
- Server info configuration
- Multiple transport types

### Browser Compatibility
- Modern browser support
- Fetch API for HTTP transport
- No Node.js-specific dependencies in browser builds

### Package Features
- Vue 2 and Vue 3 compatibility
- Tree-shakeable exports
- Side-effect free
- Peer dependency on @aivue/core

## [Unreleased]

### Planned Features
- WebSocket transport support
- Automatic reconnection with exponential backoff
- Request queuing and batching
- Caching layer for resources
- Offline support
- More UI components
- Advanced error recovery
- Performance optimizations
- Additional examples and demos

---

## Version History

- **1.0.0** - Initial release with core MCP functionality

