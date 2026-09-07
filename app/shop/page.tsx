"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  { id: 1, name: "Sneakers",         emoji: "👟" },
  { id: 2, name: "Running Shoes",    emoji: "🏃" },
  { id: 3, name: "Basketball Shoes", emoji: "🏀" },
  { id: 4, name: "Casual Shoes",     emoji: "🥿" },
  { id: 5, name: "Formal Shoes",     emoji: "👞" },
  { id: 6, name: "Sandals",          emoji: "🩴" },
];

const SORT_OPTIONS = [
  { value: "",           label: "Default" },
  { value: "price-low",  label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az",    label: "Name: A → Z" },
  { value: "name-za",    label: "Name: Z → A" },
  { value: "popular",    label: "Most Popular" },
  { value: "rating",     label: "Highest Rated" },
];

function SkeletonCard() {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-gray-100 h-56 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageFallback() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="h-10 w-64 rounded bg-gray-100 animate-pulse" />
          <div className="mt-3 h-4 w-32 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    </main>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [brand, setBrand]               = useState("");
  const [sort, setSort]                 = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(
    categoryParam ? Number(categoryParam) : null
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => {
    setActiveCategory(categoryParam ? Number(categoryParam) : null);
  }, [categoryParam]);

  async function loadProducts() {
    setLoading(true);
    if (!supabase) { setProducts([]); setLoading(false); return; }
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
    setLoading(false);
  }

  const brands = [...new Set(products.map((p) => p.brand))].filter(Boolean);

  let filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const searchMatch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const brandMatch    = !brand          || p.brand === brand;
    const catMatch      = !activeCategory || p.category_id === activeCategory;
    const minMatch      = !minPrice       || Number(p.price) >= Number(minPrice);
    const maxMatch      = !maxPrice       || Number(p.price) <= Number(maxPrice);
    return searchMatch && brandMatch && catMatch && minMatch && maxMatch;
  });

  if (sort === "price-low")  filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price-high") filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "name-az")    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-za")    filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "popular")    filtered = [...filtered].sort((a, b) => b.sold_quantity - a.sold_quantity);
  if (sort === "rating")     filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const hasFilters = search || brand || activeCategory || minPrice || maxPrice || sort;

  function clearFilters() {
    setSearch(""); setBrand(""); setActiveCategory(null);
    setMinPrice(""); setMaxPrice(""); setSort("");
  }

  const activeCategoryName = CATEGORIES.find((c) => c.id === activeCategory)?.name;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-black">
            {activeCategoryName ?? "Shop All Shoes"}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {loading ? "Loading products…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Category Pills ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              !activeCategory ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-black text-white border-black"
                  : "bg-white border-gray-200 hover:border-black"
              }`}
            >
              <span>{cat.emoji}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* ── Active Filter Tags ── */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <span className="text-xs text-gray-400 font-medium">Active filters:</span>
            {search && (
              <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                Search: "{search}"
                <button onClick={() => setSearch("")} className="ml-1 hover:opacity-70">✕</button>
              </span>
            )}
            {activeCategory && (
              <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                {activeCategoryName}
                <button onClick={() => setActiveCategory(null)} className="ml-1 hover:opacity-70">✕</button>
              </span>
            )}
            {brand && (
              <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                {brand}
                <button onClick={() => setBrand("")} className="ml-1 hover:opacity-70">✕</button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                ₱{minPrice || "0"} – ₱{maxPrice || "∞"}
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="ml-1 hover:opacity-70">✕</button>
              </span>
            )}
            {sort && (
              <span className="flex items-center gap-1 bg-black text-white text-xs px-3 py-1 rounded-full">
                {SORT_OPTIONS.find(o => o.value === sort)?.label}
                <button onClick={() => setSort("")} className="ml-1 hover:opacity-70">✕</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-600 underline ml-1">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white border rounded-2xl p-5 space-y-6 sticky top-24">

              <p className="font-black text-base">Filters</p>

              {/* Search */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Search</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search shoes..."
                    className="w-full border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${!activeCategory ? "bg-black text-white font-semibold" : "hover:bg-gray-50"}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition flex items-center gap-2 ${
                        activeCategory === cat.id ? "bg-black text-white font-semibold" : "hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat.emoji}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₱" min={0}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                  <input
                    type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₱" min={0}
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full bg-black text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-800 transition"
                >
                  Clear All Filters
                </button>
              )}

            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1">

            {/* Mobile top bar */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 border bg-white rounded-xl px-4 py-2 text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4" />
                </svg>
                Filters
              </button>
              <select
                value={sort} onChange={(e) => setSort(e.target.value)}
                className="border bg-white rounded-xl px-3 py-2 text-sm focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Mobile sidebar drawer */}
            {sidebarOpen && (
              <div className="md:hidden bg-white border rounded-2xl p-5 mb-6 space-y-4">
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shoes..." className="w-full border rounded-xl p-3 text-sm"
                />
                <select value={activeCategory ?? ""} onChange={(e) => setActiveCategory(e.target.value ? Number(e.target.value) : null)} className="w-full border rounded-xl p-3 text-sm">
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full border rounded-xl p-3 text-sm">
                  <option value="">All Brands</option>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <div className="flex gap-2">
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min ₱" className="w-full border rounded-xl p-3 text-sm" />
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max ₱" className="w-full border rounded-xl p-3 text-sm" />
                </div>
                {hasFilters && <button onClick={clearFilters} className="w-full bg-black text-white rounded-xl py-2.5 text-sm font-semibold">Clear All</button>}
              </div>
            )}

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white border rounded-2xl text-center py-24 text-gray-400">
                <p className="text-6xl mb-4">👟</p>
                <p className="text-xl font-bold text-gray-700">No shoes found</p>
                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                <button onClick={clearFilters} className="mt-6 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
