import {
  Clock,
  CalendarDays,
  TimerReset,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import SectionCard from "../common/Card/SectionCard";

interface Props {
  date: string;
  time: string;
}

const DateTimeCard = ({
  date,
  time,
}: Props) => {
  return (
    <SectionCard
      title="Date & Time"
      icon={<Clock className="h-5 w-5" />}
    >
      <div className="space-y-6">
        {/* TOP STATUS */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-5
            text-white
            shadow-lg
          "
        >
          {/* Glow */}
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">
                Incident Timeline
              </p>

              <h3 className="mt-1 text-2xl font-bold tracking-tight">
                Recorded
              </h3>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-white/10
                backdrop-blur
              "
            >
              <TimerReset className="h-7 w-7 text-cyan-300" />
            </div>
          </div>
        </div>

        {/* DATE */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-50
            to-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-blue-600
                shadow-sm
              "
            >
              <CalendarDays className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <Label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
                Date
              </Label>

              <p
                className="
                  text-lg
                  font-semibold
                  leading-7
                  text-slate-800
                "
              >
                {date}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* TIME */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-50
            to-white
            p-5
            shadow-sm
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-violet-100
                text-violet-600
                shadow-sm
              "
            >
              <Clock className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <Label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
                Time
              </Label>

              <p
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-800
                "
              >
                {time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default DateTimeCard;