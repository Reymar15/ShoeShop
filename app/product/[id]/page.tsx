"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

const CATEGORIES: Record<number, string> = {
  1: "Sneakers",
  2: "Running Shoes",
  3: "Basketball Shoes",
  4: "Casual Shoes",
  5: "Formal Shoes",
  6: "Sandals",
};

const EXTRA_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
  "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600",
];

function StarRating({ rating }: { rating: number }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-5 h-5 ${star <= Math.round(r) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-semibold text-gray-600 ml-1">{r.toFixed(1)}</span>
      <span className="text-sm text-gray-400">/ 5.0</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-64 mb-10" />
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-3xl h-[480px]" />
          <div className="flex gap-3">
            {[1,2,3,4].map(i => <div key={i} className="bg-gray-100 rounded-xl w-20 h-20" />)}
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="h-10 bg-gray-100 rounded w-3/4" />
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-12 bg-gray-100 rounded-2xl mt-8" />
        </div>
      </div>
    </main>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product,       setProduct]       = useState<Product | null>(null);
  const [related,       setRelated]       = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [size,          setSize]          = useState("");
  const [quantity,      setQuantity]      = useState(1);
  const [added,         setAdded]         = useState(false);
  const { addToCart } = useCart();

  useEffect(() => { loadProduct(); }, [id]);

  async function loadProduct() {
    if (!supabase) return;
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    if (!data) return;

    setProduct(data);
    setSelectedImage(data.image_url || EXTRA_IMAGES[0]);
    setSize(data.sizes?.[0] || "");

    if (data.category_id) {
      const { data: rel } = await supabase
        .from("products").select("*")
        .eq("category_id", data.category_id)
        .neq("id", data.id)
        .limit(4);
      setRelated(rel || []);
    }
  }

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product) return <LoadingSkeleton />;

  const categoryName = product.category_id ? CATEGORIES[product.category_id] : null;
  const outOfStock   = product.stock <= 0;
  const lowStock     = product.stock > 0 && product.stock <= 5;
  const gallery      = [product.image_url || EXTRA_IMAGES[0], ...EXTRA_IMAGES].slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition">Shop</Link>
          {categoryName && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category_id}`} className="hover:text-black transition">{categoryName}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[180px]">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[440px] object-cover"
              />
              {outOfStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white font-bold px-6 py-2 rounded-full text-lg">Out of Stock</span>
                </div>
              )}
              {lowStock && !outOfStock && (
                <span className="absolute top-4 left-4 bg-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-xl overflow-hidden border-2 transition flex-1 ${
                    selectedImage === img ? "border-black" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col">

            {/* Brand + Category */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{product.brand}</span>
              {categoryName && (
                <Link
                  href={`/shop?category=${product.category_id}`}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-3 py-1 rounded-full transition"
                >
                  {categoryName}
                </Link>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-black leading-tight text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <StarRating rating={product.rating} />

            {/* Price */}
            <div className="mt-5 mb-2">
              <span className="text-4xl font-black text-gray-900">
                ₱{Number(product.price).toLocaleString()}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-5">
              {outOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  Out of Stock
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                  Only {product.stock} items left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {product.stock} items in stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {product.description || "No description available for this product."}
            </p>

            <hr className="border-gray-100 mb-6" />

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">Select Size</h3>
                  <span className="text-sm text-gray-400">Selected: <span className="text-black font-semibold">{size || "None"}</span></span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[48px] h-11 px-3 rounded-xl border-2 text-sm font-bold transition ${
                        size === s
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-200 hover:border-black text-gray-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 text-xl font-bold hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={outOfStock}
                    className="w-11 h-11 text-xl font-bold hover:bg-gray-50 transition flex items-center justify-center disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  Max: <span className="font-semibold text-gray-600">{product.stock}</span>
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={outOfStock}
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl text-base font-black tracking-wide transition ${
                added
                  ? "bg-green-500 text-white scale-[0.99]"
                  : outOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 active:scale-[0.99]"
              }`}
            >
              {added
                ? "✓ Added to Cart!"
                : outOfStock
                ? "Out of Stock"
                : `Add to Cart  ·  ₱${(Number(product.price) * quantity).toLocaleString()}`}
            </button>

            {/* Back to shop */}
            <Link
              href="/shop"
              className="mt-4 text-center text-sm text-gray-400 hover:text-black transition"
            >
              ← Continue Shopping
            </Link>

          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Related Products</h2>
              <Link
                href={`/shop?category=${product.category_id}`}
                className="text-sm font-semibold border border-gray-200 px-4 py-2 rounded-xl hover:border-black hover:bg-black hover:text-white transition"
              >
                View all {categoryName} →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
