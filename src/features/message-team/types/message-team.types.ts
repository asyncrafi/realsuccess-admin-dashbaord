export type ChatChannelType = "event-group" | "direct-staff";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSender: boolean; // true if sent by RealSuccess Staff / Admin
}

export interface TeamMember {
  id: string;
  name: string; // Full name internally
  displayName: string; // Privacy formatted name per client rule 7: e.g. "Elena R."
  email: string;
  avatar: string;
  role: string;
  online: boolean;
  channelType: ChatChannelType;
  eventName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  messages: ChatMessage[];
}
