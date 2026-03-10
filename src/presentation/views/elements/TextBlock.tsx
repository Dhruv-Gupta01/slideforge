"use client";

import { useState, useRef, useEffect } from "react";
import type { SlideElement } from "@/domain/entities";
import { elementController } from "@/presentation/controllers/elementController";
import { historyController } from "@/presentation/controllers/historyController";

interface TextBlockProps {
  element: SlideElement;
  slideId: string;
  isSelected: boolean;
  readOnly?: boolean;
}

export default function TextBlock({
  element,
  slideId,
  isSelected,
  readOnly,
}: TextBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isSelected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsEditing(false);
    }
  }, [isSelected]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerText;
      if (newContent !== element.content) {
        elementController.updateElement(slideId, element.id, { content: newContent });
        historyController.push();
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      contentRef.current?.blur();
    }
    e.stopPropagation();
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      onDoubleClick={handleDoubleClick}
      style={{ cursor: isEditing ? "text" : "move" }}
    >
      <div
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full flex items-center outline-none"
        style={{
          fontSize: element.style.fontSize || 32,
          fontWeight: element.style.fontWeight || "normal",
          color: element.style.color || "#1a1a1a",
          backgroundColor: element.style.backgroundColor || "transparent",
          textAlign: element.style.textAlign || "center",
          opacity: element.style.opacity ?? 1,
          justifyContent:
            element.style.textAlign === "left"
              ? "flex-start"
              : element.style.textAlign === "right"
                ? "flex-end"
                : "center",
          padding: "8px",
        }}
      >
        {element.content}
      </div>
    </div>
  );
}
