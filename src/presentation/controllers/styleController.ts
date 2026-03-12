import { useSlideStore } from "@/data/store/useSlideStore";
import type { ElementStyle } from "@/domain/entities";
import { updateElementStyle } from "@/domain/usecases/elements/updateElementStyle";
import { historyController } from "./historyController";
import { isCollabActive } from "@/data/sync/syncAdapter";
import { yUpdateElementStyle } from "@/data/sync/storeToYjs";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const styleController = {
  updateStyle(slideId: string, elementId: string, styleUpdates: Partial<ElementStyle>) {
    if (isCollabActive()) {
      yUpdateElementStyle(slideId, elementId, styleUpdates);
    } else {
      const { slides } = get();
      const result = updateElementStyle({ slides, slideId, elementId, styleUpdates });
      set(result);
    }
  },

  updateStyleAndSave(slideId: string, elementId: string, styleUpdates: Partial<ElementStyle>) {
    this.updateStyle(slideId, elementId, styleUpdates);
    historyController.push();
  },

  pushHistory() {
    historyController.push();
  },
};
