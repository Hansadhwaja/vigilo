import { User } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  client: any;
}

const ClientInformationCard = ({
  client,
}: Props) => {
  if (!client) return null;

  return (
    <Card className="border-2 border-gray-200 shadow-sm bg-white">
      <CardHeader className="border-b-2 border-gray-200 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
          <User className="h-6 w-6" />
          Client Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">

          <InfoRow
            label="Name"
            value={client.name}
          />

          <InfoRow
            label="Email"
            value={client.email}
          />

          <InfoRow
            label="Mobile"
            value={client.mobile}
          />

          <InfoRow
            label="Address"
            value={client.address}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInformationCard;

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
}

const InfoRow = ({
  label,
  value,
}: InfoRowProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="text-base font-semibold text-gray-900 w-24">
        {label}:
      </div>

      <div className="text-base text-gray-700 flex-1">
        {value || "—"}
      </div>
    </div>
  );
};