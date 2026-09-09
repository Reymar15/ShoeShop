"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, LayoutDashboard, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useState, useRef, useEffect } from "react";

const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/shop",       label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/track-order",label: "Track Order" },
  { href: "/about",      label: "About" },
  { href: "/contact",    label: "Contact" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useUser();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const initials = user?.fullName?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tight shrink-0 hover:opacity-80 transition">
          ShoeShop
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-gray-100 text-black" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">

          <Link href="/admin" className="hidden md:flex items-center gap-1.5 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-black transition">
            <LayoutDashboard size={14} /> Admin
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-2 border border-gray-200 hover:border-gray-400 rounded-xl px-2.5 py-1.5 transition">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-black">
                  {initials}
                </div>
                <span className="text-sm font-semibold hidden sm:block max-w-20 truncate">{user.fullName.split(" ")[0]}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-50 animate-scale-in">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold truncate">{user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                    <span className="text-base">👤</span> My Profile
                  </Link>
                  <Link href="/track-order" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
                    <span className="text-base">📦</span> Track Order
                  </Link>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                      <span className="text-base">🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login" className="text-sm font-semibold px-3 py-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition">
                Login
              </Link>
              <Link href="/register" className="text-sm font-bold px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                Register
              </Link>
            </div>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-50 transition">
            <ShoppingCart size={22} className="text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-xs w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center font-bold text-[10px]">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1 animate-fade-in">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition ${pathname === href ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}>
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-1">
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              <LayoutDashboard size={16} /> Admin
            </Link>
            {!user && (
              <>
                <Link href="/login" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Login</Link>
                <Link href="/register" className="block px-3 py-2.5 rounded-xl text-sm font-bold bg-black text-white text-center">Register</Link>
              </>
            )}
            {user && (
              <button onClick={() => { setMobileOpen(false); logout(); }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
