import { apiClient } from "@/lib/api-client";
import { ChatMessage, TeamMember } from "../types/message-team.types";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.ourrealsuccess.com/api").replace(/\/+$/, "");

export const messageTeamService = {
  /**
   * Build authenticated WebSocket URL for real-time chat
   */
  getWebSocketUrl(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) return null;

    // Convert https://api.ourrealsuccess.com/api -> wss://api.ourrealsuccess.com/ws/chat/?token=...
    const wsOrigin = API_BASE.replace(/\/api$/, "").replace(/^http/, "ws");
    return `${wsOrigin}/ws/chat/?token=${encodeURIComponent(token)}`;
  },

  /**
   * Fetch team members and attendee conversations list in admin mode
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const res: any = await apiClient("/chat/team/?mode=admin");
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
   * Send a message to team member or attendee conversation (REST fallback)
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
