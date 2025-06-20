"use client";

import { Message as MessageType } from "@/types/chat";
import { MessageCard } from "./MessageCard";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

export function Message({ message }: MessageProps) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center py-2">
        <div className="text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <MessageCard
        userName={message.userName}
        userColor={message.userColor || "#000000"}
      >
        <div className="text-sm leading-relaxed">{message.content}</div>
      </MessageCard>
    </div>
  );
}
