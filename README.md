# OpenSauced Pizza GitHub Action

This action runs the OpenSauced pizza CLI in a GitHub Action workflow.

## About the Pizza CLI

For more information about the pizza-cli. check out the OpenSauced [pizza-cli](https://github.com/open-sauced/pizza-cli) repository.

## Usage

To use this action, you need to add the following to a GitHub Actions workflow file. The YAML snippet below uses the command to update your CODEOWNERS file in your repository, but replace it with whatever pizza-cli command you want to run.

```yaml
name: OpenSauced Pizza Action

on:
  schedule:
    # Run once a week on Sunday at 00:00 UTC
    - cron: "0 0 * * 0"
  workflow_dispatch: # Allow manual triggering

jobs:
  pizza-action:
    runs-on: ubuntu-latest
    steps:
      - name: Pizza Action
        uses: open-sauced/pizza-action@v1.0.0
        with:
          # optional and false by default
          commit-and-push: "true"
```

We suggest you add this to a workflow file in the `.github/workflows` directory of your repository and call it something like `pizza-action.yml`.

Depending on the pizza CLI command you run, different things will update. For example, if you run `pizza generate codeowners ./`, it will update the CODEOWNERS file in the root of your repository.

The pizza CLI's "generate codeowners ./" command requires a full repository history to accurately determine code ownership over time. Fetch-depth is set to 0 in this action to ensure all historical commits are available, allowing the command to analyze the entire project timeline and produce a comprehensive CODEOWNERS file.

## Inputs

### `pizza-args`

Arguments to pass to the pizza CLI. Default is `generate codeowners ./`.

### `commit-and-push`

Whether to commit and push the changes made by the pizza-cli. Default is `false`.
