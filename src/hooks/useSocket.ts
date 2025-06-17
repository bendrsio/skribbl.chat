"use client";

import { useEffect, useRef, useState } from "react";
import type { User, Message } from "@/types/chat";

// Simple socket interface without complex types
interface SimpleSocket {
  on: (event: string, callback: Function) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
  id?: string;
}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    const connectSocket = async () => {
      try {
        // Use window to access the globally available io
        const socketIOClient = (window as any).io;

        if (!socketIOClient) {
          console.error(
            "Socket.IO client not found. Please ensure the library is loaded."
          );
          return;
        }

        // Prefer explicit env var at build-time / runtime
        const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        const serverUrl = envUrl
          ? envUrl
          : `${window.location.protocol}//${window.location.hostname}:3001`;

        const socket = socketIOClient(serverUrl);
        console.log("Connecting to:", serverUrl);
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Connected to server");
          setIsConnected(true);
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from server");
          setIsConnected(false);
          setCurrentUser(null);
          setUsers([]);
          setMessages([]);
        });

        socket.on("room_update", (data: any) => {
          setUsers(data.users);
          setMessages(
            data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          );
        });

        socket.on("user_joined", (user: any) => {
          setUsers((prev) => [
            ...prev,
            {
              ...user,
              joinedAt: new Date(user.joinedAt),
            },
          ]);
        });

        socket.on("user_left", (userId: string) => {
          setUsers((prev) => prev.filter((u) => u.id !== userId));
        });

        socket.on("new_message", (message: any) => {
          setMessages((prev) => [
            ...prev,
            {
              ...message,
              timestamp: new Date(message.timestamp),
            },
          ]);
        });

        socket.on("error", (error: string) => {
          console.error("Socket error:", error);
        });
      } catch (error) {
        console.error("Failed to connect to socket server:", error);
      }
    };

    // Add a small delay to ensure the script is loaded
    const timer = setTimeout(connectSocket, 1000);

    return () => {
      clearTimeout(timer);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinRoom = (userData: { name: string; color: string }) => {
    if (!socketRef.current) return;

    const user: User = {
      id: socketRef.current.id || "",
      name: userData.name,
      color: userData.color,
      joinedAt: new Date(),
    };

    setCurrentUser(user);
    socketRef.current.emit("join_room", userData);
  };

  const sendMessage = (content: string) => {
    if (!socketRef.current || !currentUser) return;
    socketRef.current.emit("send_message", content);
  };

  const leaveRoom = () => {
    if (!socketRef.current || !currentUser) return;
    socketRef.current.emit("leave_room");
    setCurrentUser(null);
    setUsers([]);
    setMessages([]);
  };

  return {
    isConnected: isConnected && currentUser !== null,
    users,
    messages,
    currentUser,
    joinRoom,
    sendMessage,
    leaveRoom,
  };
};
