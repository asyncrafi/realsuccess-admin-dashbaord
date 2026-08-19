"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { SessionStatus, SessionType } from "../types/schedule.types";

export function CreateScheduleModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action");
  const isEdit = action === "edit";
  const isOpen = action === "create" || action === "edit";

  // Form States
  const [sessionTitle, setSessionTitle] = useState(isEdit ? "Opening Keynote" : "");
  const [speakerName, setSpeakerName] = useState(isEdit ? "Elena Rostova" : "");
  const [speakerRole, setSpeakerRole] = useState(isEdit ? "Chief Executive Officer" : "");
  const [time, setTime] = useState(isEdit ? "09:00 AM" : "09:00 AM");
  const [date, setDate] = useState(isEdit ? "2026-07-12" : "");
  const [venue, setVenue] = useState(isEdit ? "Main Auditorium" : "");
  const [type, setType] = useState<SessionType>(isEdit ? "Keynote" : "Keynote");
  const [status, setStatus] = useState<SessionStatus>(isEdit ? "Published" : "Published");
  const [description, setDescription] = useState(
    isEdit ? "Welcome speech and vision setting for RealSuccess Leadership Weekend." : ""
  );

  if (!isOpen) return null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("id");
    const newQuery = params.toString();
    router.push(newQuery ? `/schedule?${newQuery}` : "/schedule", { scroll: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isEdit ? "Session updated successfully!" : "Session created & published!");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-xl my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <div className="p-1.5 rounded-full border border-gray-200 bg-white">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>{isEdit ? "Edit Session & Publish Status" : "Create New Session"}</span>
          </button>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6 text-left">
          <div className="space-y-4">
            {/* Session Title */}
            <div className="space-y-2">
              <Label htmlFor="sessionTitle" required>
                Session Title
              </Label>
              <Input
                id="sessionTitle"
                required
                placeholder="e.g. Opening Keynote"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Speaker Name */}
              <div className="space-y-2">
                <Label htmlFor="speakerName" required>
                  Speaker Name
                </Label>
                <Input
                  id="speakerName"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              {/* Speaker Role */}
              <div className="space-y-2">
                <Label htmlFor="speakerRole">Speaker Role</Label>
                <Input
                  id="speakerRole"
                  placeholder="e.g. Chief Executive Officer"
                  value={speakerRole}
                  onChange={(e) => setSpeakerRole(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="time" required>
                  Start Time
                </Label>
                <Input
                  id="time"
                  required
                  placeholder="e.g. 09:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <Label htmlFor="venue" required>
                  Venue
                </Label>
                <Input
                  id="venue"
                  required
                  placeholder="e.g. Main Auditorium"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" required>
                  Session Type
                </Label>
                <SelectDropdown
                  value={type}
                  onChange={(val) => setType(val as SessionType)}
                  options={[
                    { label: "Keynote", value: "Keynote" },
                    { label: "Panel", value: "Panel" },
                    { label: "Workshop", value: "Workshop" },
                    { label: "Networking", value: "Networking" },
                    { label: "Breakout", value: "Breakout" },
                  ]}
                />
              </div>
            </div>

            {/* Session Status (Draft vs Published) */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <Label htmlFor="status" required>
                Session Status (Publish Control)
              </Label>
              <SelectDropdown
                value={status}
                onChange={(val) => setStatus(val as SessionStatus)}
                options={[
                  { label: "Published (Visible on App)", value: "Published" },
                  { label: "Draft (Hidden)", value: "Draft" },
                  { label: "Cancelled", value: "Cancelled" },
                ]}
              />
            </div>

            {/* Session Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Session Description</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Brief summary of the session agenda..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#F6F7F9] p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Button type="submit" className="w-full sm:w-auto flex-1 h-12 rounded-full font-semibold text-base">
              {isEdit ? "Save & Update Status" : "Create Session"}
            </Button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto flex-1 h-12 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-semibold text-base transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
