import type { Slide } from "@/domain/entities";
import type { HistoryState } from "@/domain/entities";

type Output = { slides: Slide[]; historyIndex: number } | null;

export function undo({ history, historyIndex }: HistoryState): Output {
  if (historyIndex <= 0) return null;
  const newIndex = historyIndex - 1;
  return {
    slides: structuredClone(history[newIndex]),
    historyIndex: newIndex,
  };
}
