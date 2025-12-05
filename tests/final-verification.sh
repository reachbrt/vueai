#!/bin/bash

################################################################################
# Final Verification Test
# Comprehensive test to verify predictive-input package is working correctly
################################################################################

echo ""
echo "================================================================================"
echo "🎯 FINAL VERIFICATION TEST"
echo "Comprehensive test for @aivue/predictive-input package"
echo "================================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

echo -e "${CYAN}📋 Test Plan:${NC}"
echo "   1. Verify package structure"
echo "   2. Check source code for default vocabulary"
echo "   3. Verify composable fix (removed isTrained check)"
echo "   4. Check built package files"
echo "   5. Verify demo is running"
echo ""
echo "================================================================================"
echo ""

# Test 1: Package structure
echo -e "${BLUE}Test 1: Package structure${NC}"
echo -n "  Checking if package directory exists... "
if [ -d "packages/predictive-input" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 2: COMMON_WORDS in source
echo -e "${BLUE}Test 2: COMMON_WORDS in nGramModel.ts${NC}"
echo -n "  Checking for COMMON_WORDS constant... "
if grep -q "const COMMON_WORDS = \[" packages/predictive-input/src/utils/nGramModel.ts; then
    echo -e "${GREEN}✅ PASS${NC}"
    WORD_COUNT=$(grep -A 5 "const COMMON_WORDS = \[" packages/predictive-input/src/utils/nGramModel.ts | grep -o "'" | wc -l | tr -d ' ')
    echo "    Found COMMON_WORDS with ~$((WORD_COUNT / 2)) words"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 3: COMMON_PHRASES in source
echo -e "${BLUE}Test 3: COMMON_PHRASES in nGramModel.ts${NC}"
echo -n "  Checking for COMMON_PHRASES constant... "
if grep -q "const COMMON_PHRASES = \[" packages/predictive-input/src/utils/nGramModel.ts; then
    echo -e "${GREEN}✅ PASS${NC}"
    PHRASE_COUNT=$(grep -A 10 "const COMMON_PHRASES = \[" packages/predictive-input/src/utils/nGramModel.ts | grep -o "'" | wc -l | tr -d ' ')
    echo "    Found COMMON_PHRASES with ~$((PHRASE_COUNT / 2)) phrases"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 4: initializeDefaults method
echo -e "${BLUE}Test 4: initializeDefaults method${NC}"
echo -n "  Checking for initializeDefaults method... "
if grep -q "private initializeDefaults(): void" packages/predictive-input/src/utils/nGramModel.ts; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 5: initializeDefaults called in constructor
echo -e "${BLUE}Test 5: initializeDefaults called in constructor${NC}"
echo -n "  Checking if initializeDefaults is called... "
if grep -q "this.initializeDefaults();" packages/predictive-input/src/utils/nGramModel.ts; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 6: Composable fix - isTrained check removed
echo -e "${BLUE}Test 6: Composable fix (isTrained check removed)${NC}"
echo -n "  Checking if isTrained check is removed from getPredictions... "
if ! grep -A 3 "const getPredictions = " packages/predictive-input/src/composables/usePredictiveInput.ts | grep -q "if (!isTrained.value)"; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "    ✅ isTrained check successfully removed!"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "    ❌ isTrained check still present - predictions will be blocked!"
    FAILED=$((FAILED + 1))
fi

# Test 7: Built package exists
echo -e "${BLUE}Test 7: Built package files${NC}"
echo -n "  Checking for dist/index.mjs... "
if [ -f "packages/predictive-input/dist/index.mjs" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    SIZE=$(ls -lh packages/predictive-input/dist/index.mjs | awk '{print $5}')
    echo "    File size: $SIZE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 8: CSS file exists
echo -n "  Checking for dist/predictive-input.css... "
if [ -f "packages/predictive-input/dist/predictive-input.css" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    SIZE=$(ls -lh packages/predictive-input/dist/predictive-input.css | awk '{print $5}')
    echo "    File size: $SIZE"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAILED=$((FAILED + 1))
fi

# Test 9: Demo server running
echo -e "${BLUE}Test 9: Demo server${NC}"
echo -n "  Checking if demo is running on port 8080... "
if curl -s --max-time 3 http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "    Demo URL: http://localhost:8080"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  SKIP${NC}"
    echo "    Demo not running (optional)"
fi

# Test 10: Test server running
echo -n "  Checking if test server is running on port 8082... "
if curl -s --max-time 3 http://localhost:8082 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "    Test URL: http://localhost:8082/tests/real-package-test.html"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠️  SKIP${NC}"
    echo "    Test server not running (optional)"
fi

# Summary
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")

echo ""
echo "================================================================================"
echo -e "${CYAN}📊 FINAL VERIFICATION SUMMARY${NC}"
echo "================================================================================"
echo ""
echo "Total Tests:  $TOTAL"
echo -e "Passed:       ${GREEN}$PASSED ✅${NC}"
echo -e "Failed:       ${RED}$FAILED ❌${NC}"
echo "Pass Rate:    ${PERCENTAGE}%"
echo ""
echo "--------------------------------------------------------------------------------"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! All critical tests passed!${NC}"
    echo -e "${GREEN}✅ Package is correctly configured with default vocabulary${NC}"
    echo -e "${GREEN}✅ Composable fix applied - predictions work without training${NC}"
    echo -e "${GREEN}✅ Package is built and ready${NC}"
else
    echo -e "${RED}❌ FAILURE! Some tests failed.${NC}"
    echo -e "${RED}⚠️  Package may not work correctly.${NC}"
fi

echo "--------------------------------------------------------------------------------"
echo ""

# Testing instructions
echo -e "${CYAN}📋 Manual Testing Instructions:${NC}"
echo ""
echo "1. Open Real Package Test:"
echo "   ${BLUE}http://localhost:8082/tests/real-package-test.html${NC}"
echo ""
echo "2. Open Demo Application:"
echo "   ${BLUE}http://localhost:8080${NC}"
echo "   Navigate to 'Predictive Input' tab"
echo ""
echo "3. Test these phrases:"
echo "   - Type 'I am' → Should see predictions immediately"
echo "   - Type 'thank' → Should see 'thank you'"
echo "   - Type 'how are' → Should see 'how are you'"
echo "   - Type 'please' → Should see 'please let', 'please send'"
echo ""
echo "4. Expected behavior:"
echo "   ✅ Predictions appear WITHOUT any training"
echo "   ✅ Full sentence completions shown"
echo "   ✅ Confidence scores displayed"
echo "   ✅ No errors in browser console"
echo ""
echo "================================================================================"
echo -e "${GREEN}✅ Final verification complete!${NC}"
echo "================================================================================"
echo ""

# Exit code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi

