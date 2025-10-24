# Tyler Doc Agent - Testing Guide

## 🧪 Testing on Itself (Dogfooding)

Let's test Tyler on its own codebase to validate it works before publishing to npm.

## Step 1: Build the Package

```bash
cd /Users/thomasfaulds/Projects/repomirror/tyler-doc-agent

# Install dependencies
npm install

# Build the package
npm run build

# Verify build output
ls -la dist/
ls -la dist/templates/
ls -la dist/prompts/
```

**Expected output:**
```
dist/
├── cli.js
├── cli.js.map
├── cli.d.ts
├── index.js
├── index.js.map
├── index.d.ts
├── commands/
│   ├── init.js
│   ├── sync.js
│   └── sync-forever.js
├── templates/
│   ├── sync.sh.template
│   ├── tyler-forever.sh.template
│   └── deploy-docs.sh.template
└── prompts/
    ├── docs-comprehensive.md
    ├── docs-api-focused.md
    └── docs-tutorial.md
```

## Step 2: Link Locally

```bash
# Link tyler globally
npm link

# Verify it's available
tyler --version
tyler --help
```

**Expected output:**
```
🤖 Tyler Doc Agent - AI-powered documentation generation agent
Usage: tyler [options] [command]
...
```

## Step 3: Initialize Tyler

```bash
# Make sure we're in the tyler-doc-agent directory
cd /Users/thomasfaulds/Projects/repomirror/tyler-doc-agent

# Initialize Tyler (it will document itself!)
tyler init
```

**Interactive prompts - Choose these options:**
```
? Repository to document: ./
? Documentation output directory: docs
? Documentation style: comprehensive
? Generate code examples? Yes
? Setup GitHub Pages deployment? Yes
? Site title for GitHub Pages: Tyler Doc Agent Documentation
? Site description: AI-powered documentation generation for any codebase
```

**Expected output:**
```
🤖 Tyler Doc Agent - AI-Powered Documentation Generator

I'll help you generate comprehensive documentation for your codebase:

🔍 Performing preflight checks...

1. Checking if repository directory exists...
   ✓ Repository directory ./ exists

2. Checking if directory is a git repository...
   ✓ Git repository found

3. Testing Claude Code configuration...
   ✓ Claude Code is working correctly

✅ All preflight checks passed!

Generating documentation prompt...
  Read(package.json)
  Glob("src/**/*.ts")
  Read(src/cli.ts)
  Read(src/commands/init.ts)
  Analyzed codebase with X tool calls
✔ Generated documentation prompt

✅ Saved configuration to tyler.yaml
✅ Tyler Doc Agent initialized successfully!

Next steps:
run `tyler sync` - Generate/update documentation once

run `tyler sync-forever` - Continuously improve documentation

Files created:
- .tyler/prompt.md
- .tyler/sync.sh
- .tyler/tyler-forever.sh
- .tyler/deploy-docs.sh
- docs/_config.yml (Jekyll config)
```

## Step 4: Review Generated Files

```bash
# Check what was created
ls -la .tyler/
cat tyler.yaml
head -50 .tyler/prompt.md
```

**Expected files:**
```
.tyler/
├── prompt.md              # Custom documentation prompt
├── sync.sh                # Executable script
├── tyler-forever.sh       # Executable script
├── deploy-docs.sh         # Executable script
└── .gitignore
```

**tyler.yaml should contain:**
```yaml
repo: ./
outputDir: docs
style: comprehensive
includeExamples: true
generateGithubPages: true
siteTitle: Tyler Doc Agent Documentation
siteDescription: AI-powered documentation generation for any codebase
```

**prompt.md should mention:**
- Tyler Doc Agent specifics
- TypeScript/Node.js context
- CLI tool documentation
- Commands: init, sync, sync-forever

## Step 5: Test Single Sync

```bash
# Run a single documentation iteration
# This will take 3-10 minutes
tyler sync

# Or if you want to test without running full Claude Code:
# Set environment variable to skip Claude test
SKIP_CLAUDE_TEST=1 tyler sync
```

**Expected behavior:**
- Executes `.tyler/sync.sh`
- Streams Claude output
- Creates documentation files in `docs/`
- Makes git commits as it progresses

**Expected output structure:**
```
docs/
├── index.md
├── .agent/
│   ├── exploration.md
│   └── TODO.md
└── _config.yml
```

## Step 6: Review Initial Documentation

```bash
# Check what was generated
ls -la docs/
cat docs/index.md
cat docs/.agent/exploration.md
cat docs/.agent/TODO.md
```

**Quality checks:**
- [ ] `docs/index.md` exists and has content about Tyler
- [ ] Contains installation instructions
- [ ] Mentions the three commands (init, sync, sync-forever)
- [ ] `.agent/exploration.md` shows what Tyler learned
- [ ] `.agent/TODO.md` shows remaining documentation tasks

## Step 7: Optional - Test Continuous Sync

**WARNING**: This will run continuously and cost ~$10.50/hour. Only run if you want full documentation.

```bash
# Run continuous documentation generation
# Let it run for 15-30 minutes for this small project
tyler sync-forever

# Press Ctrl+C to stop anytime
```

**Expected behavior:**
- Runs in infinite loop
- Each iteration improves documentation
- Creates commits after major sections
- Typically generates 10-20 files for a project this size

## Step 8: Review Generated Documentation

```bash
# See what was created
find docs -name "*.md" | sort

# Count pages
find docs -name "*.md" | wc -l

# Check file sizes
find docs -name "*.md" -exec wc -l {} + | sort -n

# Review main sections
cat docs/index.md
ls docs/architecture/
ls docs/api/
ls docs/guides/
ls docs/examples/
```

**Expected for Tyler itself:**
- 10-15 markdown files
- Architecture documentation
- API reference (init, sync, sync-forever functions)
- Usage guides
- Code examples
- 30-50 pages total

## Step 9: Test GitHub Pages Deployment (Optional)

```bash
# Only run if you want to commit the docs
bash .tyler/deploy-docs.sh
```

**This will:**
- Add docs to git
- Create commit
- Push to remote

## Step 10: Cleanup Test Files

Before publishing, clean up the test files:

```bash
# Remove generated files (keep them gitignored)
echo ".tyler/" >> .gitignore
echo "tyler.yaml" >> .gitignore
echo "docs/" >> .gitignore

# Check .gitignore was updated
cat .gitignore

# Unlink from global npm
npm unlink tyler-doc-agent
```

## 🐛 Common Issues

### Issue: "Command not found: tyler"

**Solution:**
```bash
npm link
# If that doesn't work:
npm run build && npm link
```

### Issue: "Claude Code not configured"

**Solution:**
```bash
# Install Claude Code first
# Visit: https://claude.ai/code

# Test it works:
claude -p "say hi"
```

### Issue: "Templates not found"

**Solution:**
```bash
# Check templates were copied during build
ls dist/templates/

# If missing, rebuild:
npm run build

# The build script should include:
# "build": "tsc && cp -r templates dist/ && cp -r prompts dist/"
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
npm link
```

## ✅ Testing Checklist

Before publishing, verify:

- [ ] `npm install` completes without errors
- [ ] `npm run build` creates dist/ directory
- [ ] `npm link` makes `tyler` command available
- [ ] `tyler --help` shows correct help text
- [ ] `tyler --version` shows 0.1.0
- [ ] `tyler init` creates `.tyler/` and `tyler.yaml`
- [ ] `.tyler/prompt.md` is customized for the project
- [ ] `tyler sync` runs without errors
- [ ] Documentation is created in `docs/`
- [ ] Documentation quality is good (readable, accurate)
- [ ] `tyler sync-forever` can be stopped with Ctrl+C
- [ ] Templates exist in `dist/templates/`
- [ ] Prompts exist in `dist/prompts/`

## 📊 Expected Test Results

For Tyler Doc Agent itself (small TypeScript project):

| Metric | Expected Value |
|--------|---------------|
| Build time | 5-10 seconds |
| Init time | 1-2 minutes (with Claude prompt generation) |
| Single sync time | 3-10 minutes |
| Files generated (1 sync) | 3-5 files |
| Full docs time | 15-30 minutes |
| Files generated (full) | 10-15 files |
| Documentation pages | 30-50 pages |
| Cost | $3-6 |

## 🎯 What Good Documentation Looks Like

After running `tyler sync-forever` for 15-30 minutes, you should see:

### docs/index.md
- Overview of Tyler Doc Agent
- Installation instructions (`npm install -g tyler-doc-agent`)
- Quick start guide
- Link to other sections

### docs/architecture/
- Overview of how Tyler works
- CLI architecture
- Template system
- Prompt generation flow

### docs/api/
- `init` command documentation
- `sync` command documentation
- `sync-forever` command documentation
- Function signatures
- Options and parameters

### docs/guides/
- How to install and setup
- How to generate documentation
- How to customize prompts
- How to deploy to GitHub Pages

### docs/examples/
- Basic usage example
- Advanced configuration example
- Custom prompt example

## 🚀 After Testing

Once testing is complete and you're satisfied:

1. **Clean up test artifacts:**
   ```bash
   git status
   # Don't commit .tyler/, tyler.yaml, or docs/ from testing
   ```

2. **Update .gitignore:**
   ```bash
   echo ".tyler/" >> .gitignore
   echo "tyler.yaml" >> .gitignore
   echo "docs/" >> .gitignore
   ```

3. **Unlink:**
   ```bash
   npm unlink tyler-doc-agent
   ```

4. **Ready to publish:**
   ```bash
   npm publish --access public
   ```

## 📝 Testing Notes Template

Use this template to document your testing:

```markdown
# Tyler Doc Agent Testing - [Date]

## Environment
- Node version:
- npm version:
- OS:
- Claude Code version:

## Test Results

### Build
- [ ] Dependencies installed
- [ ] Build completed
- [ ] Templates copied
- [ ] Prompts copied

### Init
- [ ] Command ran successfully
- [ ] Files created (.tyler/, tyler.yaml)
- [ ] Prompt customized for project
- Time taken:

### Sync
- [ ] Single sync completed
- [ ] Documentation created
- [ ] Quality acceptable
- Files created:
- Time taken:

### Issues Found
1.
2.
3.

### Documentation Quality
- Accuracy: [1-10]
- Completeness: [1-10]
- Examples: [1-10]
- Readability: [1-10]

### Overall Assessment
[ ] Ready to publish
[ ] Needs fixes
[ ] Major issues

### Notes
```

---

**Ready to test? Follow the steps above and document your findings!**
