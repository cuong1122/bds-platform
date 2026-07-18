"use client";

import { useInquiries, useUpdateInquiryConfirmation, useListingsInterest } from "@/features/admin/hooks";
import { RequireAuth } from "@/components/admin/require-auth";
import { LogoutButton } from "@/components/admin/logout-button";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("vi-VN");
}

function AdminDashboard() {
  const { data: inquiries, isLoading: loadingInquiries } = useInquiries();
  const { data: interest, isLoading: loadingInterest } = useListingsInterest();
  const updateConfirmation = useUpdateInquiryConfirmation();

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 px-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-medium text-3xl text-ink mb-1">
              Bảng Quản Trị
            </h1>
            <p className="text-slate text-sm">
              Quản lý lịch hẹn xem nhà và theo dõi mức độ quan tâm.
            </p>
          </div>
          <LogoutButton />
        </div>

        <section className="mb-16">
          <h2 className="font-display font-medium text-xl text-ink mb-4">
            Danh Sách Lịch Hẹn Xem Nhà
          </h2>

          {loadingInquiries && <p className="text-slate">Đang tải...</p>}

          {inquiries && inquiries.length === 0 && (
            <p className="text-slate">Chưa có yêu cầu nào.</p>
          )}

          {inquiries && inquiries.length > 0 && (
            <div className="border border-black/10 bg-cream-raised overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-slate font-mono">
                    <th className="p-3">Đã liên hệ</th>
                    <th className="p-3">Căn hộ</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">SĐT</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Thời gian mong muốn</th>
                    <th className="p-3">Ghi chú</th>
                    <th className="p-3">Ngày gửi</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      className={`border-b border-black/5 ${inq.is_confirmed ? "opacity-50" : ""}`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={inq.is_confirmed}
                          onChange={(e) =>
                            updateConfirmation.mutate({
                              id: inq.id,
                              isConfirmed: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-gold cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        {inq.building_name} — Căn {inq.listing_code}
                      </td>
                      <td className="p-3">{inq.full_name}</td>
                      <td className="p-3">{inq.phone}</td>
                      <td className="p-3">{inq.email || "—"}</td>
                      <td className="p-3">{inq.preferred_time || "—"}</td>
                      <td className="p-3 max-w-[200px] truncate">
                        {inq.message || "—"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {formatDate(inq.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display font-medium text-xl text-ink mb-4">
            Mức Độ Quan Tâm Theo Căn Hộ
          </h2>

          {loadingInterest && <p className="text-slate">Đang tải...</p>}

          {interest && interest.length > 0 && (
            <div className="border border-black/10 bg-cream-raised overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-slate font-mono">
                    <th className="p-3">Căn hộ</th>
                    <th className="p-3">Lượt xem</th>
                    <th className="p-3">Yêu thích</th>
                    <th className="p-3">Yêu cầu liên hệ</th>
                    <th className="p-3">Điểm quan tâm</th>
                  </tr>
                </thead>
                <tbody>
                  {interest.map((item) => (
                    <tr key={item.listing_id} className="border-b border-black/5">
                      <td className="p-3">
                        {item.building_name} — Căn {item.listing_code}
                      </td>
                      <td className="p-3">{item.view_count}</td>
                      <td className="p-3">{item.favorite_count}</td>
                      <td className="p-3">{item.inquiry_count}</td>
                      <td className="p-3 font-medium text-gold-dark">
                        {item.interest_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth>
      <AdminDashboard />
    </RequireAuth>
  );
}
