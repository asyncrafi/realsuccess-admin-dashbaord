export type SettingTabType = "edit-profile" | "change-password" | "privacy-policy" | "terms-conditions";

export interface UserProfileData {
  userName: string;
  email: string;
  contactNumber: string;
  role: string;
  avatar: string;
}

export interface PasswordChangeData {
  currentPassword: "";
  newPassword: "";
  confirmPassword: "";
}

export interface LegalDocumentData {
  privacyPolicyContent: string;
  termsConditionsContent: string;
}
