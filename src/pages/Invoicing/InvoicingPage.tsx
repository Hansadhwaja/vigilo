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
import InvoicingTable from "@/components/Invoicing/Table/InvoicingTable";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function InvoicingPage() {
  const { getParam } = useQueryParams();
  const status = getParam("status", "all");
  const month = getParam("month");
  const search = getParam("search");
  const page = getParam("page", "1");
  const limit = getParam("limit", "10");
  const debouncedSearch = useDebounce(search);
  const { data, isLoading, isFetching } = useGetAllInvoiceQuery({
    status,
    month,
    search: debouncedSearch,
    page,
    limit: limit
  });
  const invoices = data?.data ?? [];

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">

      <CustomHeader
        title="Invoicing & Payments"
        description="Manage billing, payments, and financial tracking"
        others={
          <Button
            asChild
            size="sm"
            className="rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 shadow-sm hover:shadow-md"
          >
            <Link to="/invoicing/new" className="text-sm md:text-sm">
              <Plus size={14} className="shrink-0" />
              Generate Invoice
            </Link>
          </Button>
        }
      />


      <InvoiceSearchFilters />
      {isLoading || isFetching ? <Loader /> : (
        <>
          <InvoiceStats />
          <InvoicingTable
            invoices={invoices}
          />
        </>
      )}

    </div>
  );
}