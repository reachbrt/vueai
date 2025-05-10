# Deployment Guide

This guide explains how to deploy the @aivue packages to both GitHub and npm.

## Prerequisites

1. Make sure you have an npm account and are logged in:
   ```bash
   npm login
   ```

2. Make sure you have access to the @aivue organization on npm:
   ```bash
   npm org ls @aivue
   ```

3. Make sure you have a GitHub account and have set up SSH keys for authentication.

## Building the Packages

Before deploying, you need to build the packages:

```bash
# Build all packages
npm run build

# Or build individual packages
cd packages/core
npm run build

cd packages/chatbot
npm run build
```

## Deploying to npm

To publish the packages to npm:

```bash
# Publish core package
cd packages/core
npm publish

# Publish chatbot package
cd packages/chatbot
npm publish
```

If you're publishing a beta version, use the `--tag` flag:

```bash
npm publish --tag beta
```

## Deploying to GitHub

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Release v1.1.0: Vue 2/3 compatibility and Intercom-like toggle"
   ```

2. Create a tag for the release:
   ```bash
   git tag v1.1.0
   ```

3. Push the changes and tags:
   ```bash
   git push origin main
   git push origin --tags
   ```

4. Create a release on GitHub:
   - Go to https://github.com/reachbrt/vueai/releases
   - Click "Draft a new release"
   - Select the tag you just created
   - Add a title and description (you can copy from the CHANGELOG.md files)
   - Attach any additional assets if needed
   - Click "Publish release"

## Deploying the Demo

To deploy the demo to GitHub Pages:

1. Build the demo:
   ```bash
   cd demo
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   # If you have gh-pages installed
   npx gh-pages -d dist

   # Or manually
   git checkout -b gh-pages
   git add dist -f
   git commit -m "Deploy demo to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   git checkout main
   ```

## Updating Documentation

After deployment, make sure to update the documentation:

1. Update the README.md files with the latest version numbers
2. Update any links to point to the new version
3. Update the demo site with the latest examples

## Troubleshooting

If you encounter issues during deployment:

- **npm publish fails**: Make sure you're logged in and have the correct permissions
- **GitHub push fails**: Make sure your SSH keys are set up correctly
- **Build fails**: Check the error messages and fix any issues before trying again
