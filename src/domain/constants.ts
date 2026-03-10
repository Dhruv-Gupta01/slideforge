export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const MAX_HISTORY_SIZE = 50;

export const DEFAULT_BACKGROUNDS = [
  "#ffffff",
  "#1a1a2e",
  "#0f3460",
  "#16213e",
  "#f5f5f5",
  "#fdf6e3",
];

export const THEMES = [
  {
    name: "Light",
    slideBackground: "#ffffff",
    textColor: "#1a1a1a",
    accentColor: "#3b82f6",
  },
  {
    name: "Dark",
    slideBackground: "#1a1a2e",
    textColor: "#e2e8f0",
    accentColor: "#60a5fa",
  },
  {
    name: "Ocean",
    slideBackground: "#0f3460",
    textColor: "#e2e8f0",
    accentColor: "#00d2ff",
  },
  {
    name: "Warm",
    slideBackground: "#fdf6e3",
    textColor: "#3d3d3d",
    accentColor: "#e07a5f",
  },
] as const;

export type Theme = (typeof THEMES)[number];
