import { useSlideStore } from "@/data/store/useSlideStore";
import { pushHistory } from "@/domain/usecases/history/pushHistory";
import { undo as undoUseCase } from "@/domain/usecases/history/undo";
import { redo as redoUseCase } from "@/domain/usecases/history/redo";
import { isCollabActive } from "@/data/sync/syncAdapter";
import { getYUndoManager } from "@/data/sync/yjsDocument";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const historyController = {
  push() {
    if (isCollabActive()) return;
    const { slides, history, historyIndex } = get();
    const result = pushHistory({ history, historyIndex, slides });
    set(result);
  },

  undo() {
    if (isCollabActive()) {
      getYUndoManager().undo();
      return;
    }
    const { history, historyIndex } = get();
    const result = undoUseCase({ history, historyIndex });
    if (result) {
      set({ ...result, selectedElementId: null });
    }
  },

  redo() {
    if (isCollabActive()) {
      getYUndoManager().redo();
      return;
    }
    const { history, historyIndex } = get();
    const result = redoUseCase({ history, historyIndex });
    if (result) {
      set({ ...result, selectedElementId: null });
    }
  },
};
