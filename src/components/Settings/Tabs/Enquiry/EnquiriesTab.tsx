import Loader from "@/components/common/Loader";
import { Pagination } from "@/types";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useGetAllTicketQuery } from "@/store/apis/enquiryApis";
import EnquiryTable from "./Table/EnquiryTable";
import AddEnquiryModal from "./Modal/AddEnquiryModal";

const EnquiriesTab = () => {
  const { getParam, setParam, setMultipleParams } = useQueryParams();

  const page = Number(getParam("page", "1"));
  const limit = Number(getParam("limit", "10"));
  const search = getParam("search", "");

  const { data, isLoading } = useGetAllTicketQuery({
    page,
    limit,
    search,
  });

  const tickets = data?.data ?? [];

  const pagination: Pagination = data?.pagination ?? {
    currentPage: 1,
    itemsPerPage: limit,
    totalItems: 0,
    totalPages: 1,
  };


  if (isLoading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Enquiries</h2>

          <p className="text-sm text-muted-foreground">
            Manage and track your submitted enquiries and support tickets.
          </p>
        </div>

        <AddEnquiryModal />
      </div>

      <EnquiryTable
        tickets={tickets}
        pagination={pagination}
      />
    </div>
  );
};

export default EnquiriesTab;
