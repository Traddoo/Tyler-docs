#!/bin/bash
# Quick test script for Tyler Doc Agent
# Run this to validate everything works before publishing

set -e  # Exit on error

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🧪 Tyler Doc Agent - Quick Test Script${NC}\n"

# Check we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the tyler-doc-agent directory?${NC}"
    exit 1
fi

if ! grep -q "tyler-doc-agent" package.json; then
    echo -e "${RED}❌ Error: Not in tyler-doc-agent directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Clean build${NC}"
rm -rf dist/ node_modules/ package-lock.json
npm install
npm run build

echo -e "\n${GREEN}✓ Build completed${NC}\n"

echo -e "${YELLOW}Step 2: Verify build outputs${NC}"

# Check dist directory
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ dist/ directory not created${NC}"
    exit 1
fi
echo -e "${GREEN}✓ dist/ exists${NC}"

# Check templates
if [ ! -d "dist/templates" ]; then
    echo -e "${RED}❌ dist/templates/ not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ dist/templates/ exists${NC}"

# Check prompts
if [ ! -d "dist/prompts" ]; then
    echo -e "${RED}❌ dist/prompts/ not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ dist/prompts/ exists${NC}"

# Check CLI
if [ ! -f "dist/cli.js" ]; then
    echo -e "${RED}❌ dist/cli.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ dist/cli.js exists${NC}"

# Check commands
if [ ! -f "dist/commands/init.js" ]; then
    echo -e "${RED}❌ dist/commands/init.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ dist/commands/init.js exists${NC}"

echo -e "\n${YELLOW}Step 3: Link package${NC}"
npm link
echo -e "${GREEN}✓ Package linked${NC}"

echo -e "\n${YELLOW}Step 4: Test CLI commands${NC}"

# Test help
if ! tyler --help > /dev/null 2>&1; then
    echo -e "${RED}❌ 'tyler --help' failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ tyler --help works${NC}"

# Test version
if ! tyler --version > /dev/null 2>&1; then
    echo -e "${RED}❌ 'tyler --version' failed${NC}"
    exit 1
fi
VERSION=$(tyler --version)
echo -e "${GREEN}✓ tyler --version works ($VERSION)${NC}"

# Test init help
if ! tyler init --help > /dev/null 2>&1; then
    echo -e "${RED}❌ 'tyler init --help' failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ tyler init --help works${NC}"

# Test sync help
if ! tyler sync --help > /dev/null 2>&1; then
    echo -e "${RED}❌ 'tyler sync --help' failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ tyler sync --help works${NC}"

# Test sync-forever help
if ! tyler sync-forever --help > /dev/null 2>&1; then
    echo -e "${RED}❌ 'tyler sync-forever --help' failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ tyler sync-forever --help works${NC}"

echo -e "\n${YELLOW}Step 5: Create test package${NC}"
npm pack
TARBALL=$(ls tyler-doc-agent-*.tgz | head -1)
echo -e "${GREEN}✓ Package created: $TARBALL${NC}"

# Check size
SIZE=$(ls -lh "$TARBALL" | awk '{print $5}')
echo -e "${GREEN}✓ Package size: $SIZE${NC}"

# List contents
echo -e "\n${CYAN}Package contents (first 20 files):${NC}"
tar -tzf "$TARBALL" | head -20

# Check package includes necessary files
if ! tar -tzf "$TARBALL" | grep -q "package/dist/cli.js"; then
    echo -e "${RED}❌ Package missing dist/cli.js${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Package includes dist/cli.js${NC}"

if ! tar -tzf "$TARBALL" | grep -q "package/templates/"; then
    echo -e "${RED}❌ Package missing templates/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Package includes templates/${NC}"

if ! tar -tzf "$TARBALL" | grep -q "package/prompts/"; then
    echo -e "${RED}❌ Package missing prompts/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Package includes prompts/${NC}"

echo -e "\n${GREEN}✅ All basic tests passed!${NC}\n"

echo -e "${CYAN}Next steps:${NC}"
echo -e "1. Test on actual project: cd /path/to/test-project && tyler init"
echo -e "2. Review PRE_PUBLISH_CHECKLIST.md"
echo -e "3. Run full test: Follow TESTING_GUIDE.md"
echo -e "4. When ready: npm publish --access public\n"

echo -e "${YELLOW}Note: This script tested basic functionality only.${NC}"
echo -e "${YELLOW}For full testing, follow TESTING_GUIDE.md${NC}\n"

# Ask if user wants to test init
echo -e "${CYAN}Would you like to test 'tyler init' on this repository? (y/n)${NC}"
read -r response

if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    echo -e "\n${YELLOW}Running tyler init (this will explore the codebase)...${NC}"
    echo -e "${YELLOW}This will create .tyler/ and tyler.yaml in this directory${NC}"
    echo -e "${YELLOW}Press Ctrl+C to cancel, or wait 5 seconds to continue...${NC}\n"
    sleep 5

    # Run init with SKIP_CLAUDE_TEST to avoid actual Claude Code call
    SKIP_CLAUDE_TEST=1 tyler init --repo ./ --output-dir docs --style comprehensive

    echo -e "\n${GREEN}✓ Init completed${NC}"
    echo -e "${CYAN}Created files:${NC}"
    ls -la .tyler/ || true
    cat tyler.yaml || true

    echo -e "\n${YELLOW}Don't forget to add these to .gitignore:${NC}"
    echo -e "  .tyler/"
    echo -e "  tyler.yaml"
    echo -e "  docs/"
else
    echo -e "\n${CYAN}Skipping init test.${NC}"
fi

echo -e "\n${GREEN}🎉 Testing complete!${NC}\n"
