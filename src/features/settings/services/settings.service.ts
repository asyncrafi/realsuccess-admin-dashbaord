import { apiClient } from "@/lib/api-client";
import { UserProfileData } from "../types/settings.types";

export const settingsService = {
  /**
   * Fetch current admin profile settings
   * In future: apiClient.get<UserProfileData>('/admin/profile')
   */
  async getProfile(): Promise<UserProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      userName: "Maietry Cruz",
      email: "Sarah@gamil.com",
      contactNumber: "+99007007007",
      role: "Admin",
      avatar: "/fallback_avatar.png",
    };
  },

  /**
   * Update profile information
   * In future: apiClient.put<UserProfileData>('/admin/profile', data)
   */
  async updateProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      userName: data.userName || "Maietry Cruz",
      email: data.email || "Sarah@gamil.com",
      contactNumber: data.contactNumber || "+99007007007",
      role: "Admin",
      avatar: data.avatar || "/fallback_avatar.png",
    };
  },

  /**
   * Update Password
   * In future: apiClient.post('/admin/change-password', { currentPassword, newPassword })
   */
  async updatePassword(data: any): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  },

  /**
   * Save legal documents (Privacy & Terms)
   */
  async updateLegalDocument(type: "privacy" | "terms", content: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  },
};
