You are updating the project's living documentation after a feature or issue has been completed.

## Steps

1. **Detect what changed**: Run `git diff dev...HEAD --stat` and `git log dev..HEAD --oneline` to understand what was built in the current feature branch.

2. **Update `changelog.md`**:
   - Add entries under `## [Unreleased]` with the appropriate category (`### Added`, `### Changed`, `### Fixed`)
   - Be concise — one line per meaningful change
   - Reference issue numbers where applicable

3. **Update `project-status.md`**:
   - Mark completed tasks as `Done` in the milestone tables
   - Update the "Where We Left Off" section with current state

4. **Update `architecture.md`** (only if needed):
   - If new components were added, ensure they appear in the component tree
   - If new architectural decisions were made, add to the decisions log
   - If folder structure changed, update it
   - Skip this if no structural changes were made

5. **Commit the doc updates**:
   - Stage only the doc files: `changelog.md`, `project-status.md`, `architecture.md`
   - Commit with message: `docs: update living docs for [brief description]`

## Rules
- Do NOT modify any source code — only documentation files
- Do NOT invent changes that didn't happen — only document what `git diff` shows
- Keep entries concise — one line per change
- Always reference issue numbers when known
