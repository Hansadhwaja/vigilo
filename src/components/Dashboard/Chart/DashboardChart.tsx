import RevenueTrendChart from "./RevenueTrendChart";
import RevenuePieChart from "./RevenuePieChart";

interface Props {
    line: any[];
    revenueStreams: any[];
}

const DashboardChart = ({ line, revenueStreams }: Props) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <RevenueTrendChart data={line} />
            <RevenuePieChart data={revenueStreams} />
        </div>
    );
};

export default DashboardChart;