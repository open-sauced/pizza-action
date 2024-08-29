const core = require("@actions/core");
const exec = require("@actions/exec");
const fs = require("fs").promises;
const path = require("path");

function stripQuotes(input) {
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  let args = [];
  let match;

  while ((match = regex.exec(input))) {
    if (match[1]) args.push(match[1]); // Was quoted with "
    else if (match[2]) args.push(match[2]); // Was quoted with '
    else args.push(match[0]); // Was not quoted
  }

  return args;
}

async function run() {
  try {
    const pizzaArgs = core.getInput("pizza-args");
    console.log("Raw pizza-args:", pizzaArgs);

    const args = stripQuotes(pizzaArgs);
    console.log("Stripped args:", args);

    // Create a temporary bash script
    const scriptContent = `#!/bin/bash
set -e
pizza ${args.join(" ")}
`;
    console.log("Bash script content:", scriptContent);

    const scriptPath = path.join(process.cwd(), "run_pizza.sh");
    await fs.writeFile(scriptPath, scriptContent);
    await fs.chmod(scriptPath, "0755"); // Make the script executable

    // Execute the bash script
    console.log("Executing bash script...");
    await exec.exec(`bash ${scriptPath}`);

    // Remove the temporary script
    await fs.unlink(scriptPath);

    // Add and commit changes
    await exec.exec("git config --global user.name github-actions");
    await exec.exec("git config --global user.email github-actions@github.com");
    await exec.exec("git add .");
    await exec.exec('git commit -m "Auto-commit from OpenSauced Pizza Action"');
    await exec.exec("git push");
  } catch (error) {
    console.error("Error:", error);
    core.setFailed(error.message);
  }
}

run();
