import type { PatrolCheckpoint } from "@/store/apis/patrollingAPI";
import { Badge } from "@/components/ui/badge";
import { MapPin, QrCode } from "lucide-react";
import DeleteCheckpointModal from "./Modal/DeleteCheckpointModal";
import ViewQRCodeModal from "./Modal/ViewQRCodeModal";

interface CheckpointCardProps {
  checkpoint: PatrolCheckpoint;
}

const CheckpointCard = ({ checkpoint }: CheckpointCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50">
      {/* QR Preview */}
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {checkpoint.qr?.qrUrl ? (
          <img
            src={checkpoint.qr.qrUrl}
            alt={`${checkpoint.name} QR code`}
            className="size-full object-contain p-1"
          />
        ) : (
          <QrCode className="size-6 text-slate-400" />
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-slate-800">
            {checkpoint.name}
          </h4>

          {checkpoint.priorityLevel && (
            <Badge variant="outline" className="text-[10px] capitalize">
              {checkpoint.priorityLevel}
            </Badge>
          )}

          {checkpoint.status && (
            <Badge variant="outline" className="text-[10px] capitalize">
              {checkpoint.status}
            </Badge>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {checkpoint.verificationRange !== undefined && (
            <span>
              Verification range:{" "}
              <span className="font-medium text-slate-700">
                {checkpoint.verificationRange}m
              </span>
            </span>
          )}

          {checkpoint.latitude && checkpoint.longitude && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />

              <span>
                {checkpoint.latitude}, {checkpoint.longitude}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <ViewQRCodeModal selectedCheckpoint={checkpoint} />
        <DeleteCheckpointModal checkpointId={checkpoint.id} />
      </div>
    </div>
  );
};

export default CheckpointCard;
