"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { timeSlots } from "@/constants";
import TimeRow from "./TimeRow";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
    weekDays: Date[];
    selectedDate: Date;
    setSelectedDate: (d: Date) => void;
    navigateWeek: (v: number) => void;
    getAssignmentsForSlot: (date: Date, time: string) => any[];

}

const WeeklyCalendar = ({
    weekDays,
    selectedDate,
    setSelectedDate,
    navigateWeek,
    getAssignmentsForSlot,
}: WeeklyCalendarProps) => {
    const today = new Date();
    const selectedKey = selectedDate.toDateString();

    return (
        <div className="border rounded-lg overflow-hidden">
            <Card className="shadow-lg border-0 bg-linear-to-br from-white to-gray-50">
                <CardHeader className="pb-3 px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="sub-heading font-bold">
                                Weekly Schedule
                            </CardTitle>
                            <p className="text-gray-600 description">
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

                        <div className="flex gap-2">
                            <Button size="icon-sm" variant="outline" onClick={() => navigateWeek(-1)}>
                                <ChevronLeft />
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    const today = new Date();
                                    setSelectedDate(today);
                                }}
                            >
                                Today
                            </Button>

                            <Button size="icon-sm" variant="outline" onClick={() => navigateWeek(1)}>
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                    <div className="bg-white rounded-lg border overflow-x-auto">
                        <div className="min-w-250">

                            <div className="grid grid-cols-8 bg-gray-100 sticky top-0 z-10">
                                <div className="p-3 border-r font-semibold">TIME</div>

                                {weekDays.map((day, index) => {
                                    const isToday =
                                        day.toDateString() === today.toDateString();
                                    const isSelected =
                                        day.toDateString() === selectedKey;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedDate(new Date(day))}
                                            className={cn(
                                                "p-3 text-center cursor-pointer border-r",
                                                isSelected
                                                    ? "bg-blue-900 text-white"
                                                    : isToday
                                                        ? "bg-blue-100 text-blue-900"
                                                        : "hover:bg-gray-200"
                                            )}
                                        >
                                            <div className="font-semibold">
                                                {day.toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })}
                                            </div>
                                            <div className="font-bold">{day.getDate()}</div>
                                            <div
                                                className={cn(
                                                    isSelected ? "text-blue-100" : "text-gray-500"
                                                )}
                                            >
                                                {day.toLocaleDateString("en-US", {
                                                    month: "short",
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {timeSlots.map((slot) => (
                                <TimeRow
                                    key={slot.time}
                                    slot={slot}
                                    weekDays={weekDays}
                                    selectedDate={selectedDate}
                                    getAssignmentsForSlot={getAssignmentsForSlot}
                                />
                            ))}

                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WeeklyCalendar;