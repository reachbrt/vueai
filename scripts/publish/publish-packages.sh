#!/bin/bash

# Script to update package versions and publish to npm
set -e

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the new version from command line argument or prompt for it
if [ -z "$1" ]; then
  echo -e "${YELLOW}Enter new version (e.g., 1.2.0):${NC}"
  read VERSION
else
  VERSION=$1
fi

# Validate version format
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Invalid version format. Please use semantic versioning (e.g., 1.2.0)${NC}"
  exit 1
fi

echo -e "${GREEN}Updating packages to version $VERSION${NC}"

# Update package versions
update_package_version() {
  local package_dir=$1
  local package_json="$package_dir/package.json"
  
  if [ -f "$package_json" ]; then
    echo -e "${GREEN}Updating $package_json to version $VERSION${NC}"
    # Use sed to update the version
    sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/" "$package_json"
  else
    echo -e "${RED}Error: $package_json not found${NC}"
    exit 1
  fi
}

# Update all package versions
update_package_version "packages/core"
update_package_version "packages/chatbot"
update_package_version "packages/autosuggest"
update_package_version "packages/smartform"

# Update version in dist packages if they exist
if [ -d "dist" ]; then
  update_package_version "dist/core"
  update_package_version "dist/chatbot"
  update_package_version "dist/autosuggest"
  update_package_version "dist/smartform"
fi

echo -e "${GREEN}All package versions updated to $VERSION${NC}"

# Build packages
echo -e "${GREEN}Building packages...${NC}"

# Check if we need to build from source or use the dist directory
if [ -d "packages/core/src" ]; then
  echo -e "${YELLOW}Building from source...${NC}"
  
  # Build each package
  for pkg in core chatbot autosuggest smartform; do
    echo -e "${GREEN}Building packages/$pkg...${NC}"
    cd "packages/$pkg"
    npm run build
    cd ../..
  done
else
  echo -e "${YELLOW}Using pre-built packages in dist directory...${NC}"
fi

# Publish to npm
echo -e "${YELLOW}Do you want to publish the packages to npm? (y/n)${NC}"
read PUBLISH

if [ "$PUBLISH" = "y" ] || [ "$PUBLISH" = "Y" ]; then
  echo -e "${GREEN}Publishing packages to npm...${NC}"
  
  # Determine which directory to publish from
  if [ -d "packages/core/dist" ]; then
    PUBLISH_DIR="packages"
  elif [ -d "dist/core" ]; then
    PUBLISH_DIR="dist"
  else
    echo -e "${RED}Error: Could not find built packages to publish${NC}"
    exit 1
  fi
  
  # Publish each package
  for pkg in core chatbot autosuggest smartform; do
    echo -e "${GREEN}Publishing @aivue/$pkg...${NC}"
    cd "$PUBLISH_DIR/$pkg"
    npm publish --access public
    cd ../..
    echo -e "${GREEN}Published @aivue/$pkg@$VERSION${NC}"
  done
  
  echo -e "${GREEN}All packages published successfully!${NC}"
else
  echo -e "${YELLOW}Skipping npm publish${NC}"
fi

# Create GitHub release
echo -e "${YELLOW}Do you want to create a GitHub release? (y/n)${NC}"
read CREATE_RELEASE

if [ "$CREATE_RELEASE" = "y" ] || [ "$CREATE_RELEASE" = "Y" ]; then
  echo -e "${GREEN}Creating GitHub release v$VERSION...${NC}"
  
  # Check if gh CLI is installed
  if ! command -v gh &> /dev/null; then
    echo -e "${RED}GitHub CLI (gh) is not installed. Please install it to create releases.${NC}"
    echo -e "${YELLOW}You can manually create a release on GitHub.${NC}"
  else
    # Create release notes
    RELEASE_NOTES="# VueAI v$VERSION

## What's New
- Enhanced SmartForm with color-coded validation feedback
- Improved AI integration with multiple providers
- Fixed issues with component rendering
- Added comprehensive documentation

## Packages
- @aivue/core@$VERSION
- @aivue/chatbot@$VERSION
- @aivue/autosuggest@$VERSION
- @aivue/smartform@$VERSION
"
    
    # Create GitHub release
    echo "$RELEASE_NOTES" | gh release create "v$VERSION" --title "VueAI v$VERSION" --notes-file -
    
    echo -e "${GREEN}GitHub release created successfully!${NC}"
  fi
else
  echo -e "${YELLOW}Skipping GitHub release${NC}"
fi

echo -e "${GREEN}All done!${NC}"
