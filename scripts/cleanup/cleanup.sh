#!/bin/bash

# Script to clean up the codebase before publishing
set -e

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Cleaning up the codebase...${NC}"

# Remove temporary files
echo -e "${YELLOW}Removing temporary files...${NC}"
find . -name "*.log" -type f -delete
find . -name "*.tmp" -type f -delete
find . -name ".DS_Store" -type f -delete

# Remove node_modules
echo -e "${YELLOW}Do you want to remove node_modules directories? (y/n)${NC}"
read REMOVE_NODE_MODULES

if [ "$REMOVE_NODE_MODULES" = "y" ] || [ "$REMOVE_NODE_MODULES" = "Y" ]; then
  echo -e "${YELLOW}Removing node_modules directories...${NC}"
  find . -name "node_modules" -type d -exec rm -rf {} +
  echo -e "${GREEN}node_modules directories removed${NC}"
fi

# Clean up dist directory
echo -e "${YELLOW}Cleaning up dist directory...${NC}"

# Remove any unnecessary files from dist
find ./dist -name "*.map" -type f -delete
find ./dist -name "*.test.*" -type f -delete
find ./dist -name "*.spec.*" -type f -delete

# Organize the codebase
echo -e "${YELLOW}Organizing the codebase...${NC}"

# Create directories if they don't exist
mkdir -p packages
mkdir -p docs
mkdir -p tests

# Move any stray files to their proper locations
if [ -d "src" ]; then
  echo -e "${YELLOW}Moving source files to packages directory...${NC}"
  # This is a simplified example - you may need to customize this for your project structure
  if [ ! -d "packages/core" ] && [ -d "src/core" ]; then
    mkdir -p packages/core
    cp -r src/core/* packages/core/
  fi
  
  if [ ! -d "packages/chatbot" ] && [ -d "src/chatbot" ]; then
    mkdir -p packages/chatbot
    cp -r src/chatbot/* packages/chatbot/
  fi
  
  if [ ! -d "packages/autosuggest" ] && [ -d "src/autosuggest" ]; then
    mkdir -p packages/autosuggest
    cp -r src/autosuggest/* packages/autosuggest/
  fi
  
  if [ ! -d "packages/smartform" ] && [ -d "src/smartform" ]; then
    mkdir -p packages/smartform
    cp -r src/smartform/* packages/smartform/
  fi
fi

# Move documentation files to docs directory
echo -e "${YELLOW}Moving documentation files to docs directory...${NC}"
find . -maxdepth 1 -name "*.md" -not -name "README.md" -not -name "CHANGELOG.md" -not -name "LICENSE.md" -exec mv {} docs/ \;

# Clean up any empty directories
echo -e "${YELLOW}Removing empty directories...${NC}"
find . -type d -empty -delete

echo -e "${GREEN}Codebase cleanup complete!${NC}"

# Final message
echo -e "${GREEN}The codebase is now clean and organized.${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Run 'npm install' to reinstall dependencies if you removed node_modules"
echo -e "2. Run './publish-packages.sh' to publish the packages to npm"
echo -e "3. Push the changes to GitHub"
