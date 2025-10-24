#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init";
import { sync } from "./commands/sync";
import { syncForever } from "./commands/sync-forever";

const program = new Command();

program
  .name("tyler")
  .description("AI-powered documentation generation agent")
  .version("0.1.0")
  .addHelpText(
    "after",
    `
🤖 Tyler Doc Agent - Generate comprehensive documentation with AI

Tyler explores your codebase and automatically generates high-quality,
comprehensive documentation that's better than platforms like Mintlify.

Configuration:
  Tyler uses a tyler.yaml file to store configuration.
  On first run, settings are saved to this file.
  On subsequent runs, the file is used for defaults.

  Command-line flags override both yaml defaults and interactive prompts.

Examples:
  $ tyler init
      Interactive setup with prompts

  $ tyler init --style comprehensive
      Initialize with comprehensive documentation style

  $ tyler sync
      Generate documentation once

  $ tyler sync-forever
      Continuously improve documentation (recommended for initial docs)

  $ tyler help
      Show this help message`,
  );

program
  .command("init")
  .description("Initialize Tyler in your repository")
  .option("-r, --repo <path>", "Repository to document (default: ./)")
  .option("-o, --output-dir <path>", "Documentation output directory (default: docs)")
  .option("-s, --style <style>", "Documentation style: comprehensive, api-focused, tutorial, minimal")
  .option("--no-examples", "Skip code examples generation")
  .option("--no-github-pages", "Skip GitHub Pages setup")
  .addHelpText(
    "after",
    `
Initialize Tyler Doc Agent for your codebase. Creates an AI agent that explores
your code and generates comprehensive, high-quality documentation.

Documentation Styles:
  comprehensive  - Full coverage with architecture, API, guides, and examples (default)
  api-focused    - Detailed API reference with usage examples
  tutorial       - Step-by-step guides and tutorials
  minimal        - Essential documentation only

Examples:
  $ tyler init
      Interactive mode with prompts

  $ tyler init --style api-focused
      Generate API-focused documentation

  $ tyler init --repo ./my-project --output-dir documentation
      Custom repo and output directory

  $ tyler init --style comprehensive --no-examples
      Comprehensive docs without code examples

What it creates:
  - tyler.yaml - Configuration file
  - .tyler/prompt.md - Documentation generation prompt
  - .tyler/sync.sh - Single iteration script
  - .tyler/tyler-forever.sh - Continuous generation script
  - docs/_config.yml - Jekyll config (if GitHub Pages enabled)`,
  )
  .action((options) => {
    init({
      repo: options.repo,
      outputDir: options.outputDir,
      style: options.style,
      includeExamples: options.examples,
      generateGithubPages: options.githubPages,
    });
  });

program
  .command("sync")
  .description("Generate/update documentation once")
  .option("-r, --repo <path>", "Repository path (default: ./)")
  .option("--auto-push", "Automatically commit and push documentation changes")
  .addHelpText(
    "after",
    `
Run one iteration of documentation generation. The AI agent explores your codebase
and creates or updates documentation files.

Examples:
  $ tyler sync
      Generate documentation once

  $ tyler sync --auto-push
      Generate docs and automatically push changes

  $ tyler sync --repo ./my-project
      Generate docs for specific repository

What it does:
  - Explores codebase systematically
  - Creates/updates files in the configured output directory
  - Makes commits as it creates documentation sections
  - Use --auto-push to automatically push completed docs

Notes:
  - Requires 'tyler init' to be run first
  - Takes 3-10 minutes per iteration
  - Agent commits after each major section`,
  )
  .action((options) => sync({
    repo: options.repo,
    autoPush: options.autoPush,
  }));

program
  .command("sync-forever")
  .description("Continuously improve documentation")
  .option("-r, --repo <path>", "Repository path (default: ./)")
  .addHelpText(
    "after",
    `
Run documentation generation in a continuous loop. The AI agent will keep exploring
the codebase and improving documentation until you stop it with Ctrl+C.

This is useful for:
  - Initial documentation generation (let it run for 30-60 minutes)
  - Keeping docs up-to-date (run periodically)
  - Comprehensive coverage (agent explores different areas each iteration)

Examples:
  $ tyler sync-forever
      Start continuous documentation generation

  $ tyler sync-forever --repo ./my-project
      Generate docs continuously for specific repository

What to expect:
  - Agent explores codebase progressively
  - Commits changes after each major documentation section
  - Typical runtime: 30-60 minutes for comprehensive docs
  - Cost: ~$10.50/hour (Sonnet 4.5)
  - Agent usually stops itself when documentation is comprehensive

How to stop:
  - Press Ctrl+C anytime to stop gracefully
  - All changes are committed, safe to resume later

Notes:
  - Requires 'tyler init' to be run first
  - Recommended: Run for 30-60 minutes for initial docs
  - Can stop and resume anytime`,
  )
  .action((options) => syncForever({
    repo: options.repo,
  }));

program.parse();
