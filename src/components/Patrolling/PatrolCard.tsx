import {
  Building,
  CalendarDays,
  Car,
  Clock,
  Eye,
  MapPin,
  QrCode,
  Target,
  Users,
} from "lucide-react";

import {
  AdminPatrolRun,
  useDeletePatrolRunMutation,
} from "@/store/apis/patrollingAPI";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { getStatusStyle } from "@/utils/statusColors";
import { Link } from "react-router-dom";
import DeleteModal from "../common/Modal/DeleteModal";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";

type PatrolCardProps = {
  patrol: AdminPatrolRun;
};

const PatrolCard = ({ patrol }: PatrolCardProps) => {
  const [deletePatrolRun, { isLoading }] = useDeletePatrolRunMutation();

  const handleDelete = async () => {
    try {
      await deletePatrolRun(patrol.id).unwrap();
      toast.success("Patrol deleted successfully");
    } catch (error) {
      toast.error("Error deleting patrol");
    }
  };

  const startDateTime = formatDateTime(patrol.startDateTime);
  const estimatedCompletion = formatDateTime(patrol.estimatedCompletion);

  return (
    <Card className="border border-slate-200 bg-white p-0 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <QrCode className="h-5 w-5 text-slate-700" />
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold uppercase text-slate-900">
                    #{patrol.patrolId.slice(0, 8)}
                  </h3>

                  <Badge
                    className="h-5 px-2 text-[10px] font-medium capitalize"
                    style={getStatusStyle(patrol.status)}
                  >
                    {patrol.status}
                  </Badge>
                </div>

                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex min-w-0 items-center gap-1">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate max-w-36">
                      {patrol.clientName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="max-w-28 truncate capitalize">
                      {patrol.locationName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  asChild
                >
                  <Link to={`/patrol/${patrol.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>

                <DeleteModal
                  title="Patrol"
                  onConfirm={handleDelete}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Bottom information */}
            <div className="mt-3 flex items-end justify-between gap-6">
              {/* Schedule */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>
                    {startDateTime.date},{startDateTime.time}
                  </span>
                </div>

                <div className="hidden items-center gap-1.5 sm:flex">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    ETA {estimatedCompletion.date},{estimatedCompletion.time}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex shrink-0 items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" />
                  <span>{patrol.totalSites}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  <span>{patrol.totalSubSites}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5" />
                  <span>
                    {patrol.completedCheckpoints}/{patrol.totalCheckpoints}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[10px]">
                <span className="font-medium text-slate-500">
                  Patrol progress
                </span>

                <span className="font-semibold text-slate-700">
                  {patrol.completionPercentage || 0}%
                </span>
              </div>

              <Progress
                value={patrol.completionPercentage || 0}
                className="h-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatrolCard;
