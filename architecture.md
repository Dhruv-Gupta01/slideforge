# SlideForge — Architecture

## System Overview

SlideForge is a fully client-side Next.js application. There is no backend, no database, and no server state. All presentation data lives in a Zustand store in memory.

## Component Tree

```
App (page.tsx)
├── Toolbar              — top bar: add text/image/shape, theme picker, present button
├── WorkspaceLayout      — horizontal split container
│   ├── SlidePanel       — left sidebar
│   │   └── SlideThumbnail[]  — mini previews, click to select, drag to reorder
│   └── SlideCanvas      — main 16:9 editing canvas
│       └── CanvasElement[]   — react-rnd wrapper per element
│           ├── TextBlock
│           ├── ImageBlock
│           └── ShapeBlock
├── StylePanel           — element properties (font, color, opacity)
└── PresentationMode     — fullscreen overlay with keyboard navigation
```

## State Management

Single Zustand store (`src/store/useSlideStore.ts`) holds all application state:

- `slides[]` — array of slide objects
- `currentSlideIndex` — which slide is active in the editor
- `isPresenting` — toggles presentation mode
- `selectedElementId` — currently selected element (for styling/deletion)

Actions: `addSlide`, `deleteSlide`, `reorderSlides`, `addElement`, `updateElement`, `deleteElement`, `setBackground`, etc.

Undo/redo via Zustand temporal middleware — stores state snapshots automatically.

## Canvas Scaling

The editor canvas represents a virtual 1920x1080 space. It scales to fit the editor viewport using CSS `transform: scale(factor)` where `factor = min(containerWidth/1920, containerHeight/1080)`.

All element positions (x, y, width, height) are stored in virtual canvas units, not screen pixels.

## Slide Thumbnails

Thumbnails are rendered by wrapping the actual slide content in a container with `transform: scale(0.15)` and `overflow: hidden`. No separate canvas rendering.

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Toolbar.tsx
│   ├── SlidePanel.tsx
│   ├── SlideThumbnail.tsx
│   ├── SlideCanvas.tsx
│   ├── CanvasElement.tsx
│   ├── TextBlock.tsx
│   ├── ImageBlock.tsx
│   ├── ShapeBlock.tsx
│   ├── StylePanel.tsx
│   └── PresentationMode.tsx
├── store/
│   └── useSlideStore.ts
├── lib/
│   ├── defaults.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Key Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| State library | Zustand | Lightweight, supports undo/redo middleware, no boilerplate |
| Drag/resize | react-rnd | Battle-tested HTML element drag + resize |
| Text editing | contentEditable | Native browser editing, no heavy dependency |
| Canvas approach | HTML + CSS transform | Easier than Canvas API, native text editing works |
| Image storage | Data URLs | No server needed, simple but limits file sizes |
| Thumbnails | CSS scale transform | No separate rendering pass needed |
