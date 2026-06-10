"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn, formatDateKey } from "@/lib/utils";
import { timeSlots } from "@/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TimeRow from "./TimeRow";

import { useSchedulingData } from "../../hook/useSchedulingData";

interface WeeklyCalendarProps {
    scheduling: ReturnType<typeof useSchedulingData>;
}

const WeeklyCalendar = ({ scheduling }: WeeklyCalendarProps) => {
    const {
        today,
        weekDays,
        setSelectedDate,
        navigateWeek,
        selectedKey,
    } = scheduling;

    return (
        <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-0">
            {/* Header */}
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-orange-50 via-white to-sky-50 px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
                            Weekly Schedule
                        </CardTitle>

                        <p className="mt-1 text-sm text-slate-500">
                            {weekDays[0].toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}{" "}
                            -{" "}
                            {weekDays[6].toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => navigateWeek(-1)}
                            className="rounded-xl border-slate-200 bg-white hover:bg-orange-50"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedDate(new Date());
                            }}
                            className="rounded-xl border-slate-200 bg-white px-5 font-medium hover:bg-sky-50"
                        >
                            Today
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => navigateWeek(1)}
                            className="rounded-xl border-slate-200 bg-white hover:bg-orange-50"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Calendar */}
            <CardContent className="p-0">
                <div className="h-200 overflow-x-auto">
                    <div className="min-w-340">
                        {/* Week Header */}
                        <div className="sticky top-0 z-30 grid grid-cols-8 border-b border-slate-200 bg-slate-50">
                            {/* Time */}
                            <div className="sticky left-0 z-40 bg-slate-50 flex items-center border-r border-slate-200 px-4 py-4 text-sm font-semibold tracking-wide text-slate-500">
                                TIME
                            </div>

                            {/* Days */}
                            {weekDays.map((day, index) => {
                                const isToday =
                                    day.toDateString() === today.toDateString();

                                const isSelected =
                                    formatDateKey(day) === selectedKey;

                                return (
                                    <Button
                                        variant="ghost"
                                        key={index}
                                        onClick={() => setSelectedDate(new Date(day))}
                                        className={cn("h-auto rounded-none border-r border-slate-200 px-3 py-4 flex flex-col items-center justify-center gap-1 transition-all duration-200",
                                            isSelected && "bg-linear-to-br from-orange-500 to-sky-500 text-white hover:from-orange-500 hover:to-sky-500 hover:text-white",
                                            !isSelected && "hover:bg-slate-100",
                                            isToday && !isSelected && "bg-orange-50 text-orange-600"
                                        )}
                                    >
                                        <p
                                            className={cn(
                                                "text-sm font-medium uppercase tracking-wide",
                                                isSelected
                                                    ? "text-white/80"
                                                    : "text-slate-500"
                                            )}
                                        >
                                            {day.toLocaleDateString("en-US", {
                                                weekday: "short",
                                            })}
                                        </p>

                                        <h3 className="text-xl font-bold">
                                            {day.getDate()}
                                        </h3>

                                        <p
                                            className={cn(
                                                "text-sm font-medium",
                                                isSelected
                                                    ? "text-white/80"
                                                    : "text-slate-500"
                                            )}
                                        >
                                            {day.toLocaleDateString("en-US", {
                                                month: "short",
                                            })}
                                        </p>
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Time Rows */}
                        <div className="bg-white">
                            {timeSlots.map((slot) => (
                                <TimeRow
                                    key={slot.time}
                                    slot={slot}
                                    scheduling={scheduling}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyCalendar;