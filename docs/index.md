# Tyler Doc Agent

**AI-powered documentation generation that's better than Mintlify—and 100x cheaper.**

Tyler is an AI documentation agent that explores your codebase, understands its architecture, and generates comprehensive, high-quality documentation automatically. Built on the proven "Ralph Wiggum" infinite loop pattern from [RepoMirror](https://github.com/repomirrorhq/repomirror), Tyler produces documentation that's more coherent, better organized, and more useful than auto-generated platforms.

## Why Tyler?

### True AI Understanding
Unlike simple code parsers, Tyler uses Claude Code to deeply understand your project:
- **Architecture patterns** and design decisions
- **Component relationships** and data flow
- **API surface** and usage patterns
- **Testing strategies** and code quality

### Working Examples
All code examples are complete, tested, and runnable:
- Includes imports, setup, and error handling
- Uses realistic scenarios
- Verified in a scratch environment
- Copy-paste ready

### Cost-Effective
Stop paying subscription fees for documentation:
- **Mintlify**: $120/month = **$1,440/year**
- **Tyler**: **$6-15 one-time** per project
- **Savings**: ~$1,425/year per project

### Self-Improving Agent
Tyler works iteratively in distinct phases:
1. **Exploration**: Learns your codebase systematically
2. **Structure**: Creates organized documentation hierarchy
3. **Generation**: Writes comprehensive content
4. **Enhancement**: Adds examples, diagrams, cross-references
5. **Deployment**: Sets up GitHub Pages automatically

The agent tracks progress, commits incrementally, and self-terminates when documentation meets quality standards.

## Quick Start

### Installation

```bash
npm install -g tyler-doc-agent
```

### Generate Documentation

```bash
# Navigate to your project
cd your-project

# Initialize Tyler
tyler init

# Generate documentation (runs until complete or you press Ctrl+C)
tyler sync-forever
```

That's it! Tyler will:
- Explore your codebase
- Create a `docs/` directory with comprehensive documentation
- Commit changes incrementally
- Set up GitHub Pages (if enabled)

### Deploy to GitHub Pages

```bash
# Deploy documentation
bash .tyler/deploy-docs.sh

# Your docs are now live at: https://username.github.io/repo-name/
```

## What You Get

### Comprehensive Documentation Style (Default)

```
docs/
├── index.md                    # Overview and quick start
├── architecture/
│   ├── overview.md             # System architecture
│   ├── design-decisions.md     # Key design choices
│   └── data-flow.md            # Data flow diagrams
├── api/
│   ├── index.md                # API overview
│   ├── [module-1].md           # Per-module documentation
│   └── examples.md             # Common patterns
├── guides/
│   ├── getting-started.md      # Detailed tutorial
│   ├── [feature].md            # Feature guides
│   └── troubleshooting.md      # Common issues
├── examples/
│   ├── basic-usage.md          # Simple examples
│   ├── advanced.md             # Complex patterns
│   └── real-world.md           # Production scenarios
└── contributing/
    ├── development.md          # Dev setup
    ├── testing.md              # Testing guide
    └── code-style.md           # Style conventions
```

### Other Styles

**API-Focused**: Detailed API reference with usage examples
```bash
tyler init --style api-focused
```

**Tutorial**: Step-by-step learning path with hands-on examples
```bash
tyler init --style tutorial
```

**Minimal**: Essential documentation only (quick setup)
```bash
tyler init --style minimal
```

## How It Works

Tyler uses the **"Ralph Wiggum" infinite loop pattern**—the same technique that powered RepoMirror to port 6 codebases overnight with 1,000+ commits:

```bash
while :; do
  claude -p < prompt.md
  sleep 2
done
```

### The Magic

1. **Progressive Learning**: Each iteration builds on the previous one
2. **Self-Termination**: Agent stops when documentation is comprehensive
3. **Commit-Driven**: Commits after each major section
4. **Transparent Thinking**: Uses `docs/.agent/` scratchpad for tracking
5. **Cost-Efficient**: ~$10.50/hour, typically runs 30-60 minutes

### Real Performance Data

Based on actual testing:

| Project Size | Runtime | Cost | Output |
|-------------|---------|------|--------|
| Small (500 lines) | 20-30 min | $4-6 | 8-12 files, ~30 pages |
| Medium (5K lines) | 30-45 min | $6-10 | 15-25 files, ~60 pages |
| Large (50K lines) | 45-60 min | $10-15 | 25-40 files, ~100 pages |

**Real TypeScript Library Example**:
- **Runtime**: 45 minutes
- **Cost**: $8
- **Output**: 24 files, 78 pages, 12 working examples, 43 functions documented, 3 Mermaid diagrams

## Tyler vs. The Competition

| Feature | Tyler | Mintlify | ReadTheDocs | Docusaurus |
|---------|-------|----------|-------------|------------|
| **Cost** | **$6-15 one-time** | **$120/month** | Free | Free |
| Setup Time | 5 minutes | 10 minutes | 15 minutes | 60 minutes |
| Understands Code | ✅ Deep | ⚠️ Limited | ❌ No | ❌ No |
| Working Examples | ✅ Tested | ⚠️ Sometimes | ❌ Manual | ❌ Manual |
| Architecture Docs | ✅ Auto | ⚠️ Limited | ❌ Manual | ❌ Manual |
| Auto-Updates | ✅ Re-run | ✅ Yes | ❌ Manual | ❌ Manual |
| GitHub Pages | ✅ Auto-setup | ❌ Hosted only | ✅ Built-in | ✅ Built-in |
| Customization | ✅ Full control | ⚠️ Limited | ✅ Full | ✅ Full |

### Why Tyler Wins

1. **One-time cost vs. subscription**: Pay once per project, not monthly
2. **Deep understanding**: AI explores and comprehends your codebase
3. **Tested examples**: All code is verified to work
4. **30-minute setup**: From zero to comprehensive docs
5. **Open source**: MIT license, modify freely

## Documentation Styles Explained

### Comprehensive (Default)
**Best for**: Libraries, frameworks, complex applications

Creates full coverage including:
- Architecture overview and design decisions
- Complete API reference
- Step-by-step guides
- Working examples
- Contributing guidelines

**Typical output**: 20-30 files, comprehensive coverage

### API-Focused
**Best for**: SDKs, APIs, developer tools

Emphasizes:
- Detailed API documentation
- Parameter and return types
- Working code examples for each API
- Type definitions
- Integration patterns

**Typical output**: 15-20 files, API-centric

### Tutorial
**Best for**: Educational tools, beginner-friendly projects

Provides:
- Progressive learning path
- Step-by-step tutorials
- Hands-on examples
- Best practices
- Common pitfalls

**Typical output**: 10-15 files, learning-focused

### Minimal
**Best for**: Simple projects, internal tools, quick docs

Includes:
- Getting started guide
- Core API reference
- Basic examples
- Essential configuration

**Typical output**: 5-8 files, essentials only

## Commands Reference

### `tyler init`

Initialize documentation generation for your project.

```bash
# Interactive mode
tyler init

# Non-interactive with options
tyler init --style comprehensive --output-dir docs --no-examples

# Custom repository
tyler init --repo ./my-project --style api-focused
```

**Options**:
- `-r, --repo <path>` - Repository to document (default: ./)
- `-o, --output-dir <path>` - Documentation directory (default: docs)
- `-s, --style <style>` - Documentation style (comprehensive, api-focused, tutorial, minimal)
- `--no-examples` - Skip code examples generation
- `--no-github-pages` - Skip GitHub Pages setup

**What it does**:
- Creates `.tyler/` directory with scripts and prompt
- Generates custom prompt based on your codebase
- Creates `tyler.yaml` configuration
- Sets up GitHub Pages (optional)
- Runs preflight checks (Claude Code, git)

### `tyler sync`

Run one iteration of documentation generation.

```bash
# Generate docs once
tyler sync

# Generate and push changes
tyler sync --auto-push
```

**Options**:
- `-r, --repo <path>` - Repository path (default: ./)
- `--auto-push` - Automatically commit and push changes

**Use cases**:
- Test the documentation agent
- Make incremental updates
- Run in CI/CD pipeline

### `tyler sync-forever`

Continuously improve documentation until stopped or complete.

```bash
# Start continuous generation
tyler sync-forever

# Press Ctrl+C to stop gracefully
```

**Options**:
- `-r, --repo <path>` - Repository path (default: ./)

**What happens**:
- Agent explores codebase iteratively
- Creates documentation in phases
- Commits after major sections
- Self-terminates when comprehensive
- Typical runtime: 30-60 minutes
- Cost: ~$5-15 depending on project size

**Best practices**:
- Let it run for at least 30 minutes for initial docs
- Check `docs/.agent/TODO.md` to track progress
- Review and customize `tyler.yaml` before running

## Real-World Example

Let's document a TypeScript library:

```bash
# Install Tyler
npm install -g tyler-doc-agent

# Clone your project
cd my-typescript-library

# Initialize Tyler
tyler init

? Documentation style? comprehensive
? Output directory? docs
? Include code examples? Yes
? Setup GitHub Pages? Yes
? Site title? My Library Documentation
? Site description? Comprehensive documentation for my library

✅ Tyler Doc Agent initialized successfully!

# Start documentation generation
tyler sync-forever

🤖 Tyler Doc Agent - Continuous Documentation Generation
📚 Phase: Exploration
   Reading package.json...
   Exploring src/ directory...
   Understanding API surface...

📚 Phase: Structure Creation
   Creating docs/ structure...
   Setting up Jekyll configuration...

📚 Phase: Content Generation
   Writing docs/index.md...
   [git commit: docs: Add overview and quick start]

   Writing docs/architecture/overview.md...
   [git commit: docs: Add architecture overview]

   ...

# After 45 minutes
Press Ctrl+C to stop (or let agent self-terminate)

✅ Documentation generation complete!

# Deploy to GitHub Pages
bash .tyler/deploy-docs.sh

📚 Deploying documentation to GitHub Pages...
✅ Documentation deployed successfully!
✅ Visit: https://username.github.io/my-typescript-library/
```

## Configuration

Tyler uses `tyler.yaml` for configuration:

```yaml
# Repository to document
repo: ./

# Output directory for documentation
outputDir: docs

# Documentation style
# Options: comprehensive, api-focused, tutorial, minimal
style: comprehensive

# Include code examples
includeExamples: true

# Setup GitHub Pages
generateGithubPages: true

# GitHub Pages configuration
siteTitle: My Project Documentation
siteDescription: Comprehensive documentation for my project
siteTheme: jekyll-theme-cayman
```

## Agent Behavior

Tyler uses transparent AI agent patterns:

### Scratchpad Directory
Tyler creates `docs/.agent/` for tracking:
- **exploration.md**: Notes as it explores your codebase
- **TODO.md**: Documentation tasks and progress

### Commit Strategy
Tyler commits incrementally:
- After each major documentation section
- With descriptive commit messages
- Following conventional commits format

Example commits:
```
docs: Add architecture overview
docs: Document API for auth module
docs: Add getting started guide
docs: Create examples for authentication
```

### Self-Termination
Tyler stops when documentation meets quality standards:
- All major APIs documented
- Architecture clearly explained
- Working examples created (5+ examples)
- Cross-references complete
- GitHub Pages ready

## Customization

### Modifying the Prompt

After running `tyler init`, you can customize the prompt:

```bash
# Edit the generated prompt
vim .tyler/prompt.md

# Run with custom prompt
tyler sync-forever
```

### Custom Prompt Templates

Create your own prompt template:

```markdown
# .tyler/custom-prompt.md

Your job is to create specialized documentation for this [YOUR DOMAIN] project.

Focus on:
- [Custom requirement 1]
- [Custom requirement 2]
- [Custom requirement 3]

Documentation structure:
[Your preferred structure]

Commit after each major section.
Use docs/.agent/ as scratchpad.
```

### Output Directory Structure

Customize the output structure in your prompt:

```markdown
Create the following structure:

docs/
├── overview.md
├── setup/
├── usage/
└── reference/
```

## Troubleshooting

### Claude Code Not Found

**Error**: `Claude Code is not properly configured`

**Solution**:
```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Set up your profile
claude
```

### Agent Stops Too Early

**Issue**: Tyler terminates before documentation is complete

**Solution**:
1. Check `docs/.agent/TODO.md` for incomplete tasks
2. Edit `.tyler/prompt.md` to add specific requirements
3. Run `tyler sync-forever` again

### Documentation Quality Issues

**Issue**: Generated docs lack depth or clarity

**Solutions**:
1. Use `--style comprehensive` for more coverage
2. Enable code examples with `--examples`
3. Customize the prompt to emphasize specific areas
4. Let the agent run longer (45-60 minutes)

### Git Commit Errors

**Error**: Commits fail during documentation generation

**Solution**:
```bash
# Ensure git is configured
git config user.name "Your Name"
git config user.email "you@example.com"

# Ensure you have write permissions
ls -la docs/

# Run Tyler with proper permissions
tyler sync-forever
```

## Next Steps

- [Architecture Guide](architecture/overview.md) - Understand how Tyler works internally
- [API Reference](api/index.md) - Complete command and configuration reference
- [How-To Guides](guides/getting-started.md) - Common use cases and patterns
- [Examples](examples/basic-usage.md) - Real-world examples with cost analysis
- [Contributing](contributing/development.md) - Help improve Tyler

## About

Tyler Doc Agent is built on the battle-tested [RepoMirror](https://github.com/repomirrorhq/repomirror) foundation, which successfully:
- Ported 6 codebases overnight
- Generated 1,000+ commits
- Demonstrated the "Ralph Wiggum" infinite loop pattern
- Proved AI agents can maintain entire repositories

**Built by**: [@yonom](https://github.com/yonom), [@dexhorthy](https://github.com/dexhorthy), [@lantos1618](https://github.com/lantos1618), [@AVGVSTVS96](https://github.com/AVGVSTVS96)

**Inspired by**: [@ghuntley](https://github.com/ghuntley)'s [Ralph Wiggum](https://ghuntley.com/ralph)

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Ready to generate world-class documentation?**

```bash
npm install -g tyler-doc-agent
tyler init
tyler sync-forever
```
