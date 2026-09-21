import CustomBadge from "@/components/common/Badge/CustomBadge";
import Detail from "../Detail";
import { ComplianceProfile } from "@/types/compliance/compliance.types";

interface DeclarationsStepProps {
  profile: ComplianceProfile;
}

const DeclarationsStep = ({ profile }: DeclarationsStepProps) => {
  const details = [
    {
      label: "Declaration Status",
      value: (
        <CustomBadge
          status={profile.declarationsSigned ? "Signed" : "Pending"}
        />
      ),
    },
    {
      label: "Document",
      value: profile.declarationsDocumentUrl ? (
        <a
          href={profile.declarationsDocumentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          View Declaration
        </a>
      ) : (
        "—"
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Declarations
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Review the guard&apos;s signed declarations and supporting
            documentation.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
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

export default DeclarationsStep;