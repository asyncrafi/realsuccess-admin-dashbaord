"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Copy,
  RotateCw,
  X,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { apiClient } from "@/lib/api-client";

function formatTime12h(time24: string, subtractMinutes = 0): string {
  const [hStr, mStr] = (time24 || "09:00").split(":");
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const totalMins = (((h * 60 + m - subtractMinutes) % 1440) + 1440) % 1440;
  const finalH = Math.floor(totalMins / 60);
  const finalM = totalMins % 60;
  const ampm = finalH >= 12 ? "PM" : "AM";
  const displayH = finalH % 12 === 0 ? 12 : finalH % 12;
  return `${displayH}:${String(finalM).padStart(2, "0")} ${ampm}`;
}

export function CreateEventModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action");
  const eventId = searchParams.get("id");
  const isEdit = action === "edit";
  const isOpen = action === "create" || action === "edit";

  const todayStr = new Date().toISOString().split("T")[0];

  // Form States
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("Workshop");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // Date Range & Time State
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [checkInEarlyMinutes, setCheckInEarlyMinutes] = useState("30");

  // Venue States
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // Access Code State
  const [accessCode, setAccessCode] = useState("RS-AUG-2026-001");
  const [autoActivate, setAutoActivate] = useState(true);

  // Event Settings States
  const [registrationStatus, setRegistrationStatus] = useState("Open");
  const [eventStatus, setEventStatus] = useState("Active");
  const [maxAttendees, setMaxAttendees] = useState("500");
  const [unlimitedAttendees, setUnlimitedAttendees] = useState(false);
  const [price, setPrice] = useState("0");
  const [isFree, setIsFree] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setEventName("");
    setDescription("");
    setEventType("Workshop");
    setCoverImage(null);
    setCoverImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setStartDate(today);
    setEndDate(today);
    setStartTime("09:00");
    setEndTime("17:00");
    setCheckInEarlyMinutes("30");
    setVenueName("");
    setAddress("");
    setCity("");
    setEventStatus("Active");
    setRegistrationStatus("Open");
    setMaxAttendees("500");
    setUnlimitedAttendees(false);
    setPrice("0");
    setIsFree(true);
    const random = Math.floor(100 + Math.random() * 900);
    setAccessCode(`RS-AUG-2026-${random}`);
  };

  // Load real event data when editing, or reset cleanly when creating/closing
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }
    if (isEdit && eventId) {
      setCoverImage(null);
      setCoverImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      apiClient(`/events/${eventId}/`)
        .then((res: any) => {
          const ev = res?.data || res;
          if (!ev) return;
          setEventName(ev.name || "");
          setDescription(ev.description || "");
          setVenueName(ev.venue || "");
          setAccessCode(ev.access_code || "");
          setEventStatus(ev.status || "Active");
          setMaxAttendees(String(ev.total_tickets || 400));
          const evPrice = parseFloat(ev.price ?? "0") || 0;
          setPrice(String(evPrice));
          setIsFree(evPrice <= 0);
          setStartDate(ev.start_date || todayStr);
          setEndDate(ev.end_date || ev.start_date || todayStr);
          setStartTime(ev.start_time ? String(ev.start_time).slice(0, 5) : "09:00");
          setEndTime(ev.end_time ? String(ev.end_time).slice(0, 5) : "17:00");
          setCheckInEarlyMinutes(String(ev.check_in_early_minutes ?? 30));
          setCoverImage(ev.banner_image || null);
        })
        .catch(() => {});
    } else if (!isEdit) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEdit, eventId]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    // URL-based modal closing: remove action param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("id");
    const newQuery = params.toString();
    router.push(newQuery ? `/events?${newQuery}` : "/events", { scroll: false });
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
      setCoverImageFile(file);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }
    if (endDate && startDate && endDate < startDate) {
      toast.error("To Date cannot be earlier than From Date");
      return;
    }
    setSubmitting(true);
    try {
      const numericPrice = isFree ? 0 : Math.max(0, parseFloat(price) || 0);
      const earlyMins = Math.max(0, parseInt(checkInEarlyMinutes, 10) || 30);
      const sDate = startDate || todayStr;
      const eDate = endDate || sDate;
      const startMs = new Date(sDate).getTime();
      const endMs = new Date(eDate).getTime();
      const daysDuration = Math.max(1, Math.round((endMs - startMs) / 86400000) + 1);

      const finalAccessCode =
        accessCode.trim() || `RS-AUG-2026-${Math.floor(100 + Math.random() * 900)}`;

      let bodyData: FormData | Record<string, any>;
      if (coverImageFile) {
        const fd = new FormData();
        fd.append("name", eventName.trim());
        fd.append("description", description.trim());
        fd.append("access_code", finalAccessCode);
        fd.append("venue", venueName.trim() || "RealSuccess Center");
        fd.append("start_date", sDate);
        fd.append("end_date", eDate);
        fd.append("start_time", `${startTime || "09:00"}:00`);
        fd.append("end_time", `${endTime || "17:00"}:00`);
        fd.append("check_in_early_minutes", String(earlyMins));
        fd.append("days_duration", String(daysDuration));
        fd.append("total_tickets", String(parseInt(maxAttendees, 10) || 400));
        fd.append("price", String(numericPrice));
        fd.append("status", eventStatus || "Active");
        fd.append("banner_image", coverImageFile);
        bodyData = fd;
      } else {
        bodyData = {
          name: eventName.trim(),
          description: description.trim(),
          access_code: finalAccessCode,
          venue: venueName.trim() || "RealSuccess Center",
          start_date: sDate,
          end_date: eDate,
          start_time: `${startTime || "09:00"}:00`,
          end_time: `${endTime || "17:00"}:00`,
          check_in_early_minutes: earlyMins,
          days_duration: daysDuration,
          total_tickets: parseInt(maxAttendees, 10) || 400,
          price: numericPrice,
          status: eventStatus || "Active",
        };
      }

      if (isEdit && eventId) {
        await apiClient(`/events/${eventId}/`, { method: "PUT", data: bodyData });
        toast.success("Event updated successfully!");
      } else {
        await apiClient("/events/", { method: "POST", data: bodyData });
        toast.success("Event created successfully!");
      }

      window.dispatchEvent(new CustomEvent("eventUpdated"));
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
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

          {/* 2. Date Range & Check-in Time */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-gray-900">Date & Time</h3>
              <span className="text-xs text-gray-500 font-medium">
                Select event date range & check-in window
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* From Date */}
                <div className="space-y-1">
                  <Label className="text-xs">From Date *</Label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStartDate(val);
                      if (endDate && val > endDate) {
                        setEndDate(val);
                      }
                    }}
                    className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                  />
                </div>

                {/* To Date */}
                <div className="space-y-1">
                  <Label className="text-xs">To Date *</Label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Start Time */}
                <div className="space-y-1">
                  <Label className="text-xs">Start Time *</Label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-1">
                  <Label className="text-xs">End Time *</Label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                  />
                </div>

                {/* Check-in Early Minutes */}
                <div className="space-y-1">
                  <Label className="text-xs">Check-in Early (mins)</Label>
                  <input
                    type="number"
                    min="0"
                    max="720"
                    value={checkInEarlyMinutes}
                    onChange={(e) => setCheckInEarlyMinutes(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                  />
                </div>
              </div>

              {/* Check-in Time Preview */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 font-medium">
                <Clock className="h-4 w-4 text-[oklch(0.48_0.1394_252.75)] flex-shrink-0" />
                <span>
                  App Check-in Time:{" "}
                  <strong>
                    {formatTime12h(
                      startTime,
                      Math.max(0, parseInt(checkInEarlyMinutes, 10) || 0)
                    )}
                  </strong>{" "}
                  ({Math.max(0, parseInt(checkInEarlyMinutes, 10) || 0)} mins before{" "}
                  {formatTime12h(startTime)} start)
                </span>
              </div>
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

              {/* Event Status (Default: Active) */}
              <div className="space-y-2">
                <Label htmlFor="eventStatus" required>
                  Event Status
                </Label>
                <SelectDropdown
                  value={eventStatus}
                  onChange={(val) => setEventStatus(val)}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Upcoming", value: "Upcoming" },
                    { label: "Completed", value: "Completed" },
                  ]}
                />
              </div>
            </div>

            {/* Event Ticket Pricing */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-[#F6F7F9] space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="eventPrice" className="font-bold text-gray-800">
                  Ticket Price (USD)
                </Label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => {
                      setIsFree(e.target.checked);
                      if (e.target.checked) setPrice("0");
                    }}
                    className="h-4 w-4 accent-[oklch(0.48_0.1394_252.75)] cursor-pointer"
                  />
                  <span>Free Event ($0)</span>
                </label>
              </div>
              <Input
                id="eventPrice"
                type="number"
                min="0"
                step="0.01"
                disabled={isFree}
                placeholder={isFree ? "Free ($0.00)" : "Enter ticket price (e.g. 99.00)"}
                value={isFree ? "0" : price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white border-gray-200"
              />
              <p className="text-[11px] text-gray-500">
                {isFree
                  ? "Attendees who scan the event QR will receive a confirmed free ticket immediately."
                  : "Attendees who scan the event QR will receive a ticket with Pending Payment status until you verify payment."}
              </p>
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
              disabled={submitting}
              className="w-full sm:w-auto flex-1 h-12 rounded-full font-semibold text-base"
            >
              {submitting ? "Saving..." : isEdit ? "Update Event" : "Create"}
            </Button>
            <button
              type="button"
              disabled={submitting}
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
