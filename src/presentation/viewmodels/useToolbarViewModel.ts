import { useSlideStore } from "@/data/store/useSlideStore";
import { elementController } from "@/presentation/controllers/elementController";
import { presentationController } from "@/presentation/controllers/presentationController";

export function useToolbarViewModel() {
  const selectedElementId = useSlideStore((s) => s.selectedElementId);

  return {
    canDelete: selectedElementId !== null,
    addText: elementController.addText,
    addImage: elementController.addImage,
    addShape: elementController.addShape,
    deleteSelected: () => selectedElementId && elementController.deleteElement(selectedElementId),
    startPresenting: presentationController.start,
  };
}
