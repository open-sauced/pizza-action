const core = require("@actions/core");
const exec = require("@actions/exec");

function parseArgs(input) {
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  let args = [];
  let match;

  while ((match = regex.exec(input))) {
    if (match[1]) args.push(match[1]); // Quoted with "
    else if (match[2]) args.push(match[2]); // Quoted with '
    else args.push(match[0]); // Unquoted
  }

  return args;
}

async function run() {
  try {
    const pizzaArgs = parseArgs(core.getInput("pizza-args") ?? "");

    console.log("Running Pizza CLI with args:", pizzaArgs);
    await exec.exec("pizza", pizzaArgs);

    // Add and commit changes
    await exec.exec("git config --global user.name github-actions");
    await exec.exec("git config --global user.email github-actions@github.com");
    await exec.exec("git add .");
    await exec.exec('git commit -m "Auto-commit from OpenSauced Pizza Action"');
    await exec.exec("git push");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
