"use client";

import { User } from "@/types/chat";

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  return (
    <div className="flex flex-col gap-2 pt-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: user.color }}
          />
          <span
            className={`truncate text-sm font-medium ${
              user.id === currentUserId ? "font-bold text-primary" : ""
            }`}
            style={{ color: user.id !== currentUserId ? user.color : "" }}
          >
            {user.name}
            {user.id === currentUserId && " (You)"}
          </span>
        </div>
      ))}
    </div>
  );
}
