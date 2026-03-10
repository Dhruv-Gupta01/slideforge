import { useEffect } from "react";
import { useSlideStore } from "@/data/store/useSlideStore";
import { elementController } from "@/presentation/controllers/elementController";
import { historyController } from "@/presentation/controllers/historyController";

function isEditingText(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  );
}

export function useKeyboardShortcuts() {
  const selectedElementId = useSlideStore((s) => s.selectedElementId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        historyController.undo();
        return;
      }

      if (mod && e.shiftKey && e.key === "z") {
        e.preventDefault();
        historyController.redo();
        return;
      }

      if (isEditingText(e)) return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        e.preventDefault();
        elementController.deleteElement(selectedElementId);
        return;
      }

      if (mod && e.key === "d" && selectedElementId) {
        e.preventDefault();
        elementController.duplicateElement(selectedElementId);
        return;
      }

      if (e.key === "Escape" && selectedElementId) {
        e.preventDefault();
        elementController.selectElement(null);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId]);
}
