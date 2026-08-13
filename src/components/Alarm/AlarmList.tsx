import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alarm } from "@/types";
import AlarmCard from "./Modal/AlarmCard";

interface Props {
  alarms: Alarm[];
}

const AlarmList = ({ alarms }: Props) => {
  return (
    <Card className="p-0">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Patrol Alarms</CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          {alarms?.map((alarm: Alarm) => (
            <AlarmCard key={alarm.id} alarm={alarm} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlarmList;
