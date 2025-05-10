# Contributing to AIVue

Thank you for your interest in contributing to AIVue! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/reachbrt/vueai/blob/main/CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vueai.git
   cd vueai
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/reachbrt/vueai.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the packages:
   ```bash
   npm run build:packages
   ```

## Project Structure

AIVue is organized as a monorepo with the following structure:

```
vueai/
├── packages/
│   ├── core/           # @aivue/core
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── providers/
│   │   │       ├── openai.ts
│   │   │       ├── claude.ts
│   │   │       ├── gemini.ts
│   │   │       ├── huggingface.ts
│   │   │       ├── ollama.ts
│   │   │       ├── deepseek.ts
│   │   │       └── fallback.ts
│   ├── chatbot/        # @aivue/chatbot
│   ├── autosuggest/    # @aivue/autosuggest
│   └── smartform/      # @aivue/smartform
├── examples/           # Example applications
├── tests/              # Test utilities and shared tests
└── package.json        # Root package.json with workspace configuration
```

## Development Workflow

### Creating a New Feature

1. Make sure you're on the main branch and it's up to date:
   ```bash
   git checkout main
   git pull upstream main
   ```
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes, following the coding standards
4. Write tests for your changes
5. Run the tests to make sure everything passes:
   ```bash
   npm test
   ```
6. Build the packages to make sure everything builds correctly:
   ```bash
   npm run build:packages
   ```
7. Commit your changes with a descriptive commit message:
   ```bash
   git commit -m "feat: add new feature"
   ```
8. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
9. Create a pull request on GitHub

### Fixing a Bug

1. Make sure you're on the main branch and it's up to date:
   ```bash
   git checkout main
   git pull upstream main
   ```
2. Create a new branch for your bug fix:
   ```bash
   git checkout -b fix/bug-description
   ```
3. Make your changes, following the coding standards
4. Write tests that reproduce the bug and verify your fix
5. Run the tests to make sure everything passes:
   ```bash
   npm test
   ```
6. Build the packages to make sure everything builds correctly:
   ```bash
   npm run build:packages
   ```
7. Commit your changes with a descriptive commit message:
   ```bash
   git commit -m "fix: fix bug description"
   ```
8. Push your branch to your fork:
   ```bash
   git push origin fix/bug-description
   ```
9. Create a pull request on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Define interfaces for all public APIs
- Use proper type annotations
- Avoid using `any` type
- Use `unknown` instead of `any` when the type is not known
- Use `readonly` for properties that should not be modified

### Vue Components

- Use Vue 3 Composition API with `<script setup>` syntax
- Define props using runtime validation
- Use `defineEmits` for events
- Use `defineExpose` for exposing methods and properties
- Use PascalCase for component names
- Use kebab-case for custom element names

### CSS

- Use scoped CSS or CSS modules
- Use CSS variables for theming
- Follow BEM naming convention for classes
- Use responsive design principles

### Testing

- Write unit tests for all components and utilities
- Use Vitest for testing
- Aim for high test coverage
- Write integration tests for complex features

### Documentation

- Document all public APIs
- Use JSDoc comments for TypeScript code
- Keep documentation up to date with code changes
- Write clear and concise documentation

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

Examples:
```
feat(core): add support for DeepSeek provider
fix(chatbot): fix streaming response handling
docs: update README with new examples
```

## Pull Request Process

1. Make sure your code follows the coding standards
2. Update the documentation if necessary
3. Add tests for your changes
4. Make sure all tests pass
5. Make sure your branch is up to date with the main branch
6. Create a pull request with a clear title and description
7. Wait for code review and address any feedback

## Release Process

1. Update version numbers in package.json files
2. Update CHANGELOG.md with the changes
3. Create a new tag for the version
4. Push the tag to GitHub
5. Publish the packages to npm

## Getting Help

If you need help with contributing, please:
- Open an issue on GitHub
- Ask in the discussions section
- Reach out to the maintainers

Thank you for contributing to AIVue!
