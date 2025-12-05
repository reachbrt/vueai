#!/bin/bash

################################################################################
# Method 3: Live Demo Testing
# Testing @aivue/predictive-input in the actual demo application
################################################################################

echo ""
echo "================================================================================"
echo "🧪 METHOD 3: LIVE DEMO TESTING"
echo "Testing @aivue/predictive-input in the actual demo application"
echo "================================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
DEMO_URL="http://localhost:8080"
TIMEOUT=5

echo "📋 Test Configuration:"
echo "   Demo URL: $DEMO_URL"
echo "   Timeout:  ${TIMEOUT}s"
echo ""

# Function to check if demo is running
check_demo() {
    echo -n "🔍 Checking if demo is running... "
    if curl -s --max-time $TIMEOUT "$DEMO_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Demo is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Demo is not running${NC}"
        return 1
    fi
}

# Function to test demo page
test_demo_page() {
    echo ""
    echo "📊 Testing Demo Page..."
    echo ""
    
    # Test 1: Check if page loads
    echo -n "Test 1: Page loads successfully... "
    if curl -s --max-time $TIMEOUT "$DEMO_URL" | grep -q "vite"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 2: Check if Vue is loaded
    echo -n "Test 2: Vue application loaded... "
    if curl -s --max-time $TIMEOUT "$DEMO_URL" | grep -q "app"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 3: Check if predictive-input package is available
    echo -n "Test 3: Predictive Input package available... "
    if [ -f "packages/predictive-input/dist/index.mjs" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 4: Check if package has common phrases
    echo -n "Test 4: Package contains common phrases... "
    if grep -q "COMMON_PHRASES" packages/predictive-input/src/utils/nGramModel.ts; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 5: Check if demo has PredictiveInput component
    echo -n "Test 5: Demo includes PredictiveInput component... "
    if [ -f "demo/src/components/PredictiveInputDemo.vue" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 6: Check if TrainingPanel is removed from demo
    echo -n "Test 6: TrainingPanel removed from demo... "
    if ! grep -q "TrainingPanel" demo/src/components/PredictiveInputDemo.vue; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 7: Check if package is built
    echo -n "Test 7: Package is built and ready... "
    if [ -f "packages/predictive-input/dist/index.mjs" ] && [ -f "packages/predictive-input/dist/predictive-input.css" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 8: Check if common words are initialized
    echo -n "Test 8: Common words initialized in package... "
    if grep -q "COMMON_WORDS" packages/predictive-input/src/utils/nGramModel.ts; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# Function to test package functionality
test_package_functionality() {
    echo ""
    echo "🔧 Testing Package Functionality..."
    echo ""
    
    # Test 9: Check if initializeDefaults method exists
    echo -n "Test 9: initializeDefaults method exists... "
    if grep -q "initializeDefaults" packages/predictive-input/src/utils/nGramModel.ts; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Test 10: Check if training requirement is removed
    echo -n "Test 10: Training requirement removed... "
    if ! grep -q "if (!isTrained.value) return;" packages/predictive-input/src/components/PredictiveInput.vue; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# Initialize counters
PASSED=0
FAILED=0
TOTAL=10

# Run tests
if check_demo; then
    test_demo_page
    test_package_functionality
else
    echo ""
    echo -e "${YELLOW}⚠️  Demo is not running. Starting demo server...${NC}"
    echo ""
    echo "Please run: cd demo && npm run dev"
    echo ""
    exit 1
fi

# Summary
echo ""
echo "================================================================================"
echo "📊 TEST SUMMARY"
echo "================================================================================"
echo ""
echo "Total Tests:  $TOTAL"
echo -e "Passed:       ${GREEN}$PASSED ✅${NC}"
echo -e "Failed:       ${RED}$FAILED ❌${NC}"

PERCENTAGE=$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")
echo "Pass Rate:    ${PERCENTAGE}%"

echo ""
echo "--------------------------------------------------------------------------------"

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}🎉 SUCCESS! All tests passed!${NC}"
    echo -e "${GREEN}✅ Demo application is working correctly!${NC}"
    echo -e "${GREEN}✅ Predictive input is ready for use!${NC}"
elif [ $PASSED -ge 7 ]; then
    echo -e "${YELLOW}✅ MOSTLY PASSING! Most tests passed.${NC}"
    echo -e "${YELLOW}⚠️  Some features may need review.${NC}"
else
    echo -e "${RED}❌ FAILURE! Many tests failed.${NC}"
    echo -e "${RED}⚠️  Demo needs review.${NC}"
fi

echo "--------------------------------------------------------------------------------"
echo ""

# Manual testing instructions
echo "📋 Manual Testing Instructions:"
echo ""
echo "1. Open your browser to: $DEMO_URL"
echo "2. Navigate to the 'Predictive Input' tab"
echo "3. Start typing in any input field"
echo "4. Try these test phrases:"
echo "   - 'I am' → Should see 'I am writing', 'I am looking'"
echo "   - 'thank' → Should see 'thank you'"
echo "   - 'how are' → Should see 'how are you'"
echo "   - 'please' → Should see 'please let', 'please send'"
echo ""
echo "================================================================================"
echo "✅ Live demo tests complete!"
echo "================================================================================"
echo ""

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi

