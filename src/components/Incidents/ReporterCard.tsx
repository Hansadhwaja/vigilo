import {
  User,
  ShieldCheck,
  BadgeCheck,
  Fingerprint,
} from "lucide-react";

import { Label } from "@/components/ui/label";

import SectionCard from "../common/Card/SectionCard";

interface Props {
  reporter?: {
    id: string;
    name: string;
  };
}

const ReporterCard = ({
  reporter,
}: Props) => {
  if (!reporter) return null;

  const initials = reporter.name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("")
    ?.slice(0, 2);

  return (
    <SectionCard
      title="Reporter Information"
      icon={<User className="h-5 w-5" />}
    >
      <div className="space-y-6">
        {/* TOP PROFILE */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-linear-to-br
            from-slate-50
            via-white
            to-slate-100
            p-6
            shadow-sm
          "
        >
          {/* Background Glow */}
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100 blur-3xl opacity-40" />

          <div className="relative flex items-center gap-5">
            {/* Avatar */}
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-2xl
                bg-linear-to-br
                from-blue-500
                to-indigo-600
                text-2xl
                font-bold
                text-white
                shadow-lg
              "
            >
              {initials || "NA"}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                  {reporter.name}
                </h3>

                <p className="text-sm text-slate-500">
                  Incident Reporter
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-emerald-100
                    px-3
                    py-1
                    text-sm
                    font-medium
                    text-emerald-700
                  "
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified User
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-blue-100
                    px-3
                    py-1
                    text-sm
                    font-medium
                    text-blue-700
                  "
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Security Personnel
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* NAME */}
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
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                "
              >
                <User className="h-5 w-5" />
              </div>

              <div className="space-y-2">
                <Label
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-slate-500
                  "
                >
                  Reporter Name
                </Label>

                <p className="text-lg font-semibold text-slate-800">
                  {reporter.name}
                </p>
              </div>
            </div>
          </div>

          {/* ID */}
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
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-100
                  text-violet-600
                "
              >
                <Fingerprint className="h-5 w-5" />
              </div>

              <div className="space-y-2 min-w-0 flex-1">
                <Label
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-slate-500
                  "
                >
                  Reporter ID
                </Label>

                <p
                  className="
                    break-all
                    font-mono
                    text-sm
                    leading-6
                    text-slate-700
                  "
                >
                  {reporter.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ReporterCard;