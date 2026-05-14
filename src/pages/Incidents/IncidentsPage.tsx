import { Card, CardContent } from "@/components/ui/card";

import { useGetAllIncidentsQuery } from "@/apis/incidentsApi";

import CustomHeader from "@/components/common/Header/CustomHeader";

import IncidentStats from "@/components/Incidents/IncidentStats";
import IncidentsTable from "@/components/Incidents/Table/IncidentsTable";
import IncidentsSearchFilters from "@/components/Incidents/IncidentsSearchFilters";

import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useDebounce } from "@/lib/hooks/useDebounce";

import {
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

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

  // Pagination
  const handlePageChange = (
    newPage: number
  ) => {
    setParam(
      "page",
      String(newPage)
    );
  };

  // Limit
  const handleLimitChange = (
    value: number
  ) => {
    setMultipleParams({
      limit: String(value),
      page: "1",
    });
  };

  return (
    <div
      className="
    h-full
    overflow-y-auto
    bg-linear-to-br
    from-slate-50
    via-blue-50/40
    to-indigo-50/30
  "
    >
      <div className="space-y-6 py-6">

        {/* LIGHT HERO HEADER */}
        <div
          className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-linear-to-br
        from-white
        via-blue-50
        to-indigo-50
        p-6
        shadow-sm
      "
        >
          {/* Decorative Blur */}
          <div className="absolute -top-10 right-0 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <CustomHeader
              title="Incident Management"
              description="View and manage incidents raised by guards and clients"
            />

            <IncidentStats />
          </div>
        </div>

        {/* STATS */}


        {/* TABLE SECTION */}
        <Card
          className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white/90
        shadow-sm
        backdrop-blur
      "
        >
          {/* TABLE HEADER */}
          <div
            className="
          border-b
          border-slate-200
          bg-gradient-to-r
          from-slate-50
          via-white
          to-blue-50/40
          px-6
          py-5
        "
          >
            <div
              className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
            >
              <div>
                <h2
                  className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
              "
                >
                  Incident Reports
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review, track, and manage all reported incidents
                </p>
              </div>

              <IncidentsSearchFilters />
            </div>
          </div>

          {/* TABLE */}
          <CardContent className="p-0">
            <IncidentsTable
              incidents={incidents}
              page={pagination?.page ?? 1}
              totalPages={Number(pagination?.totalPages) ?? 1}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading || isFetching}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}