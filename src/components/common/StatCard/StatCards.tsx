
import StatCard from "./StatCard";
import { LucideIcon } from "lucide-react";

export interface StatItem {
    label: string;
    value: number | string;
    Icon?: LucideIcon;
    color?: string;
}

interface StatCardsProps {
    items: StatItem[];
}

const StatCards = ({ items }: StatCardsProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((item, idx) => (
                <StatCard key={idx} {...item} />
            ))}
        </div>
    );
};

export default StatCards;