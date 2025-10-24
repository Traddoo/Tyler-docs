# Getting Started with Tyler Doc Agent

This guide walks you through generating your first documentation with Tyler, from installation to deployment.

## Prerequisites

Before starting, ensure you have:

- **Node.js** 16+ installed
- **Git** repository for your project
- **Claude Code** installed and configured
- **Anthropic API key** (for Claude)

## Installation

### Global Installation (Recommended)

```bash
npm install -g tyler-doc-agent
```

Verify installation:
```bash
tyler --help
```

### Local Installation

```bash
npm install tyler-doc-agent --save-dev
```

Use with npx:
```bash
npx tyler --help
```

## Quick Start

### 1. Navigate to Your Project

```bash
cd your-project
```

### 2. Initialize Tyler

```bash
tyler init
```

Tyler will prompt you interactively:

```
? Documentation style? (Use arrow keys)
❯ comprehensive - Full coverage with architecture, API, guides, and examples
  api-focused - Detailed API reference with usage examples
  tutorial - Step-by-step guides and tutorials
  minimal - Essential documentation only

? Output directory? (docs)

? Include code examples? (Y/n)

? Setup GitHub Pages? (Y/n)

? Site title? (My Project Documentation)

? Site description? (Comprehensive documentation for my project)
```

Tyler will then:
1. Run preflight checks (git, Claude Code)
2. Explore your codebase
3. Generate a custom prompt
4. Create `.tyler/` directory with scripts
5. Save configuration to `tyler.yaml`

### 3. Generate Documentation

**Test with single iteration**:
```bash
tyler sync
```

This runs once and exits. Review the generated docs in your output directory.

**Run continuous generation**:
```bash
tyler sync-forever
```

Let it run for 30-60 minutes. The agent will:
- Explore your codebase
- Create documentation structure
- Write comprehensive documentation
- Add code examples
- Commit changes incrementally

Press Ctrl+C to stop, or let it self-terminate when complete.

### 4. Review Documentation

```bash
# View generated files
ls -lR docs/

# Read the index
cat docs/index.md

# Check agent's progress
cat docs/.agent/TODO.md
```

### 5. Deploy to GitHub Pages

```bash
# Commit and push documentation
bash .tyler/deploy-docs.sh
```

Enable GitHub Pages in repository settings:
1. Go to Settings → Pages
2. Select "Deploy from branch"
3. Choose "main" branch and "/docs" folder
4. Save

Your docs will be live at: `https://username.github.io/repo-name/`

## Detailed Walkthrough

### Step 1: Pre-Setup

#### Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Set up your profile:
```bash
claude
```

Follow the prompts to configure your API key.

#### Verify Git Repository

Ensure you're in a git repository:
```bash
git status
```

If not initialized:
```bash
git init
git add .
git commit -m "Initial commit"
```

Add a remote (required for Tyler):
```bash
git remote add origin https://github.com/username/repo.git
```

### Step 2: Understanding Documentation Styles

#### Comprehensive (Default)

**Best for**: Libraries, frameworks, complex applications

**What you get**:
- Architecture overview and design decisions
- Complete API reference
- Multiple guides (getting started, features, troubleshooting)
- Real-world examples
- Contributing guidelines

**Example structure**:
```
docs/
├── index.md
├── architecture/
│   ├── overview.md
│   └── design-decisions.md
├── api/
│   ├── index.md
│   └── [modules].md
├── guides/
│   ├── getting-started.md
│   └── [features].md
├── examples/
│   └── [examples].md
└── contributing/
    └── development.md
```

#### API-Focused

**Best for**: SDKs, APIs, developer tools

**What you get**:
- Detailed API documentation
- Parameter and return types
- Code examples for each API
- Type definitions

**Example structure**:
```
docs/
├── index.md
├── api/
│   └── [modules].md
├── examples/
│   ├── basic.md
│   └── advanced.md
└── types/
    └── reference.md
```

#### Tutorial

**Best for**: Educational tools, learning platforms

**What you get**:
- Progressive learning path
- Step-by-step tutorials
- Hands-on examples
- Best practices

**Example structure**:
```
docs/
├── index.md
├── tutorials/
│   ├── lesson-1.md
│   └── [lessons].md
└── examples/
    └── [examples].md
```

#### Minimal

**Best for**: Simple projects, internal tools

**What you get**:
- Quick start guide
- Essential API reference
- Basic examples

**Example structure**:
```
docs/
├── index.md
├── api/
│   └── reference.md
└── examples/
    └── basic.md
```

### Step 3: Configuration

After `tyler init`, review `tyler.yaml`:

```yaml
repo: ./
outputDir: docs
style: comprehensive
includeExamples: true
generateGithubPages: true
siteTitle: My Project Documentation
siteDescription: Comprehensive documentation
siteTheme: jekyll-theme-cayman
```

**Customization options**:

```yaml
# Document a different repository
repo: ../my-other-project

# Use a different output directory
outputDir: documentation

# Change style
style: api-focused

# Disable code examples
includeExamples: false

# Skip GitHub Pages
generateGithubPages: false

# Custom Jekyll theme
siteTheme: jekyll-theme-minimal
```

### Step 4: Running Tyler

#### Single Iteration (Recommended for Testing)

```bash
tyler sync
```

**What happens**:
1. Loads configuration
2. Executes `.tyler/sync.sh`
3. Claude Code agent starts
4. Agent explores codebase
5. Agent generates/updates docs
6. Agent commits changes
7. Process exits

**Use this to**:
- Test the agent before committing to a long run
- Make incremental documentation updates
- Run in CI/CD pipelines

#### Continuous Loop (For Initial Generation)

```bash
tyler sync-forever
```

**What happens**:
```
🤖 Tyler Doc Agent - Continuous Documentation Generation
Press Ctrl+C to stop

📚 Documentation iteration starting at [timestamp]
[Agent explores codebase...]
[Agent writes documentation...]
[git commit: docs: Add architecture overview]

📚 Documentation iteration starting at [timestamp]
[Agent continues...]
```

**Agent phases**:

1. **Exploration** (2-5 iterations): Agent explores codebase, understands structure
2. **Structure** (1-2 iterations): Creates directory structure
3. **Generation** (10-20 iterations): Writes documentation files
4. **Enhancement** (3-5 iterations): Adds examples, diagrams, polish
5. **Self-Termination**: Stops when quality standards met

**Monitoring progress**:

```bash
# Check agent's TODO list
cat docs/.agent/TODO.md

# View exploration notes
cat docs/.agent/exploration.md

# Watch commits in real-time
watch -n 5 'git log --oneline -10'

# Count generated files
find docs/ -name "*.md" | wc -l
```

### Step 5: Customizing the Prompt

After initialization, you can edit the generated prompt:

```bash
vim .tyler/prompt.md
```

**Example customizations**:

**Add specific requirements**:
```markdown
Your job is to create comprehensive documentation for this codebase.

IMPORTANT: Include detailed examples for authentication and authorization.

Focus on these modules:
- src/auth/
- src/api/
- src/utils/

...
```

**Change documentation structure**:
```markdown
Create the following structure:

docs/
├── README.md
├── setup/
├── usage/
└── api-reference/
```

**Emphasize specific areas**:
```markdown
Spend 60% of effort on API documentation, 30% on guides, 10% on examples.
```

After editing, run Tyler again:
```bash
tyler sync-forever
```

### Step 6: Deployment Options

#### GitHub Pages (Recommended)

**Setup**:
```bash
# Commit and push docs
bash .tyler/deploy-docs.sh
```

**Enable in GitHub**:
1. Repository → Settings → Pages
2. Source: "Deploy from branch"
3. Branch: main, Folder: /docs
4. Save

**Custom domain** (optional):
1. Add CNAME file: `echo "docs.example.com" > docs/CNAME`
2. Configure DNS: CNAME record pointing to `username.github.io`
3. Wait for DNS propagation
4. Visit https://docs.example.com

#### Netlify

**Setup**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=docs --prod
```

**Auto-deploy**:
1. Connect repository to Netlify
2. Set build directory: `docs`
3. Netlify auto-deploys on every push

#### Vercel

**Setup**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Configure in `vercel.json`:
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "outputDirectory": "docs"
}
```

#### Self-Hosted

Serve docs with any static file server:

```bash
# Python
python3 -m http.server 8000 --directory docs

# Node.js
npx serve docs

# Nginx
# Copy docs/ to /var/www/html/docs/
```

## Common Workflows

### Workflow 1: Initial Documentation

```bash
# 1. Install Tyler
npm install -g tyler-doc-agent

# 2. Initialize
cd your-project
tyler init --style comprehensive

# 3. Generate docs (let it run 30-60 minutes)
tyler sync-forever

# 4. Review
ls -lR docs/
cat docs/index.md

# 5. Deploy
bash .tyler/deploy-docs.sh
```

**Time**: 5 minutes setup + 30-60 minutes generation
**Cost**: $6-15

### Workflow 2: Update Existing Documentation

```bash
# 1. Review current config
cat tyler.yaml

# 2. Run single sync to test
tyler sync

# 3. If satisfied, run continuous
tyler sync-forever

# 4. Let it run for 15-30 minutes

# 5. Deploy updates
bash .tyler/deploy-docs.sh
```

**Time**: 15-30 minutes
**Cost**: $3-8

### Workflow 3: API Documentation Only

```bash
# 1. Initialize with API-focused style
tyler init --style api-focused

# 2. Generate
tyler sync-forever

# 3. Deploy
bash .tyler/deploy-docs.sh
```

**Time**: 20-30 minutes
**Cost**: $4-8

### Workflow 4: Quick Internal Docs

```bash
# 1. Minimal setup
tyler init --style minimal --no-examples --no-github-pages

# 2. Quick generation
tyler sync-forever

# 3. Share internally (no deploy needed)
```

**Time**: 10-15 minutes
**Cost**: $2-4

### Workflow 5: CI/CD Integration

```yaml
# .github/workflows/docs.yml
name: Update Documentation

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Tyler
        run: npm install -g tyler-doc-agent

      - name: Setup Claude Code
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          npm install -g @anthropic-ai/claude-code
          # Configure Claude with API key

      - name: Generate Documentation
        run: tyler sync

      - name: Commit Documentation
        run: |
          git config user.name "Tyler Bot"
          git config user.email "tyler@example.com"
          git add docs/
          git commit -m "docs: Auto-update documentation" || echo "No changes"
          git push
```

## Troubleshooting

### Issue: "Configuration file not found"

**Error**:
```
Error: Configuration file tyler.yaml not found
Please run 'tyler init' first
```

**Solution**:
```bash
tyler init
```

### Issue: "Claude Code is not properly configured"

**Error**:
```
✖ Claude Code is not properly configured
  Please run `claude` to set up your profile
```

**Solution**:
```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Set up profile
claude
```

### Issue: "Not a git repository"

**Error**:
```
✖ Target directory is not a git repository
```

**Solution**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/repo.git
```

### Issue: Agent Stops Too Early

**Problem**: Tyler self-terminates before documentation is comprehensive

**Solution**:
1. Check `docs/.agent/TODO.md` for incomplete tasks
2. Edit `.tyler/prompt.md` to be more explicit about requirements
3. Run `tyler sync-forever` again

**Example prompt edit**:
```markdown
Documentation is ONLY complete when:
- All 20+ API functions are documented
- At least 10 working code examples exist
- Architecture has 3+ diagrams
- Getting started guide is 500+ words
```

### Issue: Documentation Quality Issues

**Problem**: Generated docs lack depth or have errors

**Solutions**:

1. **Use comprehensive style**:
```bash
tyler init --style comprehensive
```

2. **Enable code examples**:
```yaml
# tyler.yaml
includeExamples: true
```

3. **Let it run longer**: 45-60 minutes instead of 20-30

4. **Customize prompt**: Add specific requirements

5. **Iterate**: Run Tyler multiple times to improve

### Issue: Git Commit Failures

**Error**: Agent can't commit changes

**Solution**:
```bash
# Configure git
git config user.name "Your Name"
git config user.email "you@example.com"

# Check file permissions
ls -la docs/

# Ensure working directory is clean
git status
```

### Issue: High API Costs

**Problem**: Generation is costing more than expected

**Solutions**:

1. **Use minimal style**: Generates less content
```bash
tyler init --style minimal
```

2. **Stop earlier**: Press Ctrl+C after 20-30 minutes instead of waiting for self-termination

3. **Skip examples**: Reduces API calls
```bash
tyler init --no-examples
```

4. **Review `.tyler/prompt.md`**: Simplify if too complex

### Issue: Windows Compatibility

**Problem**: Tyler doesn't work on Windows

**Current Status**: Tyler uses bash scripts, Unix/Mac only

**Workarounds**:

1. **WSL** (Windows Subsystem for Linux):
```bash
wsl
cd /mnt/c/your-project
tyler init
```

2. **Git Bash**:
```bash
# Install Git for Windows (includes Git Bash)
# Run commands in Git Bash
tyler init
```

3. **Docker**:
```dockerfile
FROM node:18
RUN npm install -g tyler-doc-agent
WORKDIR /app
CMD ["tyler", "sync-forever"]
```

## Next Steps

- [Examples](../examples/basic-usage.md) - Real-world usage examples
- [API Reference](../api/index.md) - Complete command reference
- [Customization Guide](customization.md) - Advanced customization
- [CI/CD Integration](ci-cd.md) - Automate documentation generation

---

[← Back to Index](../index.md) | [Examples →](../examples/basic-usage.md)
