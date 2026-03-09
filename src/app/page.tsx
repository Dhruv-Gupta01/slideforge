"use client";

import Toolbar from "@/components/Toolbar";
import SlideCanvas from "@/components/SlideCanvas";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        {/* SlidePanel will go here (Dev 2) */}
        <SlideCanvas />
      </div>
    </div>
  );
}
