import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SummaryCards from "@/components/Invoicing/SummaryCards";
import InvoicingTabs from "@/components/Invoicing/Tabs/InvoicingTabs";
import CustomHeader from "@/components/common/Header/CustomHeader";
import { Plus } from "lucide-react";

export default function InvoicingPage() {
  return (
    <div className="space-y-6 overflow-y-auto">
      <div className="flex justify-between items-center">
        <CustomHeader
          title="Invoicing & Payments"
          description="Manage billing, payments, and financial tracking"
        />
        <Button size={"sm"} asChild>
          <Link to="/invoicing/new" >
            <Plus size={14} />
            Generate Invoice
          </Link>

        </Button>
      </div>

      <SummaryCards />


      {/* <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices, clients, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}

      <InvoicingTabs />

    </div>
  );
}