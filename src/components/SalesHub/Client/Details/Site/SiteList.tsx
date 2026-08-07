import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { useGetAllPatrolSitesQuery } from "@/store/apis/patrollingAPI";
import { useParams } from "react-router-dom";
import SiteCard from "./SiteCard";

const SiteList = () => {
  const { clientId } = useParams();

  const { getParam } = useQueryParams();

  const page = getParam("page", "1");
  const limit = getParam("limit", "10");

  const { data, isLoading, isError } = useGetAllPatrolSitesQuery({
    clientId: clientId || "",
    page,
    limit,
  });

  const sites = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading sites...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <p className="text-sm text-red-600">Failed to load client sites.</p>
      </div>
    );
  }

  if (!sites.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <h3 className="font-semibold text-slate-800">No Sites Found</h3>

        <p className="mt-1 text-sm text-slate-500">
          This client does not have any patrol sites yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
};

export default SiteList;
