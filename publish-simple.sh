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
  
  # If CHANGELOG.md exists, copy it too
  if [ -f CHANGELOG.md ]; then
    cp CHANGELOG.md dist/
  fi
  
  # Create a simple index.js file in dist
  echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > dist/index.js
  echo "module.exports = {};" >> dist/index.js
  
  # Create a simple index.d.ts file in dist
  echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > dist/index.d.ts
  echo "export {};" >> dist/index.d.ts
  
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
echo -e "${YELLOW}Publishing to GitHub...${NC}"
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Publishing @aivue/${package} to GitHub...${NC}"
  cd "packages/${package}/dist"
  
  # Update package.json for GitHub Packages
  node -e "const pkg = require('./package.json'); pkg.name = '@reachbrt/' + pkg.name.split('/')[1]; pkg.repository = { type: 'git', url: 'https://github.com/reachbrt/vueai.git', directory: 'packages/${package}' }; pkg.publishConfig = { registry: 'https://npm.pkg.github.com/' }; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
  
  # Publish to GitHub Packages
  npm publish --registry=https://npm.pkg.github.com/
  
  cd ../../..
done

echo -e "${GREEN}All packages have been published to npm and GitHub!${NC}"

# Create git tag for the release
echo -e "${YELLOW}Creating git tag for release v1.1.2...${NC}"
git tag v1.1.2
git push origin v1.1.2

echo -e "${GREEN}Done! Don't forget to create a release on GitHub.${NC}"
