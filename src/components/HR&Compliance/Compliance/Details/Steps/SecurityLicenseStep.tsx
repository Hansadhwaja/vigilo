import Detail from "../Detail";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { formatDate } from "@/lib/utils";
import { ComplianceProfile } from "@/types/compliance/compliance.types";

interface SecurityLicenseStepProps {
  profile: ComplianceProfile;
}

const SecurityLicenseStep = ({ profile }: SecurityLicenseStepProps) => {
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
    {
      label: "Verification Status",
      value: (
        <CustomBadge
          status={profile.securityLicenceVerificationStatus || "Pending"}
        />
      ),
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
    {
      label: "Verification Status",
      value: (
        <CustomBadge
          status={profile.interstateLicenceVerificationStatus || "Pending"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Primary Licence */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold">Security Licence</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Primary security licence and verification details.
            </p>
          </div>

          <CustomBadge
            status={profile.securityLicenceVerificationStatus || "Pending"}
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
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold">Interstate Licence</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Additional security licence registered in another state.
              </p>
            </div>

            <CustomBadge
              status={profile.interstateLicenceVerificationStatus || "Pending"}
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
