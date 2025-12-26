#!/bin/bash

# Backend API Test Script
# Usage: bash test-backend-api.sh

API_BASE="http://10.36.94.98:8000/api/v1"

echo "======================================"
echo "  Backend API Test"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local name=$3

    echo -n "Testing ${name}... "

    response=$(curl -s -w "\n%{http_code}" -X ${method} "${API_BASE}${endpoint}" \
        -H "Content-Type: application/json" 2>&1)

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $http_code)"
        echo "$body" | python3 -m json.tool 2>/dev/null | head -20
        echo ""
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "Response: $body"
        echo ""
    fi
}

# Run tests
echo "1️⃣  Reports API Tests"
echo "---"
test_endpoint "GET" "/reports" "GET /reports"
test_endpoint "GET" "/reports/report-001" "GET /reports/:id"

echo ""
echo "2️⃣  Settings API Tests"
echo "---"
test_endpoint "GET" "/settings/system" "GET /settings/system"
test_endpoint "GET" "/settings/preferences" "GET /settings/preferences"

echo ""
echo "3️⃣  CORS Check"
echo "---"
echo -n "Checking CORS headers... "

cors_test=$(curl -s -I -X OPTIONS "${API_BASE}/reports" \
    -H "Origin: http://10.36.94.98:3000" \
    -H "Access-Control-Request-Method: GET" 2>&1)

if echo "$cors_test" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✓ CORS Enabled${NC}"
    echo "$cors_test" | grep "Access-Control"
else
    echo -e "${RED}✗ CORS Not Configured${NC}"
    echo "Please add CORS middleware to your backend"
    echo "See: BACKEND_QUICK_FIX.md"
fi

echo ""
echo "======================================"
echo "  Test Complete"
echo "======================================"
echo ""
echo "📚 Documentation:"
echo "  - API_FORMAT_VALIDATION.md  (Data format guide)"
echo "  - BACKEND_QUICK_FIX.md      (Quick fixes)"
echo "  - docs/API_MOCK_DATA.md     (Detailed specs)"
