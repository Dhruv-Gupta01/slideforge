"use client";

import Toolbar from "@/presentation/views/editor/Toolbar";
import SlideCanvas from "@/presentation/views/editor/SlideCanvas";
import SlidePanel from "@/presentation/views/editor/SlidePanel";
import StylePanel from "@/presentation/views/editor/StylePanel";
import PresentationMode from "@/presentation/views/presentation/PresentationMode";
import ErrorBoundary from "@/presentation/views/ui/ErrorBoundary";
import { useEditorViewModel } from "@/presentation/viewmodels/useEditorViewModel";
import { useKeyboardShortcuts } from "@/presentation/hooks/useKeyboardShortcuts";

export default function Home() {
  const vm = useEditorViewModel();
  useKeyboardShortcuts();

  if (vm.isPresenting) {
    return <PresentationMode />;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen flex flex-col">
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <SlidePanel />
          <SlideCanvas />
          {vm.hasSelection && <StylePanel />}
        </div>
      </div>
    </ErrorBoundary>
  );
}
