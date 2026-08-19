"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Copy,
  RotateCw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/ui/select-dropdown";

interface DaySchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export function CreateEventModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action");
  const eventId = searchParams.get("id");
  const isEdit = action === "edit";
  const isOpen = action === "create" || action === "edit";

  // Form States
  const [eventName, setEventName] = useState(isEdit ? "RealSuccess Leadership Weekend" : "");
  const [description, setDescription] = useState(isEdit ? "Leadership & professional growth event organized by RealSuccess." : "");
  const [eventType, setEventType] = useState(isEdit ? "Conference" : "Workshop");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Multi-day Schedule State
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { id: "day-1", date: "2026-07-12", startTime: "09:00", endTime: "17:00" },
  ]);

  // Venue States
  const [venueName, setVenueName] = useState(isEdit ? "Main Auditorium" : "");
  const [address, setAddress] = useState(isEdit ? "RealSuccess Center, Avenue 4" : "");
  const [city, setCity] = useState(isEdit ? "Dhaka" : "");

  // Access Code State
  const [accessCode, setAccessCode] = useState(isEdit ? "RS-AUG-2026-002" : "RS-AUG-2026-001");
  const [autoActivate, setAutoActivate] = useState(true);

  // Event Settings States
  const [registrationStatus, setRegistrationStatus] = useState("Open");
  const [eventStatus, setEventStatus] = useState("Published");
  const [maxAttendees, setMaxAttendees] = useState("500");
  const [unlimitedAttendees, setUnlimitedAttendees] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    // URL-based modal closing: remove action param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    const newQuery = params.toString();
    router.push(newQuery ? `/events?${newQuery}` : "/events", { scroll: false });
  };

  // Add another day to schedule
  const handleAddDay = () => {
    setSchedules([
      ...schedules,
      {
        id: `day-${Date.now()}`,
        date: "",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
      },
    ]);
  };

  // Remove a day from schedule
  const handleRemoveDay = (id: string) => {
    if (schedules.length <= 1) return;
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  // Update schedule field
  const handleScheduleChange = (
    id: string,
    field: keyof DaySchedule,
    value: string
  ) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  };

  // Regenerate Access Code
  const handleRegenerateCode = () => {
    const random = Math.floor(100 + Math.random() * 900);
    const newCode = `RS-AUG-2026-${random}`;
    setAccessCode(newCode);
    toast.success("New event access code generated!");
  };

  // Copy Access Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode);
    toast.success("Access code copied to clipboard!");
  };

  // Create Event Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Event created successfully!");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <div className="p-1.5 rounded-full border border-gray-200 bg-white">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>{isEdit ? "Edit Event" : "Create New Event"}</span>
          </button>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-8 text-left">
          {/* 1. Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              Event Information
            </h3>

            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="eventName" required>
                Event Name
              </Label>
              <Input
                id="eventName"
                required
                placeholder="RealSuccess Leadership Weekend"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" required>
                Description
              </Label>
              <textarea
                id="description"
                required
                rows={3}
                placeholder="Write a short description about this event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#F6F7F9] p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
              />
            </div>

            {/* Cover Image Upload Dropzone */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F6F7F9] hover:bg-gray-100/80 transition-colors flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <Upload className="h-7 w-7 stroke-[1.5]" />
                    <span className="text-sm font-medium">Cover image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Type (Select or Type Custom) */}
            <div className="space-y-2">
              <Label htmlFor="eventType" required>
                Event Type
              </Label>
              <input
                id="eventType"
                list="eventTypeOptions"
                required
                placeholder="Select or type event type (e.g. Workshop, Summit...)"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="flex h-12 w-full rounded-full border border-gray-200 bg-[#F6F7F9] px-5 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
              />
              <datalist id="eventTypeOptions">
                <option value="Workshop" />
                <option value="Conference" />
                <option value="Seminar" />
                <option value="Webinar" />
                <option value="Networking" />
                <option value="Exhibition" />
                <option value="Summit" />
              </datalist>
            </div>
          </div>

          {/* 2. Date & Time Multi-Day Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-gray-900">Date & Time</h3>
              <span className="text-xs text-gray-500 font-medium">
                Set single or multi-day schedules
              </span>
            </div>

            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div
                  key={schedule.id}
                  className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[oklch(0.48_0.1394_252.75)] uppercase tracking-wider">
                      Day {index + 1} Schedule
                    </span>
                    {schedules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(schedule.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Date */}
                    <div className="space-y-1">
                      <Label className="text-xs">Date *</Label>
                      <input
                        type="date"
                        required
                        value={schedule.date}
                        onChange={(e) =>
                          handleScheduleChange(schedule.id, "date", e.target.value)
                        }
                        className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                      />
                    </div>

                    {/* Start Time */}
                    <div className="space-y-1">
                      <Label className="text-xs">Start Time *</Label>
                      <input
                        type="time"
                        required
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleScheduleChange(schedule.id, "startTime", e.target.value)
                        }
                        className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                      />
                    </div>

                    {/* End Time */}
                    <div className="space-y-1">
                      <Label className="text-xs">End Time *</Label>
                      <input
                        type="time"
                        required
                        value={schedule.endTime}
                        onChange={(e) =>
                          handleScheduleChange(schedule.id, "endTime", e.target.value)
                        }
                        className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Another Day Action Button */}
              <button
                type="button"
                onClick={handleAddDay}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-[oklch(0.48_0.1394_252.75)]/40 hover:border-[oklch(0.48_0.1394_252.75)] text-[oklch(0.48_0.1394_252.75)] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-blue-50/30"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                Add Another Day
              </button>
            </div>
          </div>

          {/* 3. Venue Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              Venue Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venueName" required>
                  Venue Name
                </Label>
                <Input
                  id="venueName"
                  required
                  placeholder="RealSuccess Center"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" required>
                  Address
                </Label>
                <Input
                  id="address"
                  required
                  placeholder="Enter venue address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          {/* 4. Event Access Code Card */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900">Event Access Code</h3>
            <p className="text-xs text-gray-500">
              This code connects attendees to this specific event after they download the app.
            </p>

            <div className="p-4 rounded-2xl border border-gray-200 bg-[#F6F7F9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Code
                </span>
                <p className="text-base font-extrabold text-gray-900 tracking-wide font-mono">
                  {accessCode}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-gray-500" />
                  Copy Code
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="px-4 py-2 rounded-full bg-[oklch(0.48_0.1394_252.75)] text-white hover:bg-[oklch(0.40_0.1394_252.75)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="autoActivate"
                checked={autoActivate}
                onChange={(e) => setAutoActivate(e.target.checked)}
                className="h-4 w-4 rounded-full text-[oklch(0.48_0.1394_252.75)] accent-[oklch(0.48_0.1394_252.75)] cursor-pointer"
              />
              <label htmlFor="autoActivate" className="text-xs font-medium text-gray-700 cursor-pointer">
                Automatically activate this code when the event is published
              </label>
            </div>
          </div>

          {/* 5. Event Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              Event Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Registration Status */}
              <div className="space-y-2">
                <Label htmlFor="registrationStatus" required>
                  Registration Status
                </Label>
                <SelectDropdown
                  value={registrationStatus}
                  onChange={(val) => setRegistrationStatus(val)}
                  options={[
                    { label: "Open", value: "Open" },
                    { label: "Closed", value: "Closed" },
                    { label: "Invite Only", value: "Invite Only" },
                  ]}
                />
              </div>

              {/* Event Status (Default: Published as requested) */}
              <div className="space-y-2">
                <Label htmlFor="eventStatus" required>
                  Event Status
                </Label>
                <SelectDropdown
                  value={eventStatus}
                  onChange={(val) => setEventStatus(val)}
                  options={[
                    { label: "Published", value: "Published" },
                    { label: "Draft", value: "Draft" },
                    { label: "Archived", value: "Archived" },
                  ]}
                />
              </div>
            </div>

            {/* Maximum Attendees (Free Custom Number Input) */}
            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Maximum Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                min="1"
                placeholder={unlimitedAttendees ? "Unlimited" : "Enter maximum attendees (e.g. 500)"}
                disabled={unlimitedAttendees}
                value={unlimitedAttendees ? "" : maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                className="bg-[#F6F7F9] border-gray-200"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="unlimitedAttendees"
                checked={unlimitedAttendees}
                onChange={(e) => setUnlimitedAttendees(e.target.checked)}
                className="h-4 w-4 rounded-full accent-[oklch(0.48_0.1394_252.75)] cursor-pointer"
              />
              <label htmlFor="unlimitedAttendees" className="text-xs font-medium text-gray-700 cursor-pointer">
                Unlimited Attendees
              </label>
            </div>
          </div>

          {/* Modal Footer Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="submit"
              className="w-full sm:w-auto flex-1 h-12 rounded-full font-semibold text-base"
            >
              {isEdit ? "Update Event" : "Create"}
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
