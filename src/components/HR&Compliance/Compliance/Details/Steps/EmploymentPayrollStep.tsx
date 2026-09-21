import Detail from "../Detail";
import CustomBadge from "@/components/common/Badge/CustomBadge";
import { formatDate } from "@/lib/utils";
import { ComplianceProfile } from "@/types/compliance/compliance.types";

interface EmploymentPayrollStepProps {
  profile: ComplianceProfile;
}

const EmploymentPayrollStep = ({
  profile,
}: EmploymentPayrollStepProps) => {
  const employmentDetails = [
    {
      label: "Employment Type",
      value: profile.employmentType || "—",
    },
    {
      label: "Employment Start Date",
      value: formatDate(profile.employmentStartDate),
    },
    {
      label: "Job Title",
      value: profile.jobTitle || "—",
    },
    {
      label: "Award Classification",
      value: profile.awardClassification || "—",
    },
    {
      label: "Pay Rate",
      value: profile.payRate || "—",
    },
    {
      label: "Long Service Leave",
      value: profile.portableLongServiceLeave || "—",
    },
  ];

  const payrollDetails = [
    {
      label: "Internal Payroll ID",
      value: profile.internalPayrollId || "—",
    },
    {
      label: "TFN Declaration",
      value: profile.taxFileNumberDeclaration || "—",
    },
    {
      label: "Superannuation Fund",
      value: profile.superannuationFundName || "—",
    },
    {
      label: "Super Member Number",
      value: profile.superannuationMemberNumber || "—",
    },
  ];

  const bankingDetails = [
    {
      label: "Bank BSB",
      value: profile.bankBSB || "—",
    },
    {
      label: "Bank Account Number",
      value: profile.bankAccountNumber || "—",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Employment */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Employment Details
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Employment type, position, award classification and pay
            information.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {employmentDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Payroll */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Payroll & Superannuation
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Tax declaration, superannuation and internal payroll
            information.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {payrollDetails.map((detail) => (
            <Detail
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </section>

      {/* Banking */}
      <section>
        <div className="mb-4">
          <h4 className="text-sm font-semibold">
            Banking Information
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Bank account details used for payroll payments.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bankingDetails.map((detail) => (
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

export default EmploymentPayrollStep;