import CustomBadge from "@/components/common/Badge/CustomBadge";
import Detail from "../Detail";
import { ComplianceProfile } from "@/types/compliance/compliance.types";

interface UniformEquipmentStepProps {
  profile: ComplianceProfile;
}

const UniformEquipmentStep = ({ profile }: UniformEquipmentStepProps) => {
  const uniformDetails = [
    {
      label: "Allocation Status",
      value: (
        <CustomBadge
          status={profile.uniformAllocated ? "Allocated" : "Pending"}
        />
      ),
    },
    {
      label: "Shirt Size",
      value: profile.uniformDetails?.shirtSize || "—",
    },
    {
      label: "Pants Size",
      value: profile.uniformDetails?.pantsSize || "—",
    },
    {
      label: "Shoe Size",
      value: profile.uniformDetails?.shoeSize || "—",
    },
  ];

  const equipment = profile.uniformDetails?.equipment ?? [];

  return (
    <div className="space-y-8">
      {/* Uniform */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">Uniform Details</h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Uniform allocation and sizing information.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {uniformDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Equipment */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">Issued Equipment</h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Equipment currently allocated to the guard.
          </p>
        </div>

        {equipment.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {equipment.map((item) => (
              <span
                key={item}
                className="rounded-md border bg-muted/40 px-3 py-1.5 text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed">
            <p className="text-sm text-muted-foreground">
              No equipment has been allocated.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default UniformEquipmentStep;
