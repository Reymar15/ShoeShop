"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getOrders } from "@/lib/store";
import type { Order } from "@/lib/store";
import type { Product } from "@/types/product";

const STATUS_STYLES: Record<string, string> = {
  Pending:    "bg-yellow-50 text-yellow-600 border-yellow-100",
  Processing: "bg-blue-50 text-blue-600 border-blue-100",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-100",
  Delivered:  "bg-green-50 text-green-600 border-green-100",
  Cancelled:  "bg-red-50 text-red-500 border-red-100",
};

const MONTHLY_SALES = [
  { month: "Aug", sales: 38200 }, { month: "Sep", sales: 52400 },
  { month: "Oct", sales: 47800 }, { month: "Nov", sales: 61500 },
  { month: "Dec", sales: 89300 }, { month: "Jan", sales: 73600 },
  { month: "Feb", sales: 55900 }, { month: "Mar", sales: 68400 },
  { month: "Apr", sales: 79200 }, { month: "May", sales: 91500 },
  { month: "Jun", sales: 84700 }, { month: "Jul", sales: 96300 },
];

function BarChart({ data }: { data: { month: string; sales: number }[] }) {
  const max = Math.max(...data.map((d) => d.sales));
  return (
    <div className="flex items-end gap-1.5 h-40 w-full">
      {data.map((d, i) => {
        const pct = Math.round((d.sales / max) * 100);
        const isLast = i === data.length - 1;
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="opacity-0 group-hover:opacity-100 transition text-xs font-bold bg-gray-900 text-white px-2 py-1 rounded-lg whitespace-nowrap">
              ₱{d.sales.toLocaleString()}
            </div>
            <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
              <div className={`w-full rounded-t-lg transition-all duration-500 ${isLast ? "bg-black" : "bg-gray-200 group-hover:bg-gray-400"}`} style={{ height: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-400 font-medium">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders,   setOrders]   = useState<Order[]>([]);

  useEffect(() => {
    setProducts(getProducts());
    setOrders(getOrders());
  }, []);

  const totalSales    = orders.reduce((s, o) => s + o.total_amount, 0);
  const totalCustomers = [...new Set(orders.map((o) => o.customer_email))].length;
  const pendingCount  = orders.filter((o) => o.status === "Pending").length;
  const lowStock      = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock    = products.filter((p) => p.stock === 0).length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const topProducts  = [...products].sort((a, b) => b.sold_quantity - a.sold_quantity).slice(0, 5);

  const CATEGORIES: Record<number, string> = { 1: "Sneakers", 2: "Running Shoes", 3: "Basketball Shoes", 4: "Casual Shoes", 5: "Formal Shoes", 6: "Sandals" };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening in your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: "👟", label: "Total Products", value: String(products.length), sub: `${products.reduce((s,p)=>s+p.stock,0)} units in stock`, color: "bg-blue-50" },
          { icon: "📦", label: "Total Orders",   value: String(orders.length),   sub: `${pendingCount} pending`,                                color: "bg-orange-50" },
          { icon: "💰", label: "Total Sales",    value: `₱${totalSales.toLocaleString()}`, sub: "All time revenue",                            color: "bg-green-50" },
          { icon: "👥", label: "Total Customers",value: String(totalCustomers),  sub: `${lowStock} low stock · ${outOfStock} out`,             color: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>{s.icon}</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-3xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-lg">Monthly Sales</h2>
            <p className="text-xs text-gray-400 mt-0.5">Aug 2024 – Jul 2025</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black">₱{MONTHLY_SALES.reduce((s, m) => s + m.sales, 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total (12 months)</p>
          </div>
        </div>
        <BarChart data={MONTHLY_SALES} />
        <p className="text-xs text-gray-400 text-center mt-2">Hover bars to see values · Darkest = current month</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h2 className="font-black text-base">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-gray-400 hover:text-black transition">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="text-left px-6 py-3">Order ID</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-right px-6 py-3">Total</th>
                  <th className="text-center px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-gray-600">{order.id}</td>
                    <td className="px-6 py-4 font-semibold">{order.customer_name}</td>
                    <td className="px-6 py-4 text-right font-black">₱{order.total_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status] ?? STATUS_STYLES.Pending}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h2 className="font-black text-base">Top Products</h2>
            <Link href="/admin/products" className="text-xs font-semibold text-gray-400 hover:text-black transition">View All →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.map((p, i) => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-3">
                <span className="text-xs font-black text-gray-300 w-4 shrink-0">#{i + 1}</span>
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                  <img src={p.image_url || "https://placehold.co/80"} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sold_quantity} sold · ₱{Number(p.price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="font-black text-base mb-5">Products by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(CATEGORIES).map(([id, name]) => {
            const count = products.filter((p) => p.category_id === Number(id)).length;
            const pct   = products.length ? Math.round((count / products.length) * 100) : 0;
            return (
              <div key={id} className="text-center">
                <div className="bg-gray-50 rounded-xl p-4 mb-2">
                  <p className="text-2xl font-black">{count}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pct}%</p>
                </div>
                <p className="text-xs font-semibold text-gray-600 leading-tight">{name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
