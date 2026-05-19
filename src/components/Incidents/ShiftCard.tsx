import {
  Shield,
  ShieldCheck,
  Fingerprint,
  Clock3,
} from "lucide-react";

import { Label } from "@/components/ui/label";

import SectionCard from "../common/Card/SectionCard";

interface Shift {
  id: string;
  type: string;
}

interface ShiftCardProps {
  shift?: Shift | null;
}

const ShiftCard = ({
  shift,
}: ShiftCardProps) => {
  if (!shift) return null;

  return (
    <SectionCard
      title="Shift Information"
      icon={<Shield className="h-5 w-5" />}
    >
      <div className="space-y-6">
        {/* TOP OVERVIEW */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-linear-to-br
            from-emerald-900
            via-emerald-800
            to-emerald-900
            p-5
            text-white
            shadow-lg
          "
        >
          {/* Glow */}
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-200">
                Active Security Shift
              </p>

              <h3 className="mt-1 text-2xl font-bold capitalize tracking-tight">
                {shift.type}
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
              <ShieldCheck className="h-7 w-7 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* SHIFT TYPE */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
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
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-emerald-100
                text-emerald-600
                shadow-sm
              "
            >
              <Clock3 className="h-6 w-6" />
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
                Shift Type
              </Label>

              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />

                <p
                  className="
                    text-xl
                    font-bold
                    capitalize
                    tracking-tight
                    text-slate-800
                  "
                >
                  {shift.type}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SHIFT ID */}
        <div
          className="
            rounded-2xl
            border
            border-slate-200
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
              <Fingerprint className="h-6 w-6" />
            </div>

            <div className="space-y-2 min-w-0 flex-1">
              <Label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
                Shift ID
              </Label>

              <p
                className="
                  break-all
                  font-mono
                  text-sm
                  leading-7
                  text-slate-700
                "
              >
                {shift.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ShiftCard;