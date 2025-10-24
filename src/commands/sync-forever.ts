import { execa } from "execa";
import chalk from "chalk";
import { promises as fs } from "fs";
import { join, resolve } from "path";

interface SyncForeverOptions {
  repo?: string;
}

export async function syncForever(
  options: SyncForeverOptions = {},
): Promise<void> {
  const repo = options.repo || "./";
  const baseDir = repo && repo !== "./" ? resolve(process.cwd(), repo) : process.cwd();
  const scriptPath = join(baseDir, ".tyler", "tyler-forever.sh");

  // Check if tyler-forever.sh exists
  try {
    await fs.access(scriptPath);
  } catch {
    console.error(
      chalk.red(
        `Error: .tyler/tyler-forever.sh not found. Run 'tyler init' first.`,
      ),
    );
    process.exit(1);
  }

  console.log(chalk.cyan("Starting continuous documentation generation...\n"));
  console.log(
    chalk.yellow(
      "This will run forever, improving documentation until you stop it with Ctrl+C\n",
    ),
  );

  let processExited = false;
  let childProcess: any;

  // Handle Ctrl+C gracefully
  const signalHandler = async () => {
    if (processExited) return;
    processExited = true;

    console.log(chalk.yellow("\n\nStopping continuous documentation sync..."));

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
