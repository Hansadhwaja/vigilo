import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Bell, Check, Clock } from "lucide-react";
import { Progress } from "../ui/progress";

const KPIMetrics = ({ openIncidents }: { openIncidents: number }) => {
    const metrics = [
        {
            label: "Total Completed Patrols",
            value: 124,
            badge: {
                text: "124",
                icon: Check,
                className: "bg-green-100 text-green-800",
            },
            progress: 82,
            targetText: "82% of monthly target (150)",
            targetClass: "text-muted-foreground",
        },
        {
            label: "SLA Breaches",
            value: 3,
            badge: {
                text: "3",
                icon: Clock,
                className: "bg-red-100 text-red-800",
            },
            progress: 15,
            targetText: "15% breach rate (target: <10%)",
            targetClass: "text-red-600",
        },
        {
            label: "Unresolved Incidents",
            value: openIncidents,
            badge: {
                text: openIncidents,
                icon: Bell,
                className: "bg-yellow-100 text-yellow-800",
            },
            progress: openIncidents * 10,
            targetText: `${openIncidents} pending resolution`,
            targetClass: "text-muted-foreground",
        },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>
                    Monthly performance metrics and compliance tracking
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {metrics.map((m, index) => {
                        const Icon = m.badge.icon;

                        return (
                            <div key={index} className="space-y-2">

                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm md:text-base font-medium">
                                        {m.label}
                                    </span>

                                    <Badge className={m.badge.className}>
                                        <Icon className="h-3 w-3 mr-1" />
                                        {m.badge.text}
                                    </Badge>
                                </div>

                                {/* Progress */}
                                <Progress value={m.progress} className="h-2" />

                                {/* Footer */}
                                <div className={`text-sm ${m.targetClass}`}>
                                    {m.targetText}
                                </div>

                            </div>
                        );
                    })}

                </div>
            </CardContent>
        </Card>
    )
}

export default KPIMetrics