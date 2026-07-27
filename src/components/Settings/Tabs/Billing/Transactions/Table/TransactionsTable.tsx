import {
  Column,
  DataTable,
  RowWithId,
} from "@/components/common/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Calendar,
  CreditCard,
  FileText,
  Receipt,
} from "lucide-react";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import { formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionTableProps {
  page: number;
  onPageChange: (n: number) => void;
  limit: number;
  onLimitChange: (n: number) => void;
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  totalPages: number;
}

const TransactionsTable = ({
  transactions,
  isError,
  error,
  page = 1,
  totalPages = 1,
  onPageChange,
  isLoading,
  limit,
  onLimitChange,
}: TransactionTableProps) => {
  const columns: Column<Transaction & RowWithId>[] = [
    {
      key: "metadata.invoice_number",
      header: "Invoice",

      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-violet-100 p-1.5">
            <Receipt className="h-3.5 w-3.5 text-violet-600" />
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              {row.metadata.invoice_number}
            </p>

            <p className="font-mono text-sm text-slate-400">
              #{row.stripeInvoiceId.slice(0, 12)}...
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "amount",
      header: "Amount",

      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-100 p-1.5">
            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <p className="font-semibold uppercase text-slate-800">
              {row.currency} {row.amount}
            </p>

            <p className="text-sm text-slate-500">Subscription Payment</p>
          </div>
        </div>
      ),
    },

    {
      key: "description",
      header: "Description",

      render: (row) => (
        <div className="flex max-w-72 items-start gap-3">
          <div className="rounded-full bg-sky-100 p-1.5">
            <FileText className="h-3.5 w-3.5 text-sky-600" />
          </div>

          <div className="space-y-1">
            <p className="line-clamp-2 text-sm font-medium text-slate-700">
              {row.description}
            </p>

            <p className="font-mono text-xs text-slate-400">
              {row.subscriptionId.slice(0, 14)}...
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "status",
      header: "Status",
      align: "center",

      render: (row) => (
        <Badge
          className="uppercase text-[10px]"
          style={getStatusStyle(row.status)}
        >
          {getStatusColor(row.status).label}
        </Badge>
      ),
    },

    {
      key: "paidAt",
      header: "Paid On",

      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-orange-100 p-1.5">
            <Calendar className="h-3.5 w-3.5 text-orange-600" />
          </div>

          <div className="space-y-1">
            <p className="font-medium text-slate-700">
              {formatDate(row.paidAt)}
            </p>

            <p className="text-sm text-slate-400">Payment Date</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={transactions}
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingText="Loading transactions..."
      emptyText="No transaction found"
      emptyIcon={<Building className="h-10 w-10 text-slate-400" />}
      page={page}
      totalPages={totalPages}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
    />
  );
};

export default TransactionsTable;
