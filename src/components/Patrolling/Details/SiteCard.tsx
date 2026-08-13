import { ChevronDown, ChevronUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import CheckpointCard from "./CheckpointCard";
import { formatCurrency } from "@/lib/utils";

interface SiteCardProps {
  site: any;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onDownloadQR: (site: any) => void;
}

const SiteCard = ({
  site,
  index,
  isOpen,
  onToggle,
  onDownloadQR,
}: SiteCardProps) => {
  const totalCheckpoints =
    (site.checkpoints?.length ?? 0) +
    (site.subSites?.reduce(
      (total: number, subSite: any) =>
        total + (subSite.checkpoints?.length ?? 0),
      0,
    ) ?? 0);

  return (
    <div className="rounded-xl border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-base font-semibold text-white">
            {index + 1}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{site.name}</p>

            <p className="truncate text-sm text-muted-foreground">
              {site.address}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDownloadQR(site)}
          >
            Download QR
          </Button>

          <Badge className="capitalize">{site.status}</Badge>

          <span className="hidden text-sm text-muted-foreground md:block">
            0/{totalCheckpoints} completed
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="space-y-5 border-t px-5 pb-5 pt-5">
          {site.description && (
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="mb-1 text-sm text-muted-foreground">Description</p>

              <p className="text-sm">{site.description}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Lat: {site.latitude} | Lng: {site.longitude}
          </p>

          <SubSites subSites={site.subSites} />

          <SiteCheckpoints checkpoints={site.checkpoints} />
        </div>
      )}
    </div>
  );
};

const SubSites = ({ subSites = [] }: { subSites?: any[] }) => {
  if (!subSites.length) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Sub-Sites ({subSites.length})</p>

      {subSites.map((subSite) => (
        <div
          key={subSite.id}
          className="space-y-3 rounded-xl border bg-blue-50/40 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{subSite.name}</p>

              {subSite.description && (
                <p className="text-sm text-muted-foreground">
                  {subSite.description}
                </p>
              )}

              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span>{formatCurrency(subSite.unitPrice)}</span>
                <span>{subSite.estimatedDuration} min</span>
              </div>
            </div>

            <Badge className="capitalize">{subSite.status}</Badge>
          </div>

          {subSite.checkpoints?.map((checkpoint: any) => (
            <CheckpointCard key={checkpoint.id} checkpoint={checkpoint} />
          ))}
        </div>
      ))}
    </div>
  );
};

const SiteCheckpoints = ({ checkpoints = [] }: { checkpoints?: any[] }) => {
  if (!checkpoints.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        Site Checkpoints ({checkpoints.length})
      </p>

      {checkpoints.map((checkpoint) => (
        <CheckpointCard key={checkpoint.id} checkpoint={checkpoint} />
      ))}
    </div>
  );
};

export default SiteCard;
