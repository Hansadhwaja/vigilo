import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomHeader from "@/components/common/Header/CustomHeader";
import EditPatrolModal from "@/components/Patrolling/Modal/EditPatrolModal";

interface PatrolHeaderProps {
  patrol: any;
  patrolData: any;
}

const PatrolHeader = ({ patrol, patrolData }: PatrolHeaderProps) => {
  return (
    <CustomHeader
      previousLink="/patrol"
      title="Patrol Run Details"
      description="Comprehensive patrol run monitoring and progress tracking"
      others={
        <div className="flex items-center justify-end gap-2">
          <Badge>
            {patrol.status}
          </Badge>

          <EditPatrolModal patrolData={patrolData} />

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      }
    />
  );
};

export default PatrolHeader;
