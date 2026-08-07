import UserAvatar from "@/components/common/Avatar/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Client } from "@/store/apis/usersApi";
import { CheckCircle2 } from "lucide-react";

interface Props {
  client: Client;
}

const ProfileCard = ({ client }: Props) => {
  return (
    <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm p-0">
      <div className="h-32 bg-linear-to-r from-primary/15 via-primary/5 to-transparent" />

      <CardContent className="-mt-12 relative px-6 pb-6 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <UserAvatar
              src={client.avatar || undefined}
              name={client.name}
              className="h-20 w-20"
            />

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {client.name}
                </h2>

                {client.isVerified && (
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Client since{" "}
                {client.createdAt ? formatDate(client.createdAt) : "-"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
