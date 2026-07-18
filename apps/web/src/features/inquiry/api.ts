import { apiClient } from "@/lib/api-client";

export interface InquiryPayload {
  full_name: string;
  phone: string;
  email?: string;
  preferred_time?: string;
  message?: string;
  session_id?: string;
}

export async function submitInquiry(
  listingId: number,
  payload: InquiryPayload
): Promise<void> {
  await apiClient.post(`/listings/${listingId}/inquiries`, payload);
}
