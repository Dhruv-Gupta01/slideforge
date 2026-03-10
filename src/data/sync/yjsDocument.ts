import * as Y from "yjs";

let doc: Y.Doc | null = null;
let undoManager: Y.UndoManager | null = null;

export function getYDoc(): Y.Doc {
  if (!doc) {
    doc = new Y.Doc();
  }
  return doc;
}

export function destroyYDoc(): void {
  if (undoManager) {
    undoManager.destroy();
    undoManager = null;
  }
  if (doc) {
    doc.destroy();
    doc = null;
  }
}

export function getYSlides(): Y.Array<Y.Map<unknown>> {
  return getYDoc().getArray("slides");
}

export function getYUndoManager(): Y.UndoManager {
  if (!undoManager) {
    undoManager = new Y.UndoManager(getYSlides(), {
      captureTimeout: 300,
    });
  }
  return undoManager;
}

export function getYSlideAt(index: number): Y.Map<unknown> | undefined {
  const slides = getYSlides();
  return index >= 0 && index < slides.length
    ? slides.get(index)
    : undefined;
}

export function getYElements(slideMap: Y.Map<unknown>): Y.Array<Y.Map<unknown>> {
  return slideMap.get("elements") as Y.Array<Y.Map<unknown>>;
}

export function getYStyle(elementMap: Y.Map<unknown>): Y.Map<unknown> {
  return elementMap.get("style") as Y.Map<unknown>;
}
