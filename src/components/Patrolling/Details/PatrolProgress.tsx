import { Activity } from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";
import { Progress } from "@/components/ui/progress";

interface PatrolProgressProps {
  patrol: any;
}

const PatrolProgress = ({
  patrol,
}: PatrolProgressProps) => {
  const missed =
    patrol.totalCheckpoints -
    patrol.completedCheckpoints;

  return (
    <SectionCard
      title="Patrol Progress"
      icon={<Activity className="h-5 w-5" />}
      description="Current patrol completion status"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-primary">
            {patrol.completionPercentage || 0}%
          </span>

          <div className="flex-1">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Overall completion</span>
              <span>
                {patrol.completedCheckpoints}/
                {patrol.totalCheckpoints} checkpoints
              </span>
            </div>

            <Progress
              value={patrol.completionPercentage || 0}
              className="h-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Sites"
            value={`${patrol.completedSites}/${patrol.totalSites}`}
          />

          <Stat
            label="Sub-Sites"
            value={`${patrol.completedSubSites}/${patrol.totalSubSites}`}
          />

          <Stat
            label="Checkpoints"
            value={`${patrol.completedCheckpoints}/${patrol.totalCheckpoints}`}
          />

          <Stat
            label="Missed"
            value={missed}
            danger
          />
        </div>
      </div>
    </SectionCard>
  );
};

const Stat = ({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string | number;
  danger?: boolean;
}) => (
  <div
    className={`rounded-xl border p-3 ${
      danger
        ? "border-red-100 bg-red-50"
        : "border-slate-100 bg-slate-50"
    }`}
  >
    <p
      className={`text-lg font-semibold ${
        danger ? "text-red-600" : "text-slate-800"
      }`}
    >
      {value}
    </p>

    <p className="text-xs text-muted-foreground">
      {label}
    </p>
  </div>
);

export default PatrolProgress;