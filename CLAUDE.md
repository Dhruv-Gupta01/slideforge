# SlideForge — Claude Code Context

## Project Goal

Browser-based presentation tool (like PowerPoint). Solo use, no persistence, no auth. Create slides with text/images/shapes, drag-and-drop editing, fullscreen presentation mode.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand 5 (with temporal middleware for undo/redo)
- **Drag/Resize**: react-rnd 10
- **Icons**: lucide-react
- **Deploy**: Vercel
- **Package Manager**: bun

## Architecture

- Fully client-side — no API routes, no database, no server state
- Single page app at `/` — editor is the entire UI
- 16:9 canvas with CSS `transform: scale()` for responsive sizing
- All element coordinates stored in canvas-relative units (1920x1080 virtual canvas)
- Images stored as data URLs in element content field
- See [architecture.md](./architecture.md) for component details

## Key Specs

- See [project-spec.md](./project-spec.md) for full product requirements and data model

## Git Rules

- **Never commit directly to `main` or `dev`**
- Always work on a feature branch: `feature/{issue-number}-{short-description}`
- All code goes through PR — human review required
- Update `changelog.md` and `architecture.md` when completing a feature
- Update `project-status.md` when a milestone item is completed

## Branch Strategy

- `main` — protected, deploys only, PRs from `dev`
- `dev` — integration branch, feature branches merge here
- `feature/*` — one branch per issue, Claude only commits here

## Commands

```bash
bun dev          # Start dev server (http://localhost:3000)
bun run build    # Production build
bun run lint     # Run ESLint
```

## Conventions

- Use plan mode before starting any new feature implementation
- Components go in `src/components/`
- All state lives in `src/store/useSlideStore.ts` — no local component state for slide data
- Types go in `src/types/index.ts`
- Use Tailwind utility classes — no custom CSS unless absolutely necessary
- Double-click to edit text, single-click to select for move/resize
- Keep components focused — one file per component, under 150 lines
- No `console.log` in committed code
- Prefer `lucide-react` icons over custom SVGs

## Team

| Role      | Owns |
|-----------|------|
| Dev 1     | Editor core: SlideCanvas, CanvasElement, TextBlock, ImageBlock, ShapeBlock, Toolbar |
| Dev 2     | Slides + presentation: SlidePanel, SlideThumbnail, PresentationMode, transitions, themes |
| Tech Lead | Scaffold, CLAUDE.md, store, types, StylePanel, undo/redo, deploy, PR reviews |
