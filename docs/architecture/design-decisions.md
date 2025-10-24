# Design Decisions

This document explains the key architectural choices made in Tyler Doc Agent and the rationale behind them.

## Core Philosophy

### Decision: The "Ralph Wiggum" Infinite Loop Pattern

**What**: Run Claude Code in a continuous while loop until documentation is complete.

```bash
while :; do
  claude -p < prompt.md
  sleep 2
done
```

**Why**:
1. **Progressive Learning**: Each iteration builds on previous knowledge
2. **Self-Correction**: Agent can fix mistakes in subsequent loops
3. **Natural Stopping**: Agent determines when documentation is sufficient
4. **Proven Pattern**: Successfully used in RepoMirror for 1,000+ commits

**Alternatives Considered**:
- **Single-shot**: Would miss nuances and depth
- **Fixed iterations**: Arbitrary limit doesn't fit all projects
- **Manual control**: Requires constant user supervision

**Trade-offs**:
- ✅ Comprehensive output
- ✅ Self-improving
- ⚠️ Unpredictable runtime
- ⚠️ Variable cost

---

## System Architecture

### Decision: Standalone Package (Tyler) vs. RepoMirror Integration

**What**: Create `tyler-doc-agent` as a separate npm package instead of keeping documentation commands in RepoMirror.

**Why**:
1. **Single Responsibility**: RepoMirror = code transformation, Tyler = documentation
2. **Simpler UX**: `tyler init` is clearer than `repomirror doc-init`
3. **Independent Evolution**: Tyler can evolve without RepoMirror changes
4. **Easier Discovery**: Users searching for "documentation generator" find Tyler
5. **Smaller Package**: Tyler doesn't need push/pull/remote commands

**Alternatives Considered**:
- Keep as `repomirror doc-*` commands
- Create separate binary but share codebase
- Fork RepoMirror entirely

**Trade-offs**:
- ✅ Clear purpose
- ✅ Better discoverability
- ✅ Smaller install size
- ⚠️ Code duplication with RepoMirror
- ⚠️ Need to maintain separately

---

### Decision: Three Commands Only

**What**: Tyler has exactly three commands:
- `tyler init` - Initialize
- `tyler sync` - Single iteration
- `tyler sync-forever` - Continuous loop

**Why**:
1. **Simplicity**: Easy to understand and remember
2. **Focus**: Documentation doesn't need push/pull/remote like code transformation
3. **User Flow**: Init once, sync forever, done
4. **No Confusion**: Clear progression from init to generation

**Alternatives Considered**:
- Add `tyler deploy` command
- Add `tyler update` command
- Mirror all RepoMirror commands

**Trade-offs**:
- ✅ Simple mental model
- ✅ Low learning curve
- ⚠️ Users must manually run deploy script
- ⚠️ No built-in update workflow

---

## Prompt Generation

### Decision: Use Claude SDK to Generate Custom Prompts

**What**: Instead of using static templates, we use Claude SDK to analyze the codebase and generate a custom prompt.

```typescript
const optimizedPrompt = await query({
  prompt: metaPrompt,
});
```

**Why**:
1. **Context-Aware**: Prompt tailored to specific project
2. **Smarter Agent**: Better prompts = better documentation
3. **Adaptive**: Handles any programming language/framework
4. **Learning**: Incorporates RepoMirror's "simple prompt" learning

**Alternatives Considered**:
- Static templates with placeholders
- User writes entire prompt manually
- Multiple fixed templates per language

**Trade-offs**:
- ✅ Better quality prompts
- ✅ Works for any project
- ⚠️ Requires API call during init
- ⚠️ Adds ~30s to initialization

**Cost**: ~$0.10-0.20 per init (one-time cost)

---

### Decision: Keep Prompts Simple (100-200 Words)

**What**: Generated prompts are concise and direct, avoiding verbose instructions.

**Why**:
Based on RepoMirror team's real-world testing:
- 103-word prompt: ✅ Fast, focused agent
- 1,500-word prompt: ❌ Slow, confused agent

**Example Good Prompt**:
```markdown
Your job is to create comprehensive documentation for this codebase in the docs/ directory.

Explore the codebase, understand architecture, and generate high-quality documentation.

Make a commit after every major documentation file.

Use docs/.agent/ as scratchpad for exploration notes and TODO tracking.

Documentation complete when:
- All major APIs documented
- Architecture explained
- 5+ working examples
- GitHub Pages ready
```

**Alternatives Considered**:
- Detailed 10-page specification
- Include specific file list
- Enumerate all documentation standards

**Trade-offs**:
- ✅ Faster agent responses
- ✅ More focused output
- ⚠️ Less explicit control
- ⚠️ Agent interprets "comprehensive"

---

## Documentation Structure

### Decision: Four Pre-defined Styles

**What**: Offer exactly four documentation styles:
1. Comprehensive (default)
2. API-focused
3. Tutorial
4. Minimal

**Why**:
1. **Covers 90% of use cases**: Libraries, APIs, learning, quick docs
2. **Easy to choose**: Clear differentiation
3. **Not overwhelming**: 4 options vs. 20 options
4. **Starting points**: Users can customize after generation

**Alternatives Considered**:
- Single "one size fits all" style
- 10+ specialized styles (e.g., "microservices", "CLI tool", "React library")
- Fully custom structure via config file

**Trade-offs**:
- ✅ Clear choices
- ✅ Fast decision-making
- ⚠️ May not fit niche needs
- ⚠️ Users may need to customize

---

### Decision: Use `docs/` as Default Output Directory

**What**: Generated documentation goes to `docs/` directory by default.

**Why**:
1. **GitHub Pages Standard**: GitHub expects `docs/` for Pages
2. **Conventional**: Most projects use `docs/` already
3. **Clear Separation**: Docs separate from source code
4. **Gitignore-Friendly**: Easy to include/exclude

**Alternatives Considered**:
- `documentation/`
- `doc/` (singular)
- Root directory (e.g., `README.md` only)
- `.docs/` (hidden)

**Trade-offs**:
- ✅ GitHub Pages integration
- ✅ Widely recognized
- ⚠️ Conflicts with existing `docs/` folder
- ⚠️ Not customizable (wait, it is via `--output-dir`)

**Note**: Users can override with `--output-dir` flag.

---

## Agent Behavior

### Decision: Scratchpad Directory (`.agent/`)

**What**: Agent uses `docs/.agent/` directory for exploration notes and TODO tracking.

```
docs/
└── .agent/
    ├── exploration.md
    └── TODO.md
```

**Why**:
1. **Transparency**: Users can see agent's thinking
2. **State Persistence**: Agent remembers across iterations
3. **Debugging**: Helps diagnose agent behavior
4. **Trust**: Users see the process, not just output

**Alternatives Considered**:
- Hidden directory (`.docs-agent/`)
- No scratchpad (agent keeps state in prompt)
- Separate file outside `docs/`

**Trade-offs**:
- ✅ Transparent agent process
- ✅ Useful for debugging
- ✅ Builds trust
- ⚠️ Clutters `docs/` directory
- ⚠️ Users might delete it accidentally

---

### Decision: Incremental Git Commits

**What**: Agent commits after each major documentation section.

```bash
git commit -m "docs: Add architecture overview"
git commit -m "docs: Document auth module API"
git commit -m "docs: Add getting started guide"
```

**Why**:
1. **Progress Preservation**: Partial work isn't lost
2. **Reviewable**: Each commit is a logical unit
3. **Rollback-Friendly**: Easy to revert specific sections
4. **Context Reduction**: Agent doesn't carry entire history

**Alternatives Considered**:
- Single commit at the end
- No commits (user commits manually)
- Commit every file individually

**Trade-offs**:
- ✅ Fault-tolerant
- ✅ Clear history
- ⚠️ Many commits in git log
- ⚠️ Requires clean working directory

---

### Decision: Self-Termination Based on Quality Standards

**What**: Agent decides when documentation is complete by checking quality standards.

**Quality Checklist**:
- [ ] All major APIs documented
- [ ] Architecture explained
- [ ] 5+ working examples
- [ ] Getting started guide
- [ ] Internal links work
- [ ] GitHub Pages configured

**Why**:
1. **Adaptive Runtime**: Different projects need different time
2. **Quality-Driven**: Stops when "good enough," not arbitrary time
3. **Proven Pattern**: RepoMirror agents successfully self-terminated

**Alternatives Considered**:
- Fixed iteration count (e.g., always 20 loops)
- Time-based limit (e.g., 1 hour max)
- User manually stops when satisfied

**Trade-offs**:
- ✅ Adapts to project complexity
- ✅ Quality-focused stopping condition
- ⚠️ Unpredictable runtime
- ⚠️ Agent might misjudge completion

---

## Template System

### Decision: Shell Script Templates with Placeholders

**What**: Use `.template` files with `${variable}` placeholders that get replaced at runtime.

```bash
# sync.sh.template
cd ${repo}
claude -p < .tyler/prompt.md
```

**Why**:
1. **Simple**: Easy to understand and modify
2. **Portable**: Works on any Unix-like system
3. **No Dependencies**: Just bash, no Node.js runtime
4. **Editable**: Users can customize after generation

**Alternatives Considered**:
- Node.js scripts (e.g., `sync.js`)
- Python scripts
- Compiled binaries
- Direct execa calls (no script files)

**Trade-offs**:
- ✅ Simple and portable
- ✅ Easy to debug
- ⚠️ Unix/Mac only (no Windows support)
- ⚠️ Requires bash

---

### Decision: Three Templates (sync, forever, deploy)

**What**: Generate three shell scripts:
1. `sync.sh` - Single iteration
2. `tyler-forever.sh` - Continuous loop
3. `deploy-docs.sh` - GitHub Pages deployment

**Why**:
1. **Separation of Concerns**: Each script has one job
2. **Testing**: Users can test with `sync.sh` before committing to forever
3. **Deployment**: Optional deploy step, user controlled

**Alternatives Considered**:
- Single script with flags (e.g., `sync.sh --forever`)
- Inline in Node.js (no separate scripts)
- Many scripts for different scenarios

**Trade-offs**:
- ✅ Clear purpose per script
- ✅ Easy to understand
- ⚠️ Three files to manage
- ⚠️ Potential duplication

---

## Configuration

### Decision: YAML Configuration File

**What**: Use `tyler.yaml` for configuration instead of JSON or TOML.

```yaml
repo: ./
outputDir: docs
style: comprehensive
includeExamples: true
```

**Why**:
1. **Human-Readable**: Easy to edit manually
2. **Comments**: YAML supports comments
3. **Established**: RepoMirror uses YAML, consistent pattern
4. **npm Ecosystem**: Many tools use YAML (prettier, eslint, github actions)

**Alternatives Considered**:
- `tyler.json` (JSON)
- `tyler.config.js` (JavaScript)
- `.tylerrc` (INI format)

**Trade-offs**:
- ✅ Easy to read and edit
- ✅ Supports comments
- ⚠️ YAML parsing dependency
- ⚠️ Whitespace-sensitive

---

### Decision: Configuration File Required for sync Commands

**What**: `tyler sync` and `tyler sync-forever` fail if `tyler.yaml` doesn't exist.

**Why**:
1. **Explicit Setup**: Prevents accidental runs
2. **Clear Workflow**: Must run `tyler init` first
3. **Configuration Validation**: Ensures required fields exist

**Alternatives Considered**:
- Use defaults if config missing
- Interactive prompts on every sync
- Look for config in multiple locations

**Trade-offs**:
- ✅ Clear initialization step
- ✅ Prevents errors
- ⚠️ Less flexible
- ⚠️ Can't run sync without init

---

## GitHub Pages Integration

### Decision: Optional Jekyll Setup

**What**: Optionally create `_config.yml` for GitHub Pages with Jekyll theme.

```yaml
title: Project Documentation
description: Comprehensive documentation
theme: jekyll-theme-cayman
```

**Why**:
1. **Zero Config**: GitHub Pages works out-of-box with `docs/`
2. **Nice Themes**: Jekyll provides professional themes
3. **Optional**: Users can skip if they don't want it
4. **Standard**: Most GitHub Pages sites use Jekyll

**Alternatives Considered**:
- No GitHub Pages support
- Custom HTML/CSS theme
- Generate static site with different tool (Hugo, Docusaurus)

**Trade-offs**:
- ✅ Quick setup
- ✅ Professional appearance
- ⚠️ Limited to Jekyll themes
- ⚠️ GitHub-specific

---

### Decision: Manual Deployment

**What**: Provide `deploy-docs.sh` script but don't auto-deploy.

**Why**:
1. **User Control**: User decides when to deploy
2. **Review First**: User should review docs before publishing
3. **No Surprises**: Avoids accidental public deploys
4. **Flexible**: User can customize deploy process

**Alternatives Considered**:
- Auto-deploy after sync (with `--auto-push`)
- GitHub Actions workflow for auto-deploy
- No deploy script (user does it manually)

**Trade-offs**:
- ✅ User has control
- ✅ No accidental deploys
- ⚠️ Extra step required
- ⚠️ Easy to forget to deploy

---

## Cost Optimization

### Decision: Accept Variable Cost vs. Fixed Pricing

**What**: Tyler costs $6-15 per project (variable) instead of fixed pricing.

**Why**:
1. **Pay for What You Use**: Small projects cost less
2. **Competitive**: Even large projects cheaper than Mintlify ($120/month)
3. **Honest**: Transparent about actual API costs
4. **Flexible**: Users control runtime (can stop early)

**Alternatives Considered**:
- Fixed pricing (e.g., $9.99 per project)
- Subscription model (e.g., $20/month unlimited)
- Free tier with paid features

**Trade-offs**:
- ✅ Fair pricing
- ✅ Transparent costs
- ⚠️ Unpredictable exact cost
- ⚠️ Requires Claude API key

---

### Decision: No Built-in Cost Tracking

**What**: Tyler doesn't track or display costs during generation.

**Why**:
1. **Simplicity**: Avoid complexity of Claude API billing integration
2. **Predictable Range**: $6-15 is narrow enough
3. **User Trust**: Users can check Claude dashboard
4. **Focus**: Don't distract user with running cost counter

**Alternatives Considered**:
- Real-time cost display
- Cost estimation before running
- Budget limits (stop at $X)

**Trade-offs**:
- ✅ Simple implementation
- ✅ No API billing complexity
- ⚠️ Users can't see live cost
- ⚠️ No cost limits

---

## Error Handling

### Decision: Fail Fast with Helpful Messages

**What**: Tyler stops immediately on errors with clear, actionable messages.

```
✖ Claude Code is not properly configured
  Please run `claude` to set up your profile
```

**Why**:
1. **Quick Feedback**: User knows immediately what's wrong
2. **Actionable**: Messages explain how to fix
3. **Safe**: Prevents partial/broken setups

**Alternatives Considered**:
- Continue with warnings
- Auto-fix errors when possible
- Verbose error logs

**Trade-offs**:
- ✅ Clear error messages
- ✅ Prevents broken states
- ⚠️ Less forgiving
- ⚠️ Can't auto-recover

---

### Decision: Graceful Shutdown on Ctrl+C

**What**: Handle SIGINT and SIGTERM gracefully with cleanup.

```typescript
process.on('SIGINT', handleShutdown);
```

**Why**:
1. **User Friendly**: No ugly stack traces
2. **Safe**: Cleanup happens properly
3. **Resumable**: Partial work is preserved in git

**Alternatives Considered**:
- Let process crash
- Prevent Ctrl+C interruption
- Confirmation prompt before exiting

**Trade-offs**:
- ✅ Clean user experience
- ✅ Safe shutdown
- ⚠️ Additional code complexity
- ⚠️ Can't force-quit easily

---

## Testing Strategy

### Decision: Minimal Test Suite (for now)

**What**: Tyler currently has minimal automated tests.

**Why**:
1. **Early Stage**: Package is new, API may change
2. **E2E Heavy**: Real value is in E2E testing (requires Claude API)
3. **Cost**: Testing with real Claude API is expensive
4. **Manual**: Easier to test manually at this stage

**Alternatives Considered**:
- Full test suite with mocks
- E2E tests with Claude API ($$$)
- No tests at all

**Trade-offs**:
- ✅ Fast development
- ✅ Low cost
- ⚠️ Less confidence in changes
- ⚠️ Manual regression testing

**Future**: Add comprehensive tests before v1.0.

---

## Key Takeaways

### What Worked Well
1. **Ralph Wiggum pattern**: Proven, reliable, produces great results
2. **Simple prompts**: Less is more
3. **Scratchpad transparency**: Builds trust
4. **Incremental commits**: Fault-tolerant
5. **Three-command simplicity**: Easy to learn

### What We'd Reconsider
1. **Unix-only**: Windows support would be nice
2. **Manual deployment**: Could automate more
3. **Variable cost**: Some users want predictability
4. **Minimal tests**: Should add more before scaling

### Lessons from RepoMirror
1. **Keep it simple**: Don't over-engineer
2. **Trust the agent**: AI is smarter than you think
3. **Let it run**: Don't micromanage the process
4. **Commit often**: Preserves progress
5. **Self-termination works**: Agents know when to stop

---

[← Architecture Overview](overview.md) | [Agent Behavior →](agent-behavior.md)
