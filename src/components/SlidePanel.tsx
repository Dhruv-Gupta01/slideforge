"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { useSlideStore } from "@/store/useSlideStore";
import SlideThumbnail from "./SlideThumbnail";

export default function SlidePanel() {
  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const addSlide = useSlideStore((s) => s.addSlide);
  const deleteSlide = useSlideStore((s) => s.deleteSlide);
  const setCurrentSlide = useSlideStore((s) => s.setCurrentSlide);
  const reorderSlides = useSlideStore((s) => s.reorderSlides);

  const dragIndexRef = useRef<number | null>(null);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex !== null && fromIndex !== toIndex) {
      reorderSlides(fromIndex, toIndex);
    }
    dragIndexRef.current = null;
  };

  return (
    <div className="w-56 bg-slate-100 border-r border-slate-300 flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide, index) => (
          <SlideThumbnail
            key={slide.id}
            slide={slide}
            index={index}
            isActive={index === currentSlideIndex}
            canDelete={slides.length > 1}
            onClick={() => setCurrentSlide(index)}
            onDelete={() => deleteSlide(slide.id)}
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={handleDrop(index)}
          />
        ))}
      </div>
      <div className="p-3 border-t border-slate-300">
        <button
          onClick={addSlide}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Slide
        </button>
      </div>
    </div>
  );
}
