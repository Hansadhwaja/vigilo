import { useQueryParams } from "@/lib/hooks/useQueryParams";
import TablePagination from "../common/Table/TablePagination";
import PatrolCard from "./PatrolCard";
import { AdminPatrolRun } from "@/store/apis/patrollingAPI";

interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  patrols: AdminPatrolRun[];
  pagination: Pagination | undefined;
}

const PatrolList = ({ patrols, pagination }: Props) => {
  const { page = 1, totalPages = 1, limit = 10 } = pagination ?? {};
  const { setMultipleParams, setParam } = useQueryParams();

  // Pagination
  const handlePageChange = (newPage: number) => {
    setParam("page", String(newPage));
  };

  // Limit
  const handleLimitChange = (value: number) => {
    setMultipleParams({
      limit: String(value),
      page: "1",
    });
  };
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {patrols.map((patrol: AdminPatrolRun) => (
          <PatrolCard key={patrol.id} patrol={patrol} />
        ))}
      </div>
      <TablePagination
        currentPage={page ?? 1}
        totalPages={totalPages ?? 1}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};

export default PatrolList;
