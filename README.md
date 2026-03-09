# SlideForge

Browser-based presentation tool. Create slides with text, images, and shapes. Drag-and-drop editing with fullscreen presentation mode.

**Live:** [https://slideforge.vercel.app](https://slideforge.vercel.app)

## Features

- 16:9 slide canvas with drag-and-drop elements
- Text, image, and shape blocks
- Style panel: font size, color, weight, opacity, alignment, border radius
- Element z-ordering (bring forward / send backward)
- Slide panel with thumbnails, add/delete/reorder
- Fullscreen presentation mode with fade and slide transitions
- Theme picker with preset themes and background colors
- Keyboard shortcuts: Delete, Ctrl+D (duplicate), Ctrl+Z (undo), Ctrl+Shift+Z (redo), Escape (deselect)
- Undo/redo history

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Zustand 5
- react-rnd 10
- lucide-react

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
bun run build
```
