"use client";

import { useState } from "react";
import { User } from "@/types/chat";
import { MessageCard } from "./MessageCard";
import { MessageToolbar } from "./MessageToolbar";

interface MessageInputProps {
  currentUser: User;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({
  currentUser,
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <MessageCard userName={currentUser.name} userColor={currentUser.color}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none bg-transparent outline-none"
          style={{ width: 400, maxWidth: "100%" }}
          rows={4}
          wrap="soft"
          maxLength={160}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message"
        />
      </MessageCard>
      <MessageToolbar
        onSend={handleSend}
        userColor={currentUser.color}
        disabled={!message.trim() || disabled}
      />
    </div>
  );
}
