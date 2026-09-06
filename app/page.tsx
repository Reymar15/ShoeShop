"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

const SLIDES = [
  {
    badge: "New Collection 2025",
    title: "Find Your\nPerfect Pair",
    desc: "Discover stylish, comfortable, and high-quality shoes for every occasion — from casual walks to formal events.",
    cta: { label: "Shop Now →", href: "/shop" },
    ctaSecondary: { label: "Browse Categories", href: "/categories" },
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    badge2: { top: "Starting from", bottom: "₱999" },
    bg: "from-gray-900 via-gray-800 to-gray-900",
  },
  {
    badge: "Limited Time Deal",
    title: "Running Shoes\nUp to 40% Off",
    desc: "Lightweight, breathable, and built for performance. Find your perfect running companion today.",
    cta: { label: "Shop Running →", href: "/shop?category=2" },
    ctaSecondary: { label: "View All Deals", href: "/shop" },
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    badge2: { top: "Save up to", bottom: "40% Off" },
    bg: "from-blue-950 via-blue-900 to-blue-950",
  },
  {
    badge: "New Arrivals",
    title: "Formal Collection\nFor Every Occasion",
    desc: "Elevate your style with our premium formal shoe collection. Perfect for work, events, and beyond.",
    cta: { label: "Shop Formal →", href: "/shop?category=5" },
    ctaSecondary: { label: "All Categories", href: "/categories" },
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800",
    badge2: { top: "New In", bottom: "2025" },
    bg: "from-stone-900 via-stone-800 to-stone-900",
  },
  {
    badge: "Best Sellers",
    title: "Sneakers\nEveryone Loves",
    desc: "Our most popular sneakers are back in stock. Grab yours before they sell out again!",
    cta: { label: "Shop Sneakers →", href: "/shop?category=1" },
    ctaSecondary: { label: "Best Sellers", href: "/shop" },
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800",
    badge2: { top: "Most Popular", bottom: "#1 Pick" },
    bg: "from-zinc-900 via-zinc-800 to-zinc-900",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  // Auto-play every 5s
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className={`relative bg-gradient-to-br ${slide.bg} text-white overflow-hidden transition-all duration-500`}>
      {/* decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center min-h-[580px]">

        {/* Text */}
        <div key={current} className="animate-fade-in">
          <span className="inline-block text-xs font-bold tracking-widest uppercase bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6">
            {slide.badge}
          </span>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-6 whitespace-pre-line">
            {slide.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed mb-10">
            {slide.desc}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={slide.cta.href} className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition text-sm">
              {slide.cta.label}
            </Link>
            <Link href={slide.ctaSecondary.href} className="border border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition text-sm">
              {slide.ctaSecondary.label}
            </Link>
          </div>
          {/* Stats */}
          <div className="flex gap-8 mt-12 text-center">
            {[["500+", "Products"], ["50+", "Brands"], ["10k+", "Happy Customers"]].map(([num, label]) => (
              <div key={label}>
                <p className="text-2xl font-black">{num}</p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="relative" key={`img-${current}`}>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-[460px] object-cover rounded-3xl shadow-2xl"
          />
          <div className="absolute bottom-6 left-6 bg-white text-black rounded-2xl px-5 py-3 shadow-xl">
            <p className="text-xs text-gray-400 font-medium">{slide.badge2.top}</p>
            <p className="text-xl font-black">{slide.badge2.bottom}</p>
          </div>
        </div>

      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
        aria-label="Previous"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
        aria-label="Next"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

const CATEGORIES = [
  { id: 1, name: "Sneakers",          emoji: "👟", bg: "bg-blue-50",   border: "border-blue-100" },
  { id: 2, name: "Running Shoes",     emoji: "🏃", bg: "bg-green-50",  border: "border-green-100" },
  { id: 3, name: "Basketball Shoes",  emoji: "🏀", bg: "bg-orange-50", border: "border-orange-100" },
  { id: 4, name: "Casual Shoes",      emoji: "🥿", bg: "bg-yellow-50", border: "border-yellow-100" },
  { id: 5, name: "Formal Shoes",      emoji: "👞", bg: "bg-gray-100",  border: "border-gray-200" },
  { id: 6, name: "Sandals",           emoji: "🩴", bg: "bg-red-50",    border: "border-red-100" },
];

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-black">{title}</h2>
      <Link href={href} className="text-sm font-medium border border-gray-300 px-4 py-2 rounded-xl hover:border-black hover:bg-black hover:text-white transition">
        View All →
      </Link>
    </div>
  );
}

function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
      ))}
    </>
  );
}

export default function Home() {
  const [featured,    setFeatured]    = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    if (!supabase) { setLoading(false); return; }

    const [featuredRes, newRes, bestRes] = await Promise.all([
      supabase.from("products").select("*").limit(4),
      supabase.from("products").select("*").order("created_at", { ascending: false }).limit(4),
      supabase.from("products").select("*").order("sold_quantity", { ascending: false }).limit(4),
    ]);

    if (!featuredRes.error) setFeatured(featuredRes.data || []);
    if (!newRes.error)      setNewArrivals(newRes.data || []);
    if (!bestRes.error)     setBestSellers(bestRes.data || []);
    setLoading(false);
  }

  return (
    <>

      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel />

      {/* ── PROMO BANNER ── */}
      <section className="bg-black text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm font-medium">
          {["🚚 Free Shipping on Orders ₱2,000+", "🔄 30-Day Easy Returns", "✅ 100% Authentic Products", "🎁 Gift Wrapping Available"].map((text) => (
            <span key={text} className="opacity-80 hover:opacity-100 transition">{text}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURED SHOES ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionHeader title="Featured Shoes" href="/shop" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading || featured.length === 0
            ? <SkeletonGrid />
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── PROMOTIONAL BANNER ── */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden h-52 group">
            <img
              src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"
              alt="Running Shoes Sale"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
              <p className="text-white/70 text-sm font-medium mb-1">Limited Time</p>
              <h3 className="text-white text-2xl font-black mb-3">Running Shoes<br />Up to 40% Off</h3>
              <Link href="/shop?category=2" className="inline-block bg-white text-black text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition w-fit">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden h-52 group">
            <img
              src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800"
              alt="Formal Shoes"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
              <p className="text-white/70 text-sm font-medium mb-1">New Arrivals</p>
              <h3 className="text-white text-2xl font-black mb-3">Formal Collection<br />For Every Occasion</h3>
              <Link href="/shop?category=5" className="inline-block bg-white text-black text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition w-fit">
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="New Arrivals" href="/shop" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading || newArrivals.length === 0
              ? <SkeletonGrid />
              : newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionHeader title="Best Sellers" href="/shop" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading || bestSellers.length === 0
            ? <SkeletonGrid />
            : bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black">Shop by Category</h2>
            <Link href="/categories" className="text-sm font-medium border border-gray-300 px-4 py-2 rounded-xl hover:border-black hover:bg-black hover:text-white transition">
              All Categories →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={`${cat.bg} ${cat.border} border rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center`}
              >
                <span className="text-4xl">{cat.emoji}</span>
                <span className="font-bold text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM PROMO BANNER ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white px-10 py-16 text-center">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative">
            <p className="text-sm font-semibold tracking-widest uppercase text-gray-300 mb-3">Special Offer</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Get 20% Off Your First Order</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Sign up and use code <span className="font-black text-white bg-white/10 px-2 py-0.5 rounded">FIRST20</span> at checkout.
            </p>
            <Link href="/shop" className="inline-block bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition">
              Shop Now & Save
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
