"use client";

import { useSocket } from "@/hooks/useSocket";
import { UserSetup } from "@/components/chat/UserSetup";
import { ChatRoom } from "@/components/chat/ChatRoom";

export default function Home() {
  const {
    isConnected,
    users,
    messages,
    currentUser,
    joinRoom,
    sendMessage,
    leaveRoom,
  } = useSocket();

  if (!isConnected || !currentUser) {
    return <UserSetup onJoin={joinRoom} />;
  }

  return (
    <ChatRoom
      currentUser={currentUser}
      users={users}
      messages={messages}
      onSendMessage={sendMessage}
      onLeaveRoom={leaveRoom}
    />
  );
}
