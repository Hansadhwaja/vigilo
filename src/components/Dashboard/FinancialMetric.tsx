import { Progress } from "../ui/progress";


const FinancialMetric = ({
    item,
    metrics,
}: {
    item: any;
    metrics: any;
}) => {
    return (
        <div className="space-y-2">

            <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-semibold">
                    {typeof item.value === "function"
                        ? item.value(metrics)
                        : item.value}
                </span>
            </div>

            <Progress
                value={
                    typeof item.progress === "function"
                        ? item.progress(metrics)
                        : item.progress
                }
                className="h-2"
            />

            <div className={`text-xs ${item.progressClass}`}>
                {item.progressText}
            </div>

        </div>
    );
};

export default FinancialMetric;