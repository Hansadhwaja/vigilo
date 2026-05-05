import { SummaryCardType } from '@/types';
import SummaryCard from './SummaryCard';

const SummaryCards = ({ items }: { items: SummaryCardType[] }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map(i => (
                <SummaryCard key={i.title} {...i} />
            ))}
        </div>
    )
}

export default SummaryCards