#!/bin/bash

# Script to verify @aivue packages are published on npm
# Author: reachbrt
# Date: 2025-12-02

echo "🔍 Verifying @aivue Packages on npm"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# List of packages to verify
PACKAGES=(
    "doc-intelligence"
    "emotion-ui"
    "predictive-input"
    "smart-notify"
)

# Function to check if package is published
check_package() {
    local pkg_name=$1
    local pkg_dir="packages/$pkg_name"
    
    # Get expected version from package.json
    if [ -f "$pkg_dir/package.json" ]; then
        local expected_version=$(node -p "require('./$pkg_dir/package.json').version")
    else
        echo -e "${RED}❌ @aivue/$pkg_name - package.json not found${NC}"
        return 1
    fi
    
    # Check if package exists on npm
    if npm view "@aivue/$pkg_name" version > /dev/null 2>&1; then
        local npm_version=$(npm view "@aivue/$pkg_name" version)
        
        if [ "$npm_version" == "$expected_version" ]; then
            echo -e "${GREEN}✅ @aivue/$pkg_name@$npm_version - Published${NC}"
            return 0
        else
            echo -e "${RED}❌ @aivue/$pkg_name - Version mismatch (local: $expected_version, npm: $npm_version)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ @aivue/$pkg_name@$expected_version - Not published${NC}"
        return 1
    fi
}

# Check all packages
PUBLISHED=0
NOT_PUBLISHED=0

for pkg in "${PACKAGES[@]}"; do
    if check_package "$pkg"; then
        ((PUBLISHED++))
    else
        ((NOT_PUBLISHED++))
    fi
done

echo ""
echo "===================================="
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "===================================="
echo -e "${GREEN}✅ Published: $PUBLISHED${NC}"
echo -e "${RED}❌ Not Published: $NOT_PUBLISHED${NC}"
echo ""

if [ $NOT_PUBLISHED -eq 0 ]; then
    echo -e "${GREEN}🎉 All packages are published!${NC}"
    echo ""
    echo "🔗 View packages:"
    for pkg in "${PACKAGES[@]}"; do
        echo "   • https://www.npmjs.com/package/@aivue/$pkg"
    done
else
    echo -e "${RED}⚠️  Some packages are not published yet${NC}"
    echo "Run: ./publish-new-packages.sh"
fi

echo ""

