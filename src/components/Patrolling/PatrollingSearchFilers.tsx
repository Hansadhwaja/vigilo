import { useMemo } from "react";
import DataFilters, { FilterItem } from "@/components/common/Filter/DataFilters";
import { useQueryParams } from "@/lib/hooks/useQueryParams";

const PatrollingSearchFilters =
  () => {
    const {
      getParam,
      setMultipleParams,
    } = useQueryParams();

    const status =
      getParam("status");

    const search =
      getParam("search");

    const statuses =
      useMemo(
        () => [
          {
            label: "Accepted",
            value: "accepted",
          },
          {
            label: "Rejected",
            value: "rejected",
          },
          {
            label: "Pending",
            value: "pending",
          },
          {
            label: "Upcoming",
            value: "upcoming",
          },
          {
            label: "Ongoing",
            value: "ongoing",
          },
          {
            label: "Delayed",
            value: "delayed",
          },
          {
            label: "Absent",
            value: "absent",
          },
          {
            label: "Scheduled",
            value: "scheduled",
          },
          {
            label: "Active",
            value: "active",
          },
          {
            label: "Completed",
            value: "completed",
          },
        ],
        []
      );

    const handleSearch = (
      value: string
    ) => {
      setMultipleParams({
        search: value,
        page: "1",
      });
    };

    const handleStatusChange =
      (value: string) => {
        setMultipleParams({
          status: value,
          page: "1",
        });
      };

    const clearParams =
      () => {
        setMultipleParams({
          status: "",
          search: "",
          page: "1",
        });
      };

    const filters = [
      {
        key: "status",
        type: "select",
        placeholder:
          "Select Status",
        value: status,
        width: "w-[220px]",
        onChange:
          handleStatusChange,
        options: statuses,
      },
    ] satisfies FilterItem[];

    return (
      <DataFilters
        searchValue={search}
        searchPlaceholder="Search patrolling..."
        onSearchChange={
          handleSearch
        }
        onClear={clearParams}
        filters={filters}
      />
    );
  };

export default PatrollingSearchFilters;