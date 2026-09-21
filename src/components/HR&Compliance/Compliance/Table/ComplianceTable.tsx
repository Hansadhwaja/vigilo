import {
  Column,
  DataTable,
  RowWithId,
} from "@/components/common/Table/DataTable";
import { Eye, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { Link } from "react-router-dom";

interface Compliance {
  id: string;
  name: string;
  email: string;
  profileCompleted: boolean;
  profile: any;
}

interface ComplianceTableProps {
  totalPages: number;
  compliances: Compliance[];
  isLoading: boolean;
  isError?: boolean;
  error?: any;
}

const ComplianceTable = ({
  compliances,
  isLoading,
  isError,
  error,
  totalPages = 1,
}: ComplianceTableProps) => {
  const columns: Column<Compliance & RowWithId>[] = [
    {
      key: "guard",
      header: "Guard",
      render: (row) => (
        <div>
          <h2 className="truncate font-semibold text-slate-800">{row.name}</h2>

          <p className="truncate text-xs text-slate-400">ID: {row.id}</p>
        </div>
      ),
    },

    {
      key: "email",
      header: "Email",
      render: (row) => (
        <p className="max-w-[260px] truncate text-sm text-slate-600">
          {row.email}
        </p>
      ),
    },

    {
      key: "status",
      header: "Profile Status",
      render: (row) => (
        <CustomBadge status={row.profileCompleted ? "Completed" : "Pending"} />
      ),
    },

    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (row) => (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="
              h-8 gap-1.5 rounded-lg
              border-slate-200
              bg-white
              px-3
              text-xs font-medium text-slate-600
              shadow-none
              transition-all
              hover:border-orange-200
              hover:bg-orange-50
              hover:text-orange-600
            "
          >
            <Link to={`/hr/compliance/details/${row.id}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={compliances}
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingText="Loading compliance records..."
      emptyText="No compliance records found"
      emptyIcon={
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <ShieldAlert className="h-8 w-8 text-slate-400" />
        </div>
      }
      totalPages={totalPages}
    />
  );
};

export default ComplianceTable;
