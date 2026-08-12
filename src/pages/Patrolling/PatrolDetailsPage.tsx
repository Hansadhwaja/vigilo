"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useGetPatrolRunByIdForAdminQuery,
  useLazyDownloadSiteQRsPdfQuery,
} from "@/store/apis/patrollingAPI";
import PatrolHeader from "@/components/Patrolling/Details/PatrolHeader";
import PatrolProgress from "@/components/Patrolling/Details/PatrolProgress";
import PatrolInformation from "@/components/Patrolling/Details/PatrolInformation";
import SitesSection from "@/components/Patrolling/Details/SitesSection";
import ClientCard from "@/components/Patrolling/Details/ClientCard";
import GuardsCard from "@/components/Patrolling/Details/GuardsCard";
import QuickStatistics from "@/components/Patrolling/Details/QuickStatistics";
import QuickActions from "@/components/Patrolling/Details/QuickActions";
import ImagesCard from "@/components/common/Card/ImagesCard";

export default function PatrolDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useGetPatrolRunByIdForAdminQuery(
    id as string,
    {
      skip: !id,
    },
  );

  const [triggerDownloadSitePdf] = useLazyDownloadSiteQRsPdfQuery();

  const patrolData = data?.data;

  const patrol = patrolData?.patrol;
  const order = patrolData?.order;
  const client = patrolData?.client;
  const guards = patrolData?.guards ?? [];
  const sites = patrolData?.sites ?? [];

  const handleDownloadSiteQR = async (site: any) => {
    if (!site?.id) {
      toast.error("Site ID missing");
      return;
    }

    try {
      const blob = await triggerDownloadSitePdf({
        siteId: site.id,
      }).unwrap();

      const url = URL.createObjectURL(blob);

      const safeName = (site.name || "site")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim();

      const fileName = `${safeName || "site"}-qr.pdf`;

      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success("QR PDF downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Download failed");
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!patrol) {
    return <div className="p-6">No data found.</div>;
  }

  return (
    <div className="h-full min-h-0 min-w-0 space-y-6 overflow-y-auto no-scrollbar">
      <PatrolHeader patrol={patrol} patrolData={patrolData} />

      <PatrolProgress patrol={patrol} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <PatrolInformation patrol={patrol} />

          <ImagesCard
            title="Location Images"
            description="Location preview and site images"
            emptyDescription="No location images available."
            images={order?.images ?? []}
          />

          <SitesSection sites={sites} onDownloadQR={handleDownloadSiteQR} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ClientCard client={client} />

          <GuardsCard guards={guards} />

          <QuickStatistics patrol={patrol} />

          <QuickActions />
        </div>
      </div>
    </div>
  );
}
