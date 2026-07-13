"use client";

import { useState, useEffect } from "react";
import { useBuildings } from "@/features/listing/hooks";
import { useListingFilterStore } from "@/features/listing/filter-store";
import type { ListingSort } from "@/features/listing/types";

const SORT_OPTIONS: { value: ListingSort; label: string }[] = [
  { value: "created_desc", label: "Mới nhất" },
  { value: "price_asc", label: "Giá: Thấp đến Cao" },
  { value: "price_desc", label: "Giá: Cao đến Thấp" },
  { value: "area_asc", label: "Diện tích: Nhỏ đến Lớn" },
  { value: "area_desc", label: "Diện tích: Lớn đến Nhỏ" },
];

export function FilterBar() {
  const { data: buildings } = useBuildings();
  const { filters, setFilter, resetFilters } = useListingFilterStore();

  // Debounce ô search - tránh gọi API mỗi lần gõ 1 ký tự
  const [searchInput, setSearchInput] = useState(filters.search || "");
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter("search", searchInput || undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="bg-cream-raised border border-black/10 p-6 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm theo mã căn..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold col-span-1 lg:col-span-2"
        />

        {/* Building */}
        <select
          value={filters.building_id ?? ""}
          onChange={(e) =>
            setFilter(
              "building_id",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-white"
        >
          <option value="">Tất cả các tòa</option>
          {buildings?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Bedrooms */}
        <select
          value={filters.min_bedrooms ?? ""}
          onChange={(e) =>
            setFilter(
              "min_bedrooms",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-white"
        >
          <option value="">Số phòng ngủ</option>
          <option value="1">Từ 1 PN</option>
          <option value="2">Từ 2 PN</option>
          <option value="3">Từ 3 PN</option>
          <option value="4">Từ 4 PN</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => setFilter("sort", e.target.value as ListingSort)}
          className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Khoảng giá */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input
          type="number"
          placeholder="Giá từ (VNĐ)"
          value={filters.min_price ?? ""}
          onChange={(e) =>
            setFilter(
              "min_price",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
        <input
          type="number"
          placeholder="Giá đến (VNĐ)"
          value={filters.max_price ?? ""}
          onChange={(e) =>
            setFilter(
              "max_price",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <button
        onClick={() => {
          setSearchInput("");
          resetFilters();
        }}
        className="mt-4 font-mono text-xs uppercase tracking-wide text-slate hover:text-gold-dark"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}
