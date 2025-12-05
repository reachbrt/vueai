#!/bin/bash

# Script to publish remaining packages
# Date: 2025-12-04

set -e

echo "🚀 Publishing Remaining Packages"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Package 1: @aivue/smart-notify
echo -e "${BLUE}📦 Publishing @aivue/smart-notify v1.0.0${NC}"
cd packages/smart-notify
npm run build
npm publish --access public
cd ../..
echo -e "${GREEN}✅ @aivue/smart-notify v1.0.0 published${NC}"
echo ""

# Package 2: @aivue/voice-actions
echo -e "${BLUE}📦 Publishing @aivue/voice-actions v1.0.0${NC}"
cd packages/voice-actions
npm run build
npm publish --access public
cd ../..
echo -e "${GREEN}✅ @aivue/voice-actions v1.0.0 published${NC}"
echo ""

# Package 3: @aivue/smart-datatable
echo -e "${BLUE}📦 Publishing @aivue/smart-datatable v1.0.0${NC}"
cd packages/smart-datatable
npm run build
npm publish --access public
cd ../..
echo -e "${GREEN}✅ @aivue/smart-datatable v1.0.0 published${NC}"
echo ""

echo "========================================================"
echo -e "${GREEN}🎉 All remaining packages published successfully!${NC}"
echo ""
echo "Published packages:"
echo "  • @aivue/smart-notify@1.0.0"
echo "  • @aivue/voice-actions@1.0.0"
echo "  • @aivue/smart-datatable@1.0.0"
echo ""

