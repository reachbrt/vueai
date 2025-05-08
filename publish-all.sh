#!/bin/bash

# Script to build and publish all packages to npm

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building and publishing all packages...${NC}"

# Array of packages in order of dependencies
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Build all packages first
echo -e "${YELLOW}Building all packages...${NC}"
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Building @aivue/${package}...${NC}"
  cd "packages/${package}"
  npm run build
  cd ../..
done

# Publish all packages
echo -e "${YELLOW}Publishing all packages...${NC}"
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Publishing @aivue/${package}...${NC}"
  cd "packages/${package}"
  npm publish
  cd ../..
done

echo -e "${GREEN}All packages have been built and published!${NC}"

# Create git tag for the release
echo -e "${YELLOW}Creating git tag for release v1.1.0...${NC}"
git tag v1.1.0
git push origin v1.1.0

echo -e "${GREEN}Done! Don't forget to create a release on GitHub.${NC}"
