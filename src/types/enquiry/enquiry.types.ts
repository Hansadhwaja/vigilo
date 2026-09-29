export type EnquiryStatus = "open" | "inprogress" | "resolved";

export type SenderType = "company" | "website" | "guard";

export interface EnquiryUser {
  id: string;
  name: string;
  email: string;
}

export interface TicketType {
  id: string;
  name: string;
  subject: string;
  description: string;
  status: EnquiryStatus;
  senderType: SenderType;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: EnquiryUser | null;
}

export interface EnquiryResponse {
  success: boolean;
  count: number;
  data: TicketType[];
}
