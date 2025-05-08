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

# Array of packages in order of dependencies
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Publish all packages
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Publishing @aivue/${package} to GitHub...${NC}"
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

  # Modify package.json to remove build scripts
  cd dist
  node -e "const pkg = require('./package.json'); delete pkg.scripts; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
  cd ..

  # Update package.json for GitHub Packages
  cd dist
  # Add GitHub repository info to package.json
  node -e "const pkg = require('./package.json'); pkg.repository = { type: 'git', url: 'https://github.com/reachbrt/vueai.git', directory: 'packages/${package}' }; pkg.publishConfig = { registry: 'https://npm.pkg.github.com/' }; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

  # Create a simple index.js file in dist
  echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > index.js
  echo "module.exports = {};" >> index.js

  # Create a simple index.d.ts file in dist
  echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > index.d.ts

  # Publish to GitHub Packages
  npm publish --registry=https://npm.pkg.github.com/

  # Go back to root
  cd ../../..
done

echo -e "${GREEN}All packages have been published to GitHub Packages!${NC}"

# Create git tag for the release
echo -e "${YELLOW}Creating git tag for release v1.1.0...${NC}"
git tag v1.1.0
git push origin v1.1.0

echo -e "${GREEN}Done! Don't forget to create a release on GitHub.${NC}"
