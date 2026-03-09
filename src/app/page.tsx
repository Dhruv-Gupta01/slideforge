"use client";

import Toolbar from "@/components/Toolbar";
import SlideCanvas from "@/components/SlideCanvas";
import SlidePanel from "@/components/SlidePanel";
import PresentationMode from "@/components/PresentationMode";
import StylePanel from "@/components/StylePanel";
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
        {selectedElementId && <StylePanel />}
      </div>
    </div>
  );
}
