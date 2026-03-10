import YPartyKitProvider from "y-partykit/provider";
import { useSlideStore } from "@/data/store/useSlideStore";
import { getYDoc, getYSlides, destroyYDoc } from "./yjsDocument";
import { initYDocFromStore } from "./storeToYjs";
import { attachYjsObserver, detachYjsObserver, forceYDocToStoreSync } from "./yjsToStore";
import { setAwareness, clearAwareness, setLocalUserInfo } from "./awareness";

let provider: YPartyKitProvider | null = null;
let connected = false;

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export function isCollabActive(): boolean {
  return connected;
}

export function getProvider(): YPartyKitProvider | null {
  return provider;
}

function onSynced(): void {
  const ySlides = getYSlides();

  if (ySlides.length === 0) {
    const { slides } = useSlideStore.getState();
    initYDocFromStore(slides);
  }

  attachYjsObserver();
  forceYDocToStoreSync();
  connected = true;
}

export async function joinRoom(
  roomId: string,
  userInfo: { name: string; color: string }
): Promise<void> {
  if (connected) {
    leaveRoom();
  }

  const doc = getYDoc();

  provider = new YPartyKitProvider(PARTYKIT_HOST, roomId, doc, {
    connect: true,
    disableBc: true,
  });

  setAwareness(provider.awareness);
  setLocalUserInfo(userInfo);

  if (provider.synced) {
    onSynced();
    return;
  }

  await new Promise<void>((resolve) => {
    if (!provider) return resolve();

    const onSync = (isSynced: boolean) => {
      if (!isSynced) return;
      provider?.off("sync", onSync);
      onSynced();
      resolve();
    };

    provider.on("sync", onSync);

    if (provider.synced) {
      provider.off("sync", onSync);
      onSynced();
      resolve();
    }
  });
}

export function leaveRoom(): void {
  detachYjsObserver();
  clearAwareness();

  if (provider) {
    provider.disconnect();
    provider.destroy();
    provider = null;
  }

  destroyYDoc();
  connected = false;
}
