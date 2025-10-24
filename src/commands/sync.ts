import { execa } from "execa";
import chalk from "chalk";
import { promises as fs } from "fs";
import { join, resolve } from "path";

interface SyncOptions {
  repo?: string;
  autoPush?: boolean;
}

export async function sync(options: SyncOptions = {}): Promise<void> {
  const repo = options.repo || "./";
  const baseDir = repo && repo !== "./" ? resolve(process.cwd(), repo) : process.cwd();
  const scriptPath = join(baseDir, ".tyler", "sync.sh");

  // Check if sync.sh exists
  try {
    await fs.access(scriptPath);
  } catch {
    console.error(
      chalk.red(
        `Error: .tyler/sync.sh not found. Run 'tyler init' first.`,
      ),
    );
    process.exit(1);
  }

  console.log(chalk.cyan("Starting documentation generation...\n"));

  let processExited = false;
  let childProcess: any;

  // Handle Ctrl+C gracefully
  const signalHandler = async () => {
    if (processExited) return;
    processExited = true;

    console.log(chalk.yellow("\n\nStopping documentation sync..."));

    if (childProcess) {
      try {
        // Send SIGTERM to child process
        childProcess.kill("SIGTERM");

        // Wait a bit for graceful shutdown
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Force kill if still running
        if (!childProcess.killed) {
          childProcess.kill("SIGKILL");
        }
      } catch (error) {
        console.error(chalk.red("Error stopping process:"), error);
      }
    }

    console.log(chalk.yellow("Documentation sync stopped"));
    process.exit(0);
  };

  process.on("SIGINT", signalHandler);
  process.on("SIGTERM", signalHandler);

  try {
    childProcess = execa("bash", [scriptPath], {
      cwd: baseDir,
      stdio: "inherit",
    });

    await childProcess;

    if (!processExited) {
      console.log(chalk.green("\n✅ Documentation sync completed successfully!"));

      if (options.autoPush) {
        console.log(chalk.cyan("\nPushing documentation changes..."));
        try {
          await execa("git", ["add", "."], { cwd: baseDir });
          await execa(
            "git",
            ["commit", "-m", "docs: Update documentation via repomirror"],
            { cwd: baseDir }
          );
          await execa("git", ["push"], { cwd: baseDir });
          console.log(chalk.green("✅ Documentation pushed successfully!"));
        } catch (error) {
          console.log(
            chalk.yellow("⚠ Could not push changes (no changes to commit or push failed)")
          );
        }
      }
    }
  } catch (error: any) {
    if (!processExited) {
      if (error.signal === "SIGTERM" || error.signal === "SIGINT") {
        console.log(chalk.yellow("\nDocumentation sync interrupted"));
      } else {
        console.error(chalk.red("\n✖ Documentation sync failed"));
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    }
  } finally {
    process.off("SIGINT", signalHandler);
    process.off("SIGTERM", signalHandler);
  }
}
