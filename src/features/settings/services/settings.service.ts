import { apiClient } from "@/lib/api-client";
import { UserProfileData } from "../types/settings.types";

export interface LegalDocumentsResponse {
  privacy: string;
  terms: string;
  updatedAt?: string;
}

export const settingsService = {
  /**
   * Fetch current admin profile settings from Django backend
   */
  async getProfile(): Promise<UserProfileData> {
    try {
      const res: any = await apiClient("/auth/profile/");
      const profile = res?.data || {};
      return {
        userName: profile.name || "Real Success Admin",
        email: profile.email || "admin@ourrealsuccess.com",
        contactNumber: profile.phone || "",
        role: "Super Admin",
        avatar: profile.profile_picture || "/fallback_avatar.png",
      };
    } catch {
      return {
        userName: "Real Success Admin",
        email: "admin@ourrealsuccess.com",
        contactNumber: "+1 (555) 000-0000",
        role: "Super Admin",
        avatar: "/fallback_avatar.png",
      };
    }
  },

  /**
   * Update profile information
   */
  async updateProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
    const payload: Record<string, any> = {};
    if (data.userName) payload.name = data.userName;
    if (data.contactNumber !== undefined) payload.phone = data.contactNumber;

    const res: any = await apiClient("/auth/profile/", {
      method: "PUT",
      data: payload,
    });
    const profile = res?.data || {};
    return {
      userName: profile.name || data.userName || "Admin",
      email: profile.email || data.email || "",
      contactNumber: profile.phone || data.contactNumber || "",
      role: "Super Admin",
      avatar: profile.profile_picture || data.avatar || "/fallback_avatar.png",
    };
  },

  /**
   * Update Password via Django /api/auth/password/change/
   */
  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<boolean> {
    await apiClient("/auth/password/change/", {
      method: "POST",
      data: {
        old_password: data.currentPassword,
        new_password: data.newPassword,
      },
    });
    return true;
  },

  /**
   * Fetch legal documents (Privacy & Terms) from backend /api/content/legal/
   */
  async getLegalDocuments(): Promise<LegalDocumentsResponse> {
    try {
      const res: any = await apiClient("/content/legal/");
      const doc = res?.data || {};
      return {
        privacy: doc.privacy_policy_content || "",
        terms: doc.terms_conditions_content || "",
        updatedAt: doc.updated_at,
      };
    } catch {
      return {
        privacy: "",
        terms: "",
      };
    }
  },

  /**
   * Save legal documents (Privacy & Terms) to backend /api/content/legal/
   */
  async updateLegalDocument(type: "privacy" | "terms", content: string): Promise<boolean> {
    const payload =
      type === "privacy"
        ? { privacy_policy_content: content }
        : { terms_conditions_content: content };

    await apiClient("/content/legal/", {
      method: "PUT",
      data: payload,
    });
    return true;
  },
};
