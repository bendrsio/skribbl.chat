"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { UserList } from "./UserList";
import { User, Message as MessageType } from "@/types/chat";
import { LogOut, Users as UsersIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: currentUser.color }}
          />
          <h1 className="truncate text-xl font-semibold">Chat Room</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile User List Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <UsersIcon className="h-5 w-5" />
                  <span className="sr-only">View users</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-64 p-0">
                <SheetHeader className="border-b p-4 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    Online ({users.length})
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto p-2">
                  <UserList users={users} currentUserId={currentUser.id} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onLeaveRoom}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Leave</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
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

          {/* Message input */}
          <div className="p-4">
            <MessageInput onSendMessage={onSendMessage} />
          </div>
        </div>

        {/* Desktop Sidebar with user list */}
        <div className="hidden w-72 border-l md:block">
          <Card className="flex h-full flex-col rounded-none border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UsersIcon className="h-5 w-5" />
                Online ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-0">
              <UserList users={users} currentUserId={currentUser.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
