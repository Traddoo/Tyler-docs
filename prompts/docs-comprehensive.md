# Comprehensive Documentation Generation Prompt

Your job is to create and maintain world-class, comprehensive documentation for this codebase in the `docs/` directory.

## Mission

Create documentation that is **better than Mintlify, ReadTheDocs, or any auto-generated docs platform**. This means:
- More coherent and thoughtfully organized
- Better explained with clear reasoning
- More useful with working examples
- Properly cross-referenced and navigable

## Documentation Structure

Create the following structure in `docs/`:

```
docs/
├── index.md                 # Overview, quick start, installation
├── architecture/
│   ├── overview.md          # High-level architecture
│   ├── design-decisions.md  # Key design choices and rationale
│   └── data-flow.md         # How data flows through the system
├── api/
│   ├── index.md             # API overview
│   ├── [module-name].md     # One file per major module/component
│   └── examples.md          # Common API usage patterns
├── guides/
│   ├── getting-started.md   # Detailed getting started guide
│   ├── [feature].md         # One guide per major feature
│   └── troubleshooting.md   # Common issues and solutions
├── examples/
│   ├── basic-usage.md       # Simple examples
│   ├── advanced.md          # Complex use cases
│   └── real-world.md        # Production-ready examples
├── contributing/
│   ├── development.md       # Setup and development workflow
│   ├── testing.md           # Testing guidelines
│   └── code-style.md        # Code style and conventions
└── .agent/
    ├── exploration.md       # Your exploration notes
    └── TODO.md              # Documentation task tracking
```

## Documentation Principles

### 1. **Be Thorough but Concise**
- Every word should add value
- No filler content or generic platitudes
- Get to the point quickly

### 2. **Working Code Examples**
- All code examples must be complete and runnable
- Include imports, setup, and error handling
- Test examples before documenting them

### 3. **Explain the "Why"**
- Don't just describe what code does
- Explain WHY design decisions were made
- Provide context and rationale

### 4. **Visual Aids**
- Use Mermaid diagrams for complex flows
- Create architecture diagrams
- Use tables for comparisons

### 5. **Cross-Reference Everything**
- Link related concepts together
- Create clear navigation paths
- Use relative links between docs

### 6. **Keep it Fresh**
- Update docs as you discover new patterns
- Refactor documentation as understanding deepens
- Remove outdated information

## Workflow

### Phase 1: Exploration (First 3-5 iterations)
1. Systematically explore the codebase
2. Identify main components, modules, and APIs
3. Understand the architecture and design patterns
4. Document findings in `docs/.agent/exploration.md`
5. Create TODO list in `docs/.agent/TODO.md`

### Phase 2: Structure Creation
1. Create the directory structure in `docs/`
2. Set up Jekyll `_config.yml` for GitHub Pages
3. Create stub files with outlines
4. Establish navigation structure

### Phase 3: Content Generation
1. Start with `docs/index.md` - overview and quick start
2. Document architecture in `docs/architecture/`
3. Create comprehensive API reference in `docs/api/`
4. Write guides in `docs/guides/`
5. Add examples in `docs/examples/`
6. Document contribution process in `docs/contributing/`

### Phase 4: Enhancement & Polish
1. Add cross-references between documents
2. Create more examples
3. Add diagrams and visual aids
4. Improve clarity and flow
5. Test all code examples

### Phase 5: Deployment
1. Ensure Jekyll `_config.yml` is properly configured
2. Test navigation and links
3. Commit and push documentation

## Commit Strategy

**Commit after each major documentation file or section**. Use descriptive commit messages:
- `docs: Add architecture overview`
- `docs: Document API for [module name]`
- `docs: Add getting started guide`
- `docs: Create examples for [feature]`

## Quality Standards

Before considering documentation "complete":
- [ ] All major APIs are documented
- [ ] Architecture is clearly explained
- [ ] At least 5 working code examples exist
- [ ] Getting started guide is clear and complete
- [ ] All internal links work
- [ ] GitHub Pages configuration is ready
- [ ] Contributing guidelines are present

## Scratchpad Usage

Use `docs/.agent/` directory for:
- **exploration.md**: Your notes as you explore the codebase
- **TODO.md**: Track documentation tasks, mark completed items

## GitHub Pages Setup

Create `docs/_config.yml` with:
```yaml
title: [Project Name] Documentation
description: Comprehensive documentation for [Project Name]
theme: jekyll-theme-cayman
markdown: kramdown
plugins:
  - jekyll-relative-links
relative_links:
  enabled: true
  collections: true
```

## Remember

You're not just generating docs - you're creating a **comprehensive knowledge base** that helps developers understand, use, and contribute to this project. Make it exceptional.
