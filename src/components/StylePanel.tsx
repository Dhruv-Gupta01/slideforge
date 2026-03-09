"use client";

import { useSlideStore } from "@/store/useSlideStore";
import type { ElementStyle } from "@/types";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function StylePanel() {
  const slides = useSlideStore((s) => s.slides);
  const currentSlideIndex = useSlideStore((s) => s.currentSlideIndex);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);
  const updateElement = useSlideStore((s) => s.updateElement);
  const pushHistory = useSlideStore((s) => s.pushHistory);
  const bringForward = useSlideStore((s) => s.bringForward);
  const sendBackward = useSlideStore((s) => s.sendBackward);

  const currentSlide = slides[currentSlideIndex];
  const element = currentSlide?.elements.find(
    (e) => e.id === selectedElementId
  );

  if (!element) return null;

  const style = element.style;
  const isText = element.type === "text";

  const updateStyle = (updates: Partial<ElementStyle>) => {
    updateElement(currentSlide.id, element.id, {
      style: { ...style, ...updates },
    });
  };

  const updateStyleAndSave = (updates: Partial<ElementStyle>) => {
    updateStyle(updates);
    pushHistory();
  };

  return (
    <div className="w-60 bg-white border-l border-slate-200 p-4 shrink-0 overflow-y-auto flex flex-col gap-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Style
      </p>

      {/* Z-ordering — all elements */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Layer</span>
        <div className="flex gap-1">
          <button
            onClick={() => bringForward(element.id)}
            className="p-1.5 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            title="Bring Forward"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => sendBackward(element.id)}
            className="p-1.5 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            title="Send Backward"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      </div>

      {/* Opacity — all elements */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">
          Opacity: {Math.round((style.opacity ?? 1) * 100)}%
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={style.opacity ?? 1}
          onChange={(e) => updateStyle({ opacity: parseFloat(e.target.value) })}
          onMouseUp={() => pushHistory()}
          onKeyUp={() => pushHistory()}
          className="accent-blue-600"
        />
      </label>

      {/* Background color — all elements */}
      <label className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Background</span>
        <input
          type="color"
          value={style.backgroundColor || "#ffffff"}
          onChange={(e) =>
            updateStyleAndSave({ backgroundColor: e.target.value })
          }
          className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
        />
      </label>

      {/* Border radius — shapes and images */}
      {(element.type === "shape" || element.type === "image") && (
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">
            Border Radius: {style.borderRadius ?? 0}px
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={style.borderRadius ?? 0}
            onChange={(e) =>
              updateStyle({ borderRadius: parseInt(e.target.value) })
            }
            onMouseUp={() => pushHistory()}
            onKeyUp={() => pushHistory()}
            className="accent-blue-600"
          />
        </label>
      )}

      {/* Text-specific controls */}
      {isText && (
        <>
          {/* Font size */}
          <label className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Font Size</span>
            <input
              type="number"
              min={8}
              max={200}
              value={style.fontSize ?? 24}
              onChange={(e) =>
                updateStyleAndSave({ fontSize: parseInt(e.target.value) || 24 })
              }
              className="w-16 px-2 py-1 text-sm border border-slate-200 rounded text-center"
            />
          </label>

          {/* Font weight toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Bold</span>
            <button
              onClick={() =>
                updateStyleAndSave({
                  fontWeight:
                    style.fontWeight === "bold" ? "normal" : "bold",
                })
              }
              className={`p-1.5 rounded transition-colors ${
                style.fontWeight === "bold"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Bold size={16} />
            </button>
          </div>

          {/* Text color */}
          <label className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Text Color</span>
            <input
              type="color"
              value={style.color || "#000000"}
              onChange={(e) =>
                updateStyleAndSave({ color: e.target.value })
              }
              className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
            />
          </label>

          {/* Text alignment */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Align</span>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((align) => {
                const Icon =
                  align === "left"
                    ? AlignLeft
                    : align === "center"
                      ? AlignCenter
                      : AlignRight;
                return (
                  <button
                    key={align}
                    onClick={() => updateStyleAndSave({ textAlign: align })}
                    className={`p-1.5 rounded transition-colors ${
                      (style.textAlign ?? "left") === align
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
