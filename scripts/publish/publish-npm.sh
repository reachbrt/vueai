#!/bin/bash

# Script to publish all packages to npm

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Publishing all packages to npm...${NC}"

# Array of packages in order of dependencies
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Publish all packages
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Publishing @aivue/${package}...${NC}"
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

  # Create a simple index.js file in dist
  echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > dist/index.js
  echo "module.exports = {};" >> dist/index.js

  # Create a simple index.d.ts file in dist
  echo "// @aivue/${package} v$(node -p "require('./package.json').version")" > dist/index.d.ts

  # Publish from dist directory
  cd dist
  npm publish --access public

  # Go back to root
  cd ../../..
done

echo -e "${GREEN}All packages have been published to npm!${NC}"
