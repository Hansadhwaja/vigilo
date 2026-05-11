import { Activity } from "@/apis/guardsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GuardActivityCard from "./GuardActivityCard";

const GuardActivityList = ({ activity }: { activity: Activity[] }) => {
    return (
        <Card>

            <CardHeader>
                <CardTitle>
                    Shift Activity History
                </CardTitle>
            </CardHeader>

            <CardContent>

                {activity.length === 0 ? (
                    <p>No Activity Found</p>
                ) : (
                    <div className="space-y-4">

                        {activity.map((shift) => (
                            <GuardActivityCard
                                key={shift.shiftId}
                                shift={shift}
                            />
                        ))}

                    </div>
                )}

            </CardContent>
        </Card>
    );
};

export default GuardActivityList;