import { useSlideStore } from "@/data/store/useSlideStore";
import { pushHistory } from "@/domain/usecases/history/pushHistory";
import { undo as undoUseCase } from "@/domain/usecases/history/undo";
import { redo as redoUseCase } from "@/domain/usecases/history/redo";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const historyController = {
  push() {
    const { slides, history, historyIndex } = get();
    const result = pushHistory({ history, historyIndex, slides });
    set(result);
  },

  undo() {
    const { history, historyIndex } = get();
    const result = undoUseCase({ history, historyIndex });
    if (result) {
      set({ ...result, selectedElementId: null });
    }
  },

  redo() {
    const { history, historyIndex } = get();
    const result = redoUseCase({ history, historyIndex });
    if (result) {
      set({ ...result, selectedElementId: null });
    }
  },
};
