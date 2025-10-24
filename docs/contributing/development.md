# Contributing to Tyler Doc Agent

Thank you for your interest in contributing to Tyler! This guide will help you get started with development.

## Quick Start for Contributors

```bash
# Clone the repository
git clone https://github.com/repomirrorhq/tyler-doc-agent.git
cd tyler-doc-agent

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm link

# Test your changes
tyler --help
```

## Development Setup

### Prerequisites

- **Node.js** 16+ (18+ recommended)
- **npm** 8+
- **Git**
- **Claude Code** CLI (for testing)
- **TypeScript** knowledge

### Install Dependencies

```bash
npm install
```

### Project Structure

```
tyler-doc-agent/
├── src/
│   ├── cli.ts                 # CLI entry point
│   ├── index.ts               # Package exports
│   └── commands/
│       ├── init.ts            # Initialize command
│       ├── sync.ts            # Single sync command
│       └── sync-forever.ts    # Continuous sync command
├── templates/
│   ├── sync.sh.template       # Single iteration script
│   ├── tyler-forever.sh.template  # Continuous loop script
│   └── deploy-docs.sh.template    # Deployment script
├── prompts/
│   ├── docs-comprehensive.md  # Comprehensive style prompt
│   ├── docs-api-focused.md    # API-focused style prompt
│   └── docs-tutorial.md       # Tutorial style prompt
├── docs/                      # This documentation
├── package.json               # npm package configuration
├── tsconfig.json              # TypeScript configuration
├── README.md                  # User-facing README
└── LICENSE                    # MIT License
```

### Build System

Tyler uses TypeScript for development:

```bash
# Compile TypeScript
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Type check without building
npm run check

# Lint code
npm run lint

# Auto-fix linting issues
npm run fix
```

**Build output**: `dist/` directory

### Development Workflow

1. **Make changes** in `src/`
2. **Build**: `npm run build`
3. **Test locally**: `npm link && tyler --help`
4. **Verify changes** work as expected
5. **Commit** with clear message
6. **Submit PR**

## Making Changes

### Adding a New Command

To add a new command (e.g., `tyler validate`):

**1. Create command file** (`src/commands/validate.ts`):

```typescript
import chalk from 'chalk';
import { loadConfig } from '../utils/config';

export interface ValidateOptions {
  verbose?: boolean;
}

export async function validate(options: ValidateOptions = {}): Promise<void> {
  console.log(chalk.cyan('Validating Tyler configuration...'));

  // Load and validate config
  const config = await loadConfig();

  // Validation logic here
  console.log(chalk.green('✅ Configuration is valid'));
}
```

**2. Export from index** (`src/index.ts`):

```typescript
export { validate } from './commands/validate';
```

**3. Add CLI command** (`src/cli.ts`):

```typescript
program
  .command('validate')
  .description('Validate Tyler configuration')
  .option('-v, --verbose', 'Verbose output')
  .action((options) => validate(options));
```

**4. Update documentation** in `docs/api/index.md`

**5. Test**:

```bash
npm run build
npm link
tyler validate
```

### Adding a New Documentation Style

To add a new style (e.g., "security-focused"):

**1. Create prompt template** (`prompts/docs-security.md`):

```markdown
# Security-Focused Documentation Generation Prompt

Your job is to create security-focused documentation for this codebase.

Focus on:
- Security architecture
- Authentication and authorization
- Threat model
- Security best practices
- Vulnerability handling

[... detailed prompt ...]
```

**2. Update init command** (`src/commands/init.ts`):

Add to style options in inquirer prompt:
```typescript
{
  type: 'list',
  name: 'style',
  message: 'Documentation style?',
  choices: [
    'comprehensive',
    'api-focused',
    'tutorial',
    'minimal',
    'security'  // Add new style
  ]
}
```

**3. Update documentation** (`docs/api/index.md`, `docs/guides/getting-started.md`)

**4. Test**:
```bash
npm run build
tyler init --style security
```

### Modifying Templates

Templates are in `templates/` and use `${variable}` syntax:

**Example**: Modify continuous loop sleep time:

```bash
# templates/tyler-forever.sh.template
while :; do
  cd ${repo}
  claude -p < .tyler/prompt.md
  sleep 5  # Changed from 2 to 5 seconds
done
```

**After changing templates**:
1. Rebuild: `npm run build`
2. Test: `tyler init` (generates new scripts)
3. Verify: `cat .tyler/tyler-forever.sh`

### Testing Changes

#### Manual Testing

```bash
# 1. Build
npm run build

# 2. Link locally
npm link

# 3. Test in a sample project
cd /tmp/test-project
git init
git remote add origin https://github.com/test/test.git
tyler init
tyler sync

# 4. Verify output
ls -la docs/
cat tyler.yaml
```

#### Testing Preflight Checks

```bash
# Test without git repo
mkdir /tmp/no-git
cd /tmp/no-git
tyler init
# Should fail with helpful error

# Test without remotes
mkdir /tmp/no-remote
cd /tmp/no-remote
git init
tyler init
# Should fail with helpful error

# Test without Claude Code (if you want to test the error)
# Temporarily rename claude binary
which claude  # Note the path
sudo mv /path/to/claude /path/to/claude.bak
tyler init
# Should fail with helpful error
sudo mv /path/to/claude.bak /path/to/claude
```

#### Testing Documentation Generation

```bash
# Test with small project
cd /tmp
git clone https://github.com/tj/commander.js.git
cd commander.js
tyler init --style minimal
tyler sync

# Review generated docs
ls -lR docs/
cat docs/index.md
```

## Code Style

### TypeScript Guidelines

- **Use TypeScript** for type safety
- **Define interfaces** for options and config
- **Use async/await** instead of promises
- **Error handling**: Use try/catch with helpful messages
- **No any**: Avoid `any` type unless absolutely necessary

**Example**:

```typescript
// ✅ Good
interface SyncOptions {
  repo?: string;
  autoPush?: boolean;
}

export async function sync(options: SyncOptions = {}): Promise<void> {
  try {
    const config = await loadConfig();
    await executeSync(config);
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

// ❌ Bad
export async function sync(options: any): Promise<any> {
  const config = loadConfig();  // Missing await
  executeSync(config);  // No error handling
}
```

### Formatting

Use Prettier for consistent formatting:

```bash
# Format all files
npm run fix

# Check formatting
npm run lint
```

**Prettier config** (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Naming Conventions

- **Files**: kebab-case (`sync-forever.ts`, `load-config.ts`)
- **Functions**: camelCase (`loadConfig`, `syncForever`)
- **Interfaces**: PascalCase (`SyncOptions`, `TylerConfig`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_OUTPUT_DIR`)

## Commit Guidelines

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Build/tooling changes

**Examples**:

```bash
# Good commit messages
git commit -m "feat(init): add security-focused documentation style"
git commit -m "fix(sync): handle SIGTERM gracefully"
git commit -m "docs: update getting started guide with new examples"
git commit -m "refactor(cli): extract config loading to utils"

# Bad commit messages
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "updates"
```

### Pull Request Process

1. **Fork** the repository
2. **Create branch**: `git checkout -b feat/my-feature`
3. **Make changes** with clear commits
4. **Test thoroughly**
5. **Update docs** if needed
6. **Push**: `git push origin feat/my-feature`
7. **Open PR** with description of changes

**PR Template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Testing
How did you test these changes?

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Commit messages are clear
```

## Testing

### Running Tests

```bash
# Run all tests (when we add them)
npm test

# Run specific test file
npm test -- init.test.ts

# Run with coverage
npm test -- --coverage
```

### Writing Tests

Tyler currently has minimal tests. Contributions to improve test coverage are welcome!

**Example test** (when implemented):

```typescript
// src/commands/__tests__/init.test.ts
import { init } from '../init';

describe('init command', () => {
  it('should create tyler.yaml', async () => {
    // Test implementation
  });

  it('should fail without git repository', async () => {
    // Test implementation
  });
});
```

## Release Process

Tyler maintainers follow this release process:

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Commit**: `git commit -m "chore: release v0.2.0"`
4. **Tag**: `git tag v0.2.0`
5. **Push**: `git push origin main --tags`
6. **Build**: `npm run build`
7. **Publish**: `npm publish`
8. **GitHub Release**: Create release notes on GitHub

### Version Numbering

Tyler follows [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.2.0): New features, backward compatible
- **Patch** (0.1.1): Bug fixes

## Documentation

### Updating Documentation

Tyler's documentation lives in `docs/`:

```
docs/
├── index.md                   # Overview
├── architecture/              # Architecture docs
├── api/                       # API reference
├── guides/                    # How-to guides
├── examples/                  # Real-world examples
├── comparison/                # Comparison with competitors
└── contributing/              # This file
```

**When to update docs**:
- ✅ Adding new command
- ✅ Changing command options
- ✅ Adding new documentation style
- ✅ Fixing bugs (update troubleshooting)
- ✅ Improving workflows (update guides)

### Documentation Style

- **Be concise**: Every word should add value
- **Use examples**: Show, don't just tell
- **Link related content**: Help readers find related info
- **Update both README and docs/**: README for quick start, docs/ for comprehensive

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code contributions

### Useful Resources

- [Commander.js Docs](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js Docs](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Claude Code SDK](https://github.com/anthropics/claude-code) - Claude SDK
- [RepoMirror](https://github.com/repomirrorhq/repomirror) - Parent project

## Common Development Tasks

### Adding a CLI Option

```typescript
// src/cli.ts
program
  .command('sync')
  .description('Run one sync iteration')
  .option('--auto-push', 'Automatically push changes')
  .option('--dry-run', 'Preview without executing')  // New option
  .action((options) => sync(options));
```

### Adding a Configuration Field

```typescript
// Update interface
interface TylerConfig {
  repo: string;
  outputDir: string;
  style: string;
  includeExamples: boolean;
  customField: string;  // New field
}

// Update validation
function validateConfig(config: TylerConfig): void {
  if (!config.customField) {
    throw new Error('customField is required');
  }
}
```

### Improving Error Messages

```typescript
// ❌ Bad error message
throw new Error('Config not found');

// ✅ Good error message
throw new Error(
  'Configuration file tyler.yaml not found.\n' +
  'Please run "tyler init" to create configuration.'
);
```

### Adding Preflight Check

```typescript
// src/commands/init.ts

async function performPreflightChecks(): Promise<void> {
  // Existing checks...

  // New check: Verify Node.js version
  console.log(chalk.white('5. Checking Node.js version...'));
  const spinner = ora('Verifying Node.js version').start();
  const nodeVersion = process.versions.node;
  const major = parseInt(nodeVersion.split('.')[0]);

  if (major < 16) {
    spinner.fail(`Node.js ${nodeVersion} is too old. Requires 16+`);
    process.exit(1);
  }

  spinner.succeed(`Node.js ${nodeVersion} is compatible`);
}
```

## FAQ for Contributors

### Q: How do I test changes without publishing to npm?

**A**: Use `npm link`:
```bash
npm run build
npm link
cd /tmp/test-project
tyler --help  # Uses your local development version
```

### Q: How do I unlink after testing?

**A**:
```bash
npm unlink -g tyler-doc-agent
npm install -g tyler-doc-agent  # Reinstall published version
```

### Q: Why are there so few tests?

**A**: Tyler is an early-stage project. The core functionality (Claude Code integration) is difficult to test without expensive API calls. We welcome contributions to improve test coverage with proper mocking.

### Q: Can I add support for Windows?

**A**: Yes! This would be a great contribution. The main challenge is converting bash scripts to PowerShell or finding a cross-platform solution.

### Q: How do I add a new prompt template?

**A**:
1. Create `prompts/docs-[name].md`
2. Update `init.ts` style options
3. Test with `tyler init --style [name]`
4. Document in `docs/api/index.md`

### Q: Can I modify the "Ralph Wiggum" loop implementation?

**A**: Yes, but be careful. The loop pattern is core to Tyler's functionality. Test thoroughly and document your changes.

## Ideas for Contributions

### High-Impact Contributions

- ✅ Windows support (PowerShell scripts)
- ✅ Test suite with mocking
- ✅ GitHub Actions integration examples
- ✅ More documentation styles (e.g., security-focused, api-first)
- ✅ Cost estimation before running
- ✅ Real-time progress UI (with rich, blessed, or ink)

### Medium-Impact Contributions

- ✅ Additional Jekyll themes
- ✅ Support for other static site generators (Hugo, VuePress)
- ✅ Documentation validation command
- ✅ Link checking command
- ✅ Configuration validation with better error messages

### Low-Impact Contributions

- ✅ Additional examples in docs
- ✅ Improved error messages
- ✅ Better logging with debug mode
- ✅ Shell completion (bash, zsh)

## License

Tyler Doc Agent is [MIT licensed](../LICENSE).

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Tyler!**

Questions? Open an issue or discussion on GitHub.

---

[← Back to Index](../index.md) | [Architecture →](../architecture/overview.md)
