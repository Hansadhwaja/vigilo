export interface ComplianceStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

export type StepStatus = "completed" | "pending" | "attention" | "missing";

export interface Qualification {
  name: string;
  certificateNumber?: string | null;
  completionDate?: string | null;
  rtoProvider?: string | null;
  expiryDate?: string | null;
  documentUrl?: string | null;
  status: string;
}

export interface SiteInduction {
  siteName: string;
  completionDate?: string | null;
  expiryDate?: string | null;
  documentUrl?: string | null;
  status: string;
}

export interface UniformDetails {
  shirtSize?: string | null;
  pantsSize?: string | null;
  shoeSize?: string | null;
  equipment: string[];
}

export interface ComplianceProfile {
  // System
  id: string;
  userId: string;
  onboardingStep: number;
  profileCompleted: boolean;
  approvalStatus: string;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  // 1. Personal Information
  profilePhotoUrl?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  title?: string | null;
  dob?: string | null;
  gender?: string | null;
  email?: string | null;
  mobile?: string | null;

  street?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;

  primaryIdType?: string | null;
  primaryIdNumber?: string | null;
  primaryIdExpiry?: string | null;
  primaryIdStatus?: string | null;

  secondaryIdType?: string | null;
  secondaryIdNumber?: string | null;
  secondaryIdExpiry?: string | null;
  secondaryIdStatus?: string | null;

  identificationPoints?: number | null;

  // 2. Work Rights & Eligibility
  citizenshipStatus?: string | null;
  visaSubclass?: string | null;
  visaExpiryDate?: string | null;
  workRightsStatus?: string | null;

  // 3. Security Licence
  securityLicenceNumber?: string | null;
  securityLicenceClass?: string | null;
  securityLicenceSubActivity?: string | null;
  securityLicenceIssueDate?: string | null;
  securityLicenceExpiryDate?: string | null;
  securityLicenceDocumentUrl?: string | null;
  securityLicenceVerificationStatus?: string | null;

  // Interstate Licence
  hasInterstateLicence?: boolean;
  interstateLicenceState?: string | null;
  interstateLicenceNumber?: string | null;
  interstateLicenceClass?: string | null;
  interstateLicenceSubActivity?: string | null;
  interstateLicenceIssueDate?: string | null;
  interstateLicenceExpiryDate?: string | null;
  interstateLicenceDocumentUrl?: string | null;
  interstateLicenceVerificationStatus?: string | null;

  // 4. National Police Check
  policeCheckReferenceNumber?: string | null;
  policeCheckDate?: string | null;
  policeCheckIssuingBody?: string | null;
  policeCheckRenewalDueDate?: string | null;
  policeCheckDocumentUrl?: string | null;
  policeCheckStatus?: string | null;

  // Overseas Police Check
  hasOverseasPoliceCheck?: boolean;
  overseasPoliceCheckCountry?: string | null;
  overseasPoliceCheckReferenceNumber?: string | null;
  overseasPoliceCheckDate?: string | null;
  overseasPoliceCheckIssuingBody?: string | null;
  overseasPoliceCheckRenewalDueDate?: string | null;
  overseasPoliceCheckDocumentUrl?: string | null;
  overseasPoliceCheckStatus?: string | null;

  // 5. Qualifications & Training
  qualifications?: Qualification[];
  siteInductions?: SiteInduction[];

  // 6. Employment & Payroll
  employmentType?: string | null;
  employmentStartDate?: string | null;
  jobTitle?: string | null;
  awardClassification?: string | null;
  payRate?: string | null;
  portableLongServiceLeave?: string | null;

  taxFileNumberDeclaration?: string | null;
  superannuationFundName?: string | null;
  superannuationMemberNumber?: string | null;
  bankBSB?: string | null;
  bankAccountNumber?: string | null;
  internalPayrollId?: string | null;

  // 7. Emergency & Medical
  emergencyName?: string | null;
  emergencyRelationship?: string | null;
  emergencyPhone?: string | null;
  emergencySecondaryPhone?: string | null;

  bloodGroup?: string | null;
  medicalConditions?: string | null;
  allergies?: string | null;

  // 8. Declarations
  declarationsSigned?: boolean;
  declarationsDocumentUrl?: string | null;

  // 9. Uniform & Equipment
  uniformAllocated?: boolean;
  uniformDetails?: UniformDetails | null;
}
