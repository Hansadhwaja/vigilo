import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alarm } from "@/types";
import AlarmCard from "./AlarmCard";

interface Props {
  alarms: Alarm[];
}

const AlarmList = ({ alarms }: Props) => {
  return (
    <Card className="p-0">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg">Patrol Alarms</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {alarms?.length > 0 ? (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
            No alarms found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlarmList;
