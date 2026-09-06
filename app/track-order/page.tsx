"use client";

import { useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

type Order = {
  id: string;
  date: string;
  customer: { name: string; contact: string; address: string };
  payment: string;
  items: OrderItem[];
  total: number;
};

const STATUSES = [
  {
    key: "placed",
    label: "Order Placed",
    desc: "We received your order.",
    icon: "📋",
  },
  {
    key: "processing",
    label: "Processing",
    desc: "We're preparing your shoes.",
    icon: "⚙️",
  },
  {
    key: "shipped",
    label: "Shipped",
    desc: "Your order is on the way.",
    icon: "🚚",
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Order successfully delivered.",
    icon: "✅",
  },
];

// For demo: all orders from localStorage are at "shipped" (index 2)
const DEMO_STATUS_INDEX = 2;

export default function TrackOrderPage() {
  const [input, setInput]     = useState("");
  const [order, setOrder]     = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  function handleTrack() {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;

    setSearched(true);
    setNotFound(false);
    setOrder(null);

    // Look up in localStorage
    const saved = localStorage.getItem("last_order");
    if (saved) {
      const parsed: Order = JSON.parse(saved);
      if (parsed.id.toUpperCase() === trimmed) {
        setOrder(parsed);
        return;
      }
    }
    setNotFound(true);
  }

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
          <p className="text-gray-400 text-sm">Enter your Order ID to see the latest status of your delivery.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Order ID
          </label>
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
              className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition shrink-0"
            >
              Track Order
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💡 Your Order ID was shown on the order confirmation page after checkout.
          </p>
        </div>

        {/* Not Found */}
        {searched && notFound && (
          <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h2 className="font-black text-lg mb-1">Order Not Found</h2>
            <p className="text-gray-400 text-sm mb-4">
              We couldn't find an order with ID <span className="font-bold text-gray-700">"{input.trim()}"</span>.
            </p>
            <p className="text-xs text-gray-400">
              Make sure you entered the correct Order ID from your confirmation page.
            </p>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="space-y-5">

            {/* Order Info Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order ID</p>
                  <p className="font-black text-lg font-mono">{order.id}</p>
                </div>
                <span className="bg-yellow-50 text-yellow-600 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-100">
                  In Transit
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-semibold">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date Ordered</p>
                  <p className="font-semibold">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Payment</p>
                  <p className="font-semibold">{order.payment}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Contact</p>
                  <p className="font-semibold">{order.customer.contact}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Delivery Address</p>
                  <p className="font-semibold">{order.customer.address}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-base mb-6">Order Status</h2>

              <div className="relative">
                {STATUSES.map((status, i) => {
                  const isDone    = i < DEMO_STATUS_INDEX;
                  const isCurrent = i === DEMO_STATUS_INDEX;
                  const isPending = i > DEMO_STATUS_INDEX;

                  return (
                    <div key={status.key} className="flex gap-4 relative">

                      {/* Line connector */}
                      {i < STATUSES.length - 1 && (
                        <div className={`absolute left-[19px] top-10 w-0.5 h-full -mb-2 ${
                          isDone ? "bg-green-400" : "bg-gray-100"
                        }`} />
                      )}

                      {/* Circle */}
                      <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center z-10 border-2 transition ${
                        isDone
                          ? "bg-green-500 border-green-500"
                          : isCurrent
                          ? "bg-black border-black"
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

                      {/* Text */}
                      <div className={`pb-8 flex-1 ${isPending ? "opacity-40" : ""}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{status.icon}</span>
                          <p className={`font-bold text-sm ${isCurrent ? "text-black" : isDone ? "text-green-600" : "text-gray-400"}`}>
                            {status.label}
                          </p>
                          {isCurrent && (
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-semibold">
                              Current
                            </span>
                          )}
                          {isDone && (
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-semibold">
                              Done
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 ml-7">{status.desc}</p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-base mb-4">Items Ordered</h2>

              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img src={item.image || "https://placehold.co/100"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.size && `Size ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color}
                        {" · "}Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-black shrink-0">₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-3" />

              <div className="flex justify-between items-center">
                <span className="font-black">Total</span>
                <span className="text-xl font-black">₱{order.total.toLocaleString()}</span>
              </div>
            </div>

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
