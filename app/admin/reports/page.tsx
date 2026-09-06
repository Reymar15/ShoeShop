"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

/* ── Demo monthly sales data ── */
const MONTHLY_SALES = [
  { month: "Aug", sales: 38200 },
  { month: "Sep", sales: 52400 },
  { month: "Oct", sales: 47800 },
  { month: "Nov", sales: 61500 },
  { month: "Dec", sales: 89300 },
  { month: "Jan", sales: 73600 },
  { month: "Feb", sales: 55900 },
  { month: "Mar", sales: 68400 },
  { month: "Apr", sales: 79200 },
  { month: "May", sales: 91500 },
  { month: "Jun", sales: 84700 },
  { month: "Jul", sales: 96300 },
];

const DEMO_ORDERS = [
  { total: 7995,  status: "Pending",   payment: "Cash on Delivery" },
  { total: 12500, status: "Shipped",   payment: "GCash" },
  { total: 4999,  status: "Delivered", payment: "Bank Transfer" },
  { total: 8750,  status: "Processing",payment: "Cash on Delivery" },
  { total: 15200, status: "Delivered", payment: "GCash" },
];

const PAYMENT_COLORS: Record<string, string> = {
  "Cash on Delivery": "bg-yellow-400",
  "GCash":            "bg-blue-500",
  "Bank Transfer":    "bg-green-500",
};

/* ── Bar Chart (pure CSS) ── */
function BarChart({ data }: { data: { month: string; sales: number }[] }) {
  const max = Math.max(...data.map((d) => d.sales));
  return (
    <div className="flex items-end gap-2 h-48 w-full">
      {data.map((d, i) => {
        const pct = Math.round((d.sales / max) * 100);
        const isLast = i === data.length - 1;
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 transition text-xs font-bold bg-gray-900 text-white px-2 py-1 rounded-lg whitespace-nowrap">
              ₱{d.sales.toLocaleString()}
            </div>
            {/* Bar */}
            <div className="w-full flex items-end justify-center" style={{ height: "160px" }}>
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${isLast ? "bg-black" : "bg-gray-200 group-hover:bg-gray-400"}`}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 font-medium">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Horizontal bar for top sellers ── */
function HBar({ label, value, max, rank, image }: {
  label: string; value: number; max: number; rank: number; image?: string | null;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const colors = ["bg-black", "bg-gray-700", "bg-gray-500", "bg-gray-400", "bg-gray-300"];
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-black text-gray-300 w-5 shrink-0 text-right">#{rank}</span>
      <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
        <img src={image || "https://placehold.co/80"} alt={label} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold truncate">{label}</span>
          <span className="text-xs font-black text-gray-500 ml-2 shrink-0">{value} sold</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colors[rank - 1] ?? "bg-gray-300"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Donut-style payment breakdown ── */
function PaymentBreakdown({ orders }: { orders: { payment: string }[] }) {
  const counts: Record<string, number> = {};
  orders.forEach((o) => { counts[o.payment] = (counts[o.payment] || 0) + 1; });
  const total = orders.length;
  return (
    <div className="space-y-3">
      {Object.entries(counts).map(([method, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={method}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-gray-700">{method}</span>
              <span className="font-black">{pct}% <span className="text-gray-400 font-normal">({count})</span></span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${PAYMENT_COLORS[method] ?? "bg-gray-400"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Page ── */
export default function SalesReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [allOrders, setAllOrders] = useState(DEMO_ORDERS);

  useEffect(() => {
    loadProducts();
    const saved = localStorage.getItem("last_order");
    if (saved) {
      const o = JSON.parse(saved);
      setAllOrders([{ total: o.total, status: "Processing", payment: o.payment }, ...DEMO_ORDERS]);
    }
  }, []);

  async function loadProducts() {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("products").select("*").order("sold_quantity", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  /* ── Computed stats ── */
  const totalProductSales = products.reduce((s, p) => s + Number(p.price) * p.sold_quantity, 0);
  const orderRevenue      = allOrders.reduce((s, o) => s + o.total, 0);
  const totalRevenue      = totalProductSales + orderRevenue;
  const totalSold         = products.reduce((s, p) => s + p.sold_quantity, 0);
  const avgOrderValue     = allOrders.length ? Math.round(orderRevenue / allOrders.length) : 0;
  const deliveredOrders   = allOrders.filter((o) => o.status === "Delivered").length;

  // Today's sales = last 2 months average / 30
  const dailySales = Math.round(
    (MONTHLY_SALES.slice(-2).reduce((s, m) => s + m.sales, 0) / 2) / 30
  );
  // This month = last entry
  const monthlySales = MONTHLY_SALES[MONTHLY_SALES.length - 1].sales;

  const topSellers = products.slice(0, 5);
  const maxSold    = topSellers[0]?.sold_quantity || 1;

  const CATEGORIES: Record<number, { name: string; emoji: string }> = {
    1: { name: "Sneakers",         emoji: "👟" },
    2: { name: "Running Shoes",    emoji: "🏃" },
    3: { name: "Basketball Shoes", emoji: "🏀" },
    4: { name: "Casual Shoes",     emoji: "🥿" },
    5: { name: "Formal Shoes",     emoji: "👞" },
    6: { name: "Sandals",          emoji: "🩴" },
  };

  const catSales = Object.entries(CATEGORIES).map(([id, cat]) => {
    const catProducts = products.filter((p) => p.category_id === Number(id));
    const revenue = catProducts.reduce((s, p) => s + Number(p.price) * p.sold_quantity, 0);
    const sold    = catProducts.reduce((s, p) => s + p.sold_quantity, 0);
    return { ...cat, revenue, sold, count: catProducts.length };
  }).sort((a, b) => b.revenue - a.revenue);

  const maxCatRevenue = catSales[0]?.revenue || 1;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">Sales Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Analytics and performance overview of your store.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: "💰", label: "Total Revenue",    value: `₱${totalRevenue.toLocaleString()}`,   sub: "All time",                  color: "bg-green-50",  text: "text-green-700" },
          { icon: "📅", label: "This Month",        value: `₱${monthlySales.toLocaleString()}`,   sub: "July 2025",                 color: "bg-blue-50",   text: "text-blue-700" },
          { icon: "☀️", label: "Est. Daily Sales",  value: `₱${dailySales.toLocaleString()}`,     sub: "Based on last 2 months",    color: "bg-yellow-50", text: "text-yellow-700" },
          { icon: "📦", label: "Total Orders",      value: String(allOrders.length),              sub: `${deliveredOrders} delivered`, color: "bg-purple-50", text: "text-purple-700" },
          { icon: "👟", label: "Total Products",    value: loading ? "—" : String(products.length), sub: `${totalSold} units sold`, color: "bg-orange-50", text: "text-orange-700" },
          { icon: "🛒", label: "Units Sold",        value: loading ? "—" : String(totalSold),     sub: "Across all products",       color: "bg-pink-50",   text: "text-pink-700" },
          { icon: "💳", label: "Avg Order Value",   value: `₱${avgOrderValue.toLocaleString()}`,  sub: "Per order",                 color: "bg-teal-50",   text: "text-teal-700" },
          { icon: "⭐", label: "Avg Rating",        value: loading ? "—" : (products.reduce((s, p) => s + p.rating, 0) / (products.length || 1)).toFixed(1), sub: "Product ratings", color: "bg-gray-50", text: "text-gray-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 border border-white shadow-sm`}>
            <span className="text-2xl">{s.icon}</span>
            <p className={`text-2xl font-black mt-2 ${s.text}`}>{s.value}</p>
            <p className="text-xs font-bold text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Monthly Sales Bar Chart ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
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
        <p className="text-xs text-gray-400 text-center mt-3">Hover over bars to see exact values · Darkest bar = current month</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ── Top Selling Shoes ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-black text-lg mb-1">Top Selling Shoes</h2>
          <p className="text-xs text-gray-400 mb-6">Ranked by units sold</p>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : topSellers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No product data available.</p>
          ) : (
            <div className="space-y-5">
              {topSellers.map((p, i) => (
                <HBar
                  key={p.id}
                  rank={i + 1}
                  label={p.name}
                  value={p.sold_quantity}
                  max={maxSold}
                  image={p.image_url}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Payment Method Breakdown ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-black text-lg mb-1">Payment Methods</h2>
          <p className="text-xs text-gray-400 mb-6">Order distribution by payment type</p>
          <PaymentBreakdown orders={allOrders} />

          <hr className="my-6 border-gray-50" />

          {/* Order Status Breakdown */}
          <h3 className="font-black text-sm mb-4">Order Status</h3>
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => {
            const count = allOrders.filter((o) => o.status === status).length;
            const pct   = allOrders.length ? Math.round((count / allOrders.length) * 100) : 0;
            const colors: Record<string, string> = {
              Pending: "bg-yellow-400", Processing: "bg-blue-400",
              Shipped: "bg-purple-400", Delivered: "bg-green-500", Cancelled: "bg-red-400",
            };
            return (
              <div key={status} className="flex items-center gap-3 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[status]}`} />
                <span className="text-sm text-gray-600 flex-1">{status}</span>
                <span className="text-sm font-black">{count}</span>
                <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── Sales by Category ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-black text-lg mb-1">Sales by Category</h2>
        <p className="text-xs text-gray-400 mb-6">Revenue and units sold per category</p>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {catSales.map((cat) => {
                const pct = maxCatRevenue > 0 ? Math.round((cat.revenue / maxCatRevenue) * 100) : 0;
                return (
                  <div key={cat.name} className="flex items-center gap-4">
                    <span className="text-xl w-7 shrink-0">{cat.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">{cat.name}</span>
                        <span className="font-black text-gray-700">₱{cat.revenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0 w-16">
                      <p className="text-xs font-black text-gray-600">{cat.sold} sold</p>
                      <p className="text-xs text-gray-400">{cat.count} items</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
