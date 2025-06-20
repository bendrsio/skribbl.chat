"use client";

import * as React from "react";

interface MessageCardProps {
  userName: string;
  userColor: string;
  children: React.ReactNode;
}

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

export function MessageCard({
  userName,
  userColor,
  children,
}: MessageCardProps) {
  const userNameBg = hexToRgba(userColor, 0.33);

  return (
    <div className="w-full">
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
            {userName}
          </span>
        </div>
        <div className="flex-1 px-3 py-2 break-words">{children}</div>
      </div>
    </div>
  );
}
