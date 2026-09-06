"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();

  const size =
    product.sizes?.[0] || "Default";

  const color =
    product.colors?.[0] || "Default";

  return (
    <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition">

      <Link href={`/product/${product.id}`}>

        <img
          src={
            product.image_url ||
            "https://placehold.co/600x500"
          }
          alt={product.name}
          className="w-full h-60 object-cover"
        />

      </Link>

      <div className="p-5">

        <p className="text-sm text-gray-500">
          {product.brand}
        </p>

        <h2 className="font-bold text-lg">
          {product.name}
        </h2>

        <div className="flex justify-between mt-2">

          <span className="font-bold">
            ₱{Number(product.price).toLocaleString()}
          </span>

          <span className="text-sm">
            ⭐ {product.rating}
          </span>

        </div>

        <p className="text-sm text-gray-500 mt-2">
          {product.stock > 0
            ? `${product.stock} available`
            : "Out of stock"}
        </p>

        <button
          disabled={product.stock <= 0}
          onClick={() =>
            addToCart(
              product,
              size,
              color
            )
          }
          className="w-full mt-4 bg-black text-white py-3 rounded-xl disabled:bg-gray-400"
        >
          {product.stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>

      </div>

    </div>
  );
}