import {
  Column,
  DataTable,
  RowWithId,
} from "@/components/common/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/types";
import { TicketType } from "@/types/enquiry/enquiry.types";
import ViewTicketModal from "../Modal/ViewTicketModal";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { formatDate } from "@/lib/utils";

interface Props {
  tickets: TicketType[];
  pagination: Pagination;
}

const EnquiryTable = ({ tickets, pagination }: Props) => {
  const columns: Column<TicketType & RowWithId>[] = [
    {
      key: "id",
      header: "S.No",
      render: (_, index) => index + 1,
    },

    {
      key: "subject",
      header: "Subject",
      render: (row) => (
        <div className="min-w-0">
          <p className="max-w-60 truncate font-medium">{row.subject}</p>

          {row.name && (
            <p className="mt-0.5 text-sm text-muted-foreground">{row.name}</p>
          )}
        </div>
      ),
    },

    {
      key: "description",
      header: "Description",
      render: (row) => (
        <p className="max-w-sm truncate text-sm text-muted-foreground">
          {row.description || "No description provided"}
        </p>
      ),
    },

    {
      key: "senderType",
      header: "Source",
      render: (row) => (
        <Badge variant="outline" className="capitalize">
          {row.senderType}
        </Badge>
      ),
    },

    {
      key: "status",
      header: "Status",
      render: (row) => <CustomBadge status={row.status} />,
    },

    {
      key: "createdAt",
      header: "Created",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.createdAt)}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (row) => (
        <div className="flex justify-center">
          <ViewTicketModal ticket={row} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tickets}
      emptyText="No enquiries found"
      totalPages={pagination.totalPages}
    />
  );
};

export default EnquiryTable;
