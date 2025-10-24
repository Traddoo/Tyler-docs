# Tutorial-Style Documentation Generation Prompt

Your job is to create comprehensive, tutorial-style documentation for this codebase in the `docs/` directory.

## Mission

Create **learning-focused documentation** that guides users from beginner to advanced usage through clear, step-by-step tutorials. Think "official tutorial" quality.

## Documentation Structure

```
docs/
├── index.md                    # Landing page with learning path
├── tutorials/
│   ├── 01-getting-started.md   # Installation and first steps
│   ├── 02-basic-concepts.md    # Core concepts explanation
│   ├── 03-first-project.md     # Build something simple
│   ├── 04-[feature-1].md       # Tutorial for feature 1
│   ├── 05-[feature-2].md       # Tutorial for feature 2
│   └── ...                     # More feature tutorials
├── how-to/
│   ├── [task-1].md             # How to accomplish specific tasks
│   ├── [task-2].md
│   └── ...
├── concepts/
│   ├── architecture.md         # Understanding the architecture
│   ├── [concept-1].md          # Key concept explanations
│   └── ...
├── reference/
│   └── quick-reference.md      # Quick reference guide
└── .agent/
    ├── learning-path.md        # Your planned tutorial flow
    └── TODO.md                 # Documentation tasks
```

## Tutorial Writing Principles

### 1. **Progressive Disclosure**
- Start simple, gradually increase complexity
- Each tutorial builds on previous ones
- Introduce one concept at a time

### 2. **Learning by Doing**
- Every tutorial is hands-on
- Users write real, working code
- Clear outcomes for each tutorial

### 3. **Clear Prerequisites**
- State what users need to know first
- Link to prerequisite tutorials
- Include setup requirements

### 4. **Complete Code Examples**
- Show full, working code at each step
- Explain what each part does
- Show expected output

### 5. **Common Pitfalls**
- Warn about common mistakes
- Explain why things work the way they do
- Provide troubleshooting tips

## Tutorial Template

Each tutorial should follow this structure:

```markdown
# [Tutorial Title]

Brief description of what users will learn.

**What you'll learn:**
- Learning objective 1
- Learning objective 2
- Learning objective 3

**Prerequisites:**
- Link to prerequisite tutorial/concept
- Required tools or setup

**Time to complete:** ~X minutes

---

## Introduction

Brief explanation of why this tutorial matters and what problem it solves.

## Step 1: [Action]

Clear explanation of what we're doing and why.

```[language]
// Complete code for this step
// with comments explaining key parts
```

**What's happening here:**
- Explanation of what the code does
- Why we're doing it this way

**Expected output:**
```
Show what users should see
```

## Step 2: [Next Action]

... continue with more steps ...

## Putting It All Together

Complete, final code example with everything integrated.

## What's Next?

- Link to next logical tutorial
- Suggestions for further exploration
- Related how-to guides

## Troubleshooting

Common issues users might encounter and solutions.
```

## Workflow

### Phase 1: Learning Path Design (2-3 iterations)
1. Explore the codebase thoroughly
2. Identify key features and concepts
3. Design a logical learning progression in `docs/.agent/learning-path.md`:
   - What should users learn first?
   - What builds on what?
   - What are the "aha!" moments?
4. Create prioritized tutorial TODO list

### Phase 2: Core Tutorials (5-8 iterations)
1. Create `docs/tutorials/01-getting-started.md`
   - Installation
   - First "Hello World" equivalent
   - Basic configuration
2. Create `docs/tutorials/02-basic-concepts.md`
   - Explain core concepts
   - Simple working examples
3. Create `docs/tutorials/03-first-project.md`
   - Build something real (but simple)
   - Integrate multiple concepts

### Phase 3: Feature Tutorials (10-15 iterations)
For each major feature:
1. Create tutorial in `docs/tutorials/XX-[feature].md`
2. Follow step-by-step format
3. Include working code for each step
4. Show expected output
5. Commit after each tutorial

### Phase 4: How-To Guides (5-8 iterations)
Create task-focused guides:
- "How to [accomplish specific task]"
- Shorter than tutorials
- Focused on one task
- Assume user knows basics

### Phase 5: Concepts & Reference (3-5 iterations)
1. Create concept explanations in `docs/concepts/`
2. Create quick reference guide
3. Add architecture overview

### Phase 6: Polish & Navigation
1. Create excellent landing page in `docs/index.md`
2. Add "Next Steps" links between tutorials
3. Test all code examples
4. Set up GitHub Pages

## Code Example Standards

Every code example must:
- Be complete and runnable
- Have clear comments
- Show expected output
- Include error handling where relevant
- Use realistic scenarios

## Commit Strategy

Commit after each tutorial:
- `docs: Add getting started tutorial`
- `docs: Create [feature] tutorial`
- `docs: Add how-to guide for [task]`
- `docs: Document [concept]`

## Quality Checklist

Before considering documentation complete:
- [ ] At least 5 progressive tutorials exist
- [ ] Getting started guide is clear and complete
- [ ] Each major feature has a tutorial
- [ ] At least 5 how-to guides exist
- [ ] Core concepts are explained
- [ ] All code examples are tested and working
- [ ] Navigation between tutorials is clear
- [ ] Learning path is logical and well-paced
- [ ] GitHub Pages is configured

## Scratchpad

Use `docs/.agent/` for:
- **learning-path.md**: Planned tutorial sequence and structure
- **TODO.md**: Track tutorial creation progress

## Remember

You're not just documenting features - you're **teaching** people how to use this project effectively. Make the learning journey smooth, logical, and rewarding.
