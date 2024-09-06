#!/bin/bash

PR_TITLE="$CUSTOM_PR_TITLE"
BRANCH_NAME="chore_automated_open-sauced-updates_$(date +%s)"

git checkout -b "$BRANCH_NAME"

# There are potentially multiple files to add from the pizza CLI output
git add .

# Check if there are any changes to commit
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Creating PR \"$PR_TITLE\" for branch "$BRANCH_NAME""
  git commit -m "$PR_TITLE"
  git push origin "$BRANCH_NAME"

  # Attempt to create the PR (dry run)
  if gh pr create --title "$PR_TITLE" --body "This is an automated PR generated by the OpenSauced pizza-action." --dry-run; then
    # If dry run is successful, create the actual PR
    PR_URL=$(gh pr create --title "$PR_TITLE" --body "This is an automated PR generated by the OpenSauced pizza-action.")
    echo "PR created successfully: $PR_URL"
  else
    echo "Failed to create PR. There might be an issue with branch permissions or other repository settings."
  fi
else
  # Shouldn't end up here, but log that there was nothing to sync
  echo "Looks like there was nothing to update."
fi
