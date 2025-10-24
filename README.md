# 🤖 Tyler Doc Agent

**AI-powered documentation generation that's better than Mintlify.**

Tyler Doc Agent automatically explores your codebase and generates comprehensive, high-quality documentation. It's like having a technical writer who actually reads and understands your code.

[![npm version](https://img.shields.io/npm/v/tyler-doc-agent.svg)](https://www.npmjs.com/package/tyler-doc-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🧠 AI-Powered**: Uses Claude Code to understand your codebase deeply
- **📚 Comprehensive**: Generates architecture docs, API reference, guides, and examples
- **🔄 Iterative**: Continuously improves documentation over multiple iterations
- **✅ Working Examples**: All code examples are tested and runnable
- **🔗 Cross-Referenced**: Automatic linking between related concepts
- **🎨 GitHub Pages Ready**: Includes Jekyll configuration for instant deployment
- **💰 Cost-Effective**: One-time cost of $6-15 vs $120/month subscriptions

## 🚀 Quick Start

### Installation

```bash
npm install -g tyler-doc-agent
```

Or use with `npx` (no installation needed):

```bash
npx tyler-doc-agent init
```

### Generate Documentation in 3 Steps

**1. Initialize Tyler in your project**

```bash
cd your-project
tyler init
```

Tyler will ask about your preferences and explore your codebase to create a customized documentation prompt.

**2. Generate documentation**

```bash
tyler sync-forever
```

Let it run for 30-60 minutes. Press Ctrl+C anytime to stop.

**3. Deploy to GitHub Pages**

```bash
bash .tyler/deploy-docs.sh
```

Enable GitHub Pages in your repo settings (Settings → Pages → Source: main → /docs).

That's it! You now have comprehensive documentation. 🎉

## 📖 Documentation Styles

Tyler supports four documentation styles:

### 📚 Comprehensive (Default)
Full coverage with architecture, API reference, guides, and examples.

**Best for**: Complex projects, libraries, frameworks

```bash
tyler init --style comprehensive
```

### 🔧 API-Focused
Detailed API reference with usage examples and best practices.

**Best for**: Libraries, SDKs, developer tools

```bash
tyler init --style api-focused
```

### 📖 Tutorial
Step-by-step guides and tutorials for learning.

**Best for**: Educational projects, getting started guides

```bash
tyler init --style tutorial
```

### ✨ Minimal
Essential documentation only - overview and basic usage.

**Best for**: Small projects, internal tools

```bash
tyler init --style minimal
```

## 📋 Commands

### `tyler init`

Initialize Tyler in your repository. Creates configuration and scripts.

```bash
tyler init                    # Interactive mode
tyler init --style api-focused --output-dir docs
tyler init --no-examples      # Skip code examples
tyler init --no-github-pages  # Skip GitHub Pages setup
```

**Options:**
- `-r, --repo <path>` - Repository to document (default: ./)
- `-o, --output-dir <path>` - Output directory (default: docs)
- `-s, --style <style>` - Documentation style
- `--no-examples` - Skip code examples
- `--no-github-pages` - Skip GitHub Pages setup

### `tyler sync`

Generate documentation once. Good for testing your setup.

```bash
tyler sync                 # Generate docs once
tyler sync --auto-push     # Generate and push to git
```

**Options:**
- `-r, --repo <path>` - Repository path
- `--auto-push` - Commit and push changes

### `tyler sync-forever`

Continuously improve documentation. **Recommended for initial docs.**

```bash
tyler sync-forever         # Run until Ctrl+C
```

Let it run for 30-60 minutes for comprehensive documentation. The agent typically stops itself when docs are complete.

**Options:**
- `-r, --repo <path>` - Repository path

## 💰 Cost & Performance

Based on testing with Sonnet 4.5:

| Metric | Value |
|--------|-------|
| **Cost per hour** | ~$10.50 |
| **Typical runtime** | 30-60 minutes |
| **Total cost** | $6-15 one-time |
| **Output** | 15-30 files, 50-100 pages |
| **Quality** | Better than Mintlify |

**Example: TypeScript Library**
- Runtime: 45 minutes
- Cost: $8
- Output: 24 files, 78 pages, 12 examples
- Full API reference (43 functions)
- Architecture diagrams
- Getting started guide

## 🏗️ How It Works

Tyler uses the "Ralph Wiggum" infinite loop pattern:

**Phase 1: Exploration** (2-5 iterations)
- Reads key files and understands structure
- Identifies components, modules, APIs
- Documents findings in `docs/.agent/exploration.md`

**Phase 2: Structure Creation**
- Creates directory structure
- Sets up navigation
- Configures GitHub Pages (if enabled)

**Phase 3: Content Generation** (10-20 iterations)
- Writes documentation files
- Creates API reference
- Adds working code examples
- Commits after each section

**Phase 4: Enhancement**
- Adds diagrams (Mermaid)
- Creates cross-references
- Improves clarity
- Tests all examples

**Phase 5: Deployment**
- Finalizes Jekyll config
- Tests navigation
- Ready for GitHub Pages

## 📁 What Gets Created

```
your-project/
├── tyler.yaml                 # Tyler configuration
├── .tyler/
│   ├── prompt.md              # Documentation generation prompt
│   ├── sync.sh                # Single iteration script
│   ├── tyler-forever.sh       # Continuous loop script
│   ├── deploy-docs.sh         # GitHub Pages deployment
│   └── .gitignore
└── docs/
    ├── index.md               # Overview and quick start
    ├── architecture/          # Architecture documentation
    ├── api/                   # API reference
    ├── guides/                # How-to guides
    ├── examples/              # Code examples
    ├── contributing/          # Contributing guidelines
    ├── _config.yml            # Jekyll configuration
    └── .agent/                # Agent's scratchpad
        ├── exploration.md     # What agent learned
        └── TODO.md            # Agent's task list
```

## 🎯 Comparison to Other Tools

| Feature | Tyler | Mintlify | ReadTheDocs | Docusaurus |
|---------|-------|----------|-------------|------------|
| Auto-generated | ✅ Yes | ✅ Yes | ❌ Manual | ❌ Manual |
| Understands code | ✅ Deep | ⚠️ Limited | ❌ No | ❌ No |
| Working examples | ✅ Tested | ⚠️ Sometimes | ❌ No | ❌ No |
| Architecture docs | ✅ Yes | ⚠️ Limited | ❌ No | ❌ No |
| Cross-references | ✅ Automatic | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual |
| GitHub Pages | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| Setup time | 5 min | 10 min | 30 min | 60 min |
| **Cost** | **$6-15 one-time** | **$120/mo** | **Free** | **Free** |

## 🔧 Advanced Usage

### Custom Prompts

After initialization, you can customize the documentation prompt:

```bash
tyler init
# Edit .tyler/prompt.md to add project-specific instructions
tyler sync
```

### Multiple Projects

Document multiple projects with different styles:

```bash
cd api-library
tyler init --style api-focused

cd ../tutorial-app
tyler init --style tutorial
```

### Monitor Progress

Check what the agent is thinking:

```bash
# View exploration notes
cat docs/.agent/exploration.md

# View task list
cat docs/.agent/TODO.md

# View live output
tail -f .tyler/claude_output.jsonl
```

### Custom Output Directory

```bash
tyler init --output-dir documentation
```

### Skip Features

```bash
# Minimal setup
tyler init --style minimal --no-examples --no-github-pages
```

## 🤖 Agent Behavior

Tyler exhibits interesting AI agent behaviors:

**Self-Termination** 🛑
The agent typically stops itself when documentation is comprehensive. You'll see commits like:
```
docs: Mark documentation as comprehensive in TODO.md
```

**Progressive Learning** 📈
Each iteration improves understanding and documentation quality.

**Working Examples** ✅
The agent tests code examples before documenting them.

**Scratchpad Usage** 📝
Uses `docs/.agent/` to maintain notes and track progress. You can read these files to see what it's thinking!

## 🐛 Troubleshooting

### Tyler doesn't start

**Check Claude Code:**
```bash
claude -p "say hi"
```

Install Claude Code if needed: [claude.ai/code](https://claude.ai/code)

### Documentation is incomplete

**Run more iterations:**
```bash
tyler sync-forever
# Let it run longer (45-60 minutes)
```

**Check progress:**
```bash
cat docs/.agent/TODO.md
```

### Examples aren't working

**Edit the prompt to emphasize testing:**
```bash
# Edit .tyler/prompt.md
# Add: "Test all code examples in a scratch environment before documenting"
tyler sync
```

### GitHub Pages not showing

1. **Check Jekyll config:**
   ```bash
   cat docs/_config.yml
   ```

2. **Enable in GitHub:**
   Settings → Pages → Source: Deploy from branch → Branch: main → /docs

3. **Test locally:**
   ```bash
   cd docs && bundle install && bundle exec jekyll serve
   ```

## 📜 Configuration

Configuration is stored in `tyler.yaml`:

```yaml
repo: ./
outputDir: docs
style: comprehensive
includeExamples: true
generateGithubPages: true
siteTitle: My Project Documentation
siteDescription: Comprehensive documentation for My Project
```

## 🙏 Credits

Built on the RepoMirror framework by:
- [@yonom](https://github.com/yonom)
- [@dexhorthy](https://github.com/dexhorthy)
- [@lantos1618](https://github.com/lantos1618)
- [@AVGVSTVS96](https://github.com/AVGVSTVS96)

Inspired by [@ghuntley](https://github.com/ghuntley)'s "Ralph Wiggum" technique.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🔗 Links

- **GitHub**: https://github.com/repomirrorhq/tyler-doc-agent
- **npm**: https://www.npmjs.com/package/tyler-doc-agent
- **Documentation**: https://github.com/repomirrorhq/tyler-doc-agent#readme
- **Issues**: https://github.com/repomirrorhq/tyler-doc-agent/issues

---

**Made with ❤️ by the RepoMirror team**

*Generate better docs. Ship faster. Stop paying monthly fees.*
