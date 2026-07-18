import { apiClient } from "@/lib/api-client";
import type { InquiryAdmin, ListingInterest } from "./types";

export async function fetchInquiries(): Promise<InquiryAdmin[]> {
  const { data } = await apiClient.get<InquiryAdmin[]>("/admin/inquiries");
  return data;
}

export async function updateInquiryConfirmation(
  id: number,
  isConfirmed: boolean
): Promise<InquiryAdmin> {
  const { data } = await apiClient.patch<InquiryAdmin>(`/admin/inquiries/${id}`, {
    is_confirmed: isConfirmed,
  });
  return data;
}

export async function fetchListingsInterest(): Promise<ListingInterest[]> {
  const { data } = await apiClient.get<ListingInterest[]>("/admin/listings-interest");
  return data;
}
