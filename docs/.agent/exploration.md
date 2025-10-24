# Tyler Doc Agent - Codebase Exploration

## Package Overview
- **Name**: tyler-doc-agent (formerly repomirror documentation commands)
- **Purpose**: AI-powered documentation generation using Claude Code
- **Binary**: `tyler` (will be published as separate package)
- **Based on**: RepoMirror's "Ralph Wiggum" infinite loop pattern

## Project Structure

### Core Commands (src/commands/)
1. **doc-init.ts**: Initialize documentation agent (NOT YET CREATED - exists as reference in parent)
2. **doc-sync.ts**: Single iteration sync (NOT YET CREATED)
3. **doc-sync-forever.ts**: Continuous loop (NOT YET CREATED)

### CLI Entry (src/cli.ts)
- 3 documentation commands: doc-init, doc-sync, doc-sync-forever
- Uses commander.js for CLI framework
- Help text explains documentation styles and workflow

### Templates (src/templates/)
Expected templates:
- doc-sync.sh.template - Single iteration script
- doc-ralph.sh.template (or tyler-forever.sh) - Continuous loop
- deploy-docs.sh.template - GitHub Pages deployment

### Prompt Templates (prompts/)
Three documentation styles:
1. **docs-comprehensive.md** - Full coverage (default)
2. **docs-api-focused.md** - API reference focus
3. **docs-tutorial.md** - Learning path focus

## Key Insights from Parent Project

### RepoMirror Architecture
- **Original Purpose**: Code transformation (Python→TypeScript, React→Vue)
- **Core Innovation**: "Ralph Wiggum" infinite loop pattern
- **Commands**: 11 total (init, sync, sync-forever, push, pull, remote, visualize, etc.)
- **Success**: 1,000+ commits overnight, $800 spend, 6 repos ported

### "Ralph Wiggum" Pattern
```bash
while :; do
  claude -p < prompt.md
  sleep 2
done
```
**Why it works:**
- Agents self-terminate when complete
- Progressive learning through iterations
- Cost: ~$10.50/hour (Sonnet 4.5)
- Agents write tests unprompted
- Agents stay focused on scope

### Key Learnings
1. **Keep prompts simple**: 100-200 words > 1,500 words
2. **Be direct**: "Port X to Y and maintain" works better than complex instructions
3. **Include commit instructions**: "Commit after every file edit"
4. **Specify scratchpad**: "Use .agent/ for plans and todos"
5. **Less is more**: Simple prompts = faster, smarter agents

## Tyler Doc Agent Adaptations

### Differences from Code Transformation
| Aspect | Code Transform | Doc Generation |
|--------|---------------|----------------|
| **Repos** | 2 (source + target) | 1 (single repo) |
| **Output** | Transformed code | Markdown docs |
| **Location** | Target repo | docs/ directory |
| **Config** | repomirror.yaml | tyler.yaml |
| **Scripts** | .repomirror/ | .tyler/ |

### Expected Workflow
1. **Exploration Phase**: Agent explores codebase (2-5 iterations)
2. **Structure Phase**: Creates docs/ directory structure
3. **Generation Phase**: Writes documentation files (10-20 iterations)
4. **Enhancement Phase**: Adds examples, diagrams, cross-refs
5. **Deployment Phase**: Sets up GitHub Pages

### Agent Behavior
- Tracks progress in `docs/.agent/TODO.md`
- Makes commits after major sections
- Uses `docs/.agent/exploration.md` for notes
- Self-terminates when quality standards met
- Typical runtime: 30-60 minutes
- Expected cost: $6-15 per project

## Documentation Styles

### 1. Comprehensive (Default)
Structure:
```
docs/
├── index.md
├── architecture/
├── api/
├── guides/
├── examples/
├── contributing/
└── .agent/
```

### 2. API-Focused
Structure:
```
docs/
├── index.md
├── api/
├── examples/
├── types/
└── .agent/
```

### 3. Tutorial
Structure:
```
docs/
├── index.md
├── tutorials/
├── examples/
├── reference/
└── .agent/
```

## Quality Standards

Documentation complete when:
- [ ] All major APIs documented
- [ ] Architecture clearly explained
- [ ] 5+ working code examples
- [ ] Getting started guide complete
- [ ] All internal links work
- [ ] GitHub Pages configured
- [ ] Contributing guidelines present

## Cost & Performance Data

From RepoMirror testing:
- **Small project** (500 lines): 20-30 min, $4-6
- **Medium project** (5K lines): 30-45 min, $6-10
- **Large project** (50K lines): 45-60 min, $10-15

Real example (TypeScript library):
- Runtime: 45 minutes
- Cost: $8
- Output: 24 files, 78 pages, 12 examples, 43 functions documented

## Competitive Landscape

**Mintlify**: $120/month = $1,440/year
- Pros: Hosted, pretty UI
- Cons: Limited understanding, expensive

**Tyler**: $6-15 one-time
- Pros: Deep understanding, working examples, cost-effective
- Cons: Requires Claude Code setup

**Savings**: ~$1,425/year per project

## Technical Dependencies
- @anthropic-ai/claude-code - Claude SDK
- commander - CLI framework
- inquirer - Interactive prompts
- chalk - Terminal colors
- ora - Spinners
- execa - Process execution
- yaml - Config parsing
- fs-extra - File operations

## Next Steps for Documentation
1. Create comprehensive index.md
2. Document architecture with diagrams
3. Full API reference for all commands
4. How-to guides with real examples
5. Cost comparison with competitors
6. Contributing guide
7. GitHub Pages setup
