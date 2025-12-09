#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Verifying README files on npm packages${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Array of all packages
PACKAGES=(
  "core"
  "chatbot"
  "autosuggest"
  "smartform"
  "image-caption"
  "emotion-ui"
  "doc-intelligence"
  "analytics"
  "360-spin"
  "predictive-input"
  "smart-datatable"
  "smart-notify"
  "voice-actions"
)

MISSING_README=()
HAS_README=()

# Check each package
for package in "${PACKAGES[@]}"; do
  echo -e "${BLUE}Checking @aivue/${package}...${NC}"
  
  # Get README from npm
  README_CHECK=$(npm view @aivue/${package} readme 2>/dev/null)
  
  if [ -z "$README_CHECK" ] || [ "$README_CHECK" = "null" ]; then
    echo -e "${RED}✗ README missing on npm${NC}\n"
    MISSING_README+=("$package")
  else
    echo -e "${GREEN}✓ README exists on npm${NC}\n"
    HAS_README+=("$package")
  fi
done

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Packages with README: ${#HAS_README[@]}${NC}"
echo -e "${RED}✗ Packages missing README: ${#MISSING_README[@]}${NC}\n"

if [ ${#MISSING_README[@]} -gt 0 ]; then
  echo -e "${YELLOW}Packages missing README:${NC}"
  for package in "${MISSING_README[@]}"; do
    echo -e "  - @aivue/${package}"
  done
  
  echo -e "\n${YELLOW}Would you like to rebuild and republish these packages? (y/n)${NC}"
  read -r response
  
  if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Rebuilding and republishing packages...${NC}\n"
    
    for package in "${MISSING_README[@]}"; do
      echo -e "${BLUE}========================================${NC}"
      echo -e "${BLUE}Processing: @aivue/${package}${NC}"
      echo -e "${BLUE}========================================${NC}\n"
      
      cd "packages/${package}" || continue
      
      # Bump patch version
      echo -e "${YELLOW}Bumping version...${NC}"
      npm version patch --no-git-tag-version 2>&1 | grep -v "ERESOLVE" || true
      
      NEW_VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
      echo -e "${GREEN}New version: ${NEW_VERSION}${NC}\n"
      
      # Build
      echo -e "${YELLOW}Building package...${NC}"
      npm run build 2>&1 | tail -20
      
      # Verify README in dist
      if [ -f "dist/README.md" ]; then
        echo -e "${GREEN}✓ README.md found in dist/${NC}\n"
      else
        echo -e "${RED}✗ README.md NOT found in dist/${NC}\n"
      fi
      
      # Publish
      echo -e "${YELLOW}Publishing to npm...${NC}"
      npm publish --access public 2>&1 | grep -E "(Published|notice|error)" || true
      
      echo -e "${GREEN}✓ Published @aivue/${package}@${NEW_VERSION}${NC}\n"
      
      cd ../..
    done
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}All packages republished!${NC}"
    echo -e "${GREEN}========================================${NC}\n"
  fi
else
  echo -e "${GREEN}All packages have README files on npm! 🎉${NC}\n"
fi

