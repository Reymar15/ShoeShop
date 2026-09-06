"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  /* ── Empty State ── */
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-2">Your cart is empty</h1>
          <p className="text-gray-400 mb-8">Add some shoes to get started!</p>
          <Link href="/shop" className="inline-block bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition">
            Browse Shoes →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-7 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Shopping Cart</h1>
            <p className="text-gray-400 text-sm mt-0.5">{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-600 font-semibold border border-red-100 hover:border-red-300 px-4 py-2 rounded-xl transition"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Column headers */}
            <div className="hidden md:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-widest px-5 pb-3 border-b border-gray-200">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-center">Subtotal</span>
            </div>

            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="grid grid-cols-12 gap-3 items-center">

                  {/* Product */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img
                        src={item.image || "https://placehold.co/200x200"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm leading-snug line-clamp-2">{item.name}</h3>

                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {item.size && (
                          <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                            {item.color}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-semibold transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <p className="text-xs text-gray-400 font-medium md:hidden mb-0.5">Price</p>
                    <p className="font-bold text-sm">₱{item.price.toLocaleString()}</p>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-gray-50 transition text-gray-600"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-gray-50 transition text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <p className="text-xs text-gray-400 font-medium md:hidden mb-0.5">Subtotal</p>
                    <p className="font-black text-sm">₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black border border-gray-200 hover:border-black px-5 py-3 rounded-xl transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>

          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">

              <h2 className="text-xl font-black mb-5">Order Summary</h2>

              {/* Item breakdown */}
              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-2">
                    <span className="text-sm text-gray-500 leading-snug flex-1">
                      {item.name}
                      <span className="text-gray-400"> × {item.quantity}</span>
                    </span>
                    <span className="text-sm font-bold text-gray-800 shrink-0">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Subtotal */}
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-semibold">₱{cartTotal.toLocaleString()}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-black">Total</span>
                <span className="text-2xl font-black">₱{cartTotal.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-black text-base hover:bg-gray-800 transition"
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <p className="text-center text-xs text-gray-400 mt-4">
                🔒 Secure checkout · Free returns
              </p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
