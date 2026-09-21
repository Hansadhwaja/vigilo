import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ComplianceProfile,
  ComplianceStep,
} from "@/types/compliance/compliance.types";
import { getStepStatus, statusLabel } from "@/utils/compliance";

import ComplianceStepContent from "./ComplianceStepContent";
import CustomBadge from "@/components/common/Badge/CustomBadge";

interface ComplianceStepsProps {
  profile: ComplianceProfile;
}

const ComplianceSteps = ({ profile }: ComplianceStepsProps) => {
  const steps = useMemo<ComplianceStep[]>(
    () => [
      {
        id: 1,
        title: "Personal Information",
        description: "Identity, contact details and identification",
        status: getStepStatus(profile, 1),
      },
      {
        id: 2,
        title: "Work Rights & Eligibility",
        description: "Citizenship, visa and employment eligibility",
        status: getStepStatus(profile, 2),
      },
      {
        id: 3,
        title: "Security Licence",
        description: "Licence details, verification and validity",
        status: getStepStatus(profile, 3),
      },
      {
        id: 4,
        title: "National Police Check",
        description: "Police check and renewal information",
        status: getStepStatus(profile, 4),
      },
      {
        id: 5,
        title: "Qualifications & Training",
        description: "Certificates, training and site inductions",
        status: getStepStatus(profile, 5),
      },
      {
        id: 6,
        title: "Employment & Payroll",
        description: "Employment, tax, superannuation and banking",
        status: getStepStatus(profile, 6),
      },
      {
        id: 7,
        title: "Emergency & Medical",
        description: "Emergency contacts and medical information",
        status: getStepStatus(profile, 7),
      },
      {
        id: 8,
        title: "Declarations",
        description: "Signed declarations and supporting documents",
        status: getStepStatus(profile, 8),
      },
      {
        id: 9,
        title: "Uniform & Equipment",
        description: "Uniform allocation and issued equipment",
        status: getStepStatus(profile, 9),
      },
    ],
    [profile],
  );

  const [activeStep, setActiveStep] = useState(1);

  const active = steps.find((step) => step.id === activeStep) ?? steps[0];
  console.log(active.status)

  const completedCount = steps.filter(
    (step) => step.status === "completed",
  ).length;

  const attentionCount = steps.filter((step) => step.status === "attention").length;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-base font-semibold">Compliance Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the guard&apos;s onboarding information and compliance
          documents.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Step Navigation */}
        <aside className="h-fit rounded-xl border bg-card shadow-sm">
          {/* Navigation Header */}
          <div className="border-b px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Onboarding</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Compliance checklist
                </p>
              </div>

              <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                {completedCount}/{steps.length}
              </span>
            </div>

            {attentionCount > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-red-600 dark:text-red-400">
                <CircleAlert className="size-3.5" />
                {attentionCount} item{attentionCount !== 1 ? "s" : ""} need
                attention
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="p-2">
            <div className="space-y-0.5">
              {steps.map((step) => {
                const isActive = step.id === activeStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                      isActive
                        ? "bg-primary/6 text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />
                    )}

                    {/* Step Icon */}
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : step.status === "completed"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : step.status === "attention"
                              ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                              : "border-border bg-muted/50 text-muted-foreground",
                      )}
                    >
                      {step.status === "completed" && !isActive ? (
                        <CheckCircle2 className="size-4" />
                      ) : step.status === "attention" && !isActive ? (
                        <CircleAlert className="size-4" />
                      ) : (
                        step.id
                      )}
                    </div>

                    {/* Step Information */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-sm font-medium",
                          isActive && "text-foreground",
                        )}
                      >
                        {step.title}
                      </p>

                      <p
                        className={cn(
                          "mt-0.5 text-[11px]",
                          step.status === "attention"
                            ? "text-red-600 dark:text-red-400"
                            : isActive
                              ? "text-primary"
                              : "text-muted-foreground",
                        )}
                      >
                        {statusLabel[step.status]}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Active Step */}
        <div className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm">
          {/* Content Header */}
          <div className="border-b px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {active.id === 1 ? (
                    <UserRound className="size-4.5" />
                  ) : active.id <= 4 ? (
                    <ShieldCheck className="size-4.5" />
                  ) : (
                    <FileText className="size-4.5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold sm:text-base">
                      {active.title}
                    </h3>
                    <CustomBadge status={active.status} />
                  </div>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                    {active.description}
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                Step {active.id} of {steps.length}
              </span>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-5">
            <ComplianceStepContent step={active.id} profile={profile} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSteps;
