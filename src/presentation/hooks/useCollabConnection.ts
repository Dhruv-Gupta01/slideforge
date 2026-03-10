"use client";

import { useEffect, useRef } from "react";
import { collabController } from "@/presentation/controllers/collabController";
import { getRoomIdFromUrl, getSavedUserName } from "@/data/sync/roomManager";

export function useCollabConnection(onNeedUserName: () => void) {
  const hasJoined = useRef(false);

  useEffect(() => {
    if (hasJoined.current) return;

    const roomId = getRoomIdFromUrl();
    if (!roomId) return;

    const savedName = getSavedUserName();
    if (savedName) {
      hasJoined.current = true;
      collabController.joinRoom(roomId, savedName);
    } else {
      hasJoined.current = true;
      onNeedUserName();
    }
  }, [onNeedUserName]);
}
