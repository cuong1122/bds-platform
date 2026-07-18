"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitInquiry } from "@/features/inquiry/api";
import { getSessionId } from "@/lib/session";

const inquirySchema = z.object({
  full_name: z.string().min(2, "Vui lòng nhập họ tên").max(100),
  phone: z
    .string()
    .min(8, "Số điện thoại không hợp lệ")
    .max(20)
    .regex(/^[0-9+\s()-]+$/, "Số điện thoại không hợp lệ"),
  email: z.union([z.email("Email không hợp lệ"), z.literal("")]).optional(),
  preferred_time: z.string().max(200).optional(),
  message: z.string().max(1000).optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export function ContactForm({ listingId }: { listingId: number }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (values: InquiryFormValues) => {
    setError(null);
    try {
      await submitInquiry(listingId, {
        ...values,
        email: values.email || undefined,
        session_id: getSessionId(),
      });
      setSubmitted(true);
      reset();
    } catch {
      setError("Gửi yêu cầu thất bại, vui lòng thử lại.");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors"
      >
        Đặt Lịch Xem Nhà
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="border border-gold/40 bg-gold-tint p-6 text-center">
        <p className="font-display text-lg text-ink mb-1">
          Đã gửi yêu cầu thành công!
        </p>
        <p className="text-sm text-slate">
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-black/10 p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-medium text-lg text-ink">
          Đặt Lịch Xem Nhà
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-slate hover:text-ink text-sm"
        >
          Đóng
        </button>
      </div>

      <div>
        <input
          {...register("full_name")}
          placeholder="Họ và tên *"
          className="w-full border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
        {errors.full_name && (
          <p className="text-red-600 text-xs mt-1">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("phone")}
          placeholder="Số điện thoại *"
          className="w-full border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
        {errors.phone && (
          <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("email")}
          placeholder="Email (không bắt buộc)"
          className="w-full border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("preferred_time")}
          placeholder="Thời gian muốn xem nhà (VD: Sáng thứ 7 tuần này)"
          className="w-full border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div>
        <textarea
          {...register("message")}
          placeholder="Ghi chú thêm (không bắt buộc)"
          rows={3}
          className="w-full border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold resize-none"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu"}
      </button>
    </form>
  );
}
