"use client";

import Link from "next/link";
import { ShoppingCart, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="text-2xl font-black tracking-tight">
          ShoeShop
        </Link>

        <div className="hidden md:flex gap-7 text-sm font-medium">
          <Link href="/" className="hover:text-gray-500 transition">Home</Link>
          <Link href="/shop" className="hover:text-gray-500 transition">Shop</Link>
          <Link href="/categories" className="hover:text-gray-500 transition">Categories</Link>
          <Link href="/track-order" className="hover:text-gray-500 transition">Track Order</Link>
          <Link href="/about" className="hover:text-gray-500 transition">About</Link>
          <Link href="/contact" className="hover:text-gray-500 transition">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin" className="hidden md:flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            <LayoutDashboard size={16} />
            Admin Dashboard
          </Link>

          <Link href="/cart" className="relative">
            <ShoppingCart size={25} />
            {totalItems > 0 && (
              <span className="absolute -top-3 -right-3 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}
