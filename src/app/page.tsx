"use client";

import Toolbar from "@/components/Toolbar";
import SlideCanvas from "@/components/SlideCanvas";
import SlidePanel from "@/components/SlidePanel";
import PresentationMode from "@/components/PresentationMode";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <SlidePanel />
        <SlideCanvas />
      </div>
      <PresentationMode />
    </div>
  );
}
