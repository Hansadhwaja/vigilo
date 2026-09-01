import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import CheckpointCard from "./Checkpoint/CheckpointCard";
import SubSiteCard from "./SubSite/SubSiteCard";
import CreateSubSiteModal from "./SubSite/Modal/CreateSubSiteModal";
import CreateCheckpointModal from "./Checkpoint/Modal/CreateCheckpointModal";
import DeleteSiteModal from "./Modal/DeleteSiteModal";
import { PatrolSiteFull } from "@/types/patrolling/patrolling.types";

const SiteCard = ({ site }: { site: PatrolSiteFull }) => {
  const [open, setOpen] = useState(true);

  const checkpoints = site.checkpoints ?? [];
  const subSites = site.subSites ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Site Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {site.name}
              </h3>

              <Badge variant="outline" className="capitalize">
                {site.status}
              </Badge>

              {site.isActive && (
                <Badge className="gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                  <CheckCircle2 className="size-3" />
                  Active
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>{site.address}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <DeleteSiteModal siteId={site.id} />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {site.description && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-slate-800">
                Site Description
              </h4>
              <p className="text-xs text-slate-500">
                Additional information and requirements for this site.
              </p>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {site.description}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Sub Sites</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {site.totalSubSites}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Checkpoints</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {site.totalCheckpoints}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Latitude</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900">
              {site.latitude}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Longitude</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900">
              {site.longitude}
            </p>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/30 p-5">
          {/* Site Checkpoints */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">Checkpoints</h4>

                <p className="text-xs text-slate-500">
                  Checkpoints directly assigned to this site.
                </p>
              </div>

              <CreateCheckpointModal siteId={site.id} />
            </div>

            <div className="space-y-2">
              {checkpoints.map((checkpoint) => (
                <CheckpointCard key={checkpoint.id} checkpoint={checkpoint} />
              ))}

              {!checkpoints.length && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center">
                  <p className="text-xs text-slate-500">
                    No direct checkpoints for this site.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sub Sites */}
          <div className="mt-7 border-t border-slate-200 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">Sub Sites</h4>

                <p className="text-xs text-slate-500">
                  Manage areas within this site.
                </p>
              </div>

              <CreateSubSiteModal id={site.id} />
            </div>

            <div className="space-y-3">
              {subSites.map((subSite) => (
                <SubSiteCard
                  key={subSite.id}
                  subSite={subSite}
                  siteId={site.id}
                />
              ))}

              {!subSites.length && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center">
                  <p className="text-xs text-slate-500">
                    No subSites for this site.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteCard;
