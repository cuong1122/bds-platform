import { apiClient } from "@/lib/api-client";

export async function fetchFavoriteIds(sessionId: string): Promise<number[]> {
  const { data } = await apiClient.get<{ listing_ids: number[] }>("/favorites", {
    params: { session_id: sessionId },
  });
  return data.listing_ids;
}

export async function addFavorite(listingId: number, sessionId: string): Promise<void> {
  await apiClient.post(`/listings/${listingId}/favorite`, { session_id: sessionId });
}

export async function removeFavorite(listingId: number, sessionId: string): Promise<void> {
  await apiClient.delete(`/listings/${listingId}/favorite`, {
    params: { session_id: sessionId },
  });
}
