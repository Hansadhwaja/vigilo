import { Card, CardContent } from "@/components/ui/card";
import { ComplianceProfile } from "@/types/compliance/compliance.types";
import { getStepStatus } from "@/utils/compliance";
import { CheckCircle2 } from "lucide-react";

interface Props {
  profile: ComplianceProfile;
}

const stepNames = [
  "Personal Information",
  "Work Rights & Eligibility",
  "Security Licence",
  "National Police Check",
  "Qualifications & Training",
  "Employment & Payroll",
  "Emergency & Medical",
  "Declarations",
  "Uniform & Equipment",
];

const statusConfig = {
  completed: {
    segment: "bg-emerald-500",
    number:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900",
    label: "Complete",
  },
  pending: {
    segment: "bg-amber-400",
    number:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900",
    label: "Pending",
  },
  attention: {
    segment: "bg-red-500",
    number:
      "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900",
    label: "Attention",
  },
  missing: {
    segment: "bg-muted",
    number: "bg-muted text-muted-foreground ring-1 ring-border",
    label: "Missing",
  },
};

const ComplianceProgress = ({ profile }: Props) => {
  const stepStatuses = Array.from({ length: 9 }, (_, index) =>
    getStepStatus(profile, index + 1),
  );

  const completedSteps = stepStatuses.filter(
    (status) => status === "completed",
  ).length;

  const attentionSteps = stepStatuses.filter(
    (status) => status === "attention",
  ).length;

  const pendingSteps = stepStatuses.filter(
    (status) => status === "pending",
  ).length;

  const missingSteps = stepStatuses.filter(
    (status) => status === "missing",
  ).length;

  const profileIsComplete = completedSteps === stepStatuses.length;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5 lg:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Compliance Progress</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {completedSteps} of {stepStatuses.length} compliance sections
              completed
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {attentionSteps > 0 && (
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {attentionSteps} attention
              </span>
            )}

            {pendingSteps > 0 && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                {pendingSteps} pending
              </span>
            )}

            {missingSteps > 0 && (
              <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {missingSteps} missing
              </span>
            )}

            {profileIsComplete && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                Profile completed
              </span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex gap-1.5">
            {stepStatuses.map((status, index) => {
              const config = statusConfig[status];

              return (
                <div
                  key={index}
                  className="min-w-0 flex-1"
                  title={`Step ${index + 1}: ${stepNames[index]} — ${config.label}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-colors ${config.segment}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Step Numbers */}
          <div className="mt-2 flex gap-1.5">
            {stepStatuses.map((status, index) => {
              const config = statusConfig[status];

              return (
                <div
                  key={index}
                  className="min-w-0 flex-1 text-center"
                  title={`${stepNames[index]} — ${config.label}`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-md text-[10px] font-semibold ${config.number}`}
                  >
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            Complete
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" />
            Pending
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-500" />
            Attention
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted" />
            Missing
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceProgress;
