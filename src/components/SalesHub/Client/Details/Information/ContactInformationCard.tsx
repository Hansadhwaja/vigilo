import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/store/apis/usersApi";
import { Mail, MapPin, Phone } from "lucide-react";

interface Props {
  client: Client;
}

const ContactInformationCard = ({ client }: Props) => {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="size-5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 break-all text-sm font-medium text-slate-800">
              {client.email || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Phone className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Mobile
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {client.countryCode
                ? `${client.countryCode} ${client.mobile}`
                : client.mobile || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <MapPin className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Address
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {client.address || "Not provided"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInformationCard;
