import Detail from "../Detail";
import StatusActions from "../StatusActions";
import { formatDate } from "@/lib/utils";
import {
  ComplianceProfile,
  ComplianceUpdatePayload,
} from "@/types/compliance/compliance.types";

interface SecurityLicenseStepProps {
  profile: ComplianceProfile;
  onStatusChange: (payload: ComplianceUpdatePayload) => void;
  loading?: boolean;
}

const SecurityLicenseStep = ({
  profile,
  onStatusChange,
  loading = false,
}: SecurityLicenseStepProps) => {
  const primaryLicenceDetails = [
    {
      label: "Licence Number",
      value: profile.securityLicenceNumber || "—",
    },
    {
      label: "Licence Class",
      value: profile.securityLicenceClass || "—",
    },
    {
      label: "Sub-Activity",
      value: profile.securityLicenceSubActivity || "—",
    },
    {
      label: "Issue Date",
      value: formatDate(profile.securityLicenceIssueDate),
    },
    {
      label: "Expiry Date",
      value: formatDate(profile.securityLicenceExpiryDate),
    },
  ];

  const interstateLicenceDetails = [
    {
      label: "Licence State",
      value: profile.interstateLicenceState || "—",
    },
    {
      label: "Licence Number",
      value: profile.interstateLicenceNumber || "—",
    },
    {
      label: "Licence Class",
      value: profile.interstateLicenceClass || "—",
    },
    {
      label: "Sub-Activity",
      value: profile.interstateLicenceSubActivity || "—",
    },
    {
      label: "Issue Date",
      value: formatDate(profile.interstateLicenceIssueDate),
    },
    {
      label: "Expiry Date",
      value: formatDate(profile.interstateLicenceExpiryDate),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Primary Licence */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold">Security Licence</h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Primary security licence and verification details.
            </p>
          </div>

          <StatusActions
            status={profile.securityLicenceVerificationStatus}
            loading={loading}
            onStatusChange={(status) =>
              onStatusChange({
                securityLicenceVerificationStatus: status,
              })
            }
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {primaryLicenceDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>

        {profile.securityLicenceDocumentUrl && (
          <div className="mt-5">
            <a
              href={profile.securityLicenceDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              View Licence Document
            </a>
          </div>
        )}
      </section>

      {/* Interstate Licence */}
      {profile.hasInterstateLicence && (
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold">Interstate Licence</h4>

              <p className="mt-1 text-xs text-muted-foreground">
                Additional security licence registered in another state.
              </p>
            </div>

            <StatusActions
              status={profile.interstateLicenceVerificationStatus}
              loading={loading}
              onStatusChange={(status) =>
                onStatusChange({
                  interstateLicenceVerificationStatus: status,
                })
              }
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {interstateLicenceDetails.map((detail) => (
              <Detail
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>

          {profile.interstateLicenceDocumentUrl && (
            <div className="mt-5">
              <a
                href={profile.interstateLicenceDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View Interstate Licence Document
              </a>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SecurityLicenseStep;
