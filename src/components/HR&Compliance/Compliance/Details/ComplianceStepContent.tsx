import {
  ComplianceProfile,
  ComplianceUpdatePayload,
} from "@/types/compliance/compliance.types";

import PersonalInformationStep from "./Steps/PersonalInformationStep";
import WorkRightsStep from "./Steps/WorkRightsStep";
import SecurityLicenseStep from "./Steps/SecurityLicenseStep";
import PoliceCheckStep from "./Steps/PoliceCheckStep";
import QualificationsStep from "./Steps/QualificationsStep";
import EmploymentPayrollStep from "./Steps/EmploymentPayrollStep";
import EmergencyMedicalStep from "./Steps/EmergencyMedicalStep";
import DeclarationsStep from "./Steps/DeclarationsStep";
import UniformEquipmentStep from "./Steps/UniformEquipmentStep";

interface ComplianceStepContentProps {
  step: number;
  profile: ComplianceProfile;
  onStatusChange: (payload: ComplianceUpdatePayload) => void;
  loading?: boolean;
}

const ComplianceStepContent = ({
  step,
  profile,
  onStatusChange,
  loading = false,
}: ComplianceStepContentProps) => {
  switch (step) {
    case 1:
      return (
        <PersonalInformationStep
          profile={profile}
          onStatusChange={onStatusChange}
          loading={loading}
        />
      );

    case 2:
      return (
        <WorkRightsStep
          profile={profile}
          onStatusChange={onStatusChange}
          loading={loading}
        />
      );

    case 3:
      return (
        <SecurityLicenseStep
          profile={profile}
          onStatusChange={onStatusChange}
          loading={loading}
        />
      );

    case 4:
      return (
        <PoliceCheckStep
          profile={profile}
          onStatusChange={onStatusChange}
          loading={loading}
        />
      );

    case 5:
      return (
        <QualificationsStep
          profile={profile}
          onStatusChange={onStatusChange}
          loading={loading}
        />
      );

    case 6:
      return <EmploymentPayrollStep profile={profile} />;

    case 7:
      return <EmergencyMedicalStep profile={profile} />;

    case 8:
      return <DeclarationsStep profile={profile} />;

    case 9:
      return <UniformEquipmentStep profile={profile} />;

    default:
      return null;
  }
};

export default ComplianceStepContent;
