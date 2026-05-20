import { useGetGuardByIdQuery } from "@/apis/guardsApi";
import Loader from "@/components/common/Loader";
import GuardActivityList from "@/components/HR&Compliance/Guard/Details/GuardActivityList";
import GuardContactCard from "@/components/HR&Compliance/Guard/Details/GuardContactCard";
import GuardDetailsHeader from "@/components/HR&Compliance/Guard/Details/GuardDetailsHeader";
import GuardEmploymentCard from "@/components/HR&Compliance/Guard/Details/GuardEmploymentCard";
import GuardStats from "@/components/HR&Compliance/Guard/Details/GuardStats";
import { useParams } from "react-router-dom";

const GuardDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetGuardByIdQuery(id || "", { skip: !id, });

  if (isLoading) return <Loader />;

  const guard = data?.data.guard;
  const activity = data?.data.activity || [];

  if (!guard) return <p>No Guards Found</p>

  return (
      <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full no-scrollbar">

      <GuardDetailsHeader guard={guard} />

      <div className="space-y-6">

        <GuardStats activity={activity} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <GuardActivityList activity={activity} />
          </div>

          <div className="space-y-6">
            <GuardContactCard guard={guard} />

            <GuardEmploymentCard
              guard={guard}
              activity={activity}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default GuardDetailsPage;