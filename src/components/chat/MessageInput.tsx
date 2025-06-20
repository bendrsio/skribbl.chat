"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { User } from "@/types/chat";
import { MessageCard } from "./MessageCard";

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <MessageCard userName={currentUser.name} userColor={currentUser.color}>
          <div className="flex items-center">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={disabled}
              maxLength={500}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </MessageCard>
      </div>
      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
