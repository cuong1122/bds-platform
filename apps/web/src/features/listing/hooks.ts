import { useQuery } from "@tanstack/react-query";
import { fetchListings, fetchListingDetail, fetchBuildings } from "./api";
import type { ListingFilterParams } from "./types";

export function useListings(filters: ListingFilterParams = {}) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => fetchListings(filters),
  });
}

export function useListingDetail(id: number) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListingDetail(id),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      // Không retry nếu lỗi 404 - thử lại cũng vô nghĩa
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useBuildings() {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: fetchBuildings,
  });
}
