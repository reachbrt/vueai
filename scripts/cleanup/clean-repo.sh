#!/bin/bash

# Script to clean sensitive data from repository history
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Cleaning sensitive data from repository history...${NC}"

# Create a backup of the repository
echo -e "${YELLOW}Creating backup of the repository...${NC}"
cp -r .git .git.bak
echo -e "${GREEN}Backup created at .git.bak${NC}"

# Remove the API key from the repository history
echo -e "${YELLOW}Removing API key from repository history...${NC}"
git filter-branch --force --index-filter \
  "git ls-files -z '*.env*' | xargs -0 -I{} sh -c 'if [ -f \"{}\" ]; then sed -i \"\" \"s/sk-[a-zA-Z0-9_\\-]\{30,\}/YOUR_API_KEY_PLACEHOLDER/g\" \"{}\"; fi'" \
  --prune-empty -- --all

# Force garbage collection to remove the old objects
echo -e "${YELLOW}Cleaning up repository...${NC}"
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Verify the API key has been removed
echo -e "${YELLOW}Verifying API key has been removed...${NC}"
if git grep -q "sk-[a-zA-Z0-9_\-]\{30,\}"; then
  echo -e "${RED}API key still found in repository. Please check manually.${NC}"
  exit 1
else
  echo -e "${GREEN}API key successfully removed from repository history.${NC}"
fi

# Push the cleaned repository to GitHub
echo -e "${YELLOW}Do you want to force push the cleaned repository to GitHub? (y/n)${NC}"
read PUSH_TO_GITHUB

if [ "$PUSH_TO_GITHUB" = "y" ] || [ "$PUSH_TO_GITHUB" = "Y" ]; then
  echo -e "${YELLOW}Force pushing to GitHub...${NC}"
  git push origin main --force

  # Push the tag
  git tag -f v1.2.2
  git push origin v1.2.2 --force

  echo -e "${GREEN}Repository successfully cleaned and pushed to GitHub!${NC}"
else
  echo -e "${YELLOW}Skipping push to GitHub. You can push manually with:${NC}"
  echo -e "git push origin main --force"
  echo -e "git push origin v1.2.2 --force"
fi

echo -e "${GREEN}All done!${NC}"
echo -e "${YELLOW}Note: If you encounter any issues, you can restore the backup with:${NC}"
echo -e "rm -rf .git && mv .git.bak .git"
