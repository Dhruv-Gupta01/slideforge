"use client";

import type { CollabUser } from "@/domain/entities/CollabUser";

interface CollabCursorsProps {
  remoteUsers: CollabUser[];
}

export default function CollabCursors({ remoteUsers }: CollabCursorsProps) {
  const usersWithCursors = remoteUsers.filter((u) => u.cursor !== null);

  if (usersWithCursors.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[1000]">
      {usersWithCursors.map((user) => (
        <div
          key={user.id}
          className="absolute transition-transform duration-75"
          style={{
            transform: `translate(${user.cursor!.x}px, ${user.cursor!.y}px)`,
          }}
        >
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            className="-translate-x-0.5 -translate-y-0.5"
          >
            <path
              d="M0 0L16 12H6L0 20V0Z"
              fill={user.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          <span
            className="absolute left-4 top-4 text-xs text-white px-1.5 py-0.5 rounded whitespace-nowrap"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </span>
        </div>
      ))}
    </div>
  );
}
