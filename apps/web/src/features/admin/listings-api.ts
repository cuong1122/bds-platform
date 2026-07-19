import { apiClient } from "@/lib/api-client";
import type { ListingStatus, Direction } from "@/features/listing/types";

export interface ListingImageAdmin {
  id: number;
  url: string;
  order: number;
  is_cover: boolean;
  caption: string | null;
}

export interface ListingAdmin {
  id: number;
  building_id: number;
  building_name: string;
  code: string;
  price: string;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  direction: Direction | null;
  status: ListingStatus;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  images: ListingImageAdmin[];
}

export interface ListingFormValues {
  building_id: number;
  code: string;
  price: number;
  area: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floor?: number | null;
  direction?: Direction | null;
  status: ListingStatus;
  description?: string | null;
  image_urls?: string[];
}

export async function fetchAdminListings(): Promise<ListingAdmin[]> {
  const { data } = await apiClient.get<ListingAdmin[]>("/admin/listings");
  return data;
}

export async function createListing(payload: ListingFormValues): Promise<ListingAdmin> {
  const { data } = await apiClient.post<ListingAdmin>("/admin/listings", payload);
  return data;
}

export async function updateListing(
  id: number,
  payload: Partial<ListingFormValues>
): Promise<ListingAdmin> {
  const { data } = await apiClient.put<ListingAdmin>(`/admin/listings/${id}`, payload);
  return data;
}

export async function deleteListing(id: number): Promise<void> {
  await apiClient.delete(`/admin/listings/${id}`);
}
