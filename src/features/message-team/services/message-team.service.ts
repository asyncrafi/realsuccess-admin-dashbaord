import { apiClient } from "@/lib/api-client";
import { ChatMessage, TeamMember } from "../types/message-team.types";

export const messageTeamService = {
  /**
   * Fetch team members and attendee conversations list
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const res: any = await apiClient("/chat/team/");
      if (res && res.data) {
        return res.data;
      }
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error("Failed to load team members from API:", error);
      return [];
    }
  },

  /**
   * Send a message to team member or attendee conversation
   */
  async sendMessage(memberId: string, text: string): Promise<ChatMessage | null> {
    try {
      const res: any = await apiClient("/chat/messages/", {
        method: "POST",
        data: {
          member_id: memberId,
          text,
          attachment_url: "",
        },
      });
      return res?.data || null;
    } catch (error) {
      console.error("Failed to send message via API:", error);
      return null;
    }
  },
};
