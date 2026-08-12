import { BarChart3 } from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";
import { Separator } from "@/components/ui/separator";

interface QuickStatisticsProps {
  patrol: any;
}

const QuickStatistics = ({
  patrol,
}: QuickStatisticsProps) => {
  const pending =
    patrol.totalCheckpoints -
    patrol.completedCheckpoints;

  return (
    <SectionCard
      title="Quick Statistics"
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <div className="space-y-3 text-sm">
        <StatRow
          label="Total Sites"
          value={patrol.totalSites}
        />

        <StatRow
          label="Total Sub-Sites"
          value={patrol.totalSubSites}
        />

        <StatRow
          label="Total Checkpoints"
          value={patrol.totalCheckpoints}
        />

        <Separator />

        <StatRow
          label="Completed"
          value={patrol.completedCheckpoints}
          valueClass="text-green-600"
        />

        <StatRow
          label="Pending"
          value={pending}
          valueClass="text-yellow-600"
        />

        <StatRow
          label="Missed"
          value={0}
          valueClass="text-red-600"
        />
      </div>
    </SectionCard>
  );
};

const StatRow = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">
      {label}
    </span>

    <span className={`font-semibold ${valueClass}`}>
      {value}
    </span>
  </div>
);

export default QuickStatistics;