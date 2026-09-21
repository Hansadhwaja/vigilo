import { ComplianceProfile } from "@/types/compliance/compliance.types";
import Detail from "../Detail";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { formatDate } from "@/lib/utils";

interface PoliceCheckStepProps {
  profile: ComplianceProfile;
}

const PoliceCheckStep = ({ profile }: PoliceCheckStepProps) => {
  const nationalPoliceCheckDetails = [
    {
      label: "Reference Number",
      value: profile.policeCheckReferenceNumber || "—",
    },
    {
      label: "Check Date",
      value: formatDate(profile.policeCheckDate),
    },
    {
      label: "Issuing Body",
      value: profile.policeCheckIssuingBody || "—",
    },
    {
      label: "Renewal Due",
      value: formatDate(profile.policeCheckRenewalDueDate),
    },
    {
      label: "Status",
      value: (
        <CustomBadge status={profile.policeCheckStatus || "Pending"} />
      ),
    },
  ];

  const overseasPoliceCheckDetails = [
    {
      label: "Country",
      value: profile.overseasPoliceCheckCountry || "—",
    },
    {
      label: "Reference Number",
      value: profile.overseasPoliceCheckReferenceNumber || "—",
    },
    {
      label: "Check Date",
      value: formatDate(profile.overseasPoliceCheckDate),
    },
    {
      label: "Issuing Body",
      value: profile.overseasPoliceCheckIssuingBody || "—",
    },
    {
      label: "Renewal Due",
      value: formatDate(profile.overseasPoliceCheckRenewalDueDate),
    },
    {
      label: "Status",
      value: (
        <CustomBadge
          status={profile.overseasPoliceCheckStatus || "Pending"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* National Police Check */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold">
              National Police Check
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Police check reference, verification and renewal details.
            </p>
          </div>

          <CustomBadge
            status={profile.policeCheckStatus || "Pending"}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {nationalPoliceCheckDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>

        {profile.policeCheckDocumentUrl && (
          <div className="mt-5">
            <a
              href={profile.policeCheckDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              View Police Check Document
            </a>
          </div>
        )}
      </section>

      {/* Overseas Police Check */}
      {profile.hasOverseasPoliceCheck && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold">
                Overseas Police Check
              </h4>

              <p className="mt-1 text-xs text-muted-foreground">
                Additional police check completed outside Australia.
              </p>
            </div>

            <CustomBadge
              status={
                profile.overseasPoliceCheckStatus || "Pending"
              }
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {overseasPoliceCheckDetails.map((detail) => (
              <Detail
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>

          {profile.overseasPoliceCheckDocumentUrl && (
            <div className="mt-5">
              <a
                href={profile.overseasPoliceCheckDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View Overseas Police Check Document
              </a>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default PoliceCheckStep;