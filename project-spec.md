# SlideForge — Project Spec

## Half 1: Product Requirements

### Vision

A browser-based presentation tool that lets a solo user create, edit, and present slide decks — fast, minimal, no sign-up, no cloud dependency.

### Target User

Solo presenter (developer, student, educator) who wants to quickly build a clean deck without the overhead of PowerPoint or Google Slides.

### Problem Statement

Existing tools are either bloated (PowerPoint), require accounts (Google Slides), or lack visual editing (Markdown-based tools like reveal.js). SlideForge sits in the middle — visual drag-and-drop editing with zero setup.

### Core User Flows

#### Flow 1: Create a New Presentation

1. User lands on the editor — a blank first slide is already present
2. Default slide has a 16:9 canvas with a light background
3. Toolbar at top, slide panel on the left

#### Flow 2: Add and Edit Elements

1. User clicks "Add Text" in the toolbar — a text block appears on the canvas
2. User drags the text block to position it, resizes using corner handles
3. User double-clicks the text block to enter edit mode — types content inline
4. User clicks outside to deselect
5. Same flow for images (file upload dialog) and shapes (rect, circle, triangle)

#### Flow 3: Style Elements

1. User selects an element by clicking it
2. A context toolbar or properties panel appears
3. User can change: font size, font weight, text color, background color, opacity, border radius
4. Changes apply in real-time

#### Flow 4: Manage Slides

1. User sees slide thumbnails in the left panel
2. User clicks "+" to add a new slide
3. User clicks a thumbnail to switch to that slide
4. User can drag thumbnails to reorder slides
5. User can delete a slide (with confirmation if it's the last one)

#### Flow 5: Apply Backgrounds and Themes

1. User can change the current slide's background (solid color, gradient)
2. User can pick from 3-4 preset themes that apply colors/fonts across all slides

#### Flow 6: Present

1. User clicks "Present" button in the toolbar
2. Browser enters fullscreen mode
3. Slides render at full resolution, scaled to fit the screen
4. Arrow keys (left/right) navigate between slides
5. Escape key exits presentation mode
6. Optional: basic slide transitions (fade, slide-left)

#### Flow 7: Undo/Redo

1. User presses Ctrl+Z to undo the last action
2. User presses Ctrl+Shift+Z to redo
3. Undo/redo works for: element add/delete, move, resize, style changes, text edits

### What's Explicitly Out of Scope (v1)

- User accounts / authentication
- Save to cloud / database persistence
- Export to PDF, PPTX, or image
- Real-time collaboration / multiplayer
- Animations on individual elements (entrance, exit, motion paths)
- Charts, tables, or embedded media (video/audio)
- Speaker notes / presenter view with dual screen
- PPTX/PDF import
- Mobile editing (present-only on mobile is fine)

---

## Half 2: Engineering / Tech Stack

### Stack

| Layer         | Choice                  | Rationale                                                                |
| ------------- | ----------------------- | ------------------------------------------------------------------------ |
| Framework     | Next.js 15 (App Router) | Industry standard, SSR not needed but gives us good DX and Vercel deploy |
| Language      | TypeScript              | Type safety for complex nested state (slides/elements)                   |
| Styling       | Tailwind CSS 4          | Utility-first, fast to build UIs                                         |
| State         | Zustand 5               | Lightweight, no boilerplate, supports middleware (undo/redo)             |
| Drag & Resize | react-rnd 10            | Battle-tested drag + resize on HTML elements                             |
| Icons         | lucide-react            | Clean, consistent icon set                                               |
| Deployment    | Vercel                  | Zero-config for Next.js                                                  |

### No Backend

This is a fully client-side application. No API routes, no database, no server state. Everything lives in Zustand store in memory. Refreshing the page resets the presentation.

### Data Model

```typescript
type Presentation = {
  slides: Slide[];
  currentSlideIndex: number;
  isPresenting: boolean;
};

type Slide = {
  id: string;
  elements: SlideElement[];
  background: string; // hex color or CSS gradient
};

type SlideElement = {
  id: string;
  type: "text" | "image" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string; // text content, image data URL, or shape type
  style: ElementStyle;
  zIndex: number;
};

type ElementStyle = {
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  opacity?: number;
  textAlign?: "left" | "center" | "right";
};

type ShapeType = "rectangle" | "circle" | "triangle";
```

### Folder Structure

```
slideforge/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with font + metadata
│   │   ├── page.tsx            # Single page — renders the editor
│   │   └── globals.css         # Tailwind imports + custom styles
│   ├── components/
│   │   ├── Toolbar.tsx         # Top bar: add elements, themes, present button
│   │   ├── SlidePanel.tsx      # Left sidebar: slide thumbnails
│   │   ├── SlideThumbnail.tsx  # Mini slide preview
│   │   ├── SlideCanvas.tsx     # Main 16:9 editing canvas
│   │   ├── CanvasElement.tsx   # Wrapper: react-rnd drag/resize per element
│   │   ├── TextBlock.tsx       # contentEditable text element
│   │   ├── ImageBlock.tsx      # Image element with upload
│   │   ├── ShapeBlock.tsx      # Shape element (rect/circle/triangle)
│   │   ├── StylePanel.tsx      # Element properties/styling panel
│   │   └── PresentationMode.tsx # Fullscreen presentation overlay
│   ├── store/
│   │   └── useSlideStore.ts    # Zustand store — all state + actions
│   ├── lib/
│   │   ├── defaults.ts         # Default themes, colors, fonts
│   │   └── utils.ts            # ID generation, helpers
│   └── types/
│       └── index.ts            # All TypeScript types
├── public/                     # Static assets (if any)
├── CLAUDE.md                   # Project context for Claude Code
├── architecture.md             # Living architecture doc
├── changelog.md                # Change log
├── project-status.md           # Milestone tracking
├── project-spec.md             # This file
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.js
```

### Key Technical Decisions

1. **Canvas scaling**: The 16:9 canvas uses `transform: scale()` to fit the editor viewport. All element coordinates are stored in canvas-relative units (e.g., on a 1920x1080 virtual canvas), not screen pixels.

2. **Text editing**: Double-click an element to enter `contentEditable` mode. Single-click selects it for drag/resize. This avoids the drag-vs-edit conflict.

3. **Slide thumbnails**: Rendered using CSS `transform: scale(0.15)` on a cloned slide div — no separate canvas rendering needed.

4. **Undo/redo**: Implemented via Zustand's `temporal` middleware — stores state snapshots automatically.

5. **Image handling**: Images are converted to data URLs on upload and stored inline in the element's `content` field. No server upload needed.

6. **Presentation mode**: Uses the Fullscreen API. Slides scale to `100vw x 100vh` maintaining 16:9 aspect ratio with black bars if needed.

### Milestones (2-Day Build)

#### Milestone 1 — Editor Core (Day 1)

- [ ] Project scaffold (Next.js + Tailwind + Zustand + react-rnd)
- [ ] TypeScript types and Zustand store with all actions
- [ ] SlideCanvas with 16:9 aspect ratio and scaling
- [ ] CanvasElement with drag and resize (react-rnd)
- [ ] TextBlock with inline contentEditable editing
- [ ] ImageBlock with file upload to data URL
- [ ] ShapeBlock (rectangle, circle, triangle)
- [ ] Toolbar — add text / image / shape, delete element
- [ ] SlidePanel — add / delete / select / reorder slides

**Done when**: User can create a multi-slide deck with text, images, and shapes, position elements freely, and navigate between slides.

#### Milestone 2 — Present + Polish (Day 2)

- [ ] PresentationMode — fullscreen, keyboard navigation
- [ ] Slide transitions (fade, slide-left via CSS)
- [ ] Background / theme picker (3-4 presets)
- [ ] StylePanel — font size, color, weight, opacity, alignment
- [ ] Element z-ordering (bring forward / send back)
- [ ] Undo / redo (Zustand temporal middleware)
- [ ] Keyboard shortcuts (Delete to remove, Ctrl+D to duplicate)
- [ ] Edge case handling and visual polish
- [ ] Deploy to Vercel

**Done when**: User can create a polished deck and present it fullscreen with transitions.

### Team Assignment

| Person    | Owns                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| Dev 1     | Editor core: SlideCanvas, CanvasElement, TextBlock, ImageBlock, ShapeBlock, Toolbar      |
| Dev 2     | Slides + presentation: SlidePanel, SlideThumbnail, PresentationMode, transitions, themes |
| Tech Lead | Scaffold, CLAUDE.md, Zustand store, types, StylePanel, undo/redo, deploy, PR reviews     |
