"use client";

import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventItem } from "../types/events.types";

interface QrModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export function QrModal({ event, onClose }: QrModalProps) {
  if (!event) return null;

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx?.drawImage(img, 0, 0, 300, 300);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${event.name.replace(/\s+/g, "_")}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-gray-100 shadow-2xl space-y-6 text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
          <p className="text-xs text-gray-500 font-medium">Event Entry QR Code</p>
        </div>

        {/* QR Code Display */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 inline-flex items-center justify-center shadow-inner">
          <svg
            id="qr-code-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-44 h-44 text-gray-900 fill-current"
          >
            <rect width="100" height="100" fill="white" />
            <path d="M0 0h30v30H0zM5 5v20h20V5zM10 10h10v10H10zM70 0h30v30H70zM75 5v20h20V5zM80 10h10v10H80zM0 70h30v30H0zM5 75v20h20V75zM10 80h10v10H10zM40 10h10v10H40zM50 20h10v10H50zM30 40h10v10H30zM40 50h10v10H40zM60 40h10v10H60zM70 50h10v10H70zM90 40h10v10H90zM30 60h10v10H30zM50 70h10v10H50zM70 70h10v10H70zM40 80h10v10H40zM60 80h10v10H60zM80 80h20v20H80z" />
          </svg>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 text-left space-y-0.5 font-medium">
          <p className="font-semibold text-gray-900">Venue: {event.venue}</p>
          <p>Date: {event.date}</p>
        </div>

        {/* Download Action Button */}
        <Button
          onClick={handleDownload}
          className="w-full h-11 rounded-full flex items-center justify-center gap-2 font-semibold"
        >
          <Download className="h-4 w-4" />
          Download QR Code
        </Button>
      </div>
    </div>
  );
}
