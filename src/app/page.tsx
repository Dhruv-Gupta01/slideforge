"use client";

import Toolbar from "@/components/Toolbar";
import SlideCanvas from "@/components/SlideCanvas";
import SlidePanel from "@/components/SlidePanel";
import PresentationMode from "@/components/PresentationMode";
import { useSlideStore } from "@/store/useSlideStore";

export default function Home() {
  const isPresenting = useSlideStore((s) => s.isPresenting);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);

  if (isPresenting) {
    return <PresentationMode />;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <SlidePanel />
        <SlideCanvas />
        {selectedElementId && (
          <div className="w-64 bg-white border-l border-slate-200 p-4 shrink-0 overflow-y-auto">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Style Panel
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Coming soon — issue #11
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
