import { create } from "zustand";
import { getSessionId } from "@/lib/session";
import { fetchFavoriteIds, addFavorite, removeFavorite } from "./api";

interface FavoritesState {
  ids: Set<number>;
  isLoaded: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (listingId: number) => Promise<void>;
  isFavorite: (listingId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: new Set(),
  isLoaded: false,

  loadFavorites: async () => {
    if (get().isLoaded) return; // chỉ gọi API 1 lần, dùng chung cho toàn site
    const sessionId = getSessionId();
    if (!sessionId) return;
    try {
      const listingIds = await fetchFavoriteIds(sessionId);
      set({ ids: new Set(listingIds), isLoaded: true });
    } catch {
      set({ isLoaded: true }); // tránh loop gọi lại liên tục nếu API lỗi
    }
  },

  toggleFavorite: async (listingId: number) => {
    const sessionId = getSessionId();
    const current = get().ids;
    const isFav = current.has(listingId);

    // Optimistic update - đổi UI ngay, không chờ API response
    const next = new Set(current);
    if (isFav) next.delete(listingId);
    else next.add(listingId);
    set({ ids: next });

    try {
      if (isFav) await removeFavorite(listingId, sessionId);
      else await addFavorite(listingId, sessionId);
    } catch {
      set({ ids: current }); // rollback nếu API lỗi
    }
  },

  isFavorite: (listingId: number) => get().ids.has(listingId),
}));
