"use client";

import { useState } from "react";
import { Palette, ChevronDown } from "lucide-react";
import { useThemePickerViewModel } from "@/presentation/viewmodels/useThemePickerViewModel";

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const vm = useThemePickerViewModel();

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
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Themes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {vm.themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      vm.applyTheme(theme);
                      setIsOpen(false);
                    }}
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

            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Background
              </p>
              <div className="flex gap-2 flex-wrap">
                {vm.backgrounds.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      vm.applyBackground(color);
                      setIsOpen(false);
                    }}
                    className="w-8 h-8 rounded-md border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor:
                        vm.currentBackground === color
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
