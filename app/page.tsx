"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

import ProductCard from "@/components/ProductCard";

export default function Home() {

  const [products, setProducts] =
    useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {

    const { data, error } =
      await supabase
        .from("products")
        .select("*")
        .order("sold_quantity", {
          ascending: false,
        })
        .limit(8);

    if (!error) {
      setProducts(data || []);
    }
  }

  return (
    <>

      <section className="bg-gray-100">

        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

          <div>

            <p className="font-semibold mb-3">
              WELCOME TO SHUESHOP
            </p>

            <h1 className="text-5xl md:text-6xl font-black">
              Find Your Perfect Pair
            </h1>

            <p className="text-gray-600 text-lg mt-6">
              Discover stylish and comfortable
              shoes for every occasion.
            </p>

            <Link
              href="/shop"
              className="inline-block mt-8 bg-black text-white px-7 py-4 rounded-xl"
            >
              Shop Now
            </Link>

          </div>

          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            alt="Shoe"
            className="w-full h-[450px] object-cover rounded-3xl"
          />

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">
            Best Sellers
          </h2>

          <Link
            href="/shop"
            className="underline"
          >
            View All
          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </section>

    </>
  );
}