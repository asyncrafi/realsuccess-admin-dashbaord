"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      error.message?.includes("Loading chunk") ||
      error.message?.includes("ChunkLoadError") ||
      error.name === "ChunkLoadError"
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="flex items-center justify-center min-h-screen bg-[#F8F9FC] p-6 font-sans">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 max-w-md w-full text-center shadow-lg space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Dashboard Update</h2>
          <p className="text-sm text-gray-500">
            A new version of the dashboard is available. Please reload to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[oklch(0.48_0.1394_252.75)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer"
          >
            Reload Dashboard
          </button>
        </div>
      </body>
    </html>
  );
}
