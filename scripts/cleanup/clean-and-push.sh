#!/bin/bash

# Script to clean sensitive data and push to GitHub
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Creating a clean repository for GitHub...${NC}"

# Create a new directory for the clean repository
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}Created temporary directory: $TEMP_DIR${NC}"

# Copy all files except .git directory and temporary scripts
echo -e "${YELLOW}Copying files to temporary directory...${NC}"
rsync -av --exclude='.git' --exclude='clean-repo.sh' --exclude='cleanup.sh' \
  --exclude='publish-packages.sh' --exclude='push-to-github.sh' \
  --exclude='cleanup-before-push.sh' --exclude='clean-and-push.sh' \
  --exclude='.git.bak' --exclude='node_modules' \
  ./ "$TEMP_DIR/"

# Initialize a new git repository in the temporary directory
echo -e "${YELLOW}Initializing new git repository...${NC}"
cd "$TEMP_DIR"
git init
git add .
git commit -m "Initial commit: VueAI v1.2.0"

# Add the remote repository
echo -e "${YELLOW}Adding remote repository...${NC}"
git remote add origin https://github.com/reachbrt/vueai.git

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main --force

# Create and push the tag
echo -e "${YELLOW}Creating and pushing tag v1.2.0...${NC}"
git tag v1.2.0
git push origin v1.2.0

echo -e "${GREEN}Repository successfully cleaned and pushed to GitHub!${NC}"
echo -e "${YELLOW}The clean repository is located at: $TEMP_DIR${NC}"
echo -e "${YELLOW}You may want to replace your current repository with this clean one.${NC}"
