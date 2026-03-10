import { useCollabStore } from "@/data/store/useCollabStore";

export function useCollabViewModel() {
  const roomId = useCollabStore((s) => s.roomId);
  const connectionStatus = useCollabStore((s) => s.connectionStatus);
  const localUserName = useCollabStore((s) => s.localUserName);
  const localUserColor = useCollabStore((s) => s.localUserColor);
  const remoteUsers = useCollabStore((s) => s.remoteUsers);

  return {
    roomId,
    connectionStatus,
    localUserName,
    localUserColor,
    remoteUsers,
    isConnected: connectionStatus === "connected",
    isConnecting: connectionStatus === "connecting",
    peerCount: remoteUsers.length,
  };
}
