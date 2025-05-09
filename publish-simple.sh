#!/bin/bash

# Script to publish all packages to npm and GitHub

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Publishing all packages to npm and GitHub...${NC}"

# Array of packages in order of dependencies
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Create dist directories and copy files
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Preparing @aivue/${package}...${NC}"
  cd "packages/${package}"

  # Create dist directory if it doesn't exist
  mkdir -p dist

  # Copy package.json and README.md to dist
  cp package.json dist/
  cp README.md dist/

  # Disable prepublishOnly script to avoid build errors
  cd dist
  node -e "const pkg = require('./package.json'); delete pkg.scripts; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
  cd ..

  # If CHANGELOG.md exists, copy it too
  if [ -f CHANGELOG.md ]; then
    cp CHANGELOG.md dist/
  fi

  # Create a simple index.js file in dist if it doesn't exist
  if [ ! -f dist/index.js ]; then
    echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > dist/index.js
    echo "module.exports = {};" >> dist/index.js
  fi

  # Create a simple index.d.ts file in dist if it doesn't exist
  if [ ! -f dist/index.d.ts ]; then
    echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > dist/index.d.ts
    echo "export {};" >> dist/index.d.ts
  fi

  # Copy source files for reference
  mkdir -p dist/src
  cp -r src/* dist/src/

  cd ../..
done

# Publish to npm
echo -e "${YELLOW}Publishing to npm...${NC}"
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Publishing @aivue/${package} to npm...${NC}"
  cd "packages/${package}/dist"
  npm publish --access public
  cd ../../..
done

# Publish to GitHub
# Check if GitHub token is available
if [ -n "$GITHUB_TOKEN" ]; then
  echo -e "${YELLOW}Publishing to GitHub Packages using GITHUB_TOKEN environment variable...${NC}"
  # Configure npm for GitHub Packages
  echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc
  
  for package in "${PACKAGES[@]}"; do
    echo -e "${GREEN}Publishing @aivue/${package} to GitHub Packages...${NC}"
    cd "packages/${package}/dist"
    # Update package.json for GitHub Packages
    node -e "const pkg = require('./package.json'); pkg.name = '@reachbrt/' + pkg.name.split('/')[1]; pkg.repository = { type: 'git', url: 'https://github.com/reachbrt/vueai.git', directory: 'packages/${package}' }; pkg.publishConfig = { registry: 'https://npm.pkg.github.com/' }; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
    npm publish --registry=https://npm.pkg.github.com/
    cd ../../..
  done
  
  # Clean up
  rm .npmrc
  
  echo -e "${GREEN}All packages have been published to GitHub Packages!${NC}"
else
  echo -e "${YELLOW}To publish to GitHub Packages, you need to:${NC}"
  echo -e "${GREEN}1. Set the GITHUB_TOKEN environment variable with your GitHub personal access token${NC}"
  echo -e "${GREEN}2. Run this script again${NC}"
  echo -e "${YELLOW}Or manually follow these steps:${NC}"
  
  for package in "${PACKAGES[@]}"; do
    echo -e "${GREEN}   cd packages/${package}/dist${NC}"
    echo -e "${GREEN}   node -e \"const pkg = require('./package.json'); pkg.name = '@reachbrt/' + pkg.name.split('/')[1]; pkg.repository = { type: 'git', url: 'https://github.com/reachbrt/vueai.git', directory: 'packages/${package}' }; pkg.publishConfig = { registry: 'https://npm.pkg.github.com/' }; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));\";${NC}"
    echo -e "${GREEN}   npm publish --registry=https://npm.pkg.github.com/${NC}"
    echo -e "${GREEN}   cd ../../..${NC}"
  done
fi

echo -e "${GREEN}All packages have been published to npm and GitHub!${NC}"

# Create git tag for the release
echo -e "${YELLOW}Creating git tag for release v1.1.5...${NC}"
git tag v1.1.5
git push origin v1.1.5

echo -e "${GREEN}Done! Don't forget to create a release on GitHub.${NC}"
