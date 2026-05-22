import { useMemo, useCallback, useState } from "react";

import { useGetAllSchedulesQuery } from "@/apis/schedulingAPI";

import {
    formatDateKey,
    generateWeekDays,
    organizeShifts,
} from "@/lib/utils";

import { timeSlots } from "@/constants";

import { useDebounce } from "@/lib/hooks/useDebounce";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

export const useSchedulingData = () => {
    const today = useMemo(() => {
        const now = new Date();

        now.setHours(0, 0, 0, 0);

        return now;
    }, []);

    const [selectedDate, setSelectedDate] = useState<Date>(today);

    const { getParam } = useQueryParams();

    const guardId = getParam("guardId");
    const search = getParam("search");
    const orderId = getParam("orderId");
    const role = getParam("role");

    const debouncedSearch = useDebounce(search);

    const { data: schedulingResponse } = useGetAllSchedulesQuery({
        search: debouncedSearch,
        guardId,
        orderId,
        role
    });

    const schedules = schedulingResponse?.data ?? [];
    const summary = schedulingResponse?.summary;

    const organizedShifts = useMemo(() => {
        return organizeShifts(
            schedules,
            timeSlots
        );
    }, [schedules]);

    const weekDays = useMemo(() => {
        return generateWeekDays(selectedDate);
    }, [selectedDate]);

    const navigateWeek = (
        direction: number
    ) => {
        setSelectedDate((prev) => {
            const next = new Date(prev);

            next.setDate(
                next.getDate() + direction * 7
            );

            next.setHours(0, 0, 0, 0);

            return next;
        });
    };

    const getAssignmentsForSlot =
        useCallback(
            (day: Date, time: string) => {
                const dateKey = formatDateKey(day);
                return (
                    organizedShifts[dateKey]?.[
                    time
                    ] || []
                );
            },
            [organizedShifts]
        );

    const getAssignmentsForDay =
        useCallback(
            (day: Date) => {
                const dateKey =
                    formatDateKey(day);

                return Object.values(
                    organizedShifts[dateKey] || {}
                ).flat();
            },
            [organizedShifts]
        );

    const selectedDayAssignments =
        useMemo(() => {
            return getAssignmentsForDay(
                selectedDate
            );
        }, [
            selectedDate,
            getAssignmentsForDay,
        ]);

    const selectedKey = formatDateKey(selectedDate);

    return {
        today,

        schedules,

        selectedDate,
        setSelectedDate,

        organizedShifts,

        weekDays,

        navigateWeek,

        getAssignmentsForSlot,

        selectedDayAssignments,

        selectedKey,
        summary
    };
};