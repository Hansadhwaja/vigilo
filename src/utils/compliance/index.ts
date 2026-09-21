import {
  ComplianceProfile,
  StepStatus,
} from "@/types/compliance/compliance.types";

const isExpired = (value?: string | null) => {
  if (!value) return false;

  return new Date(value).getTime() < Date.now();
};

const isVerified = (value?: string | null) => {
  return value?.toLowerCase() === "verified";
};

const isApproved = (value?: string | null) => {
  return value?.toLowerCase() === "approved";
};

const isConfirmed = (value?: string | null) => {
  return value?.toLowerCase() === "confirmed";
};

/**
 * Returns the overall status of a compliance step.
 *
 * Priority:
 * missing > attention > pending > complete
 */
export const getStepStatus = (
  profile: ComplianceProfile,
  step: number,
): StepStatus => {
  switch (step) {
    /**
     * 1. Personal Information
     */
    case 1: {
      const hasBasicInformation =
        Boolean(profile.firstName) &&
        Boolean(profile.lastName) &&
        Boolean(profile.dob) &&
        Boolean(profile.email) &&
        Boolean(profile.mobile);

      const hasPrimaryId =
        Boolean(profile.primaryIdType) && Boolean(profile.primaryIdNumber);

      if (!hasBasicInformation || !hasPrimaryId) {
        return "missing";
      }

      // Primary ID expiry
      if (isExpired(profile.primaryIdExpiry)) {
        return "attention";
      }

      // Primary ID must be approved
      if (!isApproved(profile.primaryIdStatus)) {
        return "pending";
      }

      // Secondary ID is optional, but if provided it must be valid.
      const hasSecondaryId =
        Boolean(profile.secondaryIdType) && Boolean(profile.secondaryIdNumber);

      if (hasSecondaryId) {
        if (isExpired(profile.secondaryIdExpiry)) {
          return "attention";
        }

        if (!isApproved(profile.secondaryIdStatus)) {
          return "pending";
        }
      }

      return "completed";
    }

    /**
     * 2. Work Rights & Eligibility
     */
    case 2: {
      if (!profile.citizenshipStatus) {
        return "missing";
      }

      const hasVisaDetails =
        Boolean(profile.visaSubclass) || Boolean(profile.visaExpiryDate);

      if (hasVisaDetails && isExpired(profile.visaExpiryDate)) {
        return "attention";
      }

      if (!isConfirmed(profile.workRightsStatus)) {
        return "pending";
      }

      return "completed";
    }

    /**
     * 3. Security Licence
     */
    case 3: {
      const hasPrimaryLicence =
        Boolean(profile.securityLicenceNumber) &&
        Boolean(profile.securityLicenceClass);

      if (!hasPrimaryLicence) {
        return "missing";
      }

      // Expiry takes priority over verification status.
      if (isExpired(profile.securityLicenceExpiryDate)) {
        return "attention";
      }

      if (!isVerified(profile.securityLicenceVerificationStatus)) {
        return "pending";
      }

      // Interstate licence is optional.
      if (profile.hasInterstateLicence) {
        const hasInterstateDetails =
          Boolean(profile.interstateLicenceState) &&
          Boolean(profile.interstateLicenceNumber) &&
          Boolean(profile.interstateLicenceClass);

        if (!hasInterstateDetails) {
          return "missing";
        }

        if (isExpired(profile.interstateLicenceExpiryDate)) {
          return "attention";
        }

        if (!isVerified(profile.interstateLicenceVerificationStatus)) {
          return "pending";
        }
      }

      return "completed";
    }

    /**
     * 4. Police Check
     */
    case 4: {
      if (!profile.policeCheckReferenceNumber) {
        return "missing";
      }

      // National police check
      if (isExpired(profile.policeCheckRenewalDueDate)) {
        return "attention";
      }

      if (!isApproved(profile.policeCheckStatus)) {
        return "pending";
      }

      // Overseas police check is optional.
      if (profile.hasOverseasPoliceCheck) {
        const hasOverseasDetails =
          Boolean(profile.overseasPoliceCheckCountry) &&
          Boolean(profile.overseasPoliceCheckReferenceNumber);

        if (!hasOverseasDetails) {
          return "missing";
        }

        if (isExpired(profile.overseasPoliceCheckRenewalDueDate)) {
          return "attention";
        }

        if (!isApproved(profile.overseasPoliceCheckStatus)) {
          return "pending";
        }
      }

      return "completed";
    }

    /**
     * 5. Qualifications & Training
     */
    case 5: {
      const qualifications = profile.qualifications ?? [];
      const siteInductions = profile.siteInductions ?? [];

      if (!qualifications.length && !siteInductions.length) {
        return "missing";
      }

      // Expired records take priority.
      const hasExpiredQualification = qualifications.some((item) =>
        isExpired(item.expiryDate),
      );

      const hasExpiredInduction = siteInductions.some((item) =>
        isExpired(item.expiryDate),
      );

      if (hasExpiredQualification || hasExpiredInduction) {
        return "attention";
      }

      // Then check verification status.
      const hasPendingQualification = qualifications.some(
        (item) => !isVerified(item.status),
      );

      const hasPendingInduction = siteInductions.some(
        (item) => !isVerified(item.status),
      );

      if (hasPendingQualification || hasPendingInduction) {
        return "pending";
      }

      return "completed";
    }

    /**
     * 6. Employment & Payroll
     */
    case 6: {
      const hasEmploymentDetails =
        Boolean(profile.employmentType) &&
        Boolean(profile.employmentStartDate) &&
        Boolean(profile.jobTitle);

      if (!hasEmploymentDetails) {
        return "missing";
      }

      const hasPayrollDetails =
        Boolean(profile.superannuationFundName) &&
        Boolean(profile.superannuationMemberNumber);

      const hasBankingDetails =
        Boolean(profile.bankBSB) && Boolean(profile.bankAccountNumber);

      if (!hasPayrollDetails || !hasBankingDetails) {
        return "pending";
      }

      return "completed";
    }

    /**
     * 7. Emergency & Medical
     */
    case 7: {
      const hasEmergencyContact =
        Boolean(profile.emergencyName) &&
        Boolean(profile.emergencyRelationship) &&
        Boolean(profile.emergencyPhone);

      if (!hasEmergencyContact) {
        return "missing";
      }

      return "completed";
    }

    /**
     * 8. Declarations
     */
    case 8: {
      if (!profile.declarationsSigned) {
        return "pending";
      }

      if (!profile.declarationsDocumentUrl) {
        return "missing";
      }

      return "completed";
    }

    /**
     * 9. Uniform & Equipment
     */
    case 9: {
      if (!profile.uniformAllocated) {
        return "pending";
      }

      if (!profile.uniformDetails) {
        return "missing";
      }

      const hasUniformSizes =
        Boolean(profile.uniformDetails.shirtSize) &&
        Boolean(profile.uniformDetails.pantsSize) &&
        Boolean(profile.uniformDetails.shoeSize);

      if (!hasUniformSizes) {
        return "pending";
      }

      return "completed";
    }

    default:
      return "missing";
  }
};

export const statusLabel: Record<StepStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  attention: "Attention",
  missing: "Missing",
};

export const statusClass: Record<StepStatus, string> = {
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400",

  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400",

  attention:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400",

  missing: "border-muted bg-muted text-muted-foreground",
};
