import { Link } from "react-router-dom";

import EditOrderModal from "../Modal/EditOrderModal";
import AcceptOrderModal from "../Modal/AcceptOrderModal";
import RejectOrderModal from "../Modal/RejectOrderModal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/store/apis/ordersApi";
import { Edit, EllipsisVertical, Eye, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusStyle } from "@/utils/statusColors";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  row: Order;
}

const OrderActions = ({ row }: Props) => {
  const [open, setOpen] = useState(false);
  const [editOrderModalOpen, setEditOrderModalOpen] = useState(false);
  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        to={`/sales/orders/${row.id}`}
        className="
                            rounded-xl border border-slate-200
                            p-2 text-slate-500 transition-all
                            hover:border-orange-200
                            hover:bg-orange-50
                            hover:text-orange-600
                        "
      >
        <Eye className="h-4 w-4" />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="
                                rounded-xl border border-slate-200
                                p-2 text-slate-500 transition-all
                                hover:border-slate-300
                                hover:bg-slate-50
                                hover:text-slate-700
                            "
        >
          <EllipsisVertical className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 rounded-2xl">
          {row.status !== "completed" ? (
            <>
              <DropdownMenuItem>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditOrderModalOpen(true)}
                  className="
                        w-full justify-start rounded-xl
                        px-3 py-2 text-slate-700
                        transition-all
                        hover:bg-orange-50
                        hover:text-orange-600
                    "
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Order
                </Button>
              </DropdownMenuItem>

              {row.status === "pending" && <DropdownMenuSeparator />}
            </>
          ) : (
            <Badge
              className="uppercase text-[10px]"
              style={getStatusStyle("completed")}
            >
              Completed
            </Badge>
          )}

          {row.status === "pending" && (
            <>
              <DropdownMenuItem>
                <div onClick={(e) => e.stopPropagation()}>
                  <AcceptOrderModal id={row.id} />
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setOpen(true)}
                  className="
                        w-full justify-start rounded-xl
                        px-3 py-2 text-red-600
                        transition-all
                        hover:bg-red-50
                        hover:text-red-700
                    "
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Order
                </Button>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {open && <RejectOrderModal id={row.id} open={open} setOpen={setOpen} />}
      {editOrderModalOpen && (
        <EditOrderModal
          order={row}
          open={editOrderModalOpen}
          setOpen={setEditOrderModalOpen}
        />
      )}
    </div>
  );
};

export default OrderActions;
