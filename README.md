# SlideForge

A browser-based presentation tool for creating, editing, and presenting slide decks — fast, minimal, no sign-up required.

**[Live Demo](https://slideforge-git-feature-re-0659a4-dhruv-guptas-projects-f8066440.vercel.app/)**

## What is SlideForge?

SlideForge is a lightweight alternative to PowerPoint and Google Slides. It runs entirely in your browser with drag-and-drop editing, preset themes, fullscreen presentations, and real-time collaboration — all without creating an account or uploading anything to the cloud.

### Key Features

- **Drag-and-drop editor** — Add text, images, and shapes to a 16:9 canvas. Move, resize, and style elements freely.
- **Fullscreen presentation mode** — Present with keyboard navigation, slide transitions (fade/slide), and auto-scaling to any screen size.
- **Preset themes** — Switch between Light, Dark, Ocean, and Warm themes with one click.
- **Real-time collaboration** — Edit slides together with others using shared room links. Powered by Yjs CRDTs + PartyKit WebSockets.
- **User presence** — See collaborator cursors, names, and colors in real time.
- **Zero setup** — No accounts, no cloud storage, no installations. Just open and start creating.

## Screenshots

> Open the [live demo](https://slideforge-git-feature-re-0659a4-dhruv-guptas-projects-f8066440.vercel.app/) to try it out.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (with temporal middleware for undo/redo) |
| Drag & Resize | react-rnd |
| Real-time Sync | Yjs + y-partykit |
| WebSocket Server | PartyKit (Cloudflare Durable Objects) |
| Icons | lucide-react |
| Deployment | Vercel (frontend) + PartyKit (WebSocket server) |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- Node.js 18+

### Installation

```bash
git clone https://github.com/Dhruv-Gupta01/aidlc-workflows.git
cd slideforge
bun install
```

### Development

Start the Next.js dev server:

```bash
bun dev
```

To enable real-time collaboration locally, run the PartyKit dev server in a separate terminal:

```bash
bun run dev:partykit
```

Then open [http://localhost:3000](http://localhost:3000).

### Build

```bash
bun run build
```

### Lint

```bash
bun run lint
```

## Architecture

```
src/
├── app/                  # Next.js App Router (single page)
├── components/           # UI components (Toolbar, SlideCanvas, StylePanel, etc.)
├── data/
│   ├── store/            # Zustand store — all slide state + actions
│   └── sync/             # Yjs sync layer (CRDT ↔ Zustand bridge)
├── lib/                  # Defaults, themes, utilities
└── types/                # TypeScript type definitions
```

### How It Works

- **Fully client-side** — no API routes, no database. All presentation data lives in a Zustand store in memory.
- **16:9 virtual canvas** (1920x1080) — scales responsively via CSS `transform: scale()`. All element coordinates are stored in canvas-relative units.
- **Text editing** — single-click to select (move/resize), double-click to edit inline via `contentEditable`.
- **Images** — uploaded as data URLs, stored inline in element state. No server upload.
- **Thumbnails** — rendered via CSS `transform: scale(0.15)` on actual slide content. No separate canvas rendering.

### Real-Time Collaboration

```
Browser A (Vercel)  ←→  PartyKit Server (Cloudflare Edge)  ←→  Browser B (Vercel)
```

- **Yjs CRDT** handles conflict-free merging of concurrent edits
- **PartyKit** provides the WebSocket relay + persistent room state on Cloudflare's edge
- **Awareness protocol** broadcasts user presence (cursors, names, colors)

See [partykit-deployment.md](./partykit-deployment.md) for deployment details.

## Project Documentation

| Document | Description |
|----------|-------------|
| [architecture.md](./architecture.md) | Component tree, state management, key design decisions |
| [project-spec.md](./project-spec.md) | Full product requirements and data model |
| [partykit-deployment.md](./partykit-deployment.md) | PartyKit deployment architecture and commands |
| [changelog.md](./changelog.md) | Feature changelog |
| [project-status.md](./project-status.md) | Milestone tracking |

## License

This project is for educational purposes.
