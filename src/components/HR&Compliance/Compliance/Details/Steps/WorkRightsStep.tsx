import Detail from "../Detail";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { formatDate } from "@/lib/utils";
import { ComplianceProfile } from "@/types/compliance/compliance.types";

interface WorkRightsStepProps {
  profile: ComplianceProfile;
}

const WorkRightsStep = ({ profile }: WorkRightsStepProps) => {
  const details = [
    {
      label: "Citizenship Status",
      value: profile.citizenshipStatus || "—",
    },
    {
      label: "Visa Subclass",
      value: profile.visaSubclass || "—",
    },
    {
      label: "Visa Expiry Date",
      value: formatDate(profile.visaExpiryDate),
    },
    {
      label: "Work Rights Status",
      value: <CustomBadge status={profile.workRightsStatus || "Pending"} />,
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold">Work Rights & Eligibility</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Citizenship, visa information and employment eligibility.
            </p>
          </div>

          <CustomBadge status={profile.workRightsStatus || "Pending"} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((detail) => (
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

export default WorkRightsStep;
