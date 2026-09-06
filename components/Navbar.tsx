"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          href="/"
          className="text-2xl font-black"
        >
          ShoeShop
        </Link>

        <div className="hidden md:flex gap-7">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/track-order">
            Track Order
          </Link>
          <Link href="/admin">
            Admin
          </Link>
        </div>

        <Link
          href="/cart"
          className="relative"
        >
          <ShoppingCart size={25} />

          {totalItems > 0 && (
            <span className="absolute -top-3 -right-3 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}