import { ComplianceProfile } from "@/types/compliance/compliance.types";

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
}

const ComplianceStepContent = ({
  step,
  profile,
}: ComplianceStepContentProps) => {
  switch (step) {
    case 1:
      return <PersonalInformationStep profile={profile} />;

    case 2:
      return <WorkRightsStep profile={profile} />;

    case 3:
      return <SecurityLicenseStep profile={profile} />;

    case 4:
      return <PoliceCheckStep profile={profile} />;

    case 5:
      return <QualificationsStep profile={profile} />;

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
