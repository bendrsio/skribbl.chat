"use client";

import { Message as MessageType } from "@/types/chat";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

export function Message({ message }: MessageProps) {
  const hexToRgba = (hex: string, alpha: number) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

  const userColor = message.userColor || "#000000";
  const userNameBg = hexToRgba(userColor, 0.33);

  return (
    <div className="w-full mb-4">
      <div
        className="flex rounded-lg bg-white border-2"
        style={{ borderColor: userColor }}
      >
        <div
          className="flex w-32 flex-shrink-0 items-center justify-center border-r-2"
          style={{
            backgroundColor: userNameBg,
            borderRightColor: userColor,
          }}
        >
          <span
            className="truncate text-xs font-bold"
            style={{ color: userColor }}
          >
            {message.userName}
          </span>
        </div>
        <div className="flex-1 px-3 py-2 break-words">
          <div className="text-sm leading-relaxed">{message.content}</div>
        </div>
      </div>
    </div>
  );
}
