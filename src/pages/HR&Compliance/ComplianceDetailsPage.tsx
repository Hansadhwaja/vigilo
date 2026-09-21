import Loader from "@/components/common/Loader";
import { useGetComplianceByIdQuery } from "@/store/apis/complianceApis";
import { useParams } from "react-router-dom";
import ComplianceDetailsHeader from "@/components/HR&Compliance/Compliance/Details/ComplianceDetailsHeader";
import ComplianceSteps from "@/components/HR&Compliance/Compliance/Details/ComplianceSteps";
import CustomHeader from "@/components/common/Header/CustomHeader";

const ComplianceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetComplianceByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!data?.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Compliance profile not found.
        </p>
      </div>
    );
  }

  const profile = data.data;

  return (
    <div className="space-y-6 pb-10">
      <CustomHeader
        title="Compliance Details"
        description="Review the guard's onboarding information and compliance documents."
        previousLink="/hr?tab=compliance"
      />

      <ComplianceDetailsHeader profile={profile} />
      <ComplianceSteps profile={profile} />
    </div>
  );
};

export default ComplianceDetailsPage;
