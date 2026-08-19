import { apiClient } from "@/lib/api-client";
import { MOCK_TEAM_MEMBERS } from "../mock-data/message-team.data";
import { ChatMessage, TeamMember } from "../types/message-team.types";

export const messageTeamService = {
  /**
   * Fetch team members list
   * In future: apiClient.get<TeamMember[]>('/team/messages')
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_TEAM_MEMBERS;
  },

  /**
   * Send a message to team member
   * In future: apiClient.post<ChatMessage>('/team/messages', { memberId, text })
   */
  async sendMessage(memberId: string, text: string): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "admin",
      senderName: "Aminul Arnob",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSender: true,
    };

    const member = MOCK_TEAM_MEMBERS.find((m) => m.id === memberId);
    if (member) {
      member.messages.push(newMsg);
      member.lastMessage = text;
      member.lastMessageTime = newMsg.timestamp;
    }

    return newMsg;
  },
};
