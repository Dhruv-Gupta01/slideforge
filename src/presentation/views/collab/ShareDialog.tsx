"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { useCollabViewModel } from "@/presentation/viewmodels/useCollabViewModel";
import { collabController } from "@/presentation/controllers/collabController";
import { getRoomShareUrl, getSavedUserName } from "@/data/sync/roomManager";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareDialog({ isOpen, onClose }: ShareDialogProps) {
  const vm = useCollabViewModel();
  const [userName, setUserName] = useState(getSavedUserName() || "");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!userName.trim()) return;
    const roomId = await collabController.createAndJoinRoom(userName.trim());
    const url = getRoomShareUrl(roomId);
    window.history.replaceState(null, "", `?room=${roomId}`);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    collabController.leaveRoom();
    window.history.replaceState(null, "", window.location.pathname);
    onClose();
  };

  const handleCopyLink = async () => {
    if (!vm.roomId) return;
    await navigator.clipboard.writeText(getRoomShareUrl(vm.roomId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {vm.isConnected ? "Collaboration" : "Start Collaborating"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {vm.isConnected ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">Room Code</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-sm font-mono">
                  {vm.roomId}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-500">
                Connected Users ({vm.peerCount + 1})
              </label>
              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: vm.localUserColor }}
                  />
                  {vm.localUserName} (you)
                </div>
                {vm.remoteUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    {user.name}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
                autoFocus
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!userName.trim() || vm.isConnecting}
              className="w-full py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
            >
              {vm.isConnecting ? "Connecting..." : "Create Room & Copy Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
