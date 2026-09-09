"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

type OrderItem = { id: number; name: string; size?: string; color?: string; price: number; quantity: number };
type Order = { id: string; date: string; payment: string; items: OrderItem[]; total: number; status: string };

const STATUS_BADGE: Record<string, string> = {
  Pending:    "bg-yellow-50 text-yellow-600 border-yellow-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-200",
  Delivered:  "bg-green-50 text-green-600 border-green-200",
  Cancelled:  "bg-red-50 text-red-500 border-red-200",
};

export default function ProfilePage() {
  const { user, loading, logout } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [user, loading, router]);
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`shoeshop-orders-${user.email}`);
      if (saved) setOrders(JSON.parse(saved));
    }
  }, [user]);

  if (loading || !user) return null;

  const initials = user.fullName.slice(0, 2).toUpperCase();
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center text-2xl font-black shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-black">{user.fullName}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-xl transition shrink-0">
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            ["📦", String(orders.length), "Total Orders"],
            ["💰", `₱${totalSpent.toLocaleString()}`, "Total Spent"],
            ["✅", String(orders.filter(o => o.status === "Delivered").length), "Delivered"],
          ].map(([icon, val, label]) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-xl font-black">{val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Personal Info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-black text-base mb-4">Personal Information</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[["Full Name", user.fullName], ["Email Address", user.email], ["Phone Number", user.phone || "—"]].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-semibold truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-black text-base mb-5">Order History</h2>

          {orders.length === 0 ? (
            <div className="text-center py-14 text-gray-400">
              <p className="text-5xl mb-3">📦</p>
              <p className="font-bold text-gray-600 mb-1">No orders yet</p>
              <p className="text-sm">Your orders will appear here after checkout.</p>
              <Link href="/shop" className="inline-block mt-5 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition">
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-300 transition">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-black text-sm font-mono">{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.payment}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${STATUS_BADGE[order.status] ?? STATUS_BADGE.Pending}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate">
                          {item.name}
                          {item.size && <span className="text-gray-400"> · Size {item.size}</span>}
                          <span className="text-gray-400"> × {item.quantity}</span>
                        </span>
                        <span className="font-semibold ml-4 shrink-0">₱{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <Link href="/track-order" className="text-xs font-semibold text-gray-500 hover:text-black transition underline">
                      Track order →
                    </Link>
                    <span className="font-black text-sm">₱{order.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
