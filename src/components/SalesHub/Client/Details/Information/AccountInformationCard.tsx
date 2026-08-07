import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Client } from "@/store/apis/usersApi";
import { CalendarDays, CheckCircle2, User } from "lucide-react";

interface Props {
  client: Client;
}

const AccountInformationCard = ({ client }: Props) => {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Account Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <User className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Client ID
            </p>

            <p className="mt-1 break-all text-sm font-medium text-slate-800">
              {client.id}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {client.createdAt ? formatDate(client.createdAt) : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Verification Status
            </p>

            <p className="mt-1 text-sm font-medium text-emerald-600">
              {client.isVerified ? "Verified Client" : "Not Verified"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInformationCard;
