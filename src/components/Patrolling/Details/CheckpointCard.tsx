import { Badge } from "@/components/ui/badge";
import { getStatusStyle } from "@/utils/statusColors";

interface CheckpointCardProps {
  checkpoint: any;
}

const CheckpointCard = ({ checkpoint }: CheckpointCardProps) => {
  return (
    <div className="space-y-2 rounded-lg border bg-white p-3">
      <div>
        <p className="text-base font-medium">{checkpoint.name}</p>

        <div className="mt-1 flex gap-2">
          <Badge variant="outline" className="capitalize">{checkpoint.priorityLevel}</Badge>

          <Badge className="capitalize">
            {checkpoint.status}
          </Badge>
        </div>
      </div>

      {checkpoint.description && (
        <p className="text-sm text-muted-foreground">
          {checkpoint.description}
        </p>
      )}

      <div className="flex justify-between gap-4 text-sm text-muted-foreground">
        <span>
          {checkpoint.latitude}, {checkpoint.longitude}
        </span>

        <span>Range: {checkpoint.verificationRange}m</span>
      </div>
    </div>
  );
};

export default CheckpointCard;
