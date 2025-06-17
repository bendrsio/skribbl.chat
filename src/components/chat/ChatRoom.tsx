"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { UserList } from "./UserList";
import { User, Message as MessageType } from "@/types/chat";
import { LogOut } from "lucide-react";

interface ChatRoomProps {
  currentUser: User;
  users: User[];
  messages: MessageType[];
  onSendMessage: (message: string) => void;
  onLeaveRoom: () => void;
}

export function ChatRoom({
  currentUser,
  users,
  messages,
  onSendMessage,
  onLeaveRoom,
}: ChatRoomProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: currentUser.color }}
          />
          <h1 className="text-xl font-semibold">Chat Room</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLeaveRoom}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Leave
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 rounded-none border-0 border-r">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col pt-0">
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-1">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-center">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <Message
                        key={message.id}
                        message={message}
                        isOwnMessage={message.userId === currentUser.id}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message input */}
          <MessageInput onSendMessage={onSendMessage} />
        </div>

        {/* Sidebar with user list */}
        <div className="w-72 p-4">
          <UserList users={users} currentUserId={currentUser.id} />
        </div>
      </div>
    </div>
  );
}
