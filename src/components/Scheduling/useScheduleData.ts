"use client";

import { useMemo } from "react";
import { organizeShifts } from "@/lib/utils";

export const useScheduleData = (schedule: any[], timeSlots: any[]) => {
  const scheduleData = useMemo(() => {
    const grouped: any = {};

    schedule.forEach((item) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);

      const dateKey = start.toDateString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: start,
          guards: [],
        };
      }

      (item.guards || []).forEach((g: any) => {
        grouped[dateKey].guards.push({
          id: `${item.id}-${g.id}`,
          guardId: g.id,
          name: g.name,
          role: g.role || "Guard",
          time: `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`,
          status: g?.StaticGuards?.status || item.status,
          orderId: item.orderId,
          shiftId: item.id,
          rawStartISO: item.startTime,
          rawEndISO: item.endTime,
        });
      });
    });

    return Object.values(grouped);
  }, [schedule]);

  const organizedShifts = useMemo(() => {
    return organizeShifts(schedule, timeSlots);
  }, [schedule, timeSlots]);

  return { scheduleData, organizedShifts };
};