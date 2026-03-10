import { create } from "zustand";
import type { CollabUser } from "@/domain/entities/CollabUser";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface CollabState {
  roomId: string | null;
  connectionStatus: ConnectionStatus;
  localUserName: string;
  localUserColor: string;
  remoteUsers: CollabUser[];
}

export const useCollabStore = create<CollabState>(() => ({
  roomId: null,
  connectionStatus: "disconnected",
  localUserName: "",
  localUserColor: "",
  remoteUsers: [],
}));
