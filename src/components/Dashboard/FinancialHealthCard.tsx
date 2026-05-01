import { CreditCard } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import FinancialMetric from "./FinancialMetric";

const FinancialHealthCard = ({ liveMetrics }: any) => {
    const financialMetrics = [
        {
            label: "Current Shift Cost",
            value: (m: any) => `$${m.currentShiftCost.toLocaleString()}`,
            progress: 65,
            progressText: "65% of daily budget",
            progressClass: "text-muted-foreground",
        },
        {
            label: "Client Satisfaction",
            value: (m: any) => `${m.clientSatisfaction}%`,
            progress: (m: any) => m.clientSatisfaction,
            progressText: "Above target (90%)",
            progressClass: "text-green-600",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>
                    Key performance indicators
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">

                {/* Metrics */}
                {financialMetrics.map((item, i) => (
                    <FinancialMetric
                        key={i}
                        item={item}
                        metrics={liveMetrics}
                    />
                ))}

                {/* Footer */}
                <div className="pt-3 border-t space-y-3">

                    <div className="flex items-center justify-between">
                        <span className="text-sm">Outstanding Invoices</span>
                        <Badge variant="outline">
                            {liveMetrics.overdueInvoices}
                        </Badge>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => (window.location.href = "/invoicing")}
                    >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Billing
                    </Button>

                </div>

            </CardContent>
        </Card>
    );
};

export default FinancialHealthCard;