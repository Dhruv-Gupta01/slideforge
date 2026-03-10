"use client";

import { Trash2 } from "lucide-react";
import type { Slide } from "@/domain/entities";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/domain/constants";
import ElementRenderer from "@/presentation/views/elements/ElementRenderer";

const THUMBNAIL_WIDTH = 192;
const THUMBNAIL_SCALE = THUMBNAIL_WIDTH / CANVAS_WIDTH;

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  canDelete: boolean;
  onClick: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function SlideThumbnail({
  slide,
  index,
  isActive,
  canDelete,
  onClick,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: SlideThumbnailProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="group relative cursor-pointer"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <span className="text-xs text-slate-400 mt-1 w-4 text-right shrink-0">
          {index + 1}
        </span>
        <div
          className={`relative overflow-hidden rounded border-2 transition-colors ${
            isActive
              ? "border-blue-500 shadow-md"
              : "border-slate-300 hover:border-slate-400"
          }`}
          style={{
            width: THUMBNAIL_WIDTH,
            height: THUMBNAIL_WIDTH * (CANVAS_HEIGHT / CANVAS_WIDTH),
          }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `scale(${THUMBNAIL_SCALE})`,
              backgroundColor: slide.background || "#ffffff",
            }}
          >
            {slide.elements.map((element) => (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  zIndex: element.zIndex,
                }}
              >
                <ElementRenderer
                  element={element}
                  slideId={slide.id}
                  readOnly
                />
              </div>
            ))}
          </div>

          {canDelete && (
            <button
              onClick={handleDelete}
              className="absolute top-1 right-1 p-0.5 rounded bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
