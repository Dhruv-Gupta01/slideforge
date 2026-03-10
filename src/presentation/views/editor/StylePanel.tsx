"use client";

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useStylePanelViewModel } from "@/presentation/viewmodels/useStylePanelViewModel";

export default function StylePanel() {
  const vm = useStylePanelViewModel();

  if (!vm.element) return null;

  return (
    <div className="w-60 bg-white border-l border-slate-200 p-4 shrink-0 overflow-y-auto flex flex-col gap-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Style
      </p>

      {/* Z-ordering */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Layer</span>
        <div className="flex gap-1">
          <button
            onClick={vm.bringForward}
            className="p-1.5 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            title="Bring Forward"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={vm.sendBackward}
            className="p-1.5 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            title="Send Backward"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      </div>

      {/* Opacity */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">
          Opacity: {Math.round((vm.style.opacity ?? 1) * 100)}%
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={vm.style.opacity ?? 1}
          onChange={(e) => vm.updateStyle({ opacity: parseFloat(e.target.value) })}
          onMouseUp={() => vm.pushHistory()}
          onKeyUp={() => vm.pushHistory()}
          className="accent-blue-600"
        />
      </label>

      {/* Background color */}
      <label className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Background</span>
        <input
          type="color"
          value={vm.style.backgroundColor || "#ffffff"}
          onChange={(e) => vm.updateStyleAndSave({ backgroundColor: e.target.value })}
          className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
        />
      </label>

      {/* Border radius */}
      {vm.isShapeOrImage && (
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">
            Border Radius: {vm.style.borderRadius ?? 0}px
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={vm.style.borderRadius ?? 0}
            onChange={(e) => vm.updateStyle({ borderRadius: parseInt(e.target.value) })}
            onMouseUp={() => vm.pushHistory()}
            onKeyUp={() => vm.pushHistory()}
            className="accent-blue-600"
          />
        </label>
      )}

      {/* Text controls */}
      {vm.isText && (
        <>
          <label className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Font Size</span>
            <input
              type="number"
              min={8}
              max={200}
              value={vm.style.fontSize ?? 24}
              onChange={(e) => vm.updateStyleAndSave({ fontSize: parseInt(e.target.value) || 24 })}
              className="w-16 px-2 py-1 text-sm border border-slate-200 rounded text-center"
            />
          </label>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Bold</span>
            <button
              onClick={() =>
                vm.updateStyleAndSave({
                  fontWeight: vm.style.fontWeight === "bold" ? "normal" : "bold",
                })
              }
              className={`p-1.5 rounded transition-colors ${
                vm.style.fontWeight === "bold"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Bold size={16} />
            </button>
          </div>

          <label className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Text Color</span>
            <input
              type="color"
              value={vm.style.color || "#000000"}
              onChange={(e) => vm.updateStyleAndSave({ color: e.target.value })}
              className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
            />
          </label>

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
                    onClick={() => vm.updateStyleAndSave({ textAlign: align })}
                    className={`p-1.5 rounded transition-colors ${
                      (vm.style.textAlign ?? "left") === align
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
