"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  X,
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  RotateCcw,
} from "lucide-react";
import { ticketsService, ScanValidationResult } from "../services/tickets.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScanTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScanTicketModal({ isOpen, onClose }: ScanTicketModalProps) {
  const [manualCode, setManualCode] = useState("");
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ScanValidationResult | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<string>("");

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // ignore stop errors
      }
      scannerRef.current = null;
    }
    setIsScanningCamera(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setResult(null);
      setManualCode("");
      setCameraError(null);
      lastScannedRef.current = "";
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleValidateToken = async (token: string) => {
    const clean = token.trim();
    if (!clean || validating) return;

    setValidating(true);
    try {
      const res = await ticketsService.scanTicket(clean);
      setResult(res);
      if (res.valid) {
        window.dispatchEvent(new CustomEvent("ticketsUpdated"));
      }
    } catch {
      setResult({
        success: false,
        valid: false,
        scan_status: "ERROR",
        message: "Failed to contact validation server.",
      });
    } finally {
      setValidating(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setResult(null);
    lastScannedRef.current = "";

    try {
      setIsScanningCamera(true);
      // Wait for DOM element to mount
      await new Promise((r) => setTimeout(r, 100));
      const html5Qr = new Html5Qrcode("ticket-qr-reader");
      scannerRef.current = html5Qr;

      await html5Qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          if (decodedText === lastScannedRef.current) return;
          lastScannedRef.current = decodedText;
          await stopCamera();
          await handleValidateToken(decodedText);
        },
        () => {
          // ignore frame scan miss
        }
      );
    } catch (err: any) {
      setIsScanningCamera(false);
      setCameraError(
        err?.message || "Camera access unavailable. Use manual Ticket ID / QR Token input below."
      );
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidateToken(manualCode);
  };

  const handleScanAnother = () => {
    setResult(null);
    setManualCode("");
    lastScannedRef.current = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[oklch(0.48_0.1394_252.75)]">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Scan Entrance Ticket</h3>
              <p className="text-[11px] text-gray-500">Validate individual attendee ticket QR</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-left">
          {/* Camera Scanner Area */}
          {!result && (
            <div className="space-y-3">
              {isScanningCamera ? (
                <div className="space-y-3">
                  <div
                    id="ticket-qr-reader"
                    className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-black min-h-[240px]"
                  />
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="w-full h-10 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Stop Camera
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-6 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50/80 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-white shadow-xs text-[oklch(0.48_0.1394_252.75)]">
                    <Camera className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">Open Camera to Scan QR</span>
                  <span className="text-xs text-gray-500">Point camera at attendee&apos;s ticket QR code</span>
                </button>
              )}

              {cameraError && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  {cameraError}
                </p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[11px] font-bold text-gray-400 uppercase">Or Enter Code</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Manual / Handheld Scanner Input */}
              <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Ticket ID or Token (e.g. RS-2026-... or TKT-...)"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                    className="h-11 text-xs bg-white border-gray-200"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={validating || !manualCode.trim()}
                  className="h-11 px-5 rounded-full text-xs font-semibold"
                >
                  {validating ? "Checking..." : "Validate"}
                </Button>
              </form>
            </div>
          )}

          {/* Validation Result Card */}
          {result && (
            <div className="space-y-4">
              <div
                className={cn(
                  "p-5 rounded-2xl border-2 text-center space-y-2",
                  result.valid
                    ? "bg-emerald-50 border-emerald-200"
                    : result.scan_status === "PAYMENT_NOT_CONFIRMED"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-red-50 border-red-200"
                )}
              >
                <div className="flex justify-center">
                  {result.valid ? (
                    <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                  ) : result.scan_status === "PAYMENT_NOT_CONFIRMED" ? (
                    <AlertTriangle className="h-12 w-12 text-amber-600" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-600" />
                  )}
                </div>
                <h4
                  className={cn(
                    "text-lg font-extrabold",
                    result.valid
                      ? "text-emerald-800"
                      : result.scan_status === "PAYMENT_NOT_CONFIRMED"
                      ? "text-amber-800"
                      : "text-red-800"
                  )}
                >
                  {result.message}
                </h4>
                <p className="text-xs font-mono text-gray-600">{result.scan_status}</p>
              </div>

              {result.ticket && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Attendee</span>
                    <span className="font-bold text-gray-900">
                      {result.ticket.attendeeName || result.ticket.attendee_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ticket ID</span>
                    <span className="font-mono font-bold text-gray-900">
                      {result.ticket.ticketId || result.ticket.ticket_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Event</span>
                    <span className="font-semibold text-gray-900">{result.ticket.eventName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Status</span>
                    <span className="font-bold text-gray-900">
                      {result.ticket.paymentStatus || result.ticket.payment_status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ticket Status</span>
                    <span className="font-bold text-gray-900">
                      {result.ticket.ticketStatus || result.ticket.ticket_status}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={handleScanAnother}
                className="w-full h-11 rounded-full flex items-center justify-center gap-2 font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                Scan Next Ticket
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
