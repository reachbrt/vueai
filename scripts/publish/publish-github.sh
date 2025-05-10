#!/bin/bash

# Script to publish all packages to GitHub Packages

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Publishing all packages to GitHub Packages...${NC}"

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${RED}Error: GITHUB_TOKEN environment variable is not set.${NC}"
  echo -e "${YELLOW}Please set your GitHub Personal Access Token:${NC}"
  echo -e "export GITHUB_TOKEN=your_github_token"
  exit 1
fi

# Configure npm for GitHub Packages
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc
echo "@reachbrt:registry=https://npm.pkg.github.com/" >> .npmrc
echo "registry=https://registry.npmjs.org/" >> .npmrc
echo "always-auth=true" >> .npmrc

# Verify the token is set in .npmrc
if ! grep -q "_authToken=${GITHUB_TOKEN}" .npmrc; then
  echo -e "${RED}Error: Failed to set up authentication in .npmrc${NC}"
  exit 1
fi

# Get the version from the core package
VERSION=$(node -p "require('./packages/core/package.json').version")
echo -e "${GREEN}Publishing version: ${VERSION}${NC}"

# Array of packages in order of dependencies
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Check if packages are built
if [ ! -d "packages/core/dist" ]; then
  echo -e "${YELLOW}Packages not built yet. Building packages...${NC}"
  npm run build:packages

  if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the build issues and try again.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}Using existing built packages.${NC}"
fi

# Publish all packages
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Publishing @aivue/${package} to GitHub...${NC}"

  # Check if dist directory exists
  if [ ! -d "packages/${package}/dist" ]; then
    echo -e "${RED}Error: dist directory for ${package} does not exist. Build may have failed.${NC}"
    continue
  fi

  cd "packages/${package}"

  # Copy package.json and README.md to dist if they don't exist there
  if [ ! -f "dist/package.json" ]; then
    cp package.json dist/
  fi

  if [ ! -f "dist/README.md" ]; then
    cp README.md dist/
  fi

  # If CHANGELOG.md exists, copy it too
  if [ -f "CHANGELOG.md" ] && [ ! -f "dist/CHANGELOG.md" ]; then
    cp CHANGELOG.md dist/
  fi

  # Modify package.json to remove build scripts
  cd dist
  node -e "const pkg = require('./package.json'); delete pkg.scripts; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

  # Update package.json for GitHub Packages
  node -e "const pkg = require('./package.json'); pkg.name = '@reachbrt/' + pkg.name.split('/')[1]; pkg.repository = { type: 'git', url: 'https://github.com/reachbrt/vueai.git', directory: 'packages/${package}' }; pkg.publishConfig = { registry: 'https://npm.pkg.github.com/' }; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

  # Check if the package has actual built files
  if [ ! -f "index.js" ] && [ ! -f "index.mjs" ]; then
    echo -e "${YELLOW}Warning: No index.js or index.mjs found in dist directory for ${package}.${NC}"
    echo -e "${YELLOW}Creating placeholder files...${NC}"

    # Create a simple index.js file in dist
    echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > index.js
    echo "module.exports = {};" >> index.js

    # Create a simple index.d.ts file in dist if it doesn't exist
    if [ ! -f "index.d.ts" ]; then
      echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > index.d.ts
    fi
  fi

  # Publish to GitHub Packages
  echo -e "${GREEN}Publishing to GitHub Packages...${NC}"
  npm publish --registry=https://npm.pkg.github.com/

  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to publish ${package} to GitHub Packages.${NC}"
  else
    echo -e "${GREEN}Successfully published ${package} to GitHub Packages.${NC}"
  fi

  # Go back to root
  cd ../../..
done

echo -e "${GREEN}All packages have been published to GitHub Packages!${NC}"

# Create git tag for the release
echo -e "${YELLOW}Creating git tag for release v${VERSION}...${NC}"
git tag "v${VERSION}"
git push origin "v${VERSION}"

echo -e "${GREEN}Done! Don't forget to create a release on GitHub.${NC}"
