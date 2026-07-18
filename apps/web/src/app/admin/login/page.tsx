"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/api";
import { setToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const token = await login(email, password);
      setToken(token);
      router.push("/admin");
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-cream-raised p-8 border border-black/10"
      >
        <h1 className="font-display font-medium text-2xl text-ink mb-1">
          Đăng Nhập Quản Trị
        </h1>
        <p className="text-slate text-sm mb-6">
          Dành riêng cho quản trị viên BDS Platform.
        </p>

        <div className="mb-4">
          <label className="block font-mono text-[11px] uppercase tracking-wide text-slate mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div className="mb-6">
          <label className="block font-mono text-[11px] uppercase tracking-wide text-slate mb-1.5">
            Mật khẩu
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>
      </form>
    </main>
  );
}
