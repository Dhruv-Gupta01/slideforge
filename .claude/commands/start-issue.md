You are helping a developer start working on a GitHub issue.

## Steps

1. **Ask which issue number** to work on (if not provided as argument: $ARGUMENTS)

2. **Read the issue**: Run `gh issue view <number>` to understand requirements

3. **Create a feature branch**:
   - Ensure you're on `dev` and it's up to date: `git checkout dev && git pull`
   - Create branch: `git checkout -b feature/<issue-number>-<short-description>`

4. **Summarize the plan**: Tell the developer:
   - What the issue requires
   - Which files need to be created or modified
   - Any dependencies on other issues
   - Suggested implementation approach

5. **Do NOT start coding** — wait for the developer to confirm the plan

## Rules
- Branch naming: `feature/{issue-number}-{short-description}`
- Always branch from `dev`, never from `main`
- Always pull latest `dev` before branching
