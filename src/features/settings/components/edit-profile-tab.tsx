"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProfileTabProps {
  userName: string;
  setUserName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  contactNumber: string;
  setContactNumber: (val: string) => void;
  onSave?: () => Promise<boolean | void>;
  isSaving?: boolean;
}

export function EditProfileTab({
  userName,
  setUserName,
  email,
  setEmail,
  contactNumber,
  setContactNumber,
  onSave,
  isSaving,
}: EditProfileTabProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      await onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-left">
      {/* Admin Name */}
      <div className="space-y-2">
        <Label htmlFor="userName">Admin Name</Label>
        <Input
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Real Success Admin"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ourrealsuccess.com"
          className="h-12 rounded-xl bg-gray-100/70 border-gray-200 text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400">Primary administrator login email</p>
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="+1 (555) 000-0000"
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
          {isSaving ? "Saving..." : "Save Change"}
        </Button>
      </div>
    </form>
  );
}
