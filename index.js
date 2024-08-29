const core = require("@actions/core");
const exec = require("@actions/exec");

async function run() {
  try {
    const pizzaArgs = core.getInput("pizza-args");
    const args = pizzaArgs.split(/\s+/).filter((arg) => arg.length > 0);

    console.log("Running Pizza CLI with args:", args);
    await exec.exec("pizza", args);

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
