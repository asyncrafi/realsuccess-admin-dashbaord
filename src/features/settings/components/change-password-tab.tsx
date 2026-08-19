"use client";

import { toast } from "sonner";
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
}

export function ChangePasswordTab({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}: ChangePasswordTabProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
          placeholder="********"
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
          placeholder="********"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Update Password Action Button */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-12 rounded-2xl bg-[oklch(0.48_0.1394_252.75)] hover:bg-[oklch(0.40_0.1394_252.75)] text-white font-bold text-base shadow-xs"
        >
          Update password
        </Button>
      </div>
    </form>
  );
}
