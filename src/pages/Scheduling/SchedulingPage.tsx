import { useState, useMemo, useCallback } from "react";

import { useGetAllGuardsQuery } from "@/apis/guardsApi";
import { useGetAllSchedulesQuery } from "@/apis/schedulingAPI";
import { useGetAllOrdersQuery } from "@/apis/ordersApi";
import { generateWeekDays, organizeShifts } from "@/lib/utils";
import { timeSlots } from "@/constants";
import CustomHeader from "@/components/common/Header/CustomHeader";
import CreateAssignmentModal from "@/components/Scheduling/Modal/CreateAssignmentModal";
import SearchFilters from "@/components/Scheduling/SearchFilters";
import SchedulingTabs from "@/components/Scheduling/Tabs/SchedulingTabs";
import QuickSummary from "@/components/Scheduling/QuickSummary";
import SchedulingStats from "@/components/Scheduling/SchedulingStats";

export default function ShiftPage() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const { data: guardsResponse } = useGetAllGuardsQuery();
  const guards = guardsResponse?.data || [];

  const { data: ordersResponse } = useGetAllOrdersQuery({ page: 1, limit: 1000 });
  const orders = ordersResponse?.data ?? [];

  const { data: schedulingResponse } = useGetAllSchedulesQuery();
  const schedules = schedulingResponse?.data || [];

  const organizedShifts = useMemo(() => {
    return organizeShifts(schedules, timeSlots);
  }, [schedules]);

  const getAssignmentsForSlot = useCallback((day: Date, time: string) => {
    const dateKey = day.toISOString().split("T")[0];
    return organizedShifts[dateKey]?.[time] || [];
  }, [organizedShifts]);


  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };


  const weekDays = useMemo(() => generateWeekDays(selectedDate), [selectedDate]);

  const getAssignmentsForDay = useCallback((day: Date) => {
    const dateKey = day.toISOString().split("T")[0];
    return Object.values(organizedShifts[dateKey] || {}).flat();
  }, [organizedShifts]);

  const selectedDayAssignments = useMemo(() => {
    return getAssignmentsForDay(selectedDate);
  }, [selectedDate, getAssignmentsForDay]);


  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full">
      <div className="space-y-3">
        <CustomHeader
          title="Scheduling Calendar"
          description="Managed Assignment & Calendar View"
          others={
            <div className="flex justify-end">
              <CreateAssignmentModal />
            </div>
          }
        />

        <SchedulingStats
          organizedShifts={organizedShifts}
          today={today}
        />
      </div>

      <SearchFilters
        orders={orders}
        guards={guards}
      />

      <div className="space-y-3">
        <SchedulingTabs
          weekDays={weekDays}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          navigateWeek={navigateWeek}
          getAssignmentsForSlot={getAssignmentsForSlot}
          assignments={selectedDayAssignments}
        />

        <QuickSummary
          selectedDate={selectedDate}
          assignments={selectedDayAssignments}
        />
      </div>
    </div>
  );
}

