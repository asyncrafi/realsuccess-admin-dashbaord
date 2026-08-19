"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X, Upload, FileText, Video as VideoIcon, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { ResourceFileType, ResourceStatus } from "../types/resources.types";
import { resourcesService } from "../services/resources.service";

export function CreateResourceModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action");
  const isEdit = action === "edit";
  const isOpen = action === "create" || action === "edit";

  // Form States
  const [eventName, setEventName] = useState(isEdit ? "Leadership Weekend" : "Leadership Weekend");
  const [title, setTitle] = useState(isEdit ? "Leadership Weekend" : "");
  const [type, setType] = useState<ResourceFileType>(isEdit ? "PDF" : "PDF");
  const [category, setCategory] = useState(isEdit ? "Workshop Materials" : "Workshop Materials");
  const [status, setStatus] = useState<ResourceStatus>(isEdit ? "Published" : "Published");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState(
    isEdit ? "Comprehensive workshop slides and exercise sheets for all attendees." : ""
  );
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("id");
    const newQuery = params.toString();
    router.push(newQuery ? `/resources?${newQuery}` : "/resources", { scroll: false });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resourcesService.createResource({
      title,
      eventName,
      type,
      category,
      status,
      description,
      fileUrl: videoUrl || "/downloads/sample.pdf",
    });

    toast.success(isEdit ? "Resource updated & status published!" : "Resource created successfully!");
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
            <span>{isEdit ? "Edit Resource & Publish Status" : "Add New Resource"}</span>
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
            {/* Target Event Selection */}
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

            {/* Resource Title */}
            <div className="space-y-2">
              <Label htmlFor="title" required>
                Resource Title
              </Label>
              <Input
                id="title"
                required
                placeholder="e.g. Workshop Materials PDF / Speaker Presentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Attachment / Resource Type */}
              <div className="space-y-2">
                <Label htmlFor="type" required>
                  Resource Type
                </Label>
                <SelectDropdown
                  value={type}
                  onChange={(val) => setType(val as ResourceFileType)}
                  options={[
                    { label: "PDF Document", value: "PDF" },
                    { label: "Video Recording", value: "Video" },
                    { label: "Image Asset", value: "Image" },
                    { label: "Other Document", value: "Document" },
                  ]}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" required>
                  Category
                </Label>
                <input
                  id="category"
                  list="resourceCategories"
                  required
                  placeholder="e.g. Workshop Materials"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-12 w-full rounded-full border border-gray-200 bg-[#F6F7F9] px-5 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                />
                <datalist id="resourceCategories">
                  <option value="Workshop Materials" />
                  <option value="Speaker Presentation" />
                  <option value="Event Map & Venue Guide" />
                  <option value="Preparation Guide" />
                </datalist>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" required>
                  Status
                </Label>
                <SelectDropdown
                  value={status}
                  onChange={(val) => setStatus(val as ResourceStatus)}
                  options={[
                    { label: "Published (Visible)", value: "Published" },
                    { label: "Draft (Hidden)", value: "Draft" },
                  ]}
                />
              </div>
            </div>

            {/* Video URL (If Video Type Selected) */}
            {type === "Video" && (
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video Stream Link (YouTube / Vimeo / MP4)</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  leftIcon={<LinkIcon className="h-4 w-4 text-gray-400" />}
                  className="bg-white border-gray-200"
                />
              </div>
            )}

            {/* Attachment File Dropzone */}
            <div className="space-y-2">
              <Label>Attachment / Resource File</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F6F7F9] hover:bg-gray-100/80 transition-colors flex flex-col items-center justify-center cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.mp4,image/*,.docx,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1 text-gray-500">
                  <Upload className="h-6 w-6 stroke-[1.5]" />
                  <span className="text-xs font-semibold text-gray-700">
                    {fileName ? fileName : "Upload resource file (PDF, MP4, Image, Slides)"}
                  </span>
                  <span className="text-[10px] text-gray-400">PDF, MP4, PNG, PPTX up to 50MB</span>
                </div>
              </div>
            </div>

            {/* Resource Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Resource Description</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Brief summary of resource content for attendees..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#F6F7F9] p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button type="submit" className="w-full sm:w-auto flex-1 h-12 rounded-full font-semibold text-base">
              {isEdit ? "Save & Update Resource" : "Add Resource"}
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
