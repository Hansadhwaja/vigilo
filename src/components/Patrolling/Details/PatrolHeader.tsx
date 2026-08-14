import { Badge } from "@/components/ui/badge";
import CustomHeader from "@/components/common/Header/CustomHeader";

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
          <Badge className="capitalize">{patrol.status}</Badge>
        </div>
      }
    />
  );
};

export default PatrolHeader;
