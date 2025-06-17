export interface User {
  id: string;
  name: string;
  color: string;
  joinedAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: Date;
  type: "message" | "system";
}

export interface ChatRoom {
  id: string;
  users: User[];
  messages: Message[];
}

export interface ClientToServerEvents {
  join_room: (userData: { name: string; color: string }) => void;
  send_message: (message: string) => void;
  leave_room: () => void;
}

export interface ServerToClientEvents {
  user_joined: (user: User) => void;
  user_left: (userId: string) => void;
  new_message: (message: Message) => void;
  room_update: (room: ChatRoom) => void;
  error: (error: string) => void;
}
