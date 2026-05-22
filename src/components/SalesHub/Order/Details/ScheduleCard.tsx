import {
  CalendarDays,
  Clock,
  Timer,
  TimerReset,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import SectionCard from "@/components/common/Card/SectionCard";
import InfoItem from "./InfoItem";
import { formatDate, formatTime } from "@/lib/utils";

interface Props {
  order: any;
}

const ScheduleCard = ({
  order,
}: Props) => {
  return (
    <SectionCard
      title="Schedule"
      icon={<Clock className="h-5 w-5" />}
    >
      <div className="space-y-6">
        {/* HERO */}
        <div
          className="
            relative overflow-hidden
            rounded-3xl
            border border-slate-700/60
            bg-linear-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-5
            text-white
            shadow-xl
          "
        >
          {/* Glow */}
          <div
            className="
              absolute -right-6 -top-6
              h-32 w-32
              rounded-full
              bg-cyan-400/20
              blur-3xl
            "
          />

          <div
            className="
              absolute -bottom-10 left-10
              h-28 w-28
              rounded-full
              bg-violet-500/20
              blur-3xl
            "
          />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">
                Service Timeline
              </p>

              <h3
                className="
                  mt-1 text-2xl
                  font-bold tracking-tight
                "
              >
                Active Schedule
              </h3>
            </div>

            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-white/10
                backdrop-blur
              "
            >
              <TimerReset className="h-7 w-7 text-cyan-300" />
            </div>
          </div>
        </div>

        {/* DATES */}
        <div className="grid gap-4">
          <div
            className="
              rounded-2xl
              border border-slate-200
              bg-linear-to-br
              from-blue-50
              to-white
              p-5
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  shadow-sm
                "
              >
                <CalendarDays className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <p
                  className="
                    text-xs font-semibold
                    uppercase tracking-[0.2em]
                    text-slate-500
                  "
                >
                  Start Date
                </p>

                <p
                  className="
                    text-lg font-semibold
                    text-slate-800
                  "
                >
                  {formatDate(
                    order.startDate
                  )}
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              rounded-2xl
              border border-slate-200
              bg-linear-to-br
              from-orange-50
              to-white
              p-5
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-orange-100
                  text-orange-600
                  shadow-sm
                "
              >
                <CalendarDays className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <p
                  className="
                    text-xs font-semibold
                    uppercase tracking-[0.2em]
                    text-slate-500
                  "
                >
                  End Date
                </p>

                <p
                  className="
                    text-lg font-semibold
                    text-slate-800
                  "
                >
                  {formatDate(
                    order.endDate
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* TIMES */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className="
              rounded-2xl
              border border-slate-200
              bg-linear-to-br
              from-violet-50
              to-white
              p-5
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-violet-100
                  text-violet-600
                  shadow-sm
                "
              >
                <Clock className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <p
                  className="
                    text-xs font-semibold
                    uppercase tracking-[0.2em]
                    text-slate-500
                  "
                >
                  Start Time
                </p>

                <p
                  className="
                    text-2xl font-bold
                    tracking-tight
                    text-slate-800
                  "
                >

                  {order.startTime}

                </p>
              </div>
            </div>
          </div>

          <div
            className="
              rounded-2xl
              border border-slate-200
              bg-linear-to-br
              from-cyan-50
              to-white
              p-5
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-cyan-100
                  text-cyan-600
                  shadow-sm
                "
              >
                <Clock className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <p
                  className="
                    text-xs font-semibold
                    uppercase tracking-[0.2em]
                    text-slate-500
                  "
                >
                  End Time
                </p>

                <p
                  className="
                    text-2xl font-bold
                    tracking-tight
                    text-slate-800
                  "
                >

                  {order.endTime}

                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ScheduleCard;