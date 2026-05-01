import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SummaryCards from "@/components/Invoicing/SummaryCards";
import InvoicingTabs from "@/components/Invoicing/Tabs/InvoicingTabs";
import CustomHeader from "@/components/common/Header/CustomHeader";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchFilters from "@/components/Invoicing/SearchFilters";

export default function InvoicingPage() {

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full">
      <div className="flex justify-between items-center">
        <CustomHeader
          title="Invoicing & Payments"
          description="Manage billing, payments, and financial tracking"
        />
        <Button size={"sm"} asChild>
          <Link to="/invoicing/new" className="text-xs md:text-sm" >
            <Plus size={14} />
            Generate Invoice
          </Link>
        </Button>
      </div>
      <SummaryCards />
      <Card className="p-2 sm:p-4">
        <CardHeader className="px-0">
          <CardTitle>Invoice Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <SearchFilters />
          <InvoicingTabs />
        </CardContent>
      </Card>
    </div>
  );
}