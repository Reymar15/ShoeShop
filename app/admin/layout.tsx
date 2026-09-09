"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";

const NAV = [
  { href: "/admin",          label: "Dashboard",  icon: "📊" },
  { href: "/admin/products", label: "Inventory",  icon: "📦" },
  { href: "/admin/orders",   label: "Orders",     icon: "🧾" },
  { href: "/admin/reports",  label: "Reports",    icon: "📈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  // Login page — no sidebar, no guard
  if (path === "/admin/login") {
    return <>{children}</>;
  }

  function handleLogout() {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0 min-h-screen">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ShoeShop</p>
          <h1 className="text-lg font-black">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  active
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <span>🏠</span> Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {NAV.find((n) => n.href === path)?.label ?? "Admin"}
          </p>
          <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">
            ● Live
          </span>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>

      </div>
    </AdminGuard>
  );
}
