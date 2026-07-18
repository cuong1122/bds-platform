import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInquiries, updateInquiryConfirmation, fetchListingsInterest } from "./api";

export function useInquiries() {
  return useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: fetchInquiries,
  });
}

export function useUpdateInquiryConfirmation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isConfirmed }: { id: number; isConfirmed: boolean }) =>
      updateInquiryConfirmation(id, isConfirmed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
    },
  });
}

export function useListingsInterest() {
  return useQuery({
    queryKey: ["admin-listings-interest"],
    queryFn: fetchListingsInterest,
  });
}
