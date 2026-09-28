import Detail from "../Detail";
import { formatDate } from "@/lib/utils";
import {
  ComplianceProfile,
  ComplianceUpdatePayload,
} from "@/types/compliance/compliance.types";
import StatusActions from "../StatusActions";

interface WorkRightsStepProps {
  profile: ComplianceProfile;
  onStatusChange: (payload: ComplianceUpdatePayload) => void;
  loading?: boolean;
}

const WorkRightsStep = ({
  profile,
  onStatusChange,
  loading = false,
}: WorkRightsStepProps) => {
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
  ];

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold">Work Rights & Eligibility</h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Citizenship, visa information and employment eligibility.
            </p>
          </div>

          <StatusActions
            status={profile.workRightsStatus}
            loading={loading}
            onStatusChange={(status) =>
              onStatusChange({
                workRightsStatus: status,
              })
            }
          />
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
