"use client";

import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./rich-text-editor";

interface TermsConditionsTabProps {
  content: string;
  setContent: (val: string) => void;
  onSave?: (content: string) => Promise<boolean | void>;
  isSaving?: boolean;
}

export function TermsConditionsTab({
  content,
  setContent,
  onSave,
  isSaving,
}: TermsConditionsTabProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      await onSave(content);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-left">
      {/* Interactive Rich Text Editor */}
      <RichTextEditor value={content} onChange={setContent} />

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
