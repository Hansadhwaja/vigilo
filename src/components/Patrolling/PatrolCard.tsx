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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getStatusStyle } from "@/utils/statusColors";
import { Link } from "react-router-dom";
import { formatDateTime } from "@/lib/utils";
import { AdminPatrolRun } from "@/types/patrolling/patrolling.types";
import DeletePatrolModal from "./Modal/DeletePatrolModal";

type PatrolCardProps = {
  patrol: AdminPatrolRun;
};

const PatrolCard = ({ patrol }: PatrolCardProps) => {
  const startDateTime = formatDateTime(patrol.startDateTime);
  const estimatedCompletion = formatDateTime(patrol.estimatedCompletion);

  const completionPercentage = patrol.completionPercentage || 0;

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border bg-card shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <QrCode className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Patrol #{patrol.patrolId.slice(0, 8)}
                  </h3>

                  <Badge
                    className="h-5 px-2 text-[10px] font-medium capitalize"
                    style={getStatusStyle(patrol.status)}
                  >
                    {patrol.status}
                  </Badge>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 shrink-0" />

                        <span className="max-w-44 truncate">
                          {patrol.clientName}
                        </span>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>{patrol.clientName}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span className="max-w-44 truncate capitalize">
                          {patrol.locationName}
                        </span>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>{patrol.locationName}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                asChild
                aria-label="View patrol"
              >
                <Link to={`/patrol/${patrol.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>

              <DeletePatrolModal patrolId={patrol.id} />
            </div>
          </div>

          {/* Main information */}
          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {/* Schedule */}
            <div className="px-5 py-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Schedule
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Started</p>
                    <p className="truncate font-medium text-foreground">
                      {startDateTime.date}, {startDateTime.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Estimated completion
                    </p>

                    <p className="truncate font-medium text-foreground">
                      {estimatedCompletion.date},{" "}
                      {estimatedCompletion.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patrol coverage */}
            <div className="px-5 py-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Coverage
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="text-lg font-semibold leading-none text-foreground">
                    {patrol.totalSites}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Sites
                  </p>
                </div>

                <div>
                  <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="text-lg font-semibold leading-none text-foreground">
                    {patrol.totalSubSites}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Sub-sites
                  </p>
                </div>

                <div>
                  <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="text-lg font-semibold leading-none text-foreground">
                    {patrol.completedCheckpoints}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      / {patrol.totalCheckpoints}
                    </span>
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Checkpoints
                  </p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="px-5 py-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Progress
              </p>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold leading-none text-foreground">
                    {completionPercentage}%
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Patrol completed
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Car className="h-3.5 w-3.5" />
                  {patrol.completedCheckpoints}/
                  {patrol.totalCheckpoints}
                </div>
              </div>

              <Progress
                value={completionPercentage}
                className="mt-4 h-1.5"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 border-t bg-muted/20 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="max-w-60 truncate capitalize">
                    {patrol.locationName}
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  <p>{patrol.locationName}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              asChild
            >
              <Link to={`/patrol/${patrol.id}`}>
                <Eye className="h-3.5 w-3.5" />
                View patrol
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default PatrolCard;