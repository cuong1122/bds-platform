import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  type BuildingFormValues,
} from "./buildings-api";

const QUERY_KEY = ["admin-buildings"];

export function useAdminBuildings() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchAdminBuildings,
  });
}

export function useCreateBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BuildingFormValues) => createBuilding(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<BuildingFormValues> }) =>
      updateBuilding(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBuilding(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
