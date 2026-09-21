import CustomBadge from "@/components/common/Badge/CustomBadge";
import Detail from "../Detail";
import { ComplianceProfile } from "@/types/compliance/compliance.types";
import { formatDate } from "@/lib/utils";

interface PersonalInformationStepProps {
  profile: ComplianceProfile;
}

const PersonalInformationStep = ({ profile }: PersonalInformationStepProps) => {
  const fullName = [
    profile.title,
    profile.firstName,
    profile.middleName,
    profile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const address = [
    profile.street,
    profile.city,
    profile.state,
    profile.postcode,
    profile.country,
  ]
    .filter(Boolean)
    .join(", ");

  const personalDetails = [
    {
      label: "Title",
      value: profile.title || "—",
    },
    {
      label: "First Name",
      value: profile.firstName || "—",
    },
    {
      label: "Middle Name",
      value: profile.middleName || "—",
    },
    {
      label: "Last Name",
      value: profile.lastName || "—",
    },
    {
      label: "Date of Birth",
      value: formatDate(profile.dob),
    },
    {
      label: "Gender",
      value: <p className="capitalize">{profile.gender}</p>,
    },
    {
      label: "Identification Points",
      value:
        profile.identificationPoints !== null &&
        profile.identificationPoints !== undefined
          ? `${profile.identificationPoints} points`
          : "—",
    },
  ];

  const contactDetails = [
    {
      label: "Email",
      value: profile.email || "—",
    },
    {
      label: "Mobile",
      value: profile.mobile || "—",
    },
    {
      label: "Country",
      value: profile.country || "—",
    },
  ];

  const addressDetails = [
    {
      label: "Street",
      value: profile.street || "—",
    },
    {
      label: "City",
      value: profile.city || "—",
    },
    {
      label: "State",
      value: profile.state || "—",
    },
    {
      label: "Postcode",
      value: profile.postcode || "—",
    },
    {
      label: "Country",
      value: profile.country || "—",
    },
    {
      label: "Full Address",
      value: address || "—",
    },
  ];

  const primaryIdDetails = [
    {
      label: "ID Type",
      value: profile.primaryIdType || "—",
    },
    {
      label: "ID Number",
      value: profile.primaryIdNumber || "—",
    },
    {
      label: "Expiry Date",
      value: formatDate(profile.primaryIdExpiry),
    },
    {
      label: "Verification Status",
      value: <CustomBadge status={profile.primaryIdStatus || "Pending"} />,
    },
  ];

  const secondaryIdDetails = [
    {
      label: "ID Type",
      value: profile.secondaryIdType || "—",
    },
    {
      label: "ID Number",
      value: profile.secondaryIdNumber || "—",
    },
    {
      label: "Expiry Date",
      value: formatDate(profile.secondaryIdExpiry),
    },
    {
      label: "Verification Status",
      value: <CustomBadge status={profile.secondaryIdStatus || "Pending"} />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={fullName || "Profile photo"}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">
              {`${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-base font-semibold">{fullName || "—"}</h5>

            <CustomBadge status={profile.approvalStatus || "Pending"} />
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {profile.jobTitle || "—"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            User ID: {profile.userId || "—"}
          </p>
        </div>
      </div>

      {/* Identity */}
      <section>
        <h4 className="mb-4 text-sm font-semibold">Identity Information</h4>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {personalDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h4 className="mb-4 text-sm font-semibold">Contact Information</h4>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contactDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Address */}
      <section>
        <h4 className="mb-4 text-sm font-semibold">Residential Address</h4>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {addressDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Primary ID */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold">Primary Identification</h4>

          <CustomBadge status={profile.primaryIdStatus || "Pending"} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {primaryIdDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Secondary ID */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold">Secondary Identification</h4>

          <CustomBadge status={profile.secondaryIdStatus || "Pending"} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryIdDetails.map((detail) => (
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

export default PersonalInformationStep;
