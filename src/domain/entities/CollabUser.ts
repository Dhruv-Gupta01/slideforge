export type CollabUser = {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number } | null;
  selectedElementId: string | null;
};

const USER_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

export function getRandomUserColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}
