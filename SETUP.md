# Tyler Doc Agent - Setup & Publishing Guide

## 📦 Package Structure

Your standalone package is ready! Here's what was created:

```
tyler-doc-agent/
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore rules
├── .npmignore                # npm publish ignore rules
├── LICENSE                   # MIT License
├── README.md                 # Main documentation
├── SETUP.md                  # This file
├── src/
│   ├── cli.ts                # CLI entry point
│   ├── index.ts              # Main exports
│   └── commands/
│       ├── init.ts           # Initialize command
│       ├── sync.ts           # Sync command
│       └── sync-forever.ts   # Continuous sync command
├── templates/
│   ├── sync.sh.template      # Single sync script
│   ├── tyler-forever.sh.template  # Continuous loop script
│   └── deploy-docs.sh.template    # GitHub Pages deployment
└── prompts/
    ├── docs-comprehensive.md  # Comprehensive style prompt
    ├── docs-api-focused.md    # API-focused style prompt
    └── docs-tutorial.md       # Tutorial style prompt
```

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
cd tyler-doc-agent
npm install
```

### 2. Build the Package

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript in `dist/`
- Copy templates to `dist/templates/`
- Copy prompts to `dist/prompts/`

### 3. Test Locally

Link the package locally to test it:

```bash
# In tyler-doc-agent directory
npm link

# Now you can use 'tyler' command globally
tyler --help
```

### 4. Test in a Sample Project

```bash
cd /path/to/test-project
tyler init
tyler sync  # Test single iteration
```

### 5. Unlink When Done Testing

```bash
npm unlink -g tyler-doc-agent
```

## 🧪 Testing Checklist

Before publishing, test these scenarios:

- [ ] `tyler --help` shows correct help text
- [ ] `tyler init` creates `.tyler/` directory and files
- [ ] `tyler init --style api-focused` works with options
- [ ] `tyler sync` runs successfully (requires Claude Code setup)
- [ ] `tyler sync-forever` starts and can be stopped with Ctrl+C
- [ ] Templates are copied correctly to dist/
- [ ] Prompts are included in the package
- [ ] Configuration saves to `tyler.yaml`
- [ ] GitHub Pages setup creates `_config.yml`

## 📤 Publishing to npm

### First-Time Setup

1. **Create npm account** (if you don't have one):
   - Go to https://www.npmjs.com/signup
   - Or run: `npm adduser`

2. **Login to npm**:
   ```bash
   npm login
   ```

3. **Check package name availability**:
   ```bash
   npm search tyler-doc-agent
   ```
   If the name is taken, update `package.json` name field.

### Publishing Steps

1. **Ensure everything is committed**:
   ```bash
   git status
   git add .
   git commit -m "Initial tyler-doc-agent package"
   ```

2. **Build the package**:
   ```bash
   npm run build
   ```

3. **Test the package build**:
   ```bash
   npm pack
   # This creates tyler-doc-agent-0.1.0.tgz
   # Inspect it to ensure all files are included
   tar -tzf tyler-doc-agent-0.1.0.tgz
   ```

4. **Publish to npm**:
   ```bash
   npm publish
   ```

   If you want to publish as public (recommended):
   ```bash
   npm publish --access public
   ```

5. **Verify publication**:
   ```bash
   npm info tyler-doc-agent
   ```

### Version Updates

When updating the package:

1. **Make your changes**

2. **Update version** (choose one):
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1 (bug fixes)
   npm version minor  # 0.1.0 -> 0.2.0 (new features)
   npm version major  # 0.1.0 -> 1.0.0 (breaking changes)
   ```

3. **Publish**:
   ```bash
   npm publish
   ```

4. **Push to git**:
   ```bash
   git push && git push --tags
   ```

## 🔧 Development Scripts

```bash
# Build the package
npm run build

# Watch mode (rebuilds on file changes)
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run fix

# Type check
npm run check
```

## 🐛 Troubleshooting

### "Module not found" errors

Make sure you built the package:
```bash
npm run build
```

### Templates not found

Check that templates are copied in the build script:
```bash
# package.json should have:
"build": "tsc && cp -r templates dist/ && cp -r prompts dist/"
```

### Command not found: tyler

After `npm link`, you might need to restart your terminal or run:
```bash
hash -r  # Refresh command cache
```

### Claude Code errors

Ensure Claude Code is installed and working:
```bash
claude -p "say hi"
```

## 📊 Package Size

Check package size before publishing:

```bash
npm pack
ls -lh tyler-doc-agent-0.1.0.tgz
```

Typical size: 50-100KB

To reduce size:
- Ensure `.npmignore` excludes unnecessary files
- Don't include `node_modules/` in git
- Keep `src/` files clean

## 🎯 Post-Publication

After publishing:

1. **Test installation**:
   ```bash
   npm install -g tyler-doc-agent
   tyler --help
   ```

2. **Create GitHub repository**:
   - Create repo: https://github.com/repomirrorhq/tyler-doc-agent
   - Push code: `git push origin main`

3. **Update npm package metadata**:
   - Add repository URL in package.json
   - Update version: `npm version patch`
   - Republish: `npm publish`

4. **Add badges to README**:
   - npm version badge
   - downloads badge
   - license badge

5. **Create release notes**:
   - GitHub releases
   - Changelog.md

## 🔐 Security

### API Keys

Never commit:
- `.tyler/` directory (in .gitignore)
- `tyler.yaml` (in .gitignore)
- Any files containing API keys

### npm 2FA

Enable two-factor authentication:
```bash
npm profile enable-2fa auth-and-writes
```

## 📈 Monitoring

After publishing, monitor:

1. **npm download stats**:
   - https://www.npmjs.com/package/tyler-doc-agent

2. **GitHub stars/issues**:
   - https://github.com/repomirrorhq/tyler-doc-agent

3. **User feedback**:
   - GitHub issues
   - npm package reviews

## 🎉 Next Steps

1. **Test locally** ✅
2. **Build package** ✅
3. **Publish to npm** ⏳
4. **Create GitHub repo** ⏳
5. **Announce on Twitter/Reddit** ⏳
6. **Write blog post** ⏳
7. **Submit to Product Hunt** ⏳

## 📞 Support

If you encounter issues:

1. Check this SETUP.md file
2. Review build output: `npm run build`
3. Test locally before publishing
4. Check npm documentation: https://docs.npmjs.com/

Good luck with your launch! 🚀
