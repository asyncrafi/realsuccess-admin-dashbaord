"use client";

import { toast } from "sonner";
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
}

export function EditProfileTab({
  userName,
  setUserName,
  email,
  setEmail,
  contactNumber,
  setContactNumber,
}: EditProfileTabProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Admin profile changes saved successfully!");
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
          placeholder="Aminul Arnob"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="aiarnob23@gmail.com"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="+8801700700700"
          className="h-12 rounded-xl bg-gray-50/70 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Save Change Action Button */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-12 rounded-2xl bg-[oklch(0.48_0.1394_252.75)] hover:bg-[oklch(0.40_0.1394_252.75)] text-white font-bold text-base shadow-xs"
        >
          Save Change
        </Button>
      </div>
    </form>
  );
}
