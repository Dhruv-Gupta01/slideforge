"use client";

import { useState } from "react";
import { useSlideStore } from "@/store/useSlideStore";
import { THEMES, DEFAULT_BACKGROUNDS } from "@/lib/defaults";
import { Palette, ChevronDown } from "lucide-react";

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);

  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const setSlideBackground = useSlideStore((s) => s.setSlideBackground);
  const updateElement = useSlideStore((s) => s.updateElement);
  const pushHistory = useSlideStore((s) => s.pushHistory);

  const currentSlide = slides[currentSlideIndex];

  const applyTheme = (theme: (typeof THEMES)[number]) => {
    if (!currentSlide) return;
    setSlideBackground(currentSlide.id, theme.slideBackground);
    // Update text color for all text elements on current slide
    currentSlide.elements
      .filter((el) => el.type === "text")
      .forEach((el) => {
        updateElement(currentSlide.id, el.id, {
          style: { ...el.style, color: theme.textColor },
        });
      });
    pushHistory();
    setIsOpen(false);
  };

  const applyBackground = (color: string) => {
    if (!currentSlide) return;
    setSlideBackground(currentSlide.id, color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        title="Theme & Background"
      >
        <Palette size={16} />
        Theme
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 w-64 p-3">
            {/* Themes */}
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Themes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => applyTheme(theme)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded border border-slate-200 shrink-0"
                      style={{ backgroundColor: theme.slideBackground }}
                    />
                    <span className="text-xs text-slate-700">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background colors */}
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Background
              </p>
              <div className="flex gap-2 flex-wrap">
                {DEFAULT_BACKGROUNDS.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyBackground(color)}
                    className="w-8 h-8 rounded-md border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor:
                        currentSlide?.background === color
                          ? "#3b82f6"
                          : "#e2e8f0",
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
