"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X, Upload, FileText, Bell, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { announcementsService } from "../services/announcements.service";

export function CreateAnnouncementModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action");
  const isEdit = action === "edit";
  const isOpen = action === "create" || action === "edit";

  // Form States
  const [title, setTitle] = useState(isEdit ? "Workshop Schedule Updated" : "");
  const [eventName, setEventName] = useState(isEdit ? "Leadership Weekend" : "Leadership Weekend");
  const [category, setCategory] = useState(isEdit ? "Schedule Update" : "Schedule Update");
  const [priority, setPriority] = useState<"Important" | "Normal">(isEdit ? "Important" : "Important");
  const [status, setStatus] = useState<"Published" | "Draft">(isEdit ? "Published" : "Published");
  const [publishedBy, setPublishedBy] = useState(isEdit ? "Elena Rostova" : "Aminul Arnob");
  const [content, setContent] = useState(
    isEdit
      ? "Welcome to the RealSuccess Leadership Weekend. Please note that today's afternoon workshop has been rescheduled to 2:00 PM. Kindly arrive at the Main Hall at least 15 minutes before the session begins."
      : ""
  );
  const [takeawayTime, setTakeawayTime] = useState(isEdit ? "1:30 PM -> 2:00 PM" : "");
  const [takeawayVenue, setTakeawayVenue] = useState(isEdit ? "Main Auditorium" : "");
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("id");
    const newQuery = params.toString();
    router.push(newQuery ? `/announcements?${newQuery}` : "/announcements", {
      scroll: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await announcementsService.createAnnouncement({
      title,
      eventName,
      publishedBy,
      priority,
      status,
      category,
      content,
      takeawayTime,
      takeawayVenue,
    });

    toast.success(isEdit ? "Announcement updated & status published!" : "Announcement created successfully!");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <div className="p-1.5 rounded-full border border-gray-200 bg-white">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>{isEdit ? "Edit Announcement & Publish Status" : "Create New Announcement"}</span>
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
          {/* Announcement Information */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Announcement Basic Info
            </h3>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" required>
                Announcement Title
              </Label>
              <Input
                id="title"
                required
                placeholder="e.g. Workshop Schedule Updated"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Event */}
              <div className="space-y-2">
                <Label htmlFor="eventName" required>
                  Target Event
                </Label>
                <SelectDropdown
                  value={eventName}
                  onChange={(val) => setEventName(val)}
                  options={[
                    { label: "Leadership Weekend", value: "Leadership Weekend" },
                    { label: "RealSuccess 3-Day Workshop", value: "RealSuccess 3-Day Workshop" },
                    { label: "All Events", value: "All Events" },
                  ]}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" required>
                  Category / Tag
                </Label>
                <input
                  id="category"
                  list="categoryOptions"
                  required
                  placeholder="Select or type category (e.g. Schedule Update)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-12 w-full rounded-full border border-gray-200 bg-[#F6F7F9] px-5 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                />
                <datalist id="categoryOptions">
                  <option value="Schedule Update" />
                  <option value="Keynote Announcement" />
                  <option value="Venue Change" />
                  <option value="General Announcement" />
                  <option value="VIP Lounge Update" />
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" required>
                  Priority Level
                </Label>
                <SelectDropdown
                  value={priority}
                  onChange={(val) => setPriority(val as "Important" | "Normal")}
                  options={[
                    { label: "Important (High)", value: "Important" },
                    { label: "Normal", value: "Normal" },
                  ]}
                />
              </div>

              {/* Status (Publish Draft Control) */}
              <div className="space-y-2">
                <Label htmlFor="status" required>
                  Status (Publish Control)
                </Label>
                <SelectDropdown
                  value={status}
                  onChange={(val) => setStatus(val as "Published" | "Draft")}
                  options={[
                    { label: "Published (Live on App)", value: "Published" },
                    { label: "Draft (Hidden)", value: "Draft" },
                  ]}
                />
              </div>

              {/* Published By */}
              <div className="space-y-2">
                <Label htmlFor="publishedBy" required>
                  Publisher Name
                </Label>
                <Input
                  id="publishedBy"
                  required
                  value={publishedBy}
                  onChange={(e) => setPublishedBy(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Announcement Content & Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Announcement Message & Takeaways
            </h3>

            {/* Content Body */}
            <div className="space-y-2">
              <Label htmlFor="content" required>
                Announcement Message (App Notification Body)
              </Label>
              <textarea
                id="content"
                required
                rows={4}
                placeholder="Write the full message broadcasted to app users..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#F6F7F9] p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
              />
            </div>

            {/* Quick Key Takeaways */}
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[oklch(0.48_0.1394_252.75)] uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Quick Key Takeaways (Mobile Highlight Card)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Rescheduled Time</Label>
                  <Input
                    placeholder="e.g. 1:30 PM -> 2:00 PM"
                    value={takeawayTime}
                    onChange={(e) => setTakeawayTime(e.target.value)}
                    className="bg-white border-gray-200 h-10 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Venue Location</Label>
                  <Input
                    placeholder="e.g. Main Auditorium"
                    value={takeawayVenue}
                    onChange={(e) => setTakeawayVenue(e.target.value)}
                    className="bg-white border-gray-200 h-10 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attachments Dropzone */}
          <div className="space-y-2">
            <Label>Event Attachments (PDF / Image)</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F6F7F9] hover:bg-gray-100/80 transition-colors flex flex-col items-center justify-center cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-1 text-gray-500">
                <Upload className="h-6 w-6 stroke-[1.5]" />
                <span className="text-xs font-semibold text-gray-700">
                  {fileName ? fileName : "Upload schedule PDF or image preview"}
                </span>
                <span className="text-[10px] text-gray-400">PDF, PNG, JPG up to 10MB</span>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button type="submit" className="w-full sm:w-auto flex-1 h-12 rounded-full font-semibold text-base">
              {isEdit ? "Save & Update Status" : "Publish Announcement"}
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
