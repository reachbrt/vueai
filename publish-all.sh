#!/bin/bash

# Script to build and publish all packages to npm and GitHub

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Version to publish
VERSION="1.2.0"

echo -e "${YELLOW}Building and publishing all packages version ${VERSION}...${NC}"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}There are uncommitted changes. Committing them before publishing...${NC}"
  git add .
  git commit -m "Release v${VERSION}: Enhanced SmartForm with color-coded validation"
  echo -e "${GREEN}Changes committed${NC}"
fi

# Array of packages in order of dependencies
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Check if we need to build packages
if [ -d "packages/core/src" ]; then
  # Build all packages first
  echo -e "${YELLOW}Building all packages...${NC}"
  for package in "${PACKAGES[@]}"; do
    echo -e "${GREEN}Building @aivue/${package}...${NC}"
    cd "packages/${package}"
    npm run build

    # Verify if dist directory exists
    if [ ! -d "dist" ]; then
      echo -e "${RED}Error: dist directory is missing for @aivue/${package}. Build might have failed.${NC}"
      exit 1
    fi

    cd ../..
  done
else
  echo -e "${YELLOW}Skipping build step - using pre-built packages in dist directory...${NC}"

  # Verify if dist directory exists
  if [ ! -d "dist/core" ]; then
    echo -e "${RED}Error: dist/core directory is missing. Please make sure the packages are built.${NC}"
    exit 1
  fi
fi

# Publish all packages
echo -e "${YELLOW}Publishing all packages...${NC}"

# Check if we should publish from dist directory or packages directory
if [ -d "dist/core" ]; then
  echo -e "${YELLOW}Publishing from dist directory...${NC}"
  for package in "${PACKAGES[@]}"; do
    echo -e "${GREEN}Publishing @aivue/${package}...${NC}"
    cd "dist/${package}"
    npm publish --access public
    cd ../..
  done
else
  echo -e "${YELLOW}Publishing from packages directory...${NC}"
  for package in "${PACKAGES[@]}"; do
    echo -e "${GREEN}Publishing @aivue/${package}...${NC}"
    cd "packages/${package}"
    npm publish --access public
    cd ../..
  done
fi

echo -e "${GREEN}All packages have been built and published!${NC}"

# Create git tag for the release
echo -e "${YELLOW}Creating git tag for release v${VERSION}...${NC}"
git tag v${VERSION}
git push origin v${VERSION}

# Push changes to GitHub
echo -e "${YELLOW}Pushing changes to GitHub...${NC}"
git push origin main

echo -e "${GREEN}Done! Don't forget to create a release on GitHub.${NC}"
