import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  DollarSign,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import CheckpointCard from "../Checkpoint/CheckpointCard";
import CreateCheckpointModal from "../Checkpoint/Modal/CreateCheckpointModal";
import DeleteSubSiteModal from "./Modal/DeleteSubSiteModal";
import { formatCurrency } from "@/lib/utils";

interface SubSiteCardProps {
  subSite: {
    id: string;
    name: string;
    address?: string;
    status?: string;
    isActive?: boolean;
    isCompleted?: boolean;
    unitPrice?: number;
    estimatedDuration?: number;
    totalCheckpoints?: number;
    checkpoints?: any[];
  };
  siteId: string;
}

const SubSiteCard = ({ subSite }: SubSiteCardProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5 size-8 shrink-0"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-slate-800">{subSite.name}</h4>

            {subSite.status && (
              <Badge variant="outline" className="text-[10px] capitalize">
                {subSite.status}
              </Badge>
            )}
          </div>

          {subSite.address && (
            <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-500">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>{subSite.address}</span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <DeleteSubSiteModal subSiteId={subSite.id} />
        </div>
      </div>

      {/* Sub-site Details */}
      <div className="mt-4 ml-11 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50">
              <DollarSign className="size-3.5 text-emerald-600" />
            </div>

            <div>
              <p className="text-[11px] text-slate-500">Unit Price</p>

              <p className="text-sm font-semibold text-slate-800">
                {formatCurrency(subSite.unitPrice ?? 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50">
              <Clock3 className="size-3.5 text-blue-600" />
            </div>

            <div>
              <p className="text-[11px] text-slate-500">Est. Duration</p>

              <p className="text-sm font-semibold text-slate-800">
                {subSite.estimatedDuration ?? 0} mins
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoints */}
      {open && (
        <div className="mt-4 ml-11 border-l-2 border-slate-200 pl-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h5 className="text-sm font-semibold text-slate-700">
                Checkpoints
              </h5>

              <p className="text-xs text-slate-500">
                {subSite.totalCheckpoints ?? subSite.checkpoints?.length ?? 0}{" "}
                checkpoints
              </p>
            </div>

            <CreateCheckpointModal subSiteId={subSite.id} />
          </div>

          <div className="space-y-2">
            {(subSite.checkpoints ?? []).map((checkpoint) => (
              <CheckpointCard key={checkpoint.id} checkpoint={checkpoint} />
            ))}

            {!subSite.checkpoints?.length && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center">
                <p className="text-xs text-slate-500">
                  No checkpoints in this sub-site.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubSiteCard;
