"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordTabProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  onSave?: () => Promise<boolean | void>;
  isSaving?: boolean;
}

export function ChangePasswordTab({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSave,
  isSaving,
}: ChangePasswordTabProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      await onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-left">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="********"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Save Change Action Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSaving}
          className="w-full h-12 rounded-2xl bg-[oklch(0.48_0.1394_252.75)] hover:bg-[oklch(0.40_0.1394_252.75)] text-white font-bold text-base shadow-xs disabled:opacity-50"
        >
          {isSaving ? "Updating Password..." : "Save Change"}
        </Button>
      </div>
    </form>
  );
}
