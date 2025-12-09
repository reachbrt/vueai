#!/bin/bash

# Script to publish packages one by one with browser authorization

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Publishing @aivue Packages One by One${NC}"
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

PUBLISHED_COUNT=0
SKIPPED_COUNT=0
FAILED_COUNT=0

for package in "${PACKAGES[@]}"; do
  if [ ! -d "packages/${package}" ]; then
    echo -e "${YELLOW}⚠ Package directory not found: packages/${package}${NC}\n"
    continue
  fi
  
  cd "packages/${package}"
  
  PACKAGE_NAME=$(grep '"name"' package.json | head -1 | cut -d'"' -f4)
  PACKAGE_VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
  
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}Package: ${PACKAGE_NAME}@${PACKAGE_VERSION}${NC}"
  echo -e "${BLUE}========================================${NC}\n"
  
  # Build the package first
  echo -e "${YELLOW}Building ${PACKAGE_NAME}...${NC}"
  if grep -q '"build"' package.json; then
    if npm run build 2>&1; then
      echo -e "${GREEN}✓ Build successful${NC}\n"
    else
      echo -e "${RED}✗ Build failed for ${PACKAGE_NAME}${NC}\n"
      ((FAILED_COUNT++))
      cd ../..
      continue
    fi
  else
    echo -e "${YELLOW}No build script found, skipping build...${NC}\n"
  fi
  
  # Publish the package
  echo -e "${YELLOW}Publishing ${PACKAGE_NAME}@${PACKAGE_VERSION}...${NC}"
  echo -e "${YELLOW}If browser authorization is required, please complete it now.${NC}\n"
  
  if npm publish --access public 2>&1 | tee /tmp/npm-publish-output.txt; then
    if grep -q "You cannot publish over the previously published versions" /tmp/npm-publish-output.txt; then
      echo -e "${YELLOW}⚠ ${PACKAGE_NAME}@${PACKAGE_VERSION} already published${NC}\n"
      ((SKIPPED_COUNT++))
    else
      echo -e "${GREEN}✓ Successfully published ${PACKAGE_NAME}@${PACKAGE_VERSION}${NC}\n"
      ((PUBLISHED_COUNT++))
    fi
  else
    echo -e "${RED}✗ Failed to publish ${PACKAGE_NAME}@${PACKAGE_VERSION}${NC}\n"
    ((FAILED_COUNT++))
  fi
  
  cd ../..
  
  # Pause between packages
  if [ "$package" != "${PACKAGES[-1]}" ]; then
    echo -e "${BLUE}Press Enter to continue to next package...${NC}"
    read
    echo ""
  fi
done

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Publishing Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Published: ${PUBLISHED_COUNT}${NC}"
echo -e "${YELLOW}⚠ Skipped (already published): ${SKIPPED_COUNT}${NC}"
echo -e "${RED}✗ Failed: ${FAILED_COUNT}${NC}"
echo -e "${BLUE}========================================${NC}\n"

if [ $FAILED_COUNT -eq 0 ]; then
  echo -e "${GREEN}All packages processed successfully!${NC}"
else
  echo -e "${YELLOW}Some packages failed. Check the output above for details.${NC}"
fi

