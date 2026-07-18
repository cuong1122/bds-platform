import { apiClient } from "@/lib/api-client";

export interface BuildingAdmin {
  id: number;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  description: string | null;
  year_built: number | null;
  total_floors: number | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface BuildingFormValues {
  name: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  year_built?: number | null;
  total_floors?: number | null;
  cover_image?: string | null;
}

export async function fetchAdminBuildings(): Promise<BuildingAdmin[]> {
  const { data } = await apiClient.get<BuildingAdmin[]>("/admin/buildings");
  return data;
}

export async function createBuilding(payload: BuildingFormValues): Promise<BuildingAdmin> {
  const { data } = await apiClient.post<BuildingAdmin>("/admin/buildings", payload);
  return data;
}

export async function updateBuilding(
  id: number,
  payload: Partial<BuildingFormValues>
): Promise<BuildingAdmin> {
  const { data } = await apiClient.put<BuildingAdmin>(`/admin/buildings/${id}`, payload);
  return data;
}

export async function deleteBuilding(id: number): Promise<void> {
  await apiClient.delete(`/admin/buildings/${id}`);
}
