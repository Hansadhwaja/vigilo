import { Column, DataTable, RowWithId } from "@/components/common/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types";
import { UserPlus } from "lucide-react";

const UsersTab = () => {
  const users: UserType[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      role: "Administrator",
      status: "Active",
      lastLogin: "2 hours ago",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Operator",
      status: "Active",
      lastLogin: "Yesterday",
    },
  ];

  const columns: Column<UserType & RowWithId>[] = [
    {
      key: "user",
      header: "User",

      render: (row) => (
        <div>
          <p className="font-medium">
            {row.name}
          </p>

          <p className="text-sm text-muted-foreground">
            {row.email}
          </p>
        </div>
      ),
    },

    {
      key: "role",
      header: "Role",

      render: (row) => (
        <Badge
          variant={
            row.role === "Administrator"
              ? "default"
              : "secondary"
          }
        >
          {row.role}
        </Badge>
      ),
    },

    {
      key: "status",
      header: "Status",

      render: (row) => (
        <Badge
          className={
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-700 border"
          }
        >
          {row.status}
        </Badge>
      ),
    },

    {
      key: "lastLogin",
      header: "Last Login",
    },

    {
      key: "actions",
      header: "Actions",
      align: "center",

      render: () => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
          >
            Disable
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            User Management
          </h2>

          <p className="text-muted-foreground">
            Manage user accounts,
            roles, and permissions
          </p>
        </div>

        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        emptyText="No users found"
      />
    </div>
  );
};

export default UsersTab;