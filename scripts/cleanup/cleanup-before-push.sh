#!/bin/bash

# Script to clean up temporary files before pushing
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Cleaning up temporary files before pushing...${NC}"

# List of files to remove
FILES_TO_REMOVE=(
  "clean-repo.sh"
  "cleanup.sh"
  "publish-packages.sh"
  "push-to-github.sh"
  "cleanup-before-push.sh"
)

# Remove the files
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${YELLOW}Removing $file...${NC}"
    rm "$file"
  fi
done

echo -e "${GREEN}Temporary files removed.${NC}"

# Commit the changes
echo -e "${YELLOW}Do you want to commit these changes? (y/n)${NC}"
read COMMIT_CHANGES

if [ "$COMMIT_CHANGES" = "y" ] || [ "$COMMIT_CHANGES" = "Y" ]; then
  git add -A
  git commit -m "Remove temporary scripts"
  echo -e "${GREEN}Changes committed.${NC}"
else
  echo -e "${YELLOW}Skipping commit.${NC}"
fi

echo -e "${GREEN}All done!${NC}"
echo -e "${YELLOW}You can now push to GitHub with:${NC}"
echo -e "git push origin main"
