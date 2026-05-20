import AppTabs from "@/components/common/Tab/AppTabs";
import InvoicingTable from "../Table/InvoicingTable";
import { InvoiceType } from "@/types";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
interface InvoicingTabsProps {
    invoices: InvoiceType[];
}

const InvoicingTabs = ({ invoices }: InvoicingTabsProps) => {
    const { getParam, setParam } = useQueryParams();

    const activeTab = getParam("status", "all");

    const handleTabChange = (value: string) => {
        setParam("status", value);
    };

    const tabs = [
        {
            value: "all",
            label: "All",
            activeColor: "data-[state=active]:bg-sky-500",
            content: <InvoicingTable invoices={invoices} />,
        },
        {
            value: "paid",
            label: "Paid",
            activeColor: "data-[state=active]:bg-green-500",
            content: (
                <InvoicingTable
                    invoices={invoices}
                />
            ),
        },
        {
            value: "overdue",
            label: "Overdue",
            activeColor: "data-[state=active]:bg-orange-500",
            content: (
                <InvoicingTable
                    invoices={invoices}
                />
            ),
        },
    ];

    return (
        <AppTabs
            value={activeTab}
            onValueChange={handleTabChange}
            tabs={tabs}
            tabsListClassName="w-[60vw] overflow-x-auto"
        />
    );
};

export default InvoicingTabs;