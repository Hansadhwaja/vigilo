import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  Hash,
  Activity,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import SectionCard from "@/components/common/Card/SectionCard";

import {
  getStatusColor,
  getStatusStyle,
} from "@/utils/statusColors";

import InfoItem from "./InfoItem";

interface Props {
  order: any;
}

const formatDate = (
  iso?: string
) => {
  if (!iso) return "—";

  try {
    return new Date(
      iso
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }
    );
  } catch {
    return iso;
  }
};

const OrderStatusCard = ({
  order,
}: Props) => {
  return (
    <SectionCard
      title="Order Status"
      icon={
        <BadgeCheck className="h-5 w-5" />
      }
    >
      <div className="space-y-6">
        {/* STATUS HERO */}
        <div
          className="
            relative overflow-hidden
            rounded-2xl
            border border-slate-200
            bg-linear-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-5
            text-white
            shadow-lg
          "
        >
          {/* Glow */}
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl
                  bg-white/10
                  backdrop-blur
                "
              >
                <Activity className="h-7 w-7 text-emerald-300" />
              </div>

              <div>
                <p className="text-sm text-slate-300">
                  Workflow State
                </p>

                <h3
                  className="
                    mt-1 text-2xl font-bold
                    tracking-tight
                  "
                >
                  {
                    getStatusColor(
                      order.status
                    ).label
                  }
                </h3>
              </div>
            </div>

            <Badge
              className="
                border-0
                px-4 py-2
                text-sm font-semibold
                shadow-md
              "
              style={getStatusStyle(
                order.status
              )}
            >
              {
                getStatusColor(
                  order.status
                ).label
              }
            </Badge>
          </div>
        </div>

        {/* TIMELINE INFO */}
        <div className="space-y-4">
          <InfoItem
            label="Created At"
            value={formatDate(
              order.createdAt
            )}
            icon={
              <CalendarDays className="h-4 w-4" />
            }
            direction="row"
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(
              order.updatedAt
            )}
            icon={
              <Clock3 className="h-4 w-4" />
            }
            direction="row"
          />
        </div>

        {/* ORDER ID */}
        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-linear-to-br
            from-slate-50
            to-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-xl
                bg-violet-100
                text-violet-600
                shadow-sm
              "
            >
              <Hash className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-xs font-semibold uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
                Order ID
              </p>

              <p
                className="
                  mt-2 break-all
                  font-mono text-sm
                  leading-6 text-slate-800
                "
              >
                {order.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default OrderStatusCard;