import { MapPinned } from "lucide-react";
import { useState } from "react";

import SectionCard from "@/components/common/Card/SectionCard";

import SiteCard from "./SiteCard";

interface SitesSectionProps {
  sites: any[];
  onDownloadQR: (site: any) => void;
}

const SitesSection = ({
  sites,
  onDownloadQR,
}: SitesSectionProps) => {
  const [openSites, setOpenSites] =
    useState<Record<string, boolean>>({});

  const toggleSite = (id: string) => {
    setOpenSites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SectionCard
      title="Sites & Checkpoints"
      icon={<MapPinned className="h-5 w-5" />}
      description={`${sites.length} site${
        sites.length !== 1 ? "s" : ""
      } assigned to this patrol`}
    >
      <div className="space-y-4">
        {sites.map((site, index) => (
          <SiteCard
            key={site.id}
            site={site}
            index={index}
            isOpen={!!openSites[site.id]}
            onToggle={() => toggleSite(site.id)}
            onDownloadQR={onDownloadQR}
          />
        ))}
      </div>
    </SectionCard>
  );
};

export default SitesSection;