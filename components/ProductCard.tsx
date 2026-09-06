"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

const CATEGORIES: Record<number, string> = {
  1: "Sneakers",
  2: "Running Shoes",
  3: "Basketball Shoes",
  4: "Casual Shoes",
  5: "Formal Shoes",
  6: "Sandals",
};

function StarRating({ rating }: { rating: number }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(r) ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-0.5">{r.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const size  = product.sizes?.[0]  || "Default";
  const color = product.colors?.[0] || "Default";
  const categoryName = product.category_id ? CATEGORIES[product.category_id] : null;

  function handleAddToCart() {
    addToCart(product, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const outOfStock = product.stock <= 0;
  const lowStock   = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* Image */}
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image_url || "https://placehold.co/600x500"}
            alt={product.name}
            className="w-full h-56 object-cover hover:scale-105 transition duration-300"
          />
        </Link>

        {/* Stock badge */}
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        {lowStock && (
          <span className="absolute top-3 left-3 bg-orange-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Only {product.stock} left!
          </span>
        )}

        {/* Category badge */}
        {categoryName && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {categoryName}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">

        {/* Brand */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          {product.brand}
        </p>

        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h2 className="font-bold text-sm leading-snug hover:underline line-clamp-2 mb-2">
            {product.name}
          </h2>
        </Link>

        {/* Rating */}
        <StarRating rating={product.rating} />

        {/* Price + Stock */}
        <div className="flex items-center justify-between mt-3 mb-1">
          <span className="text-xl font-black">
            ₱{Number(product.price).toLocaleString()}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            outOfStock
              ? "bg-red-50 text-red-500"
              : lowStock
              ? "bg-orange-50 text-orange-500"
              : "bg-green-50 text-green-600"
          }`}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-3">
          <button
            disabled={outOfStock}
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              added
                ? "bg-green-500 text-white"
                : outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {added ? "✓ Added!" : outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold text-center hover:border-black hover:text-black transition"
          >
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
}
