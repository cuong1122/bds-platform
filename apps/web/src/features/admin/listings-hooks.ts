import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminListings,
  createListing,
  updateListing,
  deleteListing,
  type ListingFormValues,
} from "./listings-api";

const QUERY_KEY = ["admin-listings"];

export function useAdminListings() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchAdminListings,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ListingFormValues) => createListing(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ListingFormValues> }) =>
      updateListing(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteListing(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
