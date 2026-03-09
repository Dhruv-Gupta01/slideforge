"use client";

import { useRef, useState } from "react";
import { useSlideStore } from "@/store/useSlideStore";
import {
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Trash2,
  Play,
  ChevronDown,
} from "lucide-react";

export default function Toolbar() {
  const addTextElement = useSlideStore((s) => s.addTextElement);
  const addImageElement = useSlideStore((s) => s.addImageElement);
  const addShapeElement = useSlideStore((s) => s.addShapeElement);
  const deleteElement = useSlideStore((s) => s.deleteElement);
  const selectedElementId = useSlideStore((s) => s.selectedElementId);
  const startPresenting = useSlideStore((s) => s.startPresenting);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showShapeMenu, setShowShapeMenu] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addImageElement(dataUrl);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleAddShape = (shapeType: string) => {
    addShapeElement(shapeType);
    setShowShapeMenu(false);
  };

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
      <span className="font-semibold text-slate-800 mr-4 text-lg">
        SlideForge
      </span>

      <div className="w-px h-8 bg-slate-200" />

      <button
        onClick={addTextElement}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        title="Add Text"
      >
        <Type size={16} />
        Text
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        title="Add Image"
      >
        <Image size={16} />
        Image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="relative">
        <button
          onClick={() => setShowShapeMenu(!showShapeMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          title="Add Shape"
        >
          <Square size={16} />
          Shape
          <ChevronDown size={14} />
        </button>
        {showShapeMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50">
            <button
              onClick={() => handleAddShape("rectangle")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full"
            >
              <Square size={14} /> Rectangle
            </button>
            <button
              onClick={() => handleAddShape("circle")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full"
            >
              <Circle size={14} /> Circle
            </button>
            <button
              onClick={() => handleAddShape("triangle")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full"
            >
              <Triangle size={14} /> Triangle
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-8 bg-slate-200" />

      <button
        onClick={() => selectedElementId && deleteElement(selectedElementId)}
        disabled={!selectedElementId}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Delete Element"
      >
        <Trash2 size={16} />
        Delete
      </button>

      <div className="flex-1" />

      <button
        onClick={startPresenting}
        className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        title="Present"
      >
        <Play size={16} />
        Present
      </button>
    </div>
  );
}
