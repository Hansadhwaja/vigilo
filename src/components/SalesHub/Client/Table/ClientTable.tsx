import {
  Column,
  DataTable,
  RowWithId,
} from "@/components/common/Table/DataTable";
import { Building, Mail, Phone, User } from "lucide-react";
import { Client } from "@/apis/usersApi";
import ViewClientModal from "../Modal/ViewClientModal";
import ClientTableActions from "./ClientTableActions";

interface ClientTableProps {
  page: number;
  totalPages: number;
  limit: number;
  clients: Client[];
  isLoading: boolean;
  isError: boolean;
  error: any;

  onPageChange: (n: number) => void;
  onLimitChange: (n: number) => void;
}

const ClientTable = ({
  clients,
  isLoading,
  isError,
  error,

  page = 1,
  totalPages = 1,
  limit,

  onPageChange,
  onLimitChange,
}: ClientTableProps) => {
  const columns: Column<Client & RowWithId>[] = [
    {
      key: "name",
      header: "Client",

      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-orange-100 p-2">
            <User className="h-4 w-4 text-orange-600" />
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-slate-800 truncate w-40">
              {row.name}
            </p>

            <p className="font-mono text-base text-slate-400">
              #{row.id.slice(0, 8)}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "email",
      header: "Email",

      render: (row) => (
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-full bg-sky-100 p-2">
            <Mail className="h-4 w-4 text-sky-600" />
          </div>

          <div className="min-w-0 space-y-1">
            <p
              className="truncate font-medium text-slate-700"
              title={row.email}
            >
              {row.email}
            </p>

            <p className="text-sm text-slate-400">Email Address</p>
          </div>
        </div>
      ),
    },

    {
      key: "mobile",
      header: "Phone",

      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-emerald-100 p-2">
            <Phone className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <p className="font-medium text-slate-700">{row.mobile}</p>

            <p className="text-sm text-slate-400">Mobile Number</p>
          </div>
        </div>
      ),
    },

    {
      key: "address",
      header: "Address",

      render: (row) => (
        <div className="max-w-[260px] space-y-1">
          <p
            className="line-clamp-2 leading-5 text-slate-700"
            title={row.address || "No address"}
          >
            {row.address || "—"}
          </p>

          <p className="text-sm text-slate-400">Client Address</p>
        </div>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      align: "center",

      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <ViewClientModal client={row} />
          <ClientTableActions row={row} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={clients}
      isLoading={isLoading}
      isError={isError}
      error={error}
      loadingText="Loading clients..."
      emptyText="No clients found"
      emptyIcon={<Building className="h-10 w-10 text-slate-400" />}
      page={page}
      totalPages={totalPages}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
    />
  );
};

export default ClientTable;
