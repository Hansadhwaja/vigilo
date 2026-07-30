import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusStyle } from "@/utils/statusColors";
import { cn } from "@/lib/utils";

interface Props {
  status: string;
  children?: ReactNode;
  className?: string;
}

const CustomBadge = ({ status, children, className }: Props) => {
  return (
    <Badge
      className={cn("uppercase text-[10px]", className)}
      style={getStatusStyle(status)}
    >
      {children ?? getStatusColor(status).label}
    </Badge>
  );
};

export default CustomBadge;
