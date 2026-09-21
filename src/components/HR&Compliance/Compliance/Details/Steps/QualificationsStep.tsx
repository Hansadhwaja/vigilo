import CustomBadge from "@/components/common/Badge/CustomBadge";
import { formatDate } from "@/lib/utils";
import { ComplianceProfile } from "@/types/compliance/compliance.types";

interface QualificationsStepProps {
  profile: ComplianceProfile;
}

const QualificationsStep = ({
  profile,
}: QualificationsStepProps) => {
  const qualifications = profile.qualifications ?? [];
  const siteInductions = profile.siteInductions ?? [];

  return (
    <div className="space-y-8">
      {/* Qualifications */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Qualifications & Certifications
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Training qualifications, certificates, expiry dates and
            verification status.
          </p>
        </div>

        {qualifications.length > 0 ? (
          <div className="overflow-hidden rounded-xl border">
            <div className="hidden grid-cols-[1.4fr_1.2fr_1.2fr_1fr_1fr_90px] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground lg:grid">
              <span>Qualification</span>
              <span>Certificate</span>
              <span>RTO Provider</span>
              <span>Completed</span>
              <span>Expiry</span>
              <span>Status</span>
            </div>

            {qualifications.map((qualification, index) => (
              <div
                key={`${qualification.name}-${qualification.certificateNumber ?? index}`}
                className="grid gap-4 border-b px-4 py-4 last:border-b-0 lg:grid-cols-[1.4fr_1.2fr_1.2fr_1fr_1fr_90px] lg:items-center"
              >
                <div>
                  <p className="text-sm font-medium">
                    {qualification.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground lg:hidden">
                    {qualification.rtoProvider || "Provider not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Certificate
                  </p>

                  <p className="text-sm">
                    {qualification.certificateNumber || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground lg:hidden">
                    RTO Provider
                  </p>

                  <p className="text-sm">
                    {qualification.rtoProvider || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Completed
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(qualification.completionDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Expiry
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(qualification.expiryDate)}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs text-muted-foreground lg:hidden">
                    Status
                  </p>

                  <CustomBadge status={qualification.status} />
                </div>

                {qualification.documentUrl && (
                  <div className="lg:col-start-6">
                    <a
                      href={qualification.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed">
            <p className="text-sm text-muted-foreground">
              No qualifications recorded.
            </p>
          </div>
        )}
      </section>

      {/* Site Inductions */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Site Inductions
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Site-specific induction records and validity information.
          </p>
        </div>

        {siteInductions.length > 0 ? (
          <div className="overflow-hidden rounded-xl border">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_100px] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground sm:grid">
              <span>Site</span>
              <span>Completed</span>
              <span>Expiry</span>
              <span>Status</span>
              <span>Document</span>
            </div>

            {siteInductions.map((induction, index) => (
              <div
                key={`${induction.siteName}-${induction.expiryDate ?? index}`}
                className="grid gap-4 border-b px-4 py-4 last:border-b-0 sm:grid-cols-[1.5fr_1fr_1fr_1fr_100px] sm:items-center"
              >
                <div>
                  <p className="text-sm font-medium">
                    {induction.siteName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    Completed
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(induction.completionDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    Expiry
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(induction.expiryDate)}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs text-muted-foreground sm:hidden">
                    Status
                  </p>

                  <CustomBadge status={induction.status} />
                </div>

                <div>
                  {induction.documentUrl ? (
                    <a
                      href={induction.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed">
            <p className="text-sm text-muted-foreground">
              No site inductions recorded.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default QualificationsStep;