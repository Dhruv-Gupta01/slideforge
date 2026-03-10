import type { Slide } from "@/domain/entities";
import type { HistoryState } from "@/domain/entities";

type Output = { slides: Slide[]; historyIndex: number } | null;

export function redo({ history, historyIndex }: HistoryState): Output {
  if (historyIndex >= history.length - 1) return null;
  const newIndex = historyIndex + 1;
  return {
    slides: structuredClone(history[newIndex]),
    historyIndex: newIndex,
  };
}
