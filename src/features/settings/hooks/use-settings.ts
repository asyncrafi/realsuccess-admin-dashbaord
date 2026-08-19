"use client";

import { useState } from "react";
import { SettingTabType } from "../types/settings.types";

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingTabType>("edit-profile");

  // Profile Form State
  const [userName, setUserName] = useState("Aminul Arnob");
  const [email, setEmail] = useState("aiarnob23@gmail.com");
  const [contactNumber, setContactNumber] = useState("+8801700700700");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Privacy Policy HTML Content
  const [privacyPolicy, setPrivacyPolicy] = useState(
    `<p><strong>1. Information We Collect</strong></p><p>We collect personal information to provide and improve our services. The types of information we collect include:</p><p><strong>a. Information You Provide Directly:</strong></p><ul style="padding-left: 20px;"><li>Account Registration: Name, email address, team name, age group, and other details required for registration.</li><li>Uploaded Content: Videos, scores, and other materials submitted for events.</li><li>Communication: Any messages or inquiries sent to us.</li></ul><p><strong>b. Automatically Collected Information:</strong></p><ul style="padding-left: 20px;"><li>Device Information: IP address, browser type, operating system, and device identifiers.</li><li>Usage Data: Pages visited, time spent on pages, and navigation patterns.</li></ul><p><strong>c. Cookies and Tracking Technologies:</strong></p><p>We use cookies to enhance your experience, track usage, and analyze performance. You can manage your cookie preferences in your browser settings.</p>`
  );

  // Terms & Conditions HTML Content
  const [termsConditions, setTermsConditions] = useState(
    `<p><strong>1. Terms of Use & Event Governance</strong></p><p>By accessing or using the RealSuccess Platform, you agree to comply with and be bound by all terms, policies, and code of conduct guidelines.</p><p><strong>a. User Responsibilities:</strong></p><ul style="padding-left: 20px;"><li>Maintain accurate profile information.</li><li>Respect event guidelines and community standards.</li></ul><p><strong>b. Platform Rights:</strong></p><ul style="padding-left: 20px;"><li>RealSuccess reserves the right to update event schedules, venue details, or attendee access as necessary for event operations.</li></ul>`
  );

  return {
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
  };
}
