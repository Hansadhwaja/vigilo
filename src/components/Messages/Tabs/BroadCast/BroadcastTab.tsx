import { Megaphone } from "lucide-react";
import { useSocket } from "@/lib/hooks/useSocket";
import BroadCastMessageForm from "./Form/BroadCastMessageForm";
import { BroadCastFormValues } from "@/schemas";
import { toast } from "sonner";

const BroadcastTab = () => {
  const socketRef = useSocket();

  const handleSubmit = async (
    data: BroadCastFormValues
  ) => {
    try {
      socketRef.current?.emit(
        "broadcastMessage",
        {
          message: data.message,
        }
      );

      toast.success(
        "Broadcast message sent"
      );
    } catch {
      toast.error(
        "Failed to send broadcast"
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-purple-100 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
            <Megaphone className="h-5 w-5 text-violet-600" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-violet-950">
              Broadcast Message
            </h2>

            <p className="text-sm text-violet-700/80">
              Send announcements to guards
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <BroadCastMessageForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default BroadcastTab;