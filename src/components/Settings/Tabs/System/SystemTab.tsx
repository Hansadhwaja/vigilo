import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const healthMetrics = [
    {
        label: "CPU Usage",
        value: 23,
    },
    {
        label: "Memory Usage",
        value: 67,
    },
    {
        label: "Database Storage",
        value: 45,
    },
];

const versionInfo = [
    {
        label: "VIGILO Platform",
        value: "v2.4.1",
    },
    {
        label: "API Version",
        value: "v1.2.0",
    },
    {
        label: "Database",
        value: "PostgreSQL 15.2",
    },
    {
        label: "Last Update",
        value: "3 days ago",
    },
];

const SystemTab = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold">
                    System Information
                </h2>

                <p className="text-muted-foreground">
                    System status, performance, and maintenance
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            System Health
                        </CardTitle>

                        <CardDescription>
                            Current system performance metrics
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {healthMetrics.map(
                            (metric) => (
                                <div
                                    key={metric.label}
                                    className="space-y-2"
                                >
                                    <div className="flex justify-between text-sm">
                                        <span>
                                            {metric.label}
                                        </span>

                                        <span>
                                            {metric.value}%
                                        </span>
                                    </div>

                                    <Progress
                                        value={
                                            metric.value
                                        }
                                        className="h-2"
                                    />
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Version Information
                        </CardTitle>

                        <CardDescription>
                            Current software versions and updates
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        {versionInfo.map(
                            (item) => (
                                <div
                                    key={item.label}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {item.label}
                                    </span>

                                    <span className="font-medium">
                                        {item.value}
                                    </span>
                                </div>
                            )
                        )}

                        <div className="border-t pt-3">
                            <Badge
                                variant="secondary"
                            >
                                Updates Available
                            </Badge>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Security update
                                v2.4.2 available
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SystemTab;