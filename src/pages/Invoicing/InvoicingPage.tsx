import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import InvoicingTabs from "@/components/Invoicing/Tabs/InvoicingTabs";
import CustomHeader from "@/components/common/Header/CustomHeader";
import { Plus } from "lucide-react";
import { useGetAllInvoiceQuery } from "@/apis/invoiceApis";
import Loader from "@/components/common/Loader";
import InvoiceSearchFilters from "@/components/Invoicing/InvoiceSearchFilters";
import InvoiceStats from "@/components/Invoicing/InvoiceStats";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

export default function InvoicingPage() {
  const { getParam } = useQueryParams();
  const status = getParam("status", "all");
  const { data, isLoading } = useGetAllInvoiceQuery({
    status,
  });
  const invoices = data?.data ?? [];

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">

      <CustomHeader
        title="Invoicing & Payments"
        description="Manage billing, payments, and financial tracking"
        others={
          <Button
            asChild
            size="sm"
            className="
    rounded-xl 
    bg-linear-to-r from-emerald-500 to-emerald-600 
    px-4 py-2 
    text-white 
    shadow-sm 
    transition-all 
    hover:from-emerald-600 hover:to-emerald-700 
    hover:shadow-md 
    active:scale-[0.98]
  "
          >
            <Link to="/invoicing/new" className="text-xs md:text-sm">
              <Plus size={14} className="shrink-0" />
              Generate Invoice
            </Link>
          </Button>
        }
      />
      <InvoiceStats />

      <InvoiceSearchFilters />
      <InvoicingTabs invoices={invoices} />

    </div>
  );
}