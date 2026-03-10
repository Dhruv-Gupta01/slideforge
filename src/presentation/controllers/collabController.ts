import { useCollabStore } from "@/data/store/useCollabStore";
import { joinRoom, leaveRoom, isCollabActive, getProvider } from "@/data/sync/syncAdapter";
import { getRemoteUsers, setLocalCursor, setLocalSelection } from "@/data/sync/awareness";
import { createRoomId, saveUserName } from "@/data/sync/roomManager";
import { getRandomUserColor } from "@/domain/entities/CollabUser";

const set = (updates: Partial<ReturnType<typeof useCollabStore.getState>>) =>
  useCollabStore.setState(updates);

let awarenessCleanup: (() => void) | null = null;

export const collabController = {
  async createAndJoinRoom(userName: string): Promise<string> {
    const roomId = createRoomId();
    await this.joinRoom(roomId, userName);
    return roomId;
  },

  async joinRoom(roomId: string, userName: string): Promise<void> {
    const color = getRandomUserColor();
    set({ connectionStatus: "connecting", localUserName: userName, localUserColor: color });
    saveUserName(userName);

    try {
      await joinRoom(roomId, { name: userName, color });
      set({ roomId, connectionStatus: "connected" });
      this.startAwarenessSync();
    } catch {
      set({ connectionStatus: "disconnected" });
    }
  },

  leaveRoom(): void {
    this.stopAwarenessSync();
    leaveRoom();
    set({ roomId: null, connectionStatus: "disconnected", remoteUsers: [] });
  },

  updateCursor(cursor: { x: number; y: number } | null): void {
    setLocalCursor(cursor);
  },

  updateSelection(elementId: string | null): void {
    setLocalSelection(elementId);
  },

  isActive(): boolean {
    return isCollabActive();
  },

  startAwarenessSync(): void {
    this.stopAwarenessSync();
    const provider = getProvider();
    if (!provider) return;

    const handler = () => {
      set({ remoteUsers: getRemoteUsers() });
    };
    provider.awareness.on("change", handler);
    awarenessCleanup = () => provider.awareness.off("change", handler);
  },

  stopAwarenessSync(): void {
    if (awarenessCleanup) {
      awarenessCleanup();
      awarenessCleanup = null;
    }
  },
};
