import { ComplianceProfile } from "@/types/compliance/compliance.types";
import GuardSummary from "./GuardSummary";
import ComplianceProgress from "./ComplianceProgress";

interface ComplianceDetailsHeaderProps {
  profile: ComplianceProfile;
}

const ComplianceDetailsHeader = ({ profile }: ComplianceDetailsHeaderProps) => {
  return (
    <div className="space-y-4">
      <GuardSummary profile={profile} />
      <ComplianceProgress profile={profile} />
    </div>
  );
};

export default ComplianceDetailsHeader;
