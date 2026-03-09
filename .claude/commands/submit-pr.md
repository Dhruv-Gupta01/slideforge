You are helping a developer submit a PR for their completed feature branch.

## Steps

1. **Check status**: Run `git status` and `git diff dev...HEAD --stat` to see all changes

2. **Verify build**: Run `bun run build` and `bun run lint` — do NOT proceed if either fails

3. **Update docs**: Run the same steps as `/update-docs` — update changelog.md, project-status.md, and architecture.md if needed. Commit doc changes.

4. **Push branch**: `git push -u origin <current-branch>`

5. **Create PR**:
   - Base branch: `dev`
   - Title: concise, under 70 chars, prefixed with `feat:`, `fix:`, or `chore:`
   - Body: summary bullets, issue references (Closes #X), and test plan checklist
   - Use: `gh pr create --base dev --title "..." --body "..."`

6. **Report**: Share the PR URL with the developer

## Rules
- Never create a PR if build or lint fails
- Always target `dev` branch, never `main`
- Always include issue references in PR body
- Always include a test plan
