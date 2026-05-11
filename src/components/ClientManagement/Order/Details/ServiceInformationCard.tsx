import { FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Props {
  order: any;
}

const ServiceInformationCard = ({ order }: Props) => {
  return (
    <Card className="border-2 border-gray-200 shadow-sm bg-white">
      <CardHeader className="border-b-2 border-gray-200 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
          <FileText className="h-6 w-6" />
          Service Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">

          <InfoItem
            label="Service Type"
            value={order.serviceType
              ?.replace(/([A-Z])/g, " $1")
              .trim()}
          />

          <InfoItem
            label="Guards Required"
            value={order.guardsRequired}
          />

          <div className="col-span-2">
            <InfoItem
              label="Location Name"
              value={order.locationName}
            />
          </div>

          <div className="col-span-2">
            <InfoItem
              label="Location Address"
              value={order.locationAddress}
            />
          </div>

          <div className="col-span-2">
            <Label className="text-base font-semibold text-gray-900 mb-2 block">
              Coordinates
            </Label>

            <div className="text-base text-gray-600 font-mono">
              Lat: {order.siteService?.coordinates?.[1] ?? "—"},
              Lng: {order.siteService?.coordinates?.[0] ?? "—"}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <Label className="text-base font-semibold text-gray-900 mb-2 block">
            Description
          </Label>

          <div className="mt-3 p-5 bg-gray-50 rounded-lg border-2 border-gray-100">
            <p className="text-base text-gray-700 leading-relaxed">
              {order.description || "No description provided"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInformationCard;

interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
}

const InfoItem = ({
  label,
  value,
}: InfoItemProps) => {
  return (
    <div>
      <Label className="text-base font-semibold text-gray-900 mb-2 block">
        {label}
      </Label>

      <div className="text-base text-gray-700">
        {value || "—"}
      </div>
    </div>
  );
};