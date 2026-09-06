"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {

  const [product, setProduct] =
    useState<Product | null>(null);

  const [size, setSize] =
    useState("");

  const [color, setColor] =
    useState("");

  const { addToCart } =
    useCart();

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {

    const { data } =
      await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

    if (data) {

      setProduct(data);

      setSize(
        data.sizes?.[0] || ""
      );

      setColor(
        data.colors?.[0] || ""
      );
    }
  }

  if (!product) {
    return (
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">

      <Link
        href="/shop"
        className="text-gray-500"
      >
        ← Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-8">

        <img
          src={
            product.image_url ||
            "https://placehold.co/600"
          }
          alt={product.name}
          className="w-full h-[550px] object-cover rounded-3xl"
        />

        <div>

          <p className="text-gray-500">
            {product.brand}
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {product.name}
          </h1>

          <p className="text-2xl font-bold mt-5">
            ₱{Number(product.price).toLocaleString()}
          </p>

          <p className="text-gray-600 mt-6 leading-7">
            {product.description}
          </p>

          <div className="mt-8">

            <h3 className="font-semibold">
              Size
            </h3>

            <div className="flex gap-2 mt-3">

              {product.sizes.map(
                (item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setSize(item)
                    }
                    className={`border px-4 py-2 rounded-lg ${
                      size === item
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    {item}
                  </button>

                )
              )}

            </div>

          </div>

          <div className="mt-8">

            <h3 className="font-semibold">
              Color
            </h3>

            <div className="flex gap-2 mt-3">

              {product.colors.map(
                (item) => (

                  <button
                    key={item}
                    onClick={() =>
                      setColor(item)
                    }
                    className={`border px-4 py-2 rounded-lg ${
                      color === item
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    {item}
                  </button>

                )
              )}

            </div>

          </div>

          <p className="mt-8">
            Stock:
            {" "}
            {product.stock}
          </p>

          <button
            disabled={
              product.stock <= 0
            }
            onClick={() =>
              addToCart(
                product,
                size,
                color
              )
            }
            className="mt-5 bg-black text-white px-8 py-4 rounded-xl disabled:bg-gray-400"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </main>
  );
}