import UserAvatar from "@/components/common/Avatar/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ComplianceProfile } from "@/types/compliance/compliance.types";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import GuardMeta from "./GuardMeta";

interface Props {
  profile: ComplianceProfile;
}

const GuardSummary = ({ profile }: Props) => {
  const fullName = [
    profile.title,
    profile.firstName,
    profile.middleName,
    profile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const approvalStatus = profile.approvalStatus?.toLowerCase();

  const isPending = approvalStatus === "pending";
  const isApproved = approvalStatus === "approved";
  const isRejected = approvalStatus === "rejected";

  const metaItems = [
    {
      label: "Employment",
      value: profile.employmentType || "—",
      Icon: UserRound,
    },
    {
      label: "Employment Start",
      value: formatDate(profile.employmentStartDate),
      Icon: CalendarDays,
    },
    {
      label: "Security Licence",
      value: profile.securityLicenceVerificationStatus || "Pending",
      Icon: ShieldCheck,
    },
    {
      label: "Work Rights",
      value: profile.workRightsStatus || "Pending",
      Icon: BadgeCheck,
    },
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="space-y-6 p-5 lg:p-6">
        {/* Guard Identity */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <UserAvatar
              src={profile.profilePhotoUrl}
              name={fullName}
              className="size-16 shrink-0 rounded-xl"
            />

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  {fullName}
                </h2>

                <Badge
                  variant={
                    isApproved
                      ? "default"
                      : isRejected
                        ? "destructive"
                        : "secondary"
                  }
                  className="gap-1"
                >
                  {isApproved && <CheckCircle2 className="size-3.5" />}

                  {isPending && <Clock3 className="size-3.5" />}

                  {profile.approvalStatus}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {profile.jobTitle || "Security Guard"}

                {profile.internalPayrollId && (
                  <>
                    <span className="mx-2">•</span>
                    {profile.internalPayrollId}
                  </>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {profile.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {profile.email}
                  </span>
                )}

                {profile.mobile && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    {profile.mobile}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap gap-2">
            {isPending && (
              <>
                <Button className="gap-2">
                  <CheckCircle2 className="size-4" />
                  Approve Profile
                </Button>

                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                >
                  Reject Profile
                </Button>
              </>
            )}

            {isApproved && (
              <Button variant="outline" className="gap-2">
                <ShieldCheck className="size-4" />
                View Approval
              </Button>
            )}
          </div>
        </div>

        {/* Guard Metadata */}
        <div className="grid gap-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {metaItems.map((item) => (
            <GuardMeta
              key={item.label}
              label={item.label}
              value={item.value}
              Icon={item.Icon}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuardSummary;
