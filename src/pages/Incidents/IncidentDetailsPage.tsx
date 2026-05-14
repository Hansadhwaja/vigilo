import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";

import { useGetIncidentByIdQuery } from "@/apis/incidentsApi";

import CustomHeader from "@/components/common/Header/CustomHeader";
import Loader from "@/components/common/Loader";

import IncidentInfoCard from "@/components/Incidents/IncidentInfoCard";
import ImagesCard from "@/components/Incidents/ImagesCard";
import ReporterCard from "@/components/Incidents/ReporterCard";
import DateTimeCard from "@/components/Incidents/DateTimeCard";
import ShiftCard from "@/components/Incidents/ShiftCard";
import MetaCard from "@/components/Incidents/MetaCard";
import IncidentAssignmentCard from "@/components/Incidents/AssignmentCard";

import { customFormatDateTime } from "@/lib/utils";
import IncidentHeroSection from "@/components/Incidents/Details/IncidentHeroSection";

export default function IncidentDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: incidentResponse, isLoading } =
    useGetIncidentByIdQuery(id || "", {
      skip: !id,
    });

  const incident = incidentResponse?.data;

  if (!incident && !isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <AlertTriangle className="h-10 w-10 text-slate-400" />
          </div>

          <h3 className="text-2xl font-bold text-slate-800">
            No incident found
          </h3>

          <p className="mt-2 text-slate-500">
            Please select an incident to view details
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-6 rounded-xl px-6"
          >
            <Link to="/incidents">
              Back to Incidents
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const dateTime = customFormatDateTime(
    incident?.createdAt
  );

  return (
    <div
      className="h-full overflow-y-auto "
    >
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-6">
        <CustomHeader
          previousLink="/incidents"
          title="Incident Details"
          description="Full incident information including location and evidence documentation"
        />

        <IncidentHeroSection incident={incident} />

        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <IncidentInfoCard
              incident={incident}
            />

            <ImagesCard
              images={incident?.images || []}
            />

            <ReporterCard
              reporter={incident?.reporter}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-8 lg:sticky lg:top-6">
            <DateTimeCard
              date={dateTime.date}
              time={dateTime.time}
            />

            <ShiftCard
              shift={incident?.shift}
            />

            <MetaCard incident={incident} />

            <IncidentAssignmentCard
              assignedGuard={
                incident?.assignedGuard
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}