import { apiClient } from "@/lib/api-client";
import type {
  ListingFilterParams,
  PaginatedListings,
  ListingDetail,
  Building,
} from "./types";

export async function fetchListings(
  filters: ListingFilterParams = {}
): Promise<PaginatedListings> {
  const { data } = await apiClient.get<PaginatedListings>("/listings", {
    params: filters,
  });
  return data;
}

export async function fetchListingDetail(id: number): Promise<ListingDetail> {
  const { data } = await apiClient.get<ListingDetail>(`/listings/${id}`);
  return data;
}

export async function fetchBuildings(): Promise<Building[]> {
  const { data } = await apiClient.get<Building[]>("/buildings");
  return data;
}
