"use client";

import { useState } from "react";
import { User } from "@/types/chat";
import { MessageCard } from "./MessageCard";
import { CanvasTextArea } from "./CanvasTextArea";
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
        <CanvasTextArea
          value={message}
          onChange={setMessage}
          width={400}
          lineColor={currentUser.color}
          cursorColor={currentUser.color}
          showCursor
          onEnter={handleSend}
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
