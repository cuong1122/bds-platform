"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="font-mono text-xs uppercase tracking-wide text-slate hover:text-red-600 border border-black/15 px-4 py-2"
    >
      Đăng Xuất
    </button>
  );
}
