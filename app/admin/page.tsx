"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

const CATEGORIES: Record<number, string> = {
  1: "Sneakers", 2: "Running Shoes", 3: "Basketball Shoes",
  4: "Casual Shoes", 5: "Formal Shoes", 6: "Sandals",
};

const DEMO_ORDERS = [
  { id: "ORD-001", customer: "Juan Dela Cruz",  total: 7995,  status: "Pending",    date: "Jan 15, 2025", payment: "Cash on Delivery" },
  { id: "ORD-002", customer: "Maria Santos",    total: 12500, status: "Shipped",    date: "Jan 14, 2025", payment: "GCash" },
  { id: "ORD-003", customer: "Mark Reyes",      total: 4999,  status: "Delivered",  date: "Jan 13, 2025", payment: "Bank Transfer" },
  { id: "ORD-004", customer: "Ana Gonzales",    total: 8750,  status: "Processing", date: "Jan 12, 2025", payment: "Cash on Delivery" },
  { id: "ORD-005", customer: "Carlo Mendoza",   total: 15200, status: "Delivered",  date: "Jan 11, 2025", payment: "GCash" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending:    "bg-yellow-50 text-yellow-600 border-yellow-100",
  Processing: "bg-blue-50 text-blue-600 border-blue-100",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-100",
  Delivered:  "bg-green-50 text-green-600 border-green-100",
  Cancelled:  "bg-red-50 text-red-500 border-red-100",
};

function StatCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("products").select("*").order("sold_quantity", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  const totalSales    = products.reduce((s, p) => s + Number(p.price) * p.sold_quantity, 0);
  const totalStock    = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock    = products.filter((p) => p.stock === 0).length;

  // Merge demo orders with last_order from localStorage
  const [allOrders, setAllOrders] = useState(DEMO_ORDERS);
  useEffect(() => {
    const saved = localStorage.getItem("last_order");
    if (saved) {
      const o = JSON.parse(saved);
      setAllOrders([
        {
          id: o.id,
          customer: o.customer.name,
          total: o.total,
          status: "Processing",
          date: o.date,
          payment: o.payment,
        },
        ...DEMO_ORDERS,
      ]);
    }
  }, []);

  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0) + totalSales;

  return (
    <div className="space-y-8">

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening in your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon="👟" label="Total Products" value={loading ? "—" : String(products.length)}  sub={`${totalStock} units in stock`}       color="bg-blue-50" />
        <StatCard icon="📦" label="Total Orders"   value={String(allOrders.length)}                 sub={`${allOrders.filter(o=>o.status==="Pending").length} pending`} color="bg-orange-50" />
        <StatCard icon="💰" label="Total Sales"    value={`₱${totalRevenue.toLocaleString()}`}      sub="All time revenue"                     color="bg-green-50" />
        <StatCard icon="⚠️" label="Low Stock"      value={loading ? "—" : String(lowStockCount)}    sub={`${outOfStock} out of stock`}          color="bg-red-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h2 className="font-black text-base">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-gray-400 hover:text-black transition">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="text-left px-6 py-3">Order ID</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Payment</th>
                  <th className="text-right px-6 py-3">Total</th>
                  <th className="text-center px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-gray-600">{order.id}</td>
                    <td className="px-6 py-4 font-semibold">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{order.payment}</td>
                    <td className="px-6 py-4 text-right font-black">₱{order.total.toLocaleString()}</td>
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
            <Link href="/admin/products" className="text-xs font-semibold text-gray-400 hover:text-black transition">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))
              : products.slice(0, 5).map((p, i) => (
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
      {!loading && products.length > 0 && (
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
      )}

    </div>
  );
}
