import { Activity } from "@/apis/guardsApi";
import SectionCard from "@/components/common/Card/SectionCard";
import { Clock } from "lucide-react";

import GuardActivityCard from "./GuardActivityCard";

const GuardActivityList = ({
    activity,
}: {
    activity: Activity[];
}) => {
    return (
        <SectionCard
            title="Shift Activity History"
            icon={<Clock className="h-5 w-5" />}
        >
            <div className="space-y-5">

                {/* HERO HEADER */}
                <div
                    className="
                        relative overflow-hidden
                        rounded-3xl
                        border border-slate-700/60
                        bg-gradient-to-br
                        from-slate-900
                        via-slate-800
                        to-slate-900
                        p-5
                        text-white
                        shadow-xl
                    "
                >
                    {/* Glow effects */}
                    <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
                    <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="relative">
                        <p className="text-sm text-slate-300">
                            Guard Shift Timeline
                        </p>

                        <h3 className="mt-1 text-2xl font-bold tracking-tight">
                            Activity Overview
                        </h3>
                    </div>
                </div>

                {/* CONTENT */}
                {activity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-slate-500 font-medium">
                            No activity found
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activity.map((shift) => (
                            <GuardActivityCard
                                key={shift.shiftId}
                                shift={shift}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SectionCard>
    );
};

export default GuardActivityList;