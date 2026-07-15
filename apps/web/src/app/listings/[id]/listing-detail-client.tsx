"use client";

import { useRouter } from "next/navigation";
import { useListingDetail } from "@/features/listing/hooks";
import { ImageGallery } from "@/components/landing/image-gallery";
import { ShareButton } from "@/components/landing/share-button";
import { useViewTracking } from "@/features/listing/use-view-tracking";

const STATUS_LABEL: Record<string, string> = {
  available: "Còn trống",
  reserved: "Đang giữ chỗ",
  sold: "Đã bán",
};

const DIRECTION_LABEL: Record<string, string> = {
  north: "Bắc",
  south: "Nam",
  east: "Đông",
  west: "Tây",
  northeast: "Đông Bắc",
  northwest: "Tây Bắc",
  southeast: "Đông Nam",
  southwest: "Tây Nam",
};

function formatPrice(price: string): string {
  const num = parseFloat(price);
  return (num / 1_000_000_000).toFixed(2) + " tỷ VNĐ";
}

export default function ListingDetailClient({ id }: { id: number }) {
  const router = useRouter();
  useViewTracking(id);
  const { data: listing, isLoading, isError } = useListingDetail(id);

  if (isLoading) {
    return (
      <main className="max-w-[1280px] mx-auto px-10 py-32 text-center text-slate">
        Đang tải thông tin căn hộ...
      </main>
    );
  }

  if (isError || !listing) {
    return (
      <main className="max-w-[1280px] mx-auto px-10 py-32 text-center">
        <p className="text-red-600 mb-4">Không tìm thấy căn hộ này.</p>
        <button
          onClick={() => router.push("/")}
          className="text-gold-dark underline"
        >
          Quay về trang chủ
        </button>
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen pt-28 pb-24">
      <div className="max-w-[1280px] mx-auto px-10">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="font-mono text-xs uppercase tracking-wide text-slate hover:text-gold-dark inline-flex items-center gap-2"
          >
            ← Quay lại
          </button>
          <ShareButton
            title={`Căn ${listing.code} - ${listing.building.name}`}
            url={typeof window !== "undefined" ? window.location.href : ""}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
          {/* Ảnh chính */}
          <ImageGallery images={listing.images} code={listing.code} />

          {/* Thông tin */}
          <div>
            <div className="font-mono text-xs tracking-wide text-gold-dark uppercase mb-2">
              {listing.building.name} — {listing.building.address}
            </div>
            <h1 className="font-display font-medium text-4xl text-ink mb-3">
              Căn {listing.code}
            </h1>
            <div className="font-display font-medium text-3xl text-gold-dark mb-6">
              {formatPrice(listing.price)}
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8 pb-8 border-b border-black/10">
              <InfoRow label="Diện tích" value={`${listing.area} m²`} />
              <InfoRow
                label="Trạng thái"
                value={STATUS_LABEL[listing.status]}
              />
              {listing.bedrooms && (
                <InfoRow label="Phòng ngủ" value={`${listing.bedrooms}`} />
              )}
              {listing.bathrooms && (
                <InfoRow label="Phòng tắm" value={`${listing.bathrooms}`} />
              )}
              {listing.floor && (
                <InfoRow label="Tầng" value={`${listing.floor}`} />
              )}
              {listing.direction && (
                <InfoRow
                  label="Hướng"
                  value={DIRECTION_LABEL[listing.direction]}
                />
              )}
            </div>

            {listing.description && (
              <div className="mb-8">
                <h3 className="font-mono text-xs uppercase tracking-wide text-slate mb-3">
                  Mô tả
                </h3>
                <p className="text-ink-soft leading-relaxed">
                  {listing.description}
                </p>
              </div>
            )}

            <button className="w-full py-4 bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors">
              Đặt Lịch Xem Nhà
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-wide text-slate mb-1">
        {label}
      </div>
      <div className="text-ink font-medium">{value}</div>
    </div>
  );
}
