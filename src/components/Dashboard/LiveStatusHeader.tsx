import { Card, CardContent } from "@/components/ui/card";
import { Clock, Zap } from "lucide-react";

interface LiveStatusHeaderProps {
    currentTime: Date;
    avgResponseTime: number;
    hourlyRevenue: number;
}

const LiveStatusHeader = ({ currentTime, avgResponseTime, hourlyRevenue }: LiveStatusHeaderProps) => {
    return (
        <Card className="border bg-linear-to-r from-indigo-50 via-blue-50 to-purple-50 p-0">
            <CardContent className="p-2">
                <div className="flex gap-2 justify-between items-center">

                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold">System Live</span>
                            <span className="text-xs text-muted-foreground">
                                {currentTime.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/60 border">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-[11px] text-muted-foreground">Response</span>
                                <span className="text-sm font-semibold">{avgResponseTime}m</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background/60 border">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-[11px] text-muted-foreground">Revenue/hr</span>
                                <span className="text-sm font-semibold">
                                    ${hourlyRevenue.toLocaleString()}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LiveStatusHeader