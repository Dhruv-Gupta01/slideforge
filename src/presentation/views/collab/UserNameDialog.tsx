"use client";

import { useState } from "react";
import { collabController } from "@/presentation/controllers/collabController";
import { getRoomIdFromUrl } from "@/data/sync/roomManager";

interface UserNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserNameDialog({ isOpen, onClose }: UserNameDialogProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!name.trim()) return;
    const roomId = getRoomIdFromUrl();
    if (!roomId) return;
    await collabController.joinRoom(roomId, name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-80 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Join Session</h2>
        <p className="text-sm text-slate-500 mb-4">Enter your name to start collaborating.</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleJoin();
          }}
          autoFocus
        />
        <button
          onClick={handleJoin}
          disabled={!name.trim()}
          className="w-full py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
        >
          Join
        </button>
      </div>
    </div>
  );
}
