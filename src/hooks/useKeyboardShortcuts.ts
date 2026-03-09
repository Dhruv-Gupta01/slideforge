import { useEffect } from "react";
import { useSlideStore } from "@/store/useSlideStore";

function isEditingText(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  );
}

export function useKeyboardShortcuts() {
  const undo = useSlideStore((s) => s.undo);
  const redo = useSlideStore((s) => s.redo);
  const deleteElement = useSlideStore((s) => s.deleteElement);
  const duplicateElement = useSlideStore((s) => s.duplicateElement);
  const selectElement = useSlideStore((s) => s.selectElement);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // Undo: Ctrl/Cmd+Z (works even when editing text)
      if (mod && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd+Shift+Z
      if (mod && e.shiftKey && e.key === "z") {
        e.preventDefault();
        redo();
        return;
      }

      // Everything below requires NOT editing text
      if (isEditingText(e)) return;

      // Delete/Backspace: delete selected element
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
        return;
      }

      // Ctrl/Cmd+D: duplicate selected element
      if (mod && e.key === "d" && selectedElementId) {
        e.preventDefault();
        duplicateElement(selectedElementId);
        return;
      }

      // Escape: deselect
      if (e.key === "Escape" && selectedElementId) {
        e.preventDefault();
        selectElement(null);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, deleteElement, duplicateElement, selectElement, selectedElementId]);
}
