import { useSlideStore } from "@/data/store/useSlideStore";

export function useEditorViewModel() {
  const isPresenting = useSlideStore((s) => s.isPresenting);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);

  return {
    isPresenting,
    selectedElementId,
    hasSelection: selectedElementId !== null,
  };
}
