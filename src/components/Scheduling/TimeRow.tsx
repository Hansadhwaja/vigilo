"use client";

import DayCell from "./DayCell";

interface TimeRowProps {
    slot: { time: string; label: string };
    weekDays: Date[];
    selectedDate: Date;
    getAssignmentsForSlot: (date: Date, time: string) => any[];
}

const TimeRow = ({
    slot,
    weekDays,
    selectedDate,
    getAssignmentsForSlot,
}: TimeRowProps) => {
    const selectedKey = selectedDate.toDateString();

    return (
        <div className="grid grid-cols-8 border-b">
            <div className="p-3 border-r bg-gray-50">
                <div className="font-semibold">{slot.time}</div>
                <div className="text-sm text-gray-500">{slot.label}</div>
            </div>

            {weekDays.map((day, idx) => {
                const assignments = getAssignmentsForSlot(day, slot.time);

                return (
                    <DayCell
                        key={idx}
                        assignments={assignments}
                        isSelected={day.toDateString() === selectedKey}
                    />
                );
            })}
        </div>
    );
};

export default TimeRow;