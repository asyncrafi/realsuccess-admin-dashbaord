"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { SessionStatus, SessionType } from "../types/schedule.types";
import { scheduleService } from "../services/schedule.service";
import { apiClient } from "@/lib/api-client";

interface EventOption {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
}

function formatTime12h(time24: string): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function CreateScheduleModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action");
  const sessionId = searchParams.get("id");
  const isEdit = action === "edit";
  const isOpen = action === "create" || action === "edit";

  const todayStr = new Date().toISOString().split("T")[0];

  // Events list for dropdown
  const [eventsList, setEventsList] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Form States
  const [sessionTitle, setSessionTitle] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [speakerRole, setSpeakerRole] = useState("");
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [venue, setVenue] = useState("");
  const [type, setType] = useState<SessionType>("Keynote");
  const [status, setStatus] = useState<SessionStatus>("Published");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedEvent = eventsList.find((e) => e.id === selectedEventId);

  // Load events and session (if editing) when modal opens
  useEffect(() => {
    if (!isOpen) return;

    apiClient("/events/")
      .then((res: any) => {
        const items = res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(items)) {
          const mapped: EventOption[] = items.map((ev: any) => ({
            id: String(ev.id),
            name: ev.name,
            startDate: ev.start_date || todayStr,
            endDate: ev.end_date || ev.start_date || todayStr,
            venue: ev.venue || "Main Auditorium",
          }));
          setEventsList(mapped);
          if (!isEdit && mapped.length > 0) {
            setSelectedEventId((prev) => prev || mapped[0].id);
            setDate((prev) => prev || mapped[0].startDate);
            setVenue((prev) => prev || mapped[0].venue);
          }
        }
      })
      .catch(() => {});

    if (isEdit && sessionId) {
      apiClient(`/schedule/sessions/${sessionId}/`)
        .then((res: any) => {
          const s = res?.data || res;
          if (!s) return;
          setSelectedEventId(s.event ? String(s.event) : "");
          setSessionTitle(s.sessionTitle || s.session_title || "");
          setSpeakerName(s.speakerName || "");
          setSpeakerRole(s.speakerRole || "");
          setDate(s.date || todayStr);
          setStartTime(s.start_time ? String(s.start_time).slice(0, 5) : "09:00");
          setEndTime(s.end_time ? String(s.end_time).slice(0, 5) : "10:30");
          setVenue(s.venue || "");
          setType((s.type as SessionType) || "Keynote");
          setStatus((s.status as SessionStatus) || "Published");
          setDescription(s.description || "");
        })
        .catch(() => {});
    } else if (!isEdit) {
      setSessionTitle("");
      setSpeakerName("");
      setSpeakerRole("");
      setDate(todayStr);
      setStartTime("09:00");
      setEndTime("10:30");
      setVenue("");
      setType("Keynote");
      setStatus("Published");
      setDescription("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEdit, sessionId]);

  if (!isOpen) return null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("id");
    const newQuery = params.toString();
    router.push(newQuery ? `/schedule?${newQuery}` : "/schedule", { scroll: false });
  };

  const handleEventChange = (evId: string) => {
    setSelectedEventId(evId);
    const ev = eventsList.find((e) => e.id === evId);
    if (ev && !isEdit) {
      setDate(ev.startDate || todayStr);
      if (!venue) setVenue(ev.venue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      toast.error("Please select an event for this schedule");
      return;
    }
    if (!date) {
      toast.error("Please select the session date");
      return;
    }
    setSubmitting(true);
    try {
      const formattedTimeRange =
        endTime && endTime !== startTime
          ? `${formatTime12h(startTime)} – ${formatTime12h(endTime)}`
          : formatTime12h(startTime);

      const payload = {
        eventId: selectedEventId,
        sessionTitle,
        speakerName,
        speakerRole,
        time: formattedTimeRange,
        startTime: `${startTime}:00`,
        endTime: endTime ? `${endTime}:00` : undefined,
        date,
        venue,
        type,
        status,
        description,
      };

      if (isEdit && sessionId) {
        await scheduleService.updateSession(sessionId, payload);
        toast.success("Session updated successfully!");
      } else {
        await scheduleService.createSession(payload);
        toast.success("Session created & published!");
      }
      handleClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save session");
    } finally {
      setSubmitting(false);
    }
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
            {/* Select Event */}
            <div className="space-y-2">
              <Label htmlFor="scheduleEvent" required>
                Select Event
              </Label>
              <SelectDropdown
                value={selectedEventId}
                onChange={handleEventChange}
                options={
                  eventsList.length > 0
                    ? eventsList.map((ev) => ({
                        label: `${ev.name} (${ev.startDate} to ${ev.endDate})`,
                        value: ev.id,
                      }))
                    : [{ label: "Loading events...", value: "" }]
                }
              />
              {selectedEvent && (
                <p className="text-[11px] text-blue-700 font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Event Date Range: {selectedEvent.startDate} to {selectedEvent.endDate}
                </p>
              )}
            </div>

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
              {/* Session Date */}
              <div className="space-y-2">
                <Label htmlFor="sessionDate" required>
                  Session Date
                </Label>
                <input
                  id="sessionDate"
                  type="date"
                  required
                  value={date}
                  min={selectedEvent?.startDate || undefined}
                  max={selectedEvent?.endDate || undefined}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex h-11 w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                />
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime" required>
                  Start Time
                </Label>
                <input
                  id="startTime"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex h-11 w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex h-11 w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
