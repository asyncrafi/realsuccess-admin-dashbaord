"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If a chunk failed to load due to a deployment version mismatch, auto-reload
    if (
      error.message?.includes("Loading chunk") ||
      error.message?.includes("ChunkLoadError") ||
      error.name === "ChunkLoadError"
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="p-4 bg-blue-50 text-[oklch(0.48_0.1394_252.75)] rounded-full">
        <RotateCw className="h-8 w-8 animate-spin-slow" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="text-sm text-gray-500 max-w-md">
        An unexpected error occurred while loading this view. Please reload to load the latest version.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={() => window.location.reload()} className="px-6 rounded-full font-semibold">
          Reload Page
        </Button>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
