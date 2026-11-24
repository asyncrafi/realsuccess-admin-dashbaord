"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SettingTabType } from "../types/settings.types";
import { settingsService } from "../services/settings.service";

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingTabType>("edit-profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Profile Form State
  const [userName, setUserName] = useState("Real Success Admin");
  const [email, setEmail] = useState("admin@ourrealsuccess.com");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("Super Admin");
  const [avatar, setAvatar] = useState("/fallback_avatar.png");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Legal Documents
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsConditions, setTermsConditions] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [profile, legal] = await Promise.all([
          settingsService.getProfile(),
          settingsService.getLegalDocuments(),
        ]);

        if (!mounted) return;

        if (profile) {
          setUserName(profile.userName || "Real Success Admin");
          setEmail(profile.email || "admin@ourrealsuccess.com");
          setContactNumber(profile.contactNumber || "");
          setRole(profile.role || "Super Admin");
          if (profile.avatar) setAvatar(profile.avatar);
        }

        if (legal) {
          if (legal.privacy) setPrivacyPolicy(legal.privacy);
          if (legal.terms) setTermsConditions(legal.terms);
        }
      } catch (err) {
        console.error("Failed to load settings from API", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);
      await settingsService.updateProfile({
        userName,
        contactNumber,
      });
      toast.success("Admin profile updated successfully!");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return false;
    }
    if (!newPassword) {
      toast.error("Please enter your new password");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return false;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return false;
    }

    try {
      setSaving(true);
      await settingsService.updatePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const savePrivacyPolicy = async (contentToSave?: string) => {
    const content = contentToSave !== undefined ? contentToSave : privacyPolicy;
    try {
      setSaving(true);
      await settingsService.updateLegalDocument("privacy", content);
      toast.success("Privacy Policy updated successfully!");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to update Privacy Policy");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveTermsConditions = async (contentToSave?: string) => {
    const content = contentToSave !== undefined ? contentToSave : termsConditions;
    try {
      setSaving(true);
      await settingsService.updateLegalDocument("terms", content);
      toast.success("Terms & Conditions updated successfully!");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Failed to update Terms & Conditions");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    saving,
    userName,
    setUserName,
    email,
    setEmail,
    contactNumber,
    setContactNumber,
    role,
    avatar,
    setAvatar,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    privacyPolicy,
    setPrivacyPolicy,
    termsConditions,
    setTermsConditions,
    saveProfile,
    savePassword,
    savePrivacyPolicy,
    saveTermsConditions,
  };
}
