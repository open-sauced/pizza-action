const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

async function run() {
  try {
    const token = core.getInput("github-token");
    const pizzaArgs = core.getInput("pizza-args");

    // Run the pizza CLI command using the given pizza arguments
    const { execSync } = require("child_process");
    execSync(`pizza ${pizzaCommand}`);

    // Commit and push changes
    const octokit = github.getOctokit(token);
    const { repo, owner } = github.context.repo;

    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${github.context.ref.replace("refs/heads/", "")}`,
    });

    const { data: commitData } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: refData.object.sha,
    });

    const { data: blobData } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: fs.readFileSync(outputPath, { encoding: "base64" }),
      encoding: "base64",
    });

    const { data: treeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: commitData.tree.sha,
      tree: [
        {
          path: outputPath,
          mode: "100644",
          type: "blob",
          sha: blobData.sha,
        },
      ],
    });

    const { data: newCommitData } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Automated pizza update for command ${pizzaCommand}`,
      tree: treeData.sha,
      parents: [commitData.sha],
    });

    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${github.context.ref.replace("refs/heads/", "")}`,
      sha: newCommitData.sha,
    });

    console.log("Changes committed and pushed successfully");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
