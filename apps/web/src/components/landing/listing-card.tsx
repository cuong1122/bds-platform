import Link from "next/link";
import type { ListingListItem } from "@/features/listing/types";
import { FavoriteButton } from "@/components/landing/favorite-button";

const STATUS_LABEL: Record<string, string> = {
  available: "Còn trống",
  reserved: "Đang giữ chỗ",
  sold: "Đã bán",
};

const STATUS_COLOR: Record<string, string> = {
  available: "bg-green-600",
  reserved: "bg-gold",
  sold: "bg-slate",
};

function formatPrice(price: string): string {
  const num = parseFloat(price);
  return (num / 1_000_000_000).toFixed(1) + " tỷ";
}

export function ListingCard({ listing }: { listing: ListingListItem }) {
  const coverImage =
    listing.images.find((img) => img.is_cover)?.url ||
    listing.images[0]?.url ||
    "https://placehold.co/600x450/F4EBD8/8A6526?text=Chua+co+anh";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-cream-raised border border-black/10 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={coverImage}
          alt={listing.code}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <FavoriteButton
          listingId={listing.id}
          className="absolute top-3 left-3 bg-ink/50 backdrop-blur-sm rounded-full p-2 hover:bg-ink/70 transition-colors z-10 text-white"
        />
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-[11px] font-mono uppercase tracking-wide text-white ${STATUS_COLOR[listing.status]}`}
        >
          {STATUS_LABEL[listing.status]}
        </span>
      </div>

      <div className="p-5">
        <div className="font-mono text-[11px] tracking-wide text-gold-dark uppercase mb-1">
          {listing.building_name}
        </div>
        <h3 className="font-display font-medium text-xl text-ink mb-2">
          Căn {listing.code}
        </h3>
        <div className="flex items-center gap-3 text-sm text-slate mb-3">
          {listing.bedrooms && <span>{listing.bedrooms} PN</span>}
          <span>·</span>
          <span>{listing.area}m²</span>
        </div>
        <div className="font-display font-medium text-2xl text-gold-dark">
          {formatPrice(listing.price)}
        </div>
      </div>
    </Link>
  );
}
