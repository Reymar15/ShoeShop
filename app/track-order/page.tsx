"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type OrderItem = {
  id: number;
  product_name: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  payment_method: string;
  subtotal: number | null;
  shipping_fee: number | null;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
};

const STEPS = [
  { key: "Pending",    label: "Order Placed",  desc: "We received your order.",       icon: "📋" },
  { key: "Processing", label: "Processing",    desc: "We're preparing your shoes.",   icon: "⚙️" },
  { key: "Shipped",    label: "Shipped",       desc: "Your order is on the way.",     icon: "🚚" },
  { key: "Delivered",  label: "Delivered",     desc: "Order successfully delivered.", icon: "✅" },
];

const STATUS_BADGE: Record<string, string> = {
  Pending:    "bg-yellow-50 text-yellow-600 border-yellow-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-200",
  Delivered:  "bg-green-50 text-green-600 border-green-200",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return iso; }
}

export default function TrackOrderPage() {
  const [input,    setInput]    = useState("");
  const [order,    setOrder]    = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleTrack() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setSearched(true);
    setNotFound(false);
    setOrder(null);

    if (supabase) {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", trimmed)
        .single();

      if (!error && data) {
        setOrder(data);
        setLoading(false);
        return;
      }
    }

    /* Fallback: localStorage */
    const saved = localStorage.getItem("last_order");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed.id === trimmed ||
        parsed.id?.toUpperCase() === trimmed.toUpperCase()
      ) {
        setOrder({
          id:             parsed.id,
          customer_name:  parsed.customer?.name    ?? "",
          customer_email: parsed.customer?.email   ?? null,
          customer_phone: parsed.customer?.contact ?? null,
          address:        parsed.customer?.address ?? null,
          city:           parsed.customer?.city    ?? null,
          province:       parsed.customer?.province ?? null,
          postal_code:    parsed.customer?.postal_code ?? null,
          payment_method: parsed.payment ?? "",
          subtotal:       null,
          shipping_fee:   null,
          total_amount:   parsed.total ?? 0,
          status:         "Pending",
          created_at:     new Date().toISOString(),
          order_items:    parsed.items?.map((i: {
            id: number; name: string; size?: string; color?: string;
            price: number; quantity: number;
          }) => ({
            id:           i.id,
            product_name: i.name,
            size:         i.size  ?? null,
            color:        i.color ?? null,
            price:        i.price,
            quantity:     i.quantity,
            subtotal:     i.price * i.quantity,
          })),
        });
        setLoading(false);
        return;
      }
    }

    setNotFound(true);
    setLoading(false);
  }

  const currentStepIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  const deliveryAddress = order
    ? [order.address, order.city, order.province, order.postal_code].filter(Boolean).join(", ")
    : "";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black mb-2">Track Your Order</h1>
          <p className="text-gray-400 text-sm">Enter your Order ID to see the latest delivery status.</p>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Order ID</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="e.g. ORD-1234567890"
              className="flex-1 border-2 border-gray-100 focus:border-black rounded-xl px-4 py-3 text-sm font-mono focus:outline-none transition"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition shrink-0 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? "Searching…" : "Track Order"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">💡 Your Order ID was shown on the confirmation page after checkout.</p>
        </div>

        {/* Not Found */}
        {searched && notFound && !loading && (
          <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h2 className="font-black text-lg mb-1">Order Not Found</h2>
            <p className="text-gray-400 text-sm mb-2">
              No order found with ID <span className="font-bold text-gray-700">"{input.trim()}"</span>.
            </p>
            <p className="text-xs text-gray-400">Double-check your Order ID from the confirmation page.</p>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="space-y-5">

            {/* Order Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order ID</p>
                  <p className="font-black text-xl font-mono">{order.id}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_BADGE[order.status] ?? STATUS_BADGE.Pending}`}>
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {([
                  ["Customer",     order.customer_name],
                  ["Date Ordered", formatDate(order.created_at)],
                  ["Payment",      order.payment_method],
                  ["Contact",      order.customer_phone],
                  ["Email",        order.customer_email],
                ] as [string, string | null][]).filter(([, v]) => v).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
                {deliveryAddress && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Delivery Address</p>
                    <p className="font-semibold">{deliveryAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-base mb-6">Order Status</h2>
              <div className="relative">
                {STEPS.map((step, i) => {
                  const isDone    = i < currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const isPending = i > currentStepIndex;
                  return (
                    <div key={step.key} className="flex gap-4 relative">
                      {i < STEPS.length - 1 && (
                        <div className={`absolute left-[19px] top-10 w-0.5 h-full ${isDone ? "bg-green-400" : "bg-gray-100"}`} />
                      )}
                      <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center z-10 border-2 transition ${
                        isDone    ? "bg-green-500 border-green-500"
                        : isCurrent ? "bg-black border-black"
                        : "bg-white border-gray-200"
                      }`}>
                        {isDone ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        ) : isCurrent ? (
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-200 rounded-full" />
                        )}
                      </div>
                      <div className={`pb-8 flex-1 ${isPending ? "opacity-35" : ""}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg">{step.icon}</span>
                          <p className={`font-bold text-sm ${isCurrent ? "text-black" : isDone ? "text-green-600" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {isCurrent && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-semibold">Current</span>}
                          {isDone    && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold border border-green-100">Done ✓</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 ml-7">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-base mb-4">Items Ordered</h2>
                <div className="space-y-3 mb-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{item.product_name}</p>
                        <p className="text-xs text-gray-400">
                          {item.size  && `Size ${item.size}`}
                          {item.size && item.color && " · "}
                          {item.color}
                          {" · "}Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-black shrink-0">₱{Number(item.subtotal).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <hr className="border-gray-100 mb-3" />
                {order.shipping_fee != null && (
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Shipping Fee</span>
                    <span>₱{Number(order.shipping_fee).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-black">Total</span>
                  <span className="text-xl font-black">₱{Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/shop" className="flex-1 text-center bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition">
                Continue Shopping
              </Link>
              <button
                onClick={() => { setOrder(null); setInput(""); setSearched(false); }}
                className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:border-black hover:text-black transition"
              >
                Track Another Order
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
