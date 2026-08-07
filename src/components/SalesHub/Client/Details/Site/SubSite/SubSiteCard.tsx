import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import CheckpointCard from "../Checkpoint/CheckpointCard";
import CreateCheckpointModal from "../Checkpoint/Modal/CreateCheckpointModal";
import DeleteSubSiteModal from "./Modal/DeleteSubSiteModal";

interface SubSiteCardProps {
  subSite: {
    id: string;
    name: string;
    address?: string;
    status?: string;
    isActive?: boolean;
    isCompleted?: boolean;
    totalCheckpoints?: number;
    checkpoints?: any[];
  };
  siteId: string;
}

const SubSiteCard = ({ subSite, siteId }: SubSiteCardProps) => {
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
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="size-3.5" />
              {subSite.address}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <DeleteSubSiteModal subSiteId={subSite.id} />
        </div>
      </div>

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
