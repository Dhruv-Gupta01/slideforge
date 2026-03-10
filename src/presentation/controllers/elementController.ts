import { useSlideStore } from "@/data/store/useSlideStore";
import type { SlideElement } from "@/domain/entities";
import { getMaxZIndex } from "@/domain/entities";
import { createTextElement, createImageElement, createShapeElement } from "@/domain/factories/elementFactory";
import { addElement } from "@/domain/usecases/elements/addElement";
import { deleteElement as deleteElementUseCase } from "@/domain/usecases/elements/deleteElement";
import { updateElement as updateElementUseCase } from "@/domain/usecases/elements/updateElement";
import { duplicateElement as duplicateElementUseCase } from "@/domain/usecases/elements/duplicateElement";
import { historyController } from "./historyController";
import { isCollabActive } from "@/data/sync/syncAdapter";
import { yAddElement, yUpdateElement, yDeleteElement } from "@/data/sync/storeToYjs";
import { collabController } from "./collabController";

const get = () => useSlideStore.getState();
const set = (updates: Partial<ReturnType<typeof get>>) =>
  useSlideStore.setState(updates);

export const elementController = {
  addText() {
    const { slides, currentSlideIndex } = get();
    const maxZ = getMaxZIndex(slides[currentSlideIndex].elements);
    const element = createTextElement({ zIndex: maxZ + 1 });

    if (isCollabActive()) {
      yAddElement(currentSlideIndex, element);
    } else {
      const result = addElement({ slides, slideIndex: currentSlideIndex, element });
      set(result);
      historyController.push();
    }
    set({ selectedElementId: element.id });
  },

  addImage(dataUrl: string) {
    const { slides, currentSlideIndex } = get();
    const maxZ = getMaxZIndex(slides[currentSlideIndex].elements);
    const element = createImageElement(dataUrl, { zIndex: maxZ + 1 });

    if (isCollabActive()) {
      yAddElement(currentSlideIndex, element);
    } else {
      const result = addElement({ slides, slideIndex: currentSlideIndex, element });
      set(result);
      historyController.push();
    }
    set({ selectedElementId: element.id });
  },

  addShape(shapeType: string) {
    const { slides, currentSlideIndex } = get();
    const maxZ = getMaxZIndex(slides[currentSlideIndex].elements);
    const element = createShapeElement(shapeType, { zIndex: maxZ + 1 });

    if (isCollabActive()) {
      yAddElement(currentSlideIndex, element);
    } else {
      const result = addElement({ slides, slideIndex: currentSlideIndex, element });
      set(result);
      historyController.push();
    }
    set({ selectedElementId: element.id });
  },

  updateElement(slideId: string, elementId: string, updates: Partial<SlideElement>) {
    if (isCollabActive()) {
      yUpdateElement(slideId, elementId, updates);
    } else {
      const { slides } = get();
      const result = updateElementUseCase({ slides, slideId, elementId, updates });
      set(result);
    }
  },

  deleteElement(elementId: string) {
    if (isCollabActive()) {
      const { currentSlideIndex } = get();
      yDeleteElement(currentSlideIndex, elementId);
    } else {
      const { slides, currentSlideIndex } = get();
      const result = deleteElementUseCase({ slides, slideIndex: currentSlideIndex, elementId });
      set(result);
      historyController.push();
    }
    set({ selectedElementId: null });
  },

  selectElement(elementId: string | null) {
    set({ selectedElementId: elementId });
    if (isCollabActive()) {
      collabController.updateSelection(elementId);
    }
  },

  duplicateElement(elementId: string) {
    const { slides, currentSlideIndex } = get();
    const result = duplicateElementUseCase({ slides, slideIndex: currentSlideIndex, elementId });
    if (result) {
      if (isCollabActive()) {
        const newElement = result.slides[currentSlideIndex].elements.find(
          (e) => e.id === result.newElementId
        );
        if (newElement) {
          yAddElement(currentSlideIndex, newElement);
        }
      } else {
        set({ slides: result.slides });
        historyController.push();
      }
      set({ selectedElementId: result.newElementId });
    }
  },
};
