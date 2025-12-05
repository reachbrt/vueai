#!/bin/bash

# Script to republish updated packages with CSS export fixes
# Date: 2025-12-04

set -e

echo "🚀 Republishing Updated Packages with CSS Export Fixes"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Package 1: @aivue/predictive-input
echo -e "${BLUE}📦 Publishing @aivue/predictive-input v1.0.2${NC}"
cd packages/predictive-input
npm run build
npm publish
cd ../..
echo -e "${GREEN}✅ @aivue/predictive-input v1.0.2 published${NC}"
echo ""

# Package 2: @aivue/emotion-ui
echo -e "${BLUE}📦 Publishing @aivue/emotion-ui v1.0.1${NC}"
cd packages/emotion-ui
npm run build
npm publish
cd ../..
echo -e "${GREEN}✅ @aivue/emotion-ui v1.0.1 published${NC}"
echo ""

# Package 3: @aivue/doc-intelligence
echo -e "${BLUE}📦 Publishing @aivue/doc-intelligence v1.0.1${NC}"
cd packages/doc-intelligence
npm run build
npm publish
cd ../..
echo -e "${GREEN}✅ @aivue/doc-intelligence v1.0.1 published${NC}"
echo ""

echo "========================================================"
echo -e "${GREEN}🎉 All packages republished successfully!${NC}"
echo ""
echo "Updated packages:"
echo "  • @aivue/predictive-input@1.0.2"
echo "  • @aivue/emotion-ui@1.0.1"
echo "  • @aivue/doc-intelligence@1.0.1"
echo ""
echo "Changes:"
echo "  • Added direct CSS export paths"
echo "  • Fixed Vite build resolution issues"
echo ""

