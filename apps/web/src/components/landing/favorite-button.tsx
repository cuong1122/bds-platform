"use client";

import { Heart } from "lucide-react";
import { useEffect } from "react";
import { useFavoritesStore } from "@/features/favorites/store";

export function FavoriteButton({
  listingId,
  className,
}: {
  listingId: number;
  className?: string;
}) {
  const { loadFavorites, toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const active = isFavorite(listingId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(listingId);
      }}
      aria-label={active ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
      className={className}
    >
      <Heart
        size={18}
        className={active ? "fill-gold text-gold" : "fill-transparent text-current"}
      />
    </button>
  );
}
