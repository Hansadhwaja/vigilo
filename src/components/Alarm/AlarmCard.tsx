"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  ShieldAlert,
  User,
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

import { cn, formatDate, formatTime } from "@/lib/utils";
import { Alarm } from "@/types";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";

import DeleteAlarmModal from "./Modal/DeleteAlarmModal";

interface Props {
  alarm: Alarm;
}

const AlarmCard = ({ alarm }: Props) => {
  const [slaProgress, setSlaProgress] = useState(0);

  const guard = alarm.guards?.[0];

  const isPending = alarm.status === "pending";
  const isBreached = alarm.breach;

  useEffect(() => {
    if (
      !isPending ||
      !alarm.slaTimeMinutes ||
      alarm.slaTimeMinutes <= 0
    ) {
      setSlaProgress(0);
      return;
    }

    const updateProgress = () => {
      const createdAt = new Date(alarm.createdAt).getTime();
      const elapsedMinutes =
        (Date.now() - createdAt) / (1000 * 60);

      const progress = Math.min(
        Math.round(
          (elapsedMinutes / alarm.slaTimeMinutes) * 100,
        ),
        100,
      );

      setSlaProgress(progress);
    };

    updateProgress();

    const interval = setInterval(updateProgress, 30_000);

    return () => clearInterval(interval);
  }, [
    alarm.createdAt,
    alarm.slaTimeMinutes,
    isPending,
  ]);

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border bg-card transition-shadow hover:shadow-sm">
        <CardContent className="p-0">
          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <ShieldAlert className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3
                        className="max-w-[500px] truncate text-sm font-semibold text-foreground sm:text-base"
                        aria-label={`Alarm title: ${alarm.title}`}
                      >
                        {alarm.title}
                      </h3>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p className="max-w-sm">
                        {alarm.title}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Badge
                    variant="outline"
                    className="capitalize"
                  >
                    {alarm.alarmType}
                  </Badge>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <p
                      className="mt-1 line-clamp-1 max-w-[600px] text-sm text-muted-foreground"
                      aria-label={`Description: ${
                        alarm.description ||
                        "No description"
                      }`}
                    >
                      {alarm.description ||
                        "No description"}
                    </p>
                  </TooltipTrigger>

                  {alarm.description && (
                    <TooltipContent>
                      <p className="max-w-md">
                        {alarm.description}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>

            {/* Header Status */}
            <div className="flex shrink-0 items-center gap-2">
              <Badge
                className={cn(
                  "capitalize",
                  getStatusColor(alarm.priority).bg,
                )}
              >
                {alarm.priority}
              </Badge>

              <Badge
                style={getStatusStyle(alarm.status)}
                className="border capitalize"
              >
                {getStatusColor(alarm.status).label}
              </Badge>

              {isBreached && (
                <Badge variant="destructive">
                  SLA Breach
                </Badge>
              )}
            </div>
          </div>

          {/* ================================================== */}
          {/* INFORMATION */}
          {/* ================================================== */}

          <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {/* LOCATION */}
            <div className="min-w-0 p-5">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />

                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Location
                </span>
              </div>

              <div className="min-w-0 space-y-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p
                      className="truncate text-sm font-medium"
                      aria-label={`Site: ${alarm.siteName}`}
                    >
                      {alarm.siteName}
                    </p>
                  </TooltipTrigger>

                  <TooltipContent>
                    {alarm.siteName}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <p
                      className="truncate text-sm text-muted-foreground"
                      aria-label={`Address: ${
                        alarm.siteAddress ||
                        "Location TBD"
                      }`}
                    >
                      {alarm.siteAddress ||
                        "Location TBD"}
                    </p>
                  </TooltipTrigger>

                  {alarm.siteAddress && (
                    <TooltipContent>
                      <p className="max-w-sm">
                        {alarm.siteAddress}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>

                {alarm.specificLocation && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p
                        className="truncate text-xs text-muted-foreground"
                        aria-label={`Specific location: ${alarm.specificLocation}`}
                      >
                        {alarm.specificLocation}
                      </p>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p className="max-w-sm">
                        {alarm.specificLocation}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* TIMING */}
            <div className="min-w-0 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />

                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Timing
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">
                    {formatDate(alarm.createdAt)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatTime(alarm.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      SLA
                    </span>

                    <p className="font-semibold">
                      {alarm.slaTimeMinutes} min
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">
                      ETA
                    </span>

                    <p className="font-semibold">
                      {alarm.etaMinutes != null
                        ? `${alarm.etaMinutes} min`
                        : "Calculating..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GUARD */}
            <div className="min-w-0 p-5">
              <div className="mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />

                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Assigned Guard
                </span>
              </div>

              {guard ? (
                <div className="min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p
                        className="truncate text-sm font-medium"
                        aria-label={`Guard: ${guard.name}`}
                      >
                        {guard.name}
                      </p>
                    </TooltipTrigger>

                    <TooltipContent>
                      {guard.name}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p
                        className="truncate text-xs text-muted-foreground"
                        aria-label={`Guard email: ${guard.email}`}
                      >
                        {guard.email}
                      </p>
                    </TooltipTrigger>

                    <TooltipContent>
                      {guard.email}
                    </TooltipContent>
                  </Tooltip>

                  <Badge
                    variant="outline"
                    className="mt-2 capitalize"
                  >
                    {guard.AlarmGuards?.status ??
                      "pending"}
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <span className="text-sm text-muted-foreground">
                    No guard assigned
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ================================================== */}
          {/* SLA */}
          {/* ================================================== */}

          {isPending &&
            alarm.slaTimeMinutes > 0 && (
              <div className="border-t bg-muted/20 px-5 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      SLA Progress
                    </span>

                    {isBreached && (
                      <span className="text-xs font-medium text-red-600">
                        Breached
                      </span>
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isBreached
                        ? "text-red-600"
                        : "text-foreground",
                    )}
                    aria-label={`SLA progress: ${slaProgress}%`}
                  >
                    {slaProgress}%
                  </span>
                </div>

                <Progress
                  value={slaProgress}
                  className="h-2"
                  aria-label={`SLA progress ${slaProgress}%`}
                />
              </div>
            )}

          {/* ================================================== */}
          {/* ACTIONS */}
          {/* ================================================== */}

          <div className="flex flex-col gap-3 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Created {formatDate(alarm.createdAt)} at{" "}
              {formatTime(alarm.createdAt)}
            </p>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    aria-label="Notify assigned guard"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  Notify assigned guard
                </TooltipContent>
              </Tooltip>

              {isPending && (
                <Button
                  size="sm"
                  className="h-8 bg-green-600 px-3 hover:bg-green-700"
                  onClick={() => {}}
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Resolve
                </Button>
              )}

              <DeleteAlarmModal alarmId={alarm.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default AlarmCard;