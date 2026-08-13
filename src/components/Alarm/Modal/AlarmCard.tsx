import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatTime } from "@/lib/utils";
import { useDeleteAlarmMutation } from "@/store/apis/alarmsAPI";
import { Alarm } from "@/types";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import { Bell, CheckCircle, MapPin, Trash2, User } from "lucide-react";
import { toast } from "sonner";

interface Props {
  alarm: Alarm;
}

const AlarmCard = ({ alarm }: Props) => {
  const [deleteAlarm, { isLoading: isDeletingAlarm }] =
    useDeleteAlarmMutation();

  const handleDeleteAlarm = async (alarmId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this alarm?",
    );
    if (!confirmDelete) return;

    try {
      await deleteAlarm(alarmId).unwrap();
      toast.success("Alarm deleted successfully");
    } catch (err: any) {
      const message =
        err?.data?.message || err?.error || "Failed to delete alarm";
      toast.error(message);
    }
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Alarm Info */}
            <div className="mt-3 flex flex-col justify-between">
              <div className="font-medium text-gray-900">{alarm.siteName}</div>
              <div className="text-xl text-gray-600">{alarm.alarmType}</div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-lg text-gray-600">
                  {alarm.siteAddress || "Location TBD"}
                </span>
              </div>
            </div>

            {/* Priority & Timing */}
            <div className="mt-2">
              <Badge className={getStatusColor(alarm.priority).bg}>
                {alarm.priority} Priority
              </Badge>
              <div>
                <p className="text-muted-foreground text-sm"></p>
                <p className="font-semibold text-base">
                  Created At: {formatDate(alarm.createdAt)}
                </p>
                <p className="font-semibold text-base">
                  {formatTime(alarm.createdAt)}
                </p>
              </div>
              <div className={"text-lg font-medium"}>
                SLA: {alarm.slaTimeMinutes}min
              </div>
            </div>

            {/* Assignment */}
            <div className="mt-4 flex flex-col justify-between">
              {alarm.status == "assigned" ? (
                <>
                  <div className="text-xl text-gray-900">{alarm.status}</div>
                  <div className="text-lg text-gray-600">
                    ETA: {alarm.etaMinutes || "Calculating..."}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <User className="h-3 w-3 text-green-500" />
                    <span className="text-lg text-green-600">Assigned</span>
                  </div>
                </>
              ) : (
                <div className="text-xl text-gray-500">Unassigned</div>
              )}
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between">
              <div>
                {alarm.status ? (
                  <Badge
                    style={getStatusStyle(alarm.status)}
                    className="border capitalize"
                  >
                    {getStatusColor(alarm.status).label}
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                    Undefined
                  </Badge>
                )}
                {alarm.breach && (
                  <div className="text-lg font-semibold text-red-600 mt-1">
                    🚨 SLA Breach
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Bell className="h-3 w-3" />
                </Button>

                {!alarm.status && (
                  <Button
                    size="sm"
                    onClick={() => {}}
                    className="h-8 px-2 text-lg bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolve
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteAlarm(alarm.id)}
                  disabled={isDeletingAlarm}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* SLA Progress Bar */}
        {!alarm.status && alarm.slaTimeMinutes > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-lg text-gray-600 mb-1">
              <span>SLA Progress</span>
              <span>
                {Math.round(
                  (alarm.slaTimeMinutes / (alarm?.totalTimeMinutes ?? 1)) * 100,
                )}
                %
              </span>
            </div>
            <Progress
              value={Math.min(
                (alarm.slaTimeMinutes / (alarm?.totalTimeMinutes ?? 1)) * 100,
                100,
              )}
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlarmCard;
