import DeleteClientModal from "../Modal/DeleteClientModal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditClientModal from "../Modal/EditClientModal";
import { Edit, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Client } from "@/apis/usersApi";
import { Button } from "@/components/ui/button";

const ClientTableActions = ({ row }: { row: Client }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700">
          <EllipsisVertical className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 rounded-2xl">
          <DropdownMenuItem asChild className="w-full cursor-pointer">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditModalOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteClientModal client={row} />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditClientModal
        client={row}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
    </>
  );
};

export default ClientTableActions;
