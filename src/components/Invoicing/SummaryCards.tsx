import SummaryCard from './SummaryCard';

const SummaryCards = () => {
    const invoiceSummary = [
        {
            title: "Total Invoiced this month",
            value: `$${Number(1034023).toLocaleString()}`,

        },
        {
            title: "Collected from Clients",
            value: `$${Number(36523).toLocaleString()}`,
            className: "text-green-500"
        },
        {
            title: "Pending / Overdue",
            value: `$${Number(74023).toLocaleString()}`,
            className: "text-yellow-500"
        },
        {
            title: "Total Records",
            value: "7",
            className: "text-emerald-500"
        },
        {
            title: "Overdue",
            value: "1",
            className: "text-orange-500"
        },

    ];
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {invoiceSummary.map(i => (
                <SummaryCard key={i.title} {...i} />
            ))}

        </div>
    )
}

export default SummaryCards