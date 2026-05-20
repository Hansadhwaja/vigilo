import { AlertTriangle } from "lucide-react";

import CustomHeader from "@/components/common/Header/CustomHeader";

import IncidentStats from "@/components/Incidents/IncidentStats";
import IncidentsTable from "@/components/Incidents/Table/IncidentsTable";
import IncidentsSearchFilters from "@/components/Incidents/IncidentsSearchFilters";

import { useGetAllIncidentsQuery } from "@/apis/incidentsApi";

import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function IncidentsPage() {
  const {
    getParam,
    setParam,
    setMultipleParams,
  } = useQueryParams();

  const page = Number(
    getParam("page", "1")
  );

  const limit = Number(
    getParam("limit", "10")
  );

  const search = getParam(
    "search",
    ""
  );

  const status = getParam(
    "status",
    ""
  );

  const debouncedSearch =
    useDebounce(search, 500);

  const {
    data,
    isLoading,
    isFetching,
  } = useGetAllIncidentsQuery({
    search: debouncedSearch,
    page,
    limit,
    status,
  });

  const {
    data: incidents = [],
    pagination,
  } = data ?? {};

  const handlePageChange = (
    newPage: number
  ) => {
    setParam(
      "page",
      String(newPage)
    );
  };

  const handleLimitChange = (
    value: number
  ) => {
    setMultipleParams({
      limit: String(value),
      page: "1",
    });
  };

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">
      {/* HEADER */}
      <div className="space-y-3">
        <CustomHeader
          title="Incident Management"
          description="View and manage incidents raised by guards and clients"
          others={
            <div
              className="
                flex items-center gap-3
                rounded-2xl border border-orange-100
                bg-linear-to-r
                from-orange-50
                to-sky-50
                px-5 py-3
                shadow-sm
              "
            >
              <div
                className="
                  flex h-11 w-11 items-center
                  justify-center rounded-xl
                  bg-linear-to-br
                  from-orange-500
                  to-sky-500
                  text-white shadow-md
                "
              >
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <p
                  className="
                    text-xs font-semibold uppercase
                    tracking-wide text-slate-500
                  "
                >
                  Incident Tracking
                </p>

                <p
                  className="
                    text-sm font-semibold
                    text-slate-800
                  "
                >
                  Real-time Monitoring
                </p>
              </div>
            </div>
          }
        />

        <IncidentStats />
      </div>

      {/* FILTERS */}
      <IncidentsSearchFilters />

      {/* TABLE */}
      <IncidentsTable
        incidents={incidents}
        page={pagination?.page ?? 1}
        totalPages={
          Number(
            pagination?.totalPages
          ) ?? 1
        }
        limit={limit}
        onPageChange={
          handlePageChange
        }
        onLimitChange={
          handleLimitChange
        }
        isLoading={
          isLoading || isFetching
        }
      />
    </div>
  );
}