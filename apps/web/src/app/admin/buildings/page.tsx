"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useAdminBuildings,
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
} from "@/features/admin/buildings-hooks";
import type { BuildingAdmin, BuildingFormValues } from "@/features/admin/buildings-api";
import { RequireAuth } from "@/components/admin/require-auth";
import { LogoutButton } from "@/components/admin/logout-button";

const EMPTY_FORM: BuildingFormValues = {
  name: "",
  address: "",
  lat: null,
  lng: null,
  description: "",
  year_built: null,
  total_floors: null,
  cover_image: "",
};

function BuildingsManager() {
  const { data: buildings, isLoading } = useAdminBuildings();
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding();
  const deleteMutation = useDeleteBuilding();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BuildingFormValues>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (building: BuildingAdmin) => {
    setEditingId(building.id);
    setForm({
      name: building.name,
      address: building.address,
      lat: building.lat,
      lng: building.lng,
      description: building.description ?? "",
      year_built: building.year_built,
      total_floors: building.total_floors,
      cover_image: building.cover_image ?? "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.address.trim()) {
      setFormError("Tên tòa và địa chỉ là bắt buộc");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      closeForm();
    } catch {
      setFormError("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleDelete = async (building: BuildingAdmin) => {
    setDeleteError(null);
    if (!confirm(`Xóa tòa "${building.name}"? Hành động này không thể hoàn tác.`)) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(building.id);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        "Không thể xóa tòa nhà này. Vui lòng thử lại.";
      setDeleteError(message);
    }
  };

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 px-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="font-mono text-xs uppercase tracking-wide text-slate hover:text-gold-dark">
              ← Quay lại Bảng Quản Trị
            </Link>
            <h1 className="font-display font-medium text-3xl text-ink mt-2">
              Quản Lý Tòa Nhà
            </h1>
          </div>
          <LogoutButton />
        </div>

        {deleteError && (
          <div className="mb-6 border border-red-300 bg-red-50 text-red-700 text-sm p-4">
            {deleteError}
          </div>
        )}

        <button
          onClick={openCreateForm}
          className="mb-6 px-5 py-2.5 bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors"
        >
          + Thêm Tòa Mới
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 border border-black/10 bg-cream-raised p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-medium text-lg text-ink">
                {editingId ? "Sửa Tòa Nhà" : "Thêm Tòa Nhà Mới"}
              </h2>
              <button type="button" onClick={closeForm} className="text-slate hover:text-ink text-sm">
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Tên tòa *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
              <input
                placeholder="Địa chỉ *"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
              <input
                type="number"
                step="any"
                placeholder="Vĩ độ (lat)"
                value={form.lat ?? ""}
                onChange={(e) => setForm({ ...form, lat: e.target.value ? Number(e.target.value) : null })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
              <input
                type="number"
                step="any"
                placeholder="Kinh độ (lng)"
                value={form.lng ?? ""}
                onChange={(e) => setForm({ ...form, lng: e.target.value ? Number(e.target.value) : null })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
              <input
                type="number"
                placeholder="Năm xây dựng"
                value={form.year_built ?? ""}
                onChange={(e) => setForm({ ...form, year_built: e.target.value ? Number(e.target.value) : null })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
              <input
                type="number"
                placeholder="Số tầng"
                value={form.total_floors ?? ""}
                onChange={(e) => setForm({ ...form, total_floors: e.target.value ? Number(e.target.value) : null })}
                className="border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
              <input
                placeholder="URL ảnh bìa (tạm thời, chưa upload thật)"
                value={form.cover_image ?? ""}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className="col-span-2 border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              />
              <textarea
                placeholder="Mô tả"
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="col-span-2 border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold resize-none"
              />
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
                : "Tạo Tòa Mới"}
            </button>
          </form>
        )}

        {isLoading && <p className="text-slate">Đang tải...</p>}

        {buildings && buildings.length > 0 && (
          <div className="border border-black/10 bg-cream-raised overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-slate font-mono">
                  <th className="p-3">Tên</th>
                  <th className="p-3">Địa chỉ</th>
                  <th className="p-3">Năm XD</th>
                  <th className="p-3">Số tầng</th>
                  <th className="p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((b) => (
                  <tr key={b.id} className="border-b border-black/5">
                    <td className="p-3 font-medium">{b.name}</td>
                    <td className="p-3">{b.address}</td>
                    <td className="p-3">{b.year_built || "—"}</td>
                    <td className="p-3">{b.total_floors || "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditForm(b)}
                          className="text-gold-dark hover:underline text-xs font-mono uppercase"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
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

export default function BuildingsPage() {
  return (
    <RequireAuth>
      <BuildingsManager />
    </RequireAuth>
  );
}
