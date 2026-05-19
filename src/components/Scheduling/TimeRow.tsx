"use client";

import { cn } from "@/lib/utils";

import DayCell from "./DayCell";

import { useSchedulingData } from "./hook/useSchedulingData";

interface TimeRowProps {
    slot: {
        time: string;
        label: string;
    };
    scheduling: ReturnType<typeof useSchedulingData>;
}

const TimeRow = ({ slot, scheduling }: TimeRowProps) => {
    const {
        weekDays,
        getAssignmentsForSlot,
        selectedKey,
    } = scheduling;

    return (
        <div className="grid grid-cols-8 border-b border-slate-200 last:border-b-0">
            {/* Time Column */}
            <div className="flex flex-col justify-center border-r border-slate-200 bg-slate-50/70 px-4 py-5">
                <h4 className="text-sm font-semibold text-slate-800">
                    {slot.time}
                </h4>

                <p className="text-xs text-slate-500">
                    {slot.label}
                </p>
            </div>

            {/* Day Cells */}
            {weekDays.map((day, idx) => {
                const assignments = getAssignmentsForSlot(
                    day,
                    slot.time
                );
                const isSelected =
                    day.toDateString() === selectedKey;

                return (
                    <div
                        key={idx}
                        className={cn(
                            "border-r border-slate-200 transition-colors duration-200",
                            isSelected
                                ? "bg-orange-50/40"
                                : "bg-white hover:bg-slate-50"
                        )}
                    >
                        <DayCell
                            assignments={assignments}
                            isSelected={isSelected}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default TimeRow;