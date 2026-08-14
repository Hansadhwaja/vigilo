"use client";

import { useMemo } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { cn, formatDate, formatTime } from "@/lib/utils";
import { useDeleteAlarmMutation } from "@/store/apis/alarmsAPI";
import { Alarm } from "@/types";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";

interface Props {
  alarm: Alarm;
}

const AlarmCard = ({ alarm }: Props) => {
  const [deleteAlarm, { isLoading: isDeletingAlarm }] =
    useDeleteAlarmMutation();

  const guard = alarm.guards?.[0];

  const isPending = alarm.status === "pending";
  const isBreached = alarm.breach;

  const slaProgress = useMemo(() => {
    if (!alarm.slaTimeMinutes || alarm.slaTimeMinutes <= 0) {
      return 0;
    }

    const createdAt = new Date(alarm.createdAt).getTime();
    const elapsedMinutes = (Date.now() - createdAt) / (1000 * 60);

    return Math.min(
      Math.round((elapsedMinutes / alarm.slaTimeMinutes) * 100),
      100,
    );
  }, [alarm.createdAt, alarm.slaTimeMinutes]);

  const handleDeleteAlarm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this alarm?",
    );

    if (!confirmed) return;

    try {
      await deleteAlarm(alarm.id).unwrap();

      toast.success("Alarm deleted successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.error || "Failed to delete alarm",
      );
    }
  };

  return (
    <Card className="border transition-colors hover:border-gray-300">
      <CardContent className="p-4">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Alarm Information */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />

                <p className="font-semibold text-foreground">{alarm.title}</p>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {alarm.description || "No description"}
              </p>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p>{alarm.siteName}</p>

                <p>{alarm.siteAddress || "Location TBD"}</p>

                {alarm.specificLocation && (
                  <p className="text-xs">{alarm.specificLocation}</p>
                )}
              </div>
            </div>

            <Badge variant="outline" className="capitalize">
              {alarm.alarmType}
            </Badge>
          </div>

          {/* Priority & Timing */}
          <div className="space-y-3">
            <Badge
              className={cn("capitalize", getStatusColor(alarm.priority).bg)}
            >
              {alarm.priority} Priority
            </Badge>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4" />

              <div>
                <p>{formatDate(alarm.createdAt)}</p>
                <p>{formatTime(alarm.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p>
                SLA:{" "}
                <span className="font-semibold">
                  {alarm.slaTimeMinutes} min
                </span>
              </p>

              <p>
                ETA:{" "}
                <span className="font-semibold">
                  {alarm.etaMinutes ?? "Calculating..."} min
                </span>
              </p>
            </div>
          </div>

          {/* Guard Assignment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />

              <p className="font-medium">Guard Assignment</p>
            </div>

            {guard ? (
              <div className="space-y-1">
                <p className="text-sm font-medium">{guard.name}</p>

                <p className="text-xs text-muted-foreground">{guard.email}</p>

                <Badge variant="outline" className="mt-1 capitalize">
                  {guard.AlarmGuards?.status ?? "pending"}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No guard assigned</p>
            )}

          </div>

          {/* Status & Actions */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                style={getStatusStyle(alarm.status)}
                className="border capitalize"
              >
                {getStatusColor(alarm.status).label}
              </Badge>

              {isBreached && <Badge variant="destructive">SLA Breach</Badge>}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                title="Notify"
              >
                <Bell className="h-4 w-4" />
              </Button>

              {isPending && (
                <Button
                  size="sm"
                  className="h-8 bg-green-600 hover:bg-green-700"
                  onClick={() => {}}
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Resolve
                </Button>
              )}

              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                onClick={handleDeleteAlarm}
                disabled={isDeletingAlarm}
                title="Delete alarm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* SLA Progress */}
        {isPending && alarm.slaTimeMinutes > 0 && (
          <div className="mt-5 border-t pt-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">SLA Progress</span>

              <span
                className={
                  isBreached ? "font-semibold text-red-600" : "font-medium"
                }
              >
                {slaProgress}%
              </span>
            </div>

            <Progress value={slaProgress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlarmCard;
