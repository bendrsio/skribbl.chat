"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageToolbarProps {
  onSend: () => void;
  userColor: string;
  disabled?: boolean;
}

export function MessageToolbar({
  onSend,
  userColor,
  disabled = false,
}: MessageToolbarProps) {
  return (
    <div className="mt-2 flex justify-end gap-2 ml-32" style={{ width: 428 }}>
      {/* Future toolbar actions can be inserted before this button */}
      <Button
        type="button"
        size="icon"
        onClick={onSend}
        disabled={disabled}
        style={{
          backgroundColor: userColor,
          borderColor: userColor,
          color: "#fff",
        }}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
