"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { EventItem } from "../types/events.types";

interface QrModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export function QrModal({ event, onClose }: QrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const qrValue = event
    ? event.qrRegistrationToken || event.accessCode || `EVT-${event.id}`
    : "";

  useEffect(() => {
    if (!event || !qrValue) return;
    QRCode.toDataURL(qrValue, {
      width: 512,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR generation failed:", err));
  }, [event, qrValue]);

  if (!event) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const downloadLink = document.createElement("a");
    downloadLink.download = `${event.name.replace(/\s+/g, "_")}_Registration_QR.png`;
    downloadLink.href = qrDataUrl;
    downloadLink.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-gray-100 shadow-2xl space-y-6 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
          <p className="text-xs text-gray-500 font-medium">
            Event Registration QR Code
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-flex items-center justify-center shadow-inner">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt={`${event.name} Registration QR`}
              className="w-48 h-48 rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400">
              Generating QR...
            </div>
          )}
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 text-left space-y-1 font-medium">
          <p className="font-semibold text-gray-900">Venue: {event.venue}</p>
          <p>Date: {event.date}</p>
          <p>Price: {event.priceDisplay || (event.isFree ? "Free" : `$${event.price}`)}</p>
          <p className="font-mono text-[11px] text-gray-500 truncate">
            Token: {qrValue}
          </p>
        </div>

        <Button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="w-full h-11 rounded-full flex items-center justify-center gap-2 font-semibold"
        >
          <Download className="h-4 w-4" />
          Download QR Code
        </Button>
      </div>
    </div>
  );
}
