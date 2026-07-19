"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useAdminListings,
  useCreateListing,
  useUpdateListing,
  useDeleteListing,
} from "@/features/admin/listings-hooks";
import { useAdminBuildings } from "@/features/admin/buildings-hooks";
import type { ListingAdmin, ListingFormValues } from "@/features/admin/listings-api";
import type { ListingStatus, Direction } from "@/features/listing/types";
import { RequireAuth } from "@/components/admin/require-auth";
import { LogoutButton } from "@/components/admin/logout-button";

const STATUS_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: "available", label: "Còn trống" },
  { value: "reserved", label: "Đang giữ chỗ" },
  { value: "sold", label: "Đã bán" },
];

const DIRECTION_OPTIONS: { value: Direction; label: string }[] = [
  { value: "north", label: "Bắc" },
  { value: "south", label: "Nam" },
  { value: "east", label: "Đông" },
  { value: "west", label: "Tây" },
  { value: "northeast", label: "Đông Bắc" },
  { value: "northwest", label: "Tây Bắc" },
  { value: "southeast", label: "Đông Nam" },
  { value: "southwest", label: "Tây Nam" },
];

interface FormState {
  building_id: string;
  code: string;
  price: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  direction: Direction | "";
  status: ListingStatus;
  description: string;
  image_urls: string[];
}

const EMPTY_FORM: FormState = {
  building_id: "",
  code: "",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  floor: "",
  direction: "",
  status: "available",
  description: "",
  image_urls: [],
};

function formatPrice(price: string): string {
  const num = parseFloat(price);
  return (num / 1_000_000_000).toFixed(2) + " tỷ";
}

function ListingsManager() {
  const { data: listings, isLoading } = useAdminListings();
  const { data: buildings } = useAdminBuildings();
  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();
  const deleteMutation = useDeleteListing();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (listing: ListingAdmin) => {
    setEditingId(listing.id);
    setForm({
      building_id: String(listing.building_id),
      code: listing.code,
      price: listing.price,
      area: String(listing.area),
      bedrooms: listing.bedrooms != null ? String(listing.bedrooms) : "",
      bathrooms: listing.bathrooms != null ? String(listing.bathrooms) : "",
      floor: listing.floor != null ? String(listing.floor) : "",
      direction: listing.direction ?? "",
      status: listing.status,
      description: listing.description ?? "",
      image_urls: listing.images
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((img) => img.url),
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const addImageField = () => {
    setForm({ ...form, image_urls: [...form.image_urls, ""] });
  };

  const updateImageField = (index: number, value: string) => {
    const next = [...form.image_urls];
    next[index] = value;
    setForm({ ...form, image_urls: next });
  };

  const removeImageField = (index: number) => {
    setForm({ ...form, image_urls: form.image_urls.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.building_id || !form.code.trim() || !form.price || !form.area) {
      setFormError("Tòa nhà, Mã căn, Giá và Diện tích là bắt buộc");
      return;
    }

    const cleanedImageUrls = form.image_urls.map((u) => u.trim()).filter(Boolean);

    const payload: ListingFormValues = {
      building_id: Number(form.building_id),
      code: form.code.trim(),
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      floor: form.floor ? Number(form.floor) : null,
      direction: form.direction || null,
      status: form.status,
      description: form.description || null,
      image_urls: cleanedImageUrls,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      closeForm();
    } catch (err: any) {
      const message = err?.response?.data?.detail || "Có lỗi xảy ra, vui lòng thử lại";
      setFormError(typeof message === "string" ? message : "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleDelete = async (listing: ListingAdmin) => {
    setActionError(null);
    if (!confirm(`Xóa căn "${listing.code}"? Toàn bộ ảnh, lượt xem, yêu thích và yêu cầu liên hệ liên quan cũng sẽ bị xóa. Hành động này không thể hoàn tác.`)) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(listing.id);
    } catch {
      setActionError("Không thể xóa căn hộ này. Vui lòng thử lại.");
    }
  };

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="font-mono text-xs uppercase tracking-wide text-slate hover:text-gold-dark">
              ← Quay lại Bảng Quản Trị
            </Link>
            <h1 className="font-display font-medium text-3xl text-ink mt-2">
              Quản Lý Căn Hộ
            </h1>
          </div>
          <LogoutButton />
        </div>

        {actionError && (
          <div className="mb-6 border border-red-300 bg-red-50 text-red-700 text-sm p-4">
            {actionError}
          </div>
        )}

        <button
          onClick={openCreateForm}
          className="mb-6 px-5 py-2.5 bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors"
        >
          + Thêm Căn Hộ Mới
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 border border-black/10 bg-cream-raised p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-medium text-lg text-ink">
                {editingId ? "Sửa Căn Hộ" : "Thêm Căn Hộ Mới"}
              </h2>
              <button type="button" onClick={closeForm} className="text-slate hover:text-ink text-sm">
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.building_id}
                onChange={(e) => setForm({ ...form, building_id: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-white"
              >
                <option value="">Chọn tòa nhà *</option>
                {buildings?.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <input
                placeholder="Mã căn (VD: A101) *"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />

              <input
                type="number"
                placeholder="Giá (VNĐ) *"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />

              <input
                type="number"
                step="any"
                placeholder="Diện tích (m²) *"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />

              <input
                type="number"
                placeholder="Số phòng ngủ"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />

              <input
                type="number"
                placeholder="Số phòng tắm"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />

              <input
                type="number"
                placeholder="Tầng"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />

              <select
                value={form.direction}
                onChange={(e) => setForm({ ...form, direction: e.target.value as Direction | "" })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-white"
              >
                <option value="">Hướng (không bắt buộc)</option>
                {DIRECTION_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ListingStatus })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              <textarea
                placeholder="Mô tả"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="col-span-2 border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[11px] uppercase tracking-wide text-slate">
                  Ảnh (URL tạm thời — ảnh đầu tiên là ảnh bìa)
                </label>
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-xs font-mono uppercase text-gold-dark hover:underline"
                >
                  + Thêm ảnh
                </button>
              </div>

              {form.image_urls.length === 0 && (
                <p className="text-slate text-sm">Chưa có ảnh nào. Bấm "+ Thêm ảnh" để thêm.</p>
              )}

              <div className="space-y-2">
                {form.image_urls.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-xs font-mono text-slate w-14 shrink-0">
                      {idx === 0 ? "Bìa" : `#${idx + 1}`}
                    </span>
                    <input
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => updateImageField(idx, e.target.value)}
                      className="flex-1 border border-black/15 px-4 py-2 text-sm focus:outline-none focus:border-gold"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="text-red-600 hover:underline text-xs font-mono uppercase shrink-0"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {formError && <p className="text-red-600 text-sm">{formError}</p>}

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full py-3 bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Đang lưu..."
                : editingId
                ? "Lưu Thay Đổi"
                : "Tạo Căn Mới"}
            </button>
          </form>
        )}

        {isLoading && <p className="text-slate">Đang tải...</p>}

        {listings && listings.length > 0 && (
          <div className="border border-black/10 bg-cream-raised overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-slate font-mono">
                  <th className="p-3">Mã căn</th>
                  <th className="p-3">Tòa</th>
                  <th className="p-3">Giá</th>
                  <th className="p-3">DT</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Số ảnh</th>
                  <th className="p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} className="border-b border-black/5">
                    <td className="p-3 font-medium">{l.code}</td>
                    <td className="p-3">{l.building_name}</td>
                    <td className="p-3">{formatPrice(l.price)}</td>
                    <td className="p-3">{l.area}m²</td>
                    <td className="p-3">
                      {STATUS_OPTIONS.find((s) => s.value === l.status)?.label}
                    </td>
                    <td className="p-3">{l.images.length}</td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditForm(l)}
                          className="text-gold-dark hover:underline text-xs font-mono uppercase"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(l)}
                          className="text-red-600 hover:underline text-xs font-mono uppercase"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ListingsPage() {
  return (
    <RequireAuth>
      <ListingsManager />
    </RequireAuth>
  );
}
