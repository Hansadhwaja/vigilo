import {
  FileText,
  Flag,
  RefreshCw,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SectionCard from "@/components/common/Card/SectionCard";

interface QuickActionsProps {
  onRefresh?: () => void;
  onGenerateReport?: () => void;
  onReportIssue?: () => void;
  isRefreshing?: boolean;
}

const QuickActions = ({
  onRefresh,
  onGenerateReport,
  onReportIssue,
  isRefreshing = false,
}: QuickActionsProps) => {
  return (
    <SectionCard
      title="Quick Actions"
      icon={<Zap className="h-5 w-5" />}
      description="Common actions for this patrol"
    >
      <div className="space-y-2">
        <Button
          variant="outline"
          className="h-9 w-full justify-start gap-2"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          {isRefreshing
            ? "Refreshing..."
            : "Refresh Status"}
        </Button>

        <Button
          variant="outline"
          className="h-9 w-full justify-start gap-2"
          onClick={onGenerateReport}
        >
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>

        <Button
          variant="outline"
          className="h-9 w-full justify-start gap-2"
          onClick={onReportIssue}
        >
          <Flag className="h-4 w-4" />
          Report Issue
        </Button>
      </div>
    </SectionCard>
  );
};

export default QuickActions;