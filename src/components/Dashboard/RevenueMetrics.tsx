import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { revenueStreams } from "@/data/sampleData";
import { TrendingDown, TrendingUp } from "lucide-react";

const RevenueMetrics = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueStreams.map((stream) => {
                const isPositive = stream.change > 0;

                return (
                    <Card
                        key={stream.name}
                        className="relative overflow-hidden border bg-background hover:shadow-md transition p-0"
                    >
                        <CardContent className="p-2 md:p-4 space-y-2">

                            {/* Header */}
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stream.name}
                                    </p>

                                    <p className="text-xl font-semibold">
                                        ${stream.value.toLocaleString()}
                                    </p>
                                </div>

                                {/* Color indicator */}
                                <div
                                    className="w-10 h-10 rounded-lg opacity-20"
                                    style={{ backgroundColor: stream.color }}
                                />
                            </div>

                            {/* Trend */}
                            <div className="flex items-center gap-1">
                                {isPositive ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                )}

                                <span
                                    className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {isPositive ? "+" : ""}
                                    {stream.change}%
                                </span>

                                <span className="text-xs text-muted-foreground ml-1">
                                    vs last month
                                </span>
                            </div>

                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default RevenueMetrics