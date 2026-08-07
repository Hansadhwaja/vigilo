import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, MapPin, QrCode, Shield, Wifi } from "lucide-react";
import { toast } from "sonner";

import type { PatrolCheckpoint } from "@/store/apis/patrollingAPI";

interface ViewQRCodeModalProps {
  selectedCheckpoint: PatrolCheckpoint;
}

const ViewQRCodeModal = ({ selectedCheckpoint }: ViewQRCodeModalProps) => {
  const [open, setOpen] = useState(false);

  const handleCopyQrUrl = async () => {
    if (!selectedCheckpoint?.qr?.qrUrl) {
      toast.error("QR code is not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedCheckpoint.qr.qrUrl);
      toast.success("QR URL copied");
    } catch {
      toast.error("Failed to copy QR URL");
    }
  };

  const handleDownload = () => {
    if (!selectedCheckpoint?.qr?.qrUrl) {
      toast.error("QR code is not available");
      return;
    }

    const link = document.createElement("a");
    link.href = selectedCheckpoint.qr.qrUrl;
    link.download = `${selectedCheckpoint.name}-qr.svg`;
    link.target = "_blank";
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          title="View QR Code"
        >
          <QrCode className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="size-5" />
            QR Code: {selectedCheckpoint.name}
          </DialogTitle>

          <DialogDescription>
            GPS-verified QR code for checkpoint scanning.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="flex size-56 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              {selectedCheckpoint.qr?.qrUrl ? (
                <img
                  src={selectedCheckpoint.qr.qrUrl}
                  alt={`${selectedCheckpoint.name} QR code`}
                  className="size-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <QrCode className="size-16" />
                  <span className="text-sm">QR unavailable</span>
                </div>
              )}
            </div>
          </div>

          {/* Checkpoint Details */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {/* GPS */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-800">
                GPS Coordinates
              </h4>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>Lat: {selectedCheckpoint.latitude}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>Lng: {selectedCheckpoint.longitude}</span>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-800">
                Verification
              </h4>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Wifi className="size-3.5 shrink-0" />
                  <span>Range: {selectedCheckpoint.verificationRange}m</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Shield className="size-3.5 shrink-0" />
                  <span className="capitalize">
                    Priority: {selectedCheckpoint.priorityLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          {selectedCheckpoint.status && (
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Status
                </span>

                <span className="text-sm font-medium capitalize text-amber-600">
                  {selectedCheckpoint.status}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={handleCopyQrUrl}
              disabled={!selectedCheckpoint.qr?.qrUrl}
            >
              <Copy className="size-4" />
              Copy QR URL
            </Button>

            <Button
              type="button"
              className="rounded-xl"
              onClick={handleDownload}
              disabled={!selectedCheckpoint.qr?.qrUrl}
            >
              <Download className="size-4" />
              Download QR
            </Button>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewQRCodeModal;
