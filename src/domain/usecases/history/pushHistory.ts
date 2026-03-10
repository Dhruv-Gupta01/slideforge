import type { Slide } from "@/domain/entities";
import type { HistoryState } from "@/domain/entities";
import { MAX_HISTORY_SIZE } from "@/domain/constants";

type Input = HistoryState & { slides: Slide[] };
type Output = HistoryState;

export function pushHistory({ history, historyIndex, slides }: Input): Output {
  const trimmed = history.slice(0, historyIndex + 1);
  trimmed.push(structuredClone(slides));

  if (trimmed.length > MAX_HISTORY_SIZE) {
    trimmed.shift();
    return { history: trimmed, historyIndex: trimmed.length - 1 };
  }

  return { history: trimmed, historyIndex: trimmed.length - 1 };
}
