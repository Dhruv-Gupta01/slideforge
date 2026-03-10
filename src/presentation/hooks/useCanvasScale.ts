import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/domain/constants";

interface ScaleOptions {
  padding?: number;
  fillViewport?: boolean;
}

export function useCanvasScale(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: ScaleOptions = {}
) {
  const { padding = 40, fillViewport = false } = options;
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (fillViewport) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setScale(Math.min(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT));
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const availableWidth = container.clientWidth - padding * 2;
    const availableHeight = container.clientHeight - padding * 2;
    setScale(Math.min(availableWidth / CANVAS_WIDTH, availableHeight / CANVAS_HEIGHT));
  }, [containerRef, padding, fillViewport]);

  useLayoutEffect(() => {
    // Initial scale calculation — safe in layout effect as it reads DOM measurements
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateScale();
  }, [updateScale]);

  useEffect(() => {
    const handler = () => updateScale();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [updateScale]);

  return scale;
}
