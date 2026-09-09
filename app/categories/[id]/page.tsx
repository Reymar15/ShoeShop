"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/store";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

const CATEGORY_META: Record<number, { name: string; emoji: string; description: string; bg: string }> = {
  1: { name: "Sneakers",         emoji: "👟", description: "Trendy and versatile sneakers for everyday wear.",              bg: "bg-blue-50"   },
  2: { name: "Running Shoes",    emoji: "🏃", description: "Lightweight and supportive shoes built for performance.",       bg: "bg-green-50"  },
  3: { name: "Basketball Shoes", emoji: "🏀", description: "High-top shoes with ankle support for the court.",             bg: "bg-orange-50" },
  4: { name: "Casual Shoes",     emoji: "🥿", description: "Comfortable everyday shoes for a relaxed look.",               bg: "bg-yellow-50" },
  5: { name: "Formal Shoes",     emoji: "👞", description: "Elegant shoes perfect for work and special occasions.",        bg: "bg-gray-100"  },
  6: { name: "Sandals",          emoji: "🩴", description: "Breezy and stylish sandals for warm weather.",                 bg: "bg-red-50"    },
};

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;
  const lowStock   = product.stock > 0 && product.stock <= 5;

  function handleAdd() {
    addToCart(product, product.sizes?.[0] || "");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={product.image_url || "https://placehold.co/600x400"}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}
        {lowStock && !outOfStock && (
          <span className="absolute top-3 left-3 bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Only {product.stock} left!
          </span>
        )}
        {/* Rating badge */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          ⭐ {product.rating}
        </span>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
        <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">{product.description}</p>

        {/* Stock */}
        <div className="mb-4">
          {outOfStock ? (
            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">Out of Stock</span>
          ) : (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              {product.stock} in stock
            </span>
          )}
        </div>

        {/* Price */}
        <p className="text-2xl font-black text-gray-900 mb-4">
          ₱{Number(product.price).toLocaleString()}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
              added
                ? "bg-green-500 text-white"
                : outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {added ? "✓ Added!" : outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 hover:border-black text-center transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const categoryId = Number(id);
  const meta = CATEGORY_META[categoryId];

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const all = getProducts();
    setProducts(all.filter((p) => p.category_id === categoryId));
  }, [categoryId]);

  if (!meta) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-black mb-4">Category Not Found</h1>
        <Link href="/categories" className="text-sm font-semibold underline">← Back to Categories</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-white transition">Categories</Link>
            <span>/</span>
            <span className="text-white font-medium">{meta.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{meta.emoji}</span>
            <div>
              <h1 className="text-4xl font-black">{meta.name}</h1>
              <p className="text-gray-400 mt-1">{meta.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-bold text-gray-900">{products.length}</span> products
          </p>
          <Link
            href="/categories"
            className="text-sm font-semibold border border-gray-200 hover:border-black px-4 py-2 rounded-xl transition"
          >
            ← All Categories
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">👟</p>
            <p className="text-lg font-semibold">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
