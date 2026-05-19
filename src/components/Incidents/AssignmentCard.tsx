import {
    UserCheck,
    UserX,
    ShieldCheck,
    ShieldAlert,
    Fingerprint,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import SectionCard from "../common/Card/SectionCard";

interface IncidentAssignmentCardProps {
    assignedGuard?: string | null;
}

const IncidentAssignmentCard = ({
    assignedGuard,
}: IncidentAssignmentCardProps) => {
    const isAssigned = !!assignedGuard;

    return (
        <SectionCard
            title="Assignment Status"
            icon={
                isAssigned ? (
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                ) : (
                    <UserX className="h-5 w-5 text-orange-500" />
                )
            }
        >
            <div className="space-y-6">
                {/* TOP STATUS CARD */}
                <div
                    className={`
            relative
            overflow-hidden
            rounded-2xl
            border
            p-5
            text-white
            shadow-lg
            ${isAssigned
                            ? `
                  border-emerald-800
                  bg-linear-to-br
                  from-emerald-900
                  via-emerald-800
                  to-emerald-900
                `
                            : `
                  border-orange-800
                  bg-linear-to-br
                  from-orange-900
                  via-amber-800
                  to-orange-900
                `
                        }
          `}
                >
                    {/* Glow */}
                    <div
                        className={`
              absolute
              right-0
              top-0
              h-28
              w-28
              rounded-full
              blur-3xl
              ${isAssigned
                                ? "bg-emerald-300/20"
                                : "bg-orange-300/20"
                            }
            `}
                    />

                    <div className="relative flex items-center justify-between">
                        <div>
                            <p
                                className={`text-sm ${isAssigned
                                        ? "text-emerald-200"
                                        : "text-orange-200"
                                    }`}
                            >
                                Security Assignment
                            </p>

                            <h3 className="mt-1 text-2xl font-bold tracking-tight">
                                {isAssigned
                                    ? "Guard Assigned"
                                    : "Pending Assignment"}
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
                            {isAssigned ? (
                                <ShieldCheck className="h-7 w-7 text-emerald-200" />
                            ) : (
                                <ShieldAlert className="h-7 w-7 text-orange-200" />
                            )}
                        </div>
                    </div>
                </div>

                {/* STATUS DETAILS */}
                <div
                    className={`
            rounded-2xl
            border
            p-5
            shadow-sm
            ${isAssigned
                            ? `
                  border-emerald-200
                  bg-linear-to-br
                  from-emerald-50
                  to-white
                `
                            : `
                  border-orange-200
                  bg-linear-to-br
                  from-orange-50
                  to-white
                `
                        }
          `}
                >
                    <div className="flex items-center justify-between gap-4">
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
                                Current Status
                            </Label>

                            <p className="text-lg font-semibold text-slate-800">
                                {isAssigned
                                    ? "Security personnel assigned"
                                    : "Awaiting security assignment"}
                            </p>
                        </div>

                        <Badge
                            className={`
                border
                px-4
                py-1.5
                text-sm
                font-semibold
                shadow-sm
                ${isAssigned
                                    ? `
                      border-emerald-300
                      bg-emerald-100
                      text-emerald-800
                    `
                                    : `
                      border-orange-300
                      bg-orange-100
                      text-orange-800
                    `
                                }
              `}
                        >
                            {isAssigned
                                ? "Assigned"
                                : "Unassigned"}
                        </Badge>
                    </div>

                    <div
                        className={`
              mt-5
              rounded-xl
              border
              p-4
              ${isAssigned
                                ? `
                    border-emerald-200
                    bg-emerald-100/50
                  `
                                : `
                    border-orange-200
                    bg-orange-100/50
                  `
                            }
            `}
                    >
                        <p
                            className={`
                text-sm
                leading-7
                ${isAssigned
                                    ? "text-emerald-900"
                                    : "text-orange-900"
                                }
              `}
                        >
                            {isAssigned
                                ? "A security guard has been assigned and is actively handling this incident report."
                                : "No security guard has been assigned yet. This incident is currently waiting for assignment."}
                        </p>
                    </div>
                </div>

                {/* GUARD ID */}
                {isAssigned && (
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
                                    Assigned Guard ID
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
                                    {assignedGuard}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SectionCard>
    );
};

export default IncidentAssignmentCard;