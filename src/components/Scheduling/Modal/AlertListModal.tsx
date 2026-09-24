import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAllShiftChangeRequestsQuery } from "@/store/apis/schedulingAPI";
import { Bell } from "lucide-react";
import { useState } from "react";
import ShiftChangeList from "../ShiftChangeList";

const AlertListModal = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetAllShiftChangeRequestsQuery();

  const shiftChangeRequests = data?.data ?? [];
  const requestCount = data?.count ?? shiftChangeRequests.length;

  if (isLoading) return <Loader />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="mr-2 h-4 w-4" />
          Alerts ({requestCount})
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Alerts</DialogTitle>

          <DialogDescription>
            Recent notifications and requests that need your attention.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-96 space-y-2 overflow-y-auto">
          {shiftChangeRequests.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-8 text-center">
              <Bell className="mx-auto h-7 w-7 text-muted-foreground/50" />

              <p className="mt-2 text-sm font-medium text-foreground">
                No alerts
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                You don't have any shift change requests to review.
              </p>
            </div>
          ) : (
            <ShiftChangeList shiftChangeRequests={shiftChangeRequests} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertListModal;
