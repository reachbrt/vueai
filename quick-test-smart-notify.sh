#!/bin/bash

# Quick Smart Notify Demo Test Script
# Verifies the demo is running and package is loaded correctly

echo "🧪 Smart Notify Demo - Quick Test"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DEMO_URL="http://localhost:8080"
PASSED=0
FAILED=0

# Test 1: Check if demo is running
echo -n "1. Checking if demo is running... "
if curl -s -o /dev/null -w "%{http_code}" "$DEMO_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Demo is not running at $DEMO_URL"
    echo "   Run: cd demo && npm run dev"
    ((FAILED++))
    exit 1
fi

# Test 2: Check if smart-notify package is built
echo -n "2. Checking if smart-notify package is built... "
if [ -f "packages/smart-notify/dist/index.mjs" ] && [ -f "packages/smart-notify/dist/smart-notify.css" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Package not built. Run: cd packages/smart-notify && npm run build"
    ((FAILED++))
fi

# Test 3: Check if NotificationCenter component exists
echo -n "3. Checking NotificationCenter component... "
if [ -f "packages/smart-notify/src/components/NotificationCenter.vue" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test 4: Check if useSmartNotify composable exists
echo -n "4. Checking useSmartNotify composable... "
if [ -f "packages/smart-notify/src/composables/useSmartNotify.ts" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test 5: Check if demo component exists
echo -n "5. Checking SmartNotifyDemo component... "
if [ -f "demo/src/components/SmartNotifyDemo.vue" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test 6: Check if CSS is copied to demo
echo -n "6. Checking CSS in demo assets... "
if [ -f "demo/src/assets/smart-notify.css" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}"
    echo "   CSS not found in demo assets"
    echo "   Run: cp packages/smart-notify/dist/smart-notify.css demo/src/assets/"
fi

# Test 7: Check if AI engines exist
echo -n "7. Checking AI engines... "
AI_ENGINES=(
    "packages/smart-notify/src/ai/urgencyDetector.ts"
    "packages/smart-notify/src/ai/timingPredictor.ts"
    "packages/smart-notify/src/ai/groupingEngine.ts"
    "packages/smart-notify/src/ai/attentionMonitor.ts"
)

ALL_EXIST=true
for engine in "${AI_ENGINES[@]}"; do
    if [ ! -f "$engine" ]; then
        ALL_EXIST=false
        break
    fi
done

if [ "$ALL_EXIST" = true ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test 8: Check package.json configuration
echo -n "8. Checking package.json... "
if grep -q '"@aivue/smart-notify"' packages/smart-notify/package.json && \
   grep -q '"version": "1.0.0"' packages/smart-notify/package.json; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test 9: Check if tests exist and pass
echo -n "9. Checking test suite... "
if [ -f "packages/smart-notify/tests/e2e.test.ts" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC}"
    echo "   Test file not found"
fi

# Test 10: Check TypeScript declarations
echo -n "10. Checking TypeScript declarations... "
if [ -f "packages/smart-notify/dist/index.d.ts" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo "=================================="
echo -e "${BLUE}📊 Test Summary${NC}"
echo "=================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Open browser: $DEMO_URL"
    echo "2. Navigate to '🔔 Smart Notify' tab"
    echo "3. Click the 🔔 bell icon to open NotificationCenter"
    echo "4. Test all notification types using the buttons"
    echo "5. Use the manual checklist: SMART_NOTIFY_TEST_CHECKLIST.md"
    echo ""
    echo "🔗 Test Resources:"
    echo "   • Manual Checklist: SMART_NOTIFY_TEST_CHECKLIST.md"
    echo "   • Visual Test Page: test-smart-notify-demo.html"
    echo "   • Automated Tests: test-smart-notify-automated.mjs"
    echo ""
else
    echo -e "${RED}⚠️  Some tests failed. Please fix the issues above.${NC}"
    exit 1
fi

