import { Badge as BadgeIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import {
  getStatusColor,
  getStatusStyle,
} from "@/utils/statusColors";

interface Props {
  order: any;
}

const formatDate = (iso?: string) => {
  if (!iso) return "—";

  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
};

const OrderStatusCard = ({ order }: Props) => {
  return (
    <Card className="border-2 border-gray-200 shadow-sm bg-white">
      <CardHeader className="border-b-2 border-gray-200 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
          <BadgeIcon className="h-6 w-6" />
          Order Status
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">

        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-gray-900">
            Status:
          </Label>

          <Badge
            className="text-base font-semibold px-4 py-1.5 border-2"
            style={getStatusStyle(order.status)}
          >
            {getStatusColor(order.status).label}
          </Badge>
        </div>

        <InfoItem
          label="Created"
          value={formatDate(order.createdAt)}
        />

        <InfoItem
          label="Last Updated"
          value={formatDate(order.updatedAt)}
        />

        <div>
          <Label className="text-base font-semibold text-gray-900 mb-2 block">
            Order ID
          </Label>

          <div className="text-sm text-gray-600 font-mono break-all leading-relaxed">
            {order.id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;

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