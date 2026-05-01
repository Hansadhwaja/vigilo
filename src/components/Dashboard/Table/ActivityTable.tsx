


import { Column } from "@/components/common/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/Table/DataTable";

interface DashboardActivity {
    id: string;
    time: string;
    type: string;
    typeBadge?: string;
    summary: string;
    impact: string;
    impactClass?: string;
}

const ActivityTable = ({ currentTime }: { currentTime: Date }) => {
    const activityFeed: DashboardActivity[] = [
        {
            id: "1",
            time: currentTime.toLocaleTimeString(),
            type: "Invoice",
            typeBadge: "bg-green-100 text-green-800",
            summary: "Alarm response invoice generated",
            impact: "+$55",
            impactClass: "text-green-600",
        },
        {
            id: "2",
            time: "10:24",
            type: "Incident",
            summary: "Trespass reported by A. Khan",
            impact: "Billable",
            impactClass: "text-blue-600",
        },
        {
            id: "3",
            time: "09:11",
            type: "Tour",
            summary: "Checkpoint #3 scanned - CBD Mall",
            impact: "Contract",
            impactClass: "text-muted-foreground",
        },
        {
            id: "4",
            time: "08:58",
            type: "Billing",
            typeBadge: "bg-yellow-100 text-yellow-800",
            summary: "Monthly contract payment received",
            impact: "+$12,400",
            impactClass: "text-green-600",
        },
    ];
    const activityColumns: Column<DashboardActivity>[] = [
        {
            key: "time",
            header: "Time",
        },
        {
            key: "type",
            header: "Type",
            render: (row) =>
                row.typeBadge ? (
                    <Badge className={row.typeBadge}>{row.type}</Badge>
                ) : (
                    <Badge variant="secondary">{row.type}</Badge>
                ),
        },
        {
            key: "summary",
            header: "Summary",
        },
        {
            key: "impact",
            header: "Revenue Impact",
            render: (row) => (
                <span className={row.impactClass}>{row.impact}</span>
            ),
        },
    ];
    return (
        <DataTable<DashboardActivity>
            columns={activityColumns}
            data={activityFeed}
            emptyText="No activity found"
        />
    );
};

export default ActivityTable;