# API-Focused Documentation Generation Prompt

Your job is to create detailed, high-quality API reference documentation for this codebase in the `docs/` directory.

## Mission

Create API documentation that is **clearer and more useful** than typical auto-generated API docs. Focus on:
- Complete API coverage with detailed descriptions
- Working code examples for every major function/class
- Clear parameter and return type documentation
- Error handling and edge cases
- Best practices and common patterns

## Documentation Structure

```
docs/
├── index.md              # API overview and navigation
├── api/
│   ├── [module-1].md     # One file per module/package
│   ├── [module-2].md
│   └── ...
├── examples/
│   ├── basic.md          # Basic usage examples
│   ├── advanced.md       # Advanced patterns
│   └── integration.md    # Integration examples
├── types/
│   └── reference.md      # Type definitions and interfaces
└── .agent/
    ├── api-inventory.md  # Your API exploration notes
    └── TODO.md           # Documentation tasks
```

## API Documentation Template

For each module, use this structure:

```markdown
# [Module Name]

Brief description of what this module does.

## Overview

High-level explanation of the module's purpose and main use cases.

## Classes/Functions

### `functionName(param1, param2)`

**Description**: Clear description of what this does.

**Parameters**:
- `param1` (type): Description
- `param2` (type): Description

**Returns**:
- (return-type): Description of return value

**Throws**:
- `ErrorType`: When this error occurs

**Example**:
```[language]
// Complete, runnable example
import { functionName } from 'module';

const result = functionName(arg1, arg2);
console.log(result);
```

**Related**: Links to related APIs or guides
```

## Workflow

### Phase 1: API Inventory (2-3 iterations)
1. Explore the codebase systematically
2. Identify all public APIs (functions, classes, methods)
3. Document in `docs/.agent/api-inventory.md`:
   - List all modules/packages
   - List all public exports per module
   - Note which APIs are core vs. utility
4. Create prioritized TODO list

### Phase 2: Documentation Generation (10-15 iterations)
1. Start with core/most-used APIs
2. For each module:
   - Create `docs/api/[module-name].md`
   - Document all public functions/classes
   - Add at least 2-3 working examples per API
   - Document parameters, return types, errors
3. Commit after each module is documented

### Phase 3: Examples & Patterns (5-8 iterations)
1. Create `docs/examples/basic.md` with simple use cases
2. Create `docs/examples/advanced.md` with complex patterns
3. Create `docs/examples/integration.md` with real-world scenarios
4. Ensure all examples are complete and runnable

### Phase 4: Types & Interfaces (2-3 iterations)
1. Document all TypeScript interfaces/types or equivalent
2. Create `docs/types/reference.md` with type definitions
3. Cross-reference types from API docs

### Phase 5: Navigation & Polish
1. Create `docs/index.md` with clear navigation
2. Add cross-references between related APIs
3. Test all code examples
4. Set up GitHub Pages configuration

## Documentation Principles

1. **Completeness**: Document every public API
2. **Clarity**: Write like you're explaining to a colleague
3. **Examples**: Every API needs at least one working example
4. **Accuracy**: Test examples, verify parameter types
5. **Consistency**: Use the same format for all APIs

## Code Example Standards

All code examples must:
- Be complete (include imports, setup)
- Be runnable without modification
- Handle errors appropriately
- Use realistic variable names
- Include comments for complex parts

## Commit Strategy

Commit frequently with clear messages:
- `docs: Document [module] API`
- `docs: Add examples for [feature]`
- `docs: Document [ClassName] class`
- `docs: Add type reference for [types]`

## Quality Checklist

Before considering documentation complete:
- [ ] All public APIs are documented
- [ ] Each API has parameter descriptions
- [ ] Each API has return type documentation
- [ ] Each major API has a code example
- [ ] At least 10 working examples exist across docs
- [ ] Type definitions are documented
- [ ] Navigation is clear and complete
- [ ] GitHub Pages is configured

## Scratchpad

Use `docs/.agent/` for:
- **api-inventory.md**: List of all APIs as you discover them
- **TODO.md**: Track documentation progress

## Remember

Focus on making the API **immediately usable** by developers. If someone reads your docs, they should be able to use the API without looking at source code.
