import { OrganizedAssignment } from "@/types";
import { Calendar, Clock, ShieldCheck, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

import ShiftPill from "./ShiftPill";
import StatCards from "../common/StatCard/StatCards";

import { useSchedulingData } from "./hook/useSchedulingData";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

interface QuickSummaryProps {
  scheduling: ReturnType<typeof useSchedulingData>;
}

const QuickSummary = ({ scheduling }: QuickSummaryProps) => {
  const { setParam } = useQueryParams();

  const { selectedDate, selectedDayAssignments: assignments } = scheduling;

  const handleRedirect = () => {
    setParam("tab", "daily");
  };

  const activeAssignments = assignments.filter(
    (assignment: OrganizedAssignment) =>
      assignment.status?.toLowerCase() === "active",
  );

  const completedAssignments = assignments.filter(
    (assignment: OrganizedAssignment) =>
      assignment.status?.toLowerCase() === "completed",
  );

  const stats = [
    {
      label: "Total",
      Icon: User,
      value: assignments.length,
      color:
        "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300",
    },
    {
      label: "Active",
      Icon: Clock,
      value: activeAssignments.length,
      color:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      label: "Completed",
      Icon: ShieldCheck,
      value: completedAssignments.length,
      color:
        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300",
    },
  ];

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm p-0">
      {/* Accent */}
      <div className="h-1 w-full bg-linear-to-r from-orange-500 via-orange-400 to-sky-500" />

      <CardContent className="space-y-5 p-5">
        {/* Header */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
              <Calendar className="size-5 text-orange-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Schedule Overview
              </p>

              <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
            </div>
          </div>

          {/* Stats */}
          <div className="overflow-x-auto">
            <StatCards items={stats} />
          </div>
        </div>

        <Separator />

        {/* Assignments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                Assigned Shifts
              </h4>

              <p className="mt-0.5 text-xs text-slate-400">
                Shifts scheduled for this day
              </p>
            </div>

            {assignments.length > 0 && (
              <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                {assignments.length}{" "}
                {assignments.length === 1 ? "Assignment" : "Assignments"}
              </span>
            )}
          </div>

          {assignments.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {assignments
                .slice(0, 4)
                .map((assignment: OrganizedAssignment) => (
                  <ShiftPill key={assignment.id} assignment={assignment} />
                ))}

              {assignments.length > 4 && (
                <Button
                  variant="ghost"
                  onClick={handleRedirect}
                  className="h-auto min-h-[76px] rounded-xl border border-dashed border-orange-200 bg-orange-50/40 px-4 hover:border-orange-300 hover:bg-orange-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-orange-600">
                      +{assignments.length - 4}
                    </span>

                    <span className="text-sm font-medium text-slate-600">
                      More assignments
                    </span>
                  </div>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Calendar className="size-5 text-slate-400" />
              </div>

              <h4 className="mt-3 text-sm font-semibold text-slate-700">
                No assignments
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                There are no shifts scheduled for this date.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickSummary;
