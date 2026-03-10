import type { Awareness } from "y-protocols/awareness";
import type { CollabUser } from "@/domain/entities/CollabUser";

let awareness: Awareness | null = null;

export function setAwareness(a: Awareness): void {
  awareness = a;
}

export function getAwareness(): Awareness | null {
  return awareness;
}

export function clearAwareness(): void {
  awareness = null;
}

export function setLocalCursor(cursor: { x: number; y: number } | null): void {
  if (!awareness) return;
  const current = awareness.getLocalState() || {};
  awareness.setLocalStateField("user", { ...current.user, cursor });
}

export function setLocalSelection(selectedElementId: string | null): void {
  if (!awareness) return;
  const current = awareness.getLocalState() || {};
  awareness.setLocalStateField("user", { ...current.user, selectedElementId });
}

export function setLocalUserInfo(info: { name: string; color: string }): void {
  if (!awareness) return;
  const current = awareness.getLocalState() || {};
  awareness.setLocalStateField("user", { ...current.user, ...info });
}

export function getRemoteUsers(): CollabUser[] {
  if (!awareness) return [];

  const users: CollabUser[] = [];
  const localId = awareness.clientID;

  awareness.getStates().forEach((state, clientId) => {
    if (clientId === localId) return;
    const user = state.user;
    if (!user) return;

    users.push({
      id: String(clientId),
      name: user.name || "Anonymous",
      color: user.color || "#3b82f6",
      cursor: user.cursor || null,
      selectedElementId: user.selectedElementId || null,
    });
  });

  return users;
}
