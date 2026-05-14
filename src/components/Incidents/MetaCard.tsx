import {
  AlertTriangle,
  CalendarClock,
  Fingerprint,
  ShieldAlert,
  Activity,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { getStatusStyle } from "@/utils/statusColors";

import SectionCard from "../common/Card/SectionCard";

interface MetaCardProps {
  incident: any;
}

const formatDate = (iso?: string) => {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );
};

const MetaCard = ({
  incident,
}: MetaCardProps) => {
  return (
    <SectionCard
      title="Incident Metadata"
      icon={
        <AlertTriangle className="h-5 w-5" />
      }
    >
      <div className="space-y-6">
        {/* TOP STATUS OVERVIEW */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-gradient-to-br
            from-red-900
            via-rose-800
            to-red-900
            p-5
            text-white
            shadow-lg
          "
        >
          {/* Glow */}
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-red-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-red-200">
                Incident Tracking
              </p>

              <h3 className="mt-1 text-2xl font-bold tracking-tight">
                Metadata
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-white/10
                backdrop-blur
              "
            >
              <ShieldAlert className="h-7 w-7 text-red-200" />
            </div>
          </div>
        </div>

        {/* STATUS */}
        {incident?.status && (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-gradient-to-br
              from-slate-50
              to-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-100
                    text-red-600
                    shadow-sm
                  "
                >
                  <Activity className="h-6 w-6" />
                </div>

                <div className="space-y-2">
                  <Label
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-slate-500
                    "
                  >
                    Status
                  </Label>

                  <p className="text-lg font-semibold text-slate-800">
                    Incident Status
                  </p>
                </div>
              </div>

              <Badge
                className="
                  border
                  px-4
                  py-1.5
                  text-sm
                  font-semibold
                  shadow-sm
                "
                style={getStatusStyle(
                  incident.status
                )}
              >
                {incident.status}
              </Badge>
            </div>
          </div>
        )}

        {/* PRIORITY */}
        {incident?.priorityLevel && (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-gradient-to-br
              from-slate-50
              to-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-amber-100
                  text-amber-600
                  shadow-sm
                "
              >
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <Label
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-slate-500
                  "
                >
                  Priority Level
                </Label>

                <p
                  className="
                    text-xl
                    font-bold
                    capitalize
                    tracking-tight
                    text-slate-800
                  "
                >
                  {incident.priorityLevel}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CREATED */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-gradient-to-br
            from-blue-50
            to-indigo-50
            p-5
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-blue-600
                shadow-sm
              "
            >
              <CalendarClock className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <Label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
                Created At
              </Label>

              <p
                className="
                  text-lg
                  font-semibold
                  text-slate-800
                "
              >
                {formatDate(
                  incident?.createdAt
                )}
              </p>
            </div>
          </div>
        </div>

        {/* UPDATED */}
        {incident?.updatedAt && (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-gradient-to-br
              from-orange-50
              to-amber-50
              p-5
              shadow-sm
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-100
                  text-orange-600
                  shadow-sm
                "
              >
                <CalendarClock className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <Label
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-slate-500
                  "
                >
                  Last Updated
                </Label>

                <p
                  className="
                    text-lg
                    font-semibold
                    text-slate-800
                  "
                >
                  {formatDate(
                    incident.updatedAt
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* INCIDENT ID */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-50
            to-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-violet-100
                text-violet-600
                shadow-sm
              "
            >
              <Fingerprint className="h-6 w-6" />
            </div>

            <div className="space-y-2 min-w-0 flex-1">
              <Label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
                Incident ID
              </Label>

              <p
                className="
                  break-all
                  font-mono
                  text-sm
                  leading-7
                  text-slate-700
                "
              >
                {incident?.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default MetaCard;