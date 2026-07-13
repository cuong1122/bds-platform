import { create } from "zustand";
import type { ListingFilterParams } from "./types";

interface ListingFilterState {
  filters: ListingFilterParams;
  setFilter: <K extends keyof ListingFilterParams>(
    key: K,
    value: ListingFilterParams[K]
  ) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ListingFilterParams = {
  page: 1,
  page_size: 9,
  sort: "created_desc",
};

export const useListingFilterStore = create<ListingFilterState>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        // Reset về trang 1 mỗi khi đổi filter (trừ khi đang đổi chính page)
        ...(key !== "page" ? { page: 1 } : {}),
      },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
