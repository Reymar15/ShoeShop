"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  date: string;
  customer: { name: string; contact: string; address: string };
  payment: string;
  items: { id: number; name: string; image: string; price: number; quantity: number; size?: string; color?: string }[];
  total: number;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("last_order");
    if (saved) setOrder(JSON.parse(saved));
  }, []);

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-5xl mb-4">📦</p>
          <h1 className="text-2xl font-black mb-2">No order found</h1>
          <Link href="/shop" className="text-sm underline text-gray-500 hover:text-black">Go to Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Success Banner */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Order Placed!</h1>
          <p className="text-gray-400 text-sm">Thank you, <span className="font-bold text-gray-700">{order.customer.name}</span>! Your order has been received.</p>

          <div className="mt-5 inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-5 py-2.5">
            <span className="text-xs text-gray-400 font-medium">Order ID</span>
            <span className="font-black text-sm text-gray-800">{order.id}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-black text-base mb-4">Order Details</h2>

          <div className="grid grid-cols-2 gap-4 text-sm mb-5">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
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
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
              <span className="inline-block bg-yellow-50 text-yellow-600 text-xs font-bold px-2.5 py-1 rounded-full">
                Processing
              </span>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Delivery Address</p>
              <p className="font-semibold">{order.customer.address}</p>
            </div>
          </div>

          <hr className="border-gray-100 mb-4" />

          {/* Items */}
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                  <img src={item.image || "https://placehold.co/100"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {item.size && `Size ${item.size}`}{item.size && item.color && " · "}{item.color}
                    {" · "}Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-black shrink-0">₱{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <hr className="border-gray-100 mb-3" />

          <div className="flex justify-between items-center">
            <span className="font-black">Total Paid</span>
            <span className="text-xl font-black">₱{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/shop"
            className="flex-1 text-center bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 text-center border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:border-black hover:text-black transition"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
