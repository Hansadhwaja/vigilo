import Detail from "../Detail";
import { ComplianceProfile } from "@/types/compliance/compliance.types";

interface EmergencyMedicalStepProps {
  profile: ComplianceProfile;
}

const EmergencyMedicalStep = ({
  profile,
}: EmergencyMedicalStepProps) => {
  const emergencyContactDetails = [
    {
      label: "Contact Name",
      value: profile.emergencyName || "—",
    },
    {
      label: "Relationship",
      value: profile.emergencyRelationship || "—",
    },
    {
      label: "Primary Phone",
      value: profile.emergencyPhone || "—",
    },
    {
      label: "Secondary Phone",
      value: profile.emergencySecondaryPhone || "—",
    },
  ];

  const medicalDetails = [
    {
      label: "Blood Group",
      value: profile.bloodGroup || "—",
    },
    {
      label: "Medical Conditions",
      value: profile.medicalConditions || "—",
    },
    {
      label: "Allergies",
      value: profile.allergies || "—",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Emergency Contact */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Emergency Contact
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Primary contact details to use in case of an emergency.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {emergencyContactDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Medical Information */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Medical Information
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Medical information provided during the onboarding
            process.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {medicalDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EmergencyMedicalStep;