"use client";

import { useListings } from "@/features/listing/hooks";
import { useListingFilterStore } from "@/features/listing/filter-store";
import { FilterBar } from "./filter-bar";
import { ListingCard } from "./listing-card";

export function ListingsGrid() {
  const { filters } = useListingFilterStore();
  const { data, isLoading, isError } = useListings(filters);

  // Lọc bỏ "sold" và sắp xếp available lên trước reserved (xử lý phía client
  // vì đây chỉ là trang chủ hiển thị nổi bật, không phải trang danh sách đầy đủ)
  const visibleItems = data?.items
    .filter((item) => item.status !== "sold")
    .sort((a, b) => {
      const priority = { available: 0, reserved: 1, sold: 2 };
      return priority[a.status] - priority[b.status];
    });

  return (
    <section className="py-24 bg-cream" id="can-ho">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="max-w-xl mb-14">
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase text-gold-dark font-semibold mb-4">
            <span className="w-8 h-px bg-gold" />
            Sản Phẩm
          </div>
          <h2 className="font-display font-medium text-ink text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Không Gian Sống Đa Dạng
          </h2>
          <p className="text-slate leading-relaxed">
            Khám phá các căn hộ hiện có, đa dạng diện tích và thiết kế phù hợp
            với nhu cầu của bạn.
          </p>
        </div>

        <FilterBar />

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-black/5 animate-pulse rounded"
              />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-600 py-10">
            Không thể tải danh sách căn hộ. Vui lòng thử lại sau.
          </p>
        )}

        {data && visibleItems && visibleItems.length === 0 && (
          <p className="text-center text-slate py-10">
            Hiện chưa có căn hộ nào được đăng.
          </p>
        )}

        {data && visibleItems && visibleItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems!.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
