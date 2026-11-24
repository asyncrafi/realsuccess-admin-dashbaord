"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "../hooks/use-settings";
import { EditProfileTab } from "./edit-profile-tab";
import { ChangePasswordTab } from "./change-password-tab";
import { PrivacyPolicyTab } from "./privacy-policy-tab";
import { TermsConditionsTab } from "./terms-conditions-tab";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const {
    activeTab,
    setActiveTab,
    userName,
    setUserName,
    email,
    setEmail,
    contactNumber,
    setContactNumber,
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
    uploadAvatar,
    avatar,
    saving,
  } = useSettings();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayAvatar = avatarPreview || avatar || "/fallback_avatar.png";

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      await uploadAvatar(file);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Page Section Title */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Profile
      </h2>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 shadow-xs space-y-8">
        {/* User Profile Card Header */}
        <div className="flex items-center gap-5">
          {/* Avatar with Elegant Floating Camera Badge */}
          <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
            {/* Image Mask Circle */}
            <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-gray-100 bg-gray-50">
              <Image
                src={displayAvatar}
                alt={userName}
                fill
                className="object-cover"
                onError={() => setAvatarPreview("/fallback_avatar.png")}
              />
            </div>
            {/* Camera Upload Button Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 text-white hover:bg-black transition-all shadow-md cursor-pointer ring-2 ring-white hover:scale-105 active:scale-95 z-20 flex items-center justify-center"
              title="Change Profile Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* User Name & Role */}
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              {userName}
            </h3>
            <p className="text-sm font-semibold text-[#B89468]">
              Admin
            </p>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="flex items-center gap-6 border-b border-gray-100 text-sm font-bold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("edit-profile")}
            className={cn(
              "pb-3 transition-colors relative whitespace-nowrap cursor-pointer",
              activeTab === "edit-profile"
                ? "text-[oklch(0.48_0.1394_252.75)]"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <span>Edit Profile</span>
            {activeTab === "edit-profile" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.48_0.1394_252.75)] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("change-password")}
            className={cn(
              "pb-3 transition-colors relative whitespace-nowrap cursor-pointer",
              activeTab === "change-password"
                ? "text-[oklch(0.48_0.1394_252.75)]"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <span>Change Password</span>
            {activeTab === "change-password" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.48_0.1394_252.75)] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("privacy-policy")}
            className={cn(
              "pb-3 transition-colors relative whitespace-nowrap cursor-pointer",
              activeTab === "privacy-policy"
                ? "text-[oklch(0.48_0.1394_252.75)]"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <span>Privacy & Policy</span>
            {activeTab === "privacy-policy" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.48_0.1394_252.75)] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("terms-conditions")}
            className={cn(
              "pb-3 transition-colors relative whitespace-nowrap cursor-pointer",
              activeTab === "terms-conditions"
                ? "text-[oklch(0.48_0.1394_252.75)]"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <span>Terms & Conditions</span>
            {activeTab === "terms-conditions" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.48_0.1394_252.75)] rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === "edit-profile" && (
            <EditProfileTab
              userName={userName}
              setUserName={setUserName}
              email={email}
              setEmail={setEmail}
              contactNumber={contactNumber}
              setContactNumber={setContactNumber}
              onSave={saveProfile}
              isSaving={saving}
            />
          )}

          {activeTab === "change-password" && (
            <ChangePasswordTab
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSave={savePassword}
              isSaving={saving}
            />
          )}

          {activeTab === "privacy-policy" && (
            <PrivacyPolicyTab
              content={privacyPolicy}
              setContent={setPrivacyPolicy}
              onSave={savePrivacyPolicy}
              isSaving={saving}
            />
          )}

          {activeTab === "terms-conditions" && (
            <TermsConditionsTab
              content={termsConditions}
              setContent={setTermsConditions}
              onSave={saveTermsConditions}
              isSaving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
