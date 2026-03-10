"use client";

import { useCollabViewModel } from "@/presentation/viewmodels/useCollabViewModel";

export default function CollabAvatars() {
  const vm = useCollabViewModel();

  if (!vm.isConnected) return null;

  return (
    <div className="flex items-center gap-1">
      {vm.localUserName && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-medium ring-2 ring-white"
          style={{ backgroundColor: vm.localUserColor }}
          title={`${vm.localUserName} (you)`}
        >
          {vm.localUserName[0]?.toUpperCase()}
        </div>
      )}
      {vm.remoteUsers.map((user) => (
        <div
          key={user.id}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-medium ring-2 ring-white"
          style={{ backgroundColor: user.color }}
          title={user.name}
        >
          {user.name[0]?.toUpperCase()}
        </div>
      ))}
    </div>
  );
}
