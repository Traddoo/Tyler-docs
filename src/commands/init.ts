import { promises as fs } from "fs";
import path, { join, basename, resolve } from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { query } from "@anthropic-ai/claude-code";
import { execa } from "execa";
import yaml from "yaml";

interface DocInitOptions {
  repo: string;
  outputDir: string;
  style: "comprehensive" | "api-focused" | "tutorial" | "minimal";
  includeExamples: boolean;
  generateGithubPages: boolean;
}

interface DocConfig {
  repo: string;
  outputDir: string;
  style: string;
  includeExamples: boolean;
  generateGithubPages: boolean;
  siteTitle?: string;
  siteDescription?: string;
}

async function loadExistingDocConfig(repo?: string): Promise<Partial<DocConfig> | null> {
  try {
    const baseDir = repo && repo !== "./"
      ? resolve(process.cwd(), repo)
      : process.cwd();
    const configPath = join(baseDir, "tyler.yaml");
    const configContent = await fs.readFile(configPath, "utf-8");
    return yaml.parse(configContent) as DocConfig;
  } catch {
    return null;
  }
}

async function saveDocConfig(config: DocConfig, repo?: string): Promise<void> {
  const baseDir = repo && repo !== "./"
    ? resolve(process.cwd(), repo)
    : process.cwd();
  await fs.mkdir(baseDir, { recursive: true });
  const configPath = join(baseDir, "tyler.yaml");
  const configContent = yaml.stringify(config);
  await fs.writeFile(configPath, configContent, "utf-8");
}

export async function init(cliOptions?: Partial<DocInitOptions>): Promise<void> {
  console.log(
    chalk.cyan("🤖 Tyler Doc Agent - AI-Powered Documentation Generator\n"),
  );
  console.log(
    chalk.white("I'll help you generate comprehensive documentation for your codebase:\n"),
  );

  const repoPath = cliOptions?.repo || "./";
  const existingConfig = await loadExistingDocConfig(repoPath);

  if (existingConfig) {
    console.log(
      chalk.yellow("Found existing tyler.yaml, using as defaults\n"),
    );
  }

  const currentDir = process.cwd();
  const repoName = basename(currentDir);

  const defaults = {
    repo: cliOptions?.repo || existingConfig?.repo || "./",
    outputDir: cliOptions?.outputDir || existingConfig?.outputDir || "docs",
    style: cliOptions?.style || existingConfig?.style || "comprehensive",
    includeExamples: cliOptions?.includeExamples ?? existingConfig?.includeExamples ?? true,
    generateGithubPages: cliOptions?.generateGithubPages ?? existingConfig?.generateGithubPages ?? true,
  };

  const answers = await inquirer.prompt<DocInitOptions>([
    {
      type: "input",
      name: "repo",
      message: "Repository to document:",
      default: defaults.repo,
      when: !cliOptions?.repo,
    },
    {
      type: "input",
      name: "outputDir",
      message: "Documentation output directory:",
      default: defaults.outputDir,
      when: !cliOptions?.outputDir,
    },
    {
      type: "list",
      name: "style",
      message: "Documentation style:",
      choices: [
        { name: "Comprehensive - Full coverage with architecture, API, guides, and examples", value: "comprehensive" },
        { name: "API-Focused - Detailed API reference with usage examples", value: "api-focused" },
        { name: "Tutorial - Step-by-step guides and tutorials", value: "tutorial" },
        { name: "Minimal - Essential documentation only", value: "minimal" },
      ],
      default: defaults.style,
      when: !cliOptions?.style,
    },
    {
      type: "confirm",
      name: "includeExamples",
      message: "Generate code examples and usage patterns?",
      default: defaults.includeExamples,
      when: cliOptions?.includeExamples === undefined,
    },
    {
      type: "confirm",
      name: "generateGithubPages",
      message: "Setup GitHub Pages deployment?",
      default: defaults.generateGithubPages,
      when: cliOptions?.generateGithubPages === undefined,
    },
  ]);

  const siteAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "siteTitle",
      message: "Site title for GitHub Pages:",
      default: `${repoName} Documentation`,
      when: answers.generateGithubPages || defaults.generateGithubPages,
    },
    {
      type: "input",
      name: "siteDescription",
      message: "Site description:",
      default: `Comprehensive documentation for ${repoName}`,
      when: answers.generateGithubPages || defaults.generateGithubPages,
    },
  ]);

  const finalConfig: DocConfig = {
    repo: cliOptions?.repo || answers.repo,
    outputDir: cliOptions?.outputDir || answers.outputDir,
    style: cliOptions?.style || answers.style,
    includeExamples: cliOptions?.includeExamples ?? answers.includeExamples,
    generateGithubPages: cliOptions?.generateGithubPages ?? answers.generateGithubPages,
    siteTitle: siteAnswers.siteTitle,
    siteDescription: siteAnswers.siteDescription,
  };

  // Save configuration
  await saveDocConfig(finalConfig, finalConfig.repo);
  console.log(chalk.green("\n✅ Saved configuration to tyler.yaml"));

  // Perform preflight checks
  await performDocPreflightChecks(finalConfig.repo);

  // Generate documentation prompt
  console.log(chalk.cyan("\nGenerating documentation prompt..."));

  try {
    const optimizedPrompt = await generateDocumentationPrompt(finalConfig);
    console.log(chalk.green("✔ Generated documentation prompt"));

    // Create .repomirror directory and files
    await createDocMirrorFiles(finalConfig, optimizedPrompt);

    console.log(chalk.green("\n✅ Tyler Doc Agent initialized successfully!"));
    console.log(chalk.cyan("\nNext steps:"));
    console.log(
      chalk.white(
        "run `tyler sync` - Generate/update documentation once",
      ),
    );
    console.log("");
    console.log(
      chalk.white(
        "run `tyler sync-forever` - Continuously improve documentation",
      ),
    );
    console.log("");
    console.log(chalk.white("Files created:"));
    console.log(chalk.white("- .tyler/prompt.md"));
    console.log(chalk.white("- .tyler/sync.sh"));
    console.log(chalk.white("- .tyler/tyler-forever.sh"));
    if (finalConfig.generateGithubPages) {
      console.log(chalk.white("- .tyler/deploy-docs.sh"));
      console.log(chalk.white("- docs/_config.yml (Jekyll config)"));
    }
  } catch (error) {
    console.log(chalk.red("✖ Failed to generate documentation prompt"));
    console.error(
      chalk.red(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
    process.exit(1);
  }
}

async function performDocPreflightChecks(repo: string): Promise<void> {
  console.log(chalk.cyan("\n🔍 Performing preflight checks...\n"));

  const repoDir = repo && repo !== "./" ? resolve(process.cwd(), repo) : process.cwd();

  // Check if repo directory exists
  console.log(chalk.white("1. Checking if repository directory exists..."));
  const dirSpinner = ora(`   Accessing ${repo}`).start();
  try {
    await fs.access(repoDir);
    dirSpinner.succeed(`   Repository directory ${chalk.green(repo)} exists`);
  } catch {
    dirSpinner.fail(`   Repository directory ${chalk.red(repo)} does not exist`);
    process.exit(1);
  }

  // Check if it's a git repo
  console.log(chalk.white("2. Checking if directory is a git repository..."));
  const gitSpinner = ora(`   Verifying git repository in ${repo}`).start();
  try {
    await execa("git", ["rev-parse", "--git-dir"], { cwd: repoDir });
    gitSpinner.succeed(`   Git repository found`);
  } catch {
    gitSpinner.warn(
      `   ${chalk.yellow("Not a git repository - documentation will still work but git integration features will be limited")}`,
    );
  }

  // Check if Claude Code is configured
  if (process.env.SKIP_CLAUDE_TEST === "true") {
    console.log(chalk.yellow("3. Skipping Claude Code test (test mode)"));
  } else {
    console.log(chalk.white("3. Testing Claude Code configuration..."));
    const claudeSpinner = ora("   Running Claude Code test command").start();
    try {
      const { stdout } = await execa("claude", ["-p", "say hi"], {
        timeout: 30000,
        input: "",
      });
      if (!stdout || stdout.trim().length < 10) {
        claudeSpinner.fail("   Claude Code test failed");
        process.exit(1);
      }
      claudeSpinner.succeed("   Claude Code is working correctly");
    } catch (error) {
      claudeSpinner.fail("   Claude Code is not properly configured");
      console.log(chalk.red("   Please run `claude` to set up your profile"));
      process.exit(1);
    }
  }

  console.log(chalk.green("\n✅ All preflight checks passed!\n"));
}

async function generateDocumentationPrompt(config: DocConfig): Promise<string> {
  if (process.env.SKIP_CLAUDE_TEST === "true") {
    return generateTestDocPrompt(config);
  }

  const styleDescriptions = {
    comprehensive: "comprehensive documentation covering architecture, API reference, guides, tutorials, and examples",
    "api-focused": "detailed API reference documentation with usage examples and best practices",
    tutorial: "step-by-step tutorials and guides for common use cases",
    minimal: "essential documentation covering core concepts and basic usage",
  };

  const metaPrompt = `Your task is to generate an optimized prompt for a documentation agent. This agent will explore a codebase and create high-quality, comprehensive documentation.

The documentation should be BETTER than platforms like Mintlify - more coherent, better organized, and more useful for developers.

<requirements>
Repository: ${config.repo}
Output Directory: ${config.outputDir}
Style: ${styleDescriptions[config.style as keyof typeof styleDescriptions]}
Include Examples: ${config.includeExamples ? "Yes" : "No"}
GitHub Pages: ${config.generateGithubPages ? "Yes" : "No"}
${config.siteTitle ? `Site Title: ${config.siteTitle}` : ""}
${config.siteDescription ? `Site Description: ${config.siteDescription}` : ""}
</requirements>

<example_prompts>
Example 1 (Comprehensive):
Your job is to create and maintain comprehensive documentation for this codebase in the docs/ directory.

DOCUMENTATION STRUCTURE:
1. docs/index.md - Overview and quick start
2. docs/architecture/ - System architecture and design decisions
3. docs/api/ - Detailed API reference
4. docs/guides/ - How-to guides and tutorials
5. docs/examples/ - Code examples and usage patterns
6. docs/contributing/ - Contributing guidelines

DOCUMENTATION PRINCIPLES:
- Be thorough but concise - every word should add value
- Include working code examples that developers can copy-paste
- Explain the "why" not just the "what"
- Create clear diagrams for complex flows (use mermaid syntax)
- Keep documentation cohesive - link related concepts
- Update docs/ directory incrementally, commit after each major documentation file

WORKFLOW:
1. Explore the codebase systematically - understand architecture, components, APIs
2. Create documentation structure in docs/
3. Generate comprehensive documentation files
4. Add code examples that actually work
5. Create navigation and cross-references
6. Set up GitHub Pages with _config.yml
7. Commit and push changes

Use docs/.agent/ as your scratchpad for exploration notes and TODO tracking.

Example 2 (API-Focused):
Your job is to create detailed API reference documentation for this codebase.

Focus on documenting:
- Public APIs and their usage
- Function signatures with parameter descriptions
- Return types and error handling
- Code examples for each major API
- Best practices and common patterns

Create docs/ directory with:
- docs/index.md - API overview
- docs/api/ - Organized API reference
- docs/examples/ - Usage examples

Make commits after documenting each major API or module.
</example_prompts>

Your job: Generate a prompt matching this format that will guide a Claude Code agent to create exceptional documentation for the specified repository. The prompt should be clear, actionable, and result in documentation that surpasses typical auto-generated docs.

Explore the repository CURSORILY to understand its structure and purpose. Use ONLY read tools (Read, Glob, Grep). Don't use subagents.

Respond with EXACTLY the prompt and nothing else.`;

  let result = "";
  let toolCallCount = 0;
  let queryAborted = false;

  const signalHandler = () => {
    console.log(chalk.yellow("\n\nStopping prompt generation..."));
    queryAborted = true;
    process.exit(0);
  };

  process.on('SIGINT', signalHandler);
  process.on('SIGTERM', signalHandler);

  try {
    for await (const message of query({ prompt: metaPrompt })) {
      if (queryAborted) break;

      if (message.type === "assistant" && (message as any).message?.content?.[0]?.name) {
        const toolName = (message as any).message.content[0].name;
        const toolInput = (message as any).message.content[0].input;
        toolCallCount++;

        let toolDisplay = `  ${chalk.cyan(toolName)}`;

        if (toolInput?.file_path) {
          toolDisplay += `(${chalk.green(toolInput.file_path)})`;
        } else if (toolInput?.pattern) {
          toolDisplay += `(${chalk.green(`"${toolInput.pattern}"`)})`;
        }

        console.log(toolDisplay);
      }

      if (message.type === "result") {
        if (message.is_error) {
          throw new Error((message as any).result || "Claude SDK error");
        }
        result = (message as any).result || "";
        break;
      }
    }
  } finally {
    process.off('SIGINT', signalHandler);
    process.off('SIGTERM', signalHandler);
  }

  if (toolCallCount > 0) {
    console.log(chalk.gray(`  Analyzed codebase with ${toolCallCount} tool calls`));
  }

  if (!result) {
    throw new Error("Failed to generate documentation prompt");
  }

  return result;
}

function generateTestDocPrompt(config: DocConfig): string {
  return `Your job is to create comprehensive documentation for the ${config.repo} repository in the ${config.outputDir}/ directory.

Create documentation with the following structure:
- ${config.outputDir}/index.md - Overview and getting started
- ${config.outputDir}/architecture/ - Architecture documentation
- ${config.outputDir}/api/ - API reference
- ${config.outputDir}/guides/ - User guides

${config.includeExamples ? "Include working code examples throughout the documentation." : ""}

${config.generateGithubPages ? `Setup GitHub Pages with Jekyll configuration.
Site Title: ${config.siteTitle}
Site Description: ${config.siteDescription}` : ""}

Make a commit after creating each major documentation section.

Use ${config.outputDir}/.agent/ as a scratchpad for your work.`;
}

async function createDocMirrorFiles(
  config: DocConfig,
  optimizedPrompt: string,
): Promise<void> {
  const baseDir = config.repo && config.repo !== "./"
    ? resolve(process.cwd(), config.repo)
    : process.cwd();
  const tylerDir = join(baseDir, ".tyler");

  await fs.mkdir(tylerDir, { recursive: true });

  // Create prompt.md
  await fs.writeFile(join(tylerDir, "prompt.md"), optimizedPrompt);

  // Get template directory
  const templateDir = await getTemplateDir();

  // Create sync.sh from template
  const syncTemplate = await fs.readFile(
    join(templateDir, "sync.sh.template"),
    "utf8"
  );
  const syncScript = syncTemplate
    .replace(/\${repo}/g, config.repo)
    .replace(/\${outputDir}/g, config.outputDir);
  await fs.writeFile(join(tylerDir, "sync.sh"), syncScript, {
    mode: 0o755,
  });

  // Create tyler-forever.sh from template
  const foreverTemplate = await fs.readFile(
    join(templateDir, "tyler-forever.sh.template"),
    "utf8"
  );
  await fs.writeFile(join(tylerDir, "tyler-forever.sh"), foreverTemplate, {
    mode: 0o755,
  });

  // Create GitHub Pages deployment script if requested
  if (config.generateGithubPages) {
    const deployTemplate = await fs.readFile(
      join(templateDir, "deploy-docs.sh.template"),
      "utf8"
    );
    const deployScript = deployTemplate.replace(/\${outputDir}/g, config.outputDir);
    await fs.writeFile(join(tylerDir, "deploy-docs.sh"), deployScript, {
      mode: 0o755,
    });

    // Create Jekyll _config.yml
    const docsDir = join(baseDir, config.outputDir);
    await fs.mkdir(docsDir, { recursive: true });

    const jekyllConfig = `title: ${config.siteTitle}
description: ${config.siteDescription}
theme: jekyll-theme-cayman
markdown: kramdown
plugins:
  - jekyll-relative-links
relative_links:
  enabled: true
  collections: true
include:
  - README.md
`;
    await fs.writeFile(join(docsDir, "_config.yml"), jekyllConfig);
  }

  // Create .gitignore for .tyler if it doesn't exist
  const gitignoreContent = `# Tyler Doc Agent runtime files
claude_output.jsonl
*.log
`;
  await fs.writeFile(
    join(tylerDir, ".gitignore"),
    gitignoreContent,
  );
}

async function getTemplateDir(): Promise<string> {
  try {
    const packageRoot = path.dirname(path.dirname(__dirname));
    const distTemplateDir = join(packageRoot, "dist", "templates");
    await fs.access(distTemplateDir);
    return distTemplateDir;
  } catch {
    const packageRoot = path.dirname(path.dirname(__dirname));
    const srcTemplateDir = join(packageRoot, "src", "templates");
    try {
      await fs.access(srcTemplateDir);
      return srcTemplateDir;
    } catch {
      throw new Error(`Could not find templates directory`);
    }
  }
}
