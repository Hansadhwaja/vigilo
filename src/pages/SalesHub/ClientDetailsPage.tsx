import CustomHeader from "@/components/common/Header/CustomHeader";
import Loader from "@/components/common/Loader";
import InformationSection from "@/components/SalesHub/Client/Details/Information";
import ProfileCard from "@/components/SalesHub/Client/Details/ProfileCard";
import SiteSection from "@/components/SalesHub/Client/Details/Site";
import CreateSiteModal from "@/components/SalesHub/Client/Details/Site/Modal/CreateSiteModal";
import { Button } from "@/components/ui/button";
import { useGetClientByIdQuery } from "@/store/apis/usersApi";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ClientDetailsPage = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const { data, isLoading, isError } = useGetClientByIdQuery(clientId || "", {
    skip: !clientId,
  });

  const client = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader />

          <div className="space-y-1 text-center">
            <h3 className="font-semibold text-slate-800">Loading Client</h3>

            <p className="text-sm text-slate-500">
              Fetching complete client details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !client) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100">
            <User className="size-7 text-slate-400" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            No Client Found
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            The client you are trying to access may have been deleted or does
            not exist anymore.
          </p>

          <Button
            variant="outline"
            onClick={() => navigate("/clients")}
            className="mt-7 h-11 rounded-2xl border-slate-200 px-6"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CustomHeader
        previousLink="/sales"
        title="Client Details"
        description="View and manage client information."
        others={<CreateSiteModal clientId={clientId ?? ""} />}
      />

      <ProfileCard client={client} />

      <InformationSection client={client} />
      <SiteSection />
    </div>
  );
};

export default ClientDetailsPage;
