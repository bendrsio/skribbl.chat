"use client";

import { Message as MessageType } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

export function Message({ message, isOwnMessage }: MessageProps) {
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(timestamp);
  };

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
    <div
      className={cn(
        "flex w-full mb-4",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3 break-words",
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {!isOwnMessage && (
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: message.userColor }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: message.userColor }}
            >
              {message.userName}
            </span>
          </div>
        )}

        <div className="text-sm leading-relaxed">{message.content}</div>

        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            isOwnMessage ? "text-right" : "text-left"
          )}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
