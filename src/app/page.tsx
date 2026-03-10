"use client";

import { useState, useCallback } from "react";
import Toolbar from "@/presentation/views/editor/Toolbar";
import SlideCanvas from "@/presentation/views/editor/SlideCanvas";
import SlidePanel from "@/presentation/views/editor/SlidePanel";
import StylePanel from "@/presentation/views/editor/StylePanel";
import PresentationMode from "@/presentation/views/presentation/PresentationMode";
import ErrorBoundary from "@/presentation/views/ui/ErrorBoundary";
import UserNameDialog from "@/presentation/views/collab/UserNameDialog";
import { useEditorViewModel } from "@/presentation/viewmodels/useEditorViewModel";
import { useKeyboardShortcuts } from "@/presentation/hooks/useKeyboardShortcuts";
import { useCollabConnection } from "@/presentation/hooks/useCollabConnection";

export default function Home() {
  const vm = useEditorViewModel();
  const [showNameDialog, setShowNameDialog] = useState(false);

  useKeyboardShortcuts();
  useCollabConnection(
    useCallback(() => setShowNameDialog(true), [])
  );

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
      <UserNameDialog
        isOpen={showNameDialog}
        onClose={() => setShowNameDialog(false)}
      />
    </ErrorBoundary>
  );
}
