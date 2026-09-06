"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

import ProductCard from "@/components/ProductCard";

export default function ShopPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [sort, setSort] =
    useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {

    const { data } =
      await supabase
        .from("products")
        .select("*");

    setProducts(data || []);
  }

  let filtered =
    products.filter((product) => {

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const brandMatch =
        !brand ||
        product.brand === brand;

      return searchMatch && brandMatch;
    });

  if (sort === "low") {
    filtered.sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );
  }

  if (sort === "high") {
    filtered.sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    );
  }

  if (sort === "popular") {
    filtered.sort(
      (a, b) =>
        b.sold_quantity -
        a.sold_quantity
    );
  }

  const brands = [
    ...new Set(
      products.map(
        (product) =>
          product.brand
      )
    ),
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold">
        Shop Shoes
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mt-8 mb-10">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search shoes..."
          className="border rounded-xl p-3"
        />

        <select
          value={brand}
          onChange={(e) =>
            setBrand(e.target.value)
          }
          className="border rounded-xl p-3"
        >

          <option value="">
            All Brands
          </option>

          {brands.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="border rounded-xl p-3"
        >

          <option value="">
            Sort By
          </option>

          <option value="low">
            Price: Low to High
          </option>

          <option value="high">
            Price: High to Low
          </option>

          <option value="popular">
            Popular
          </option>

        </select>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </main>
  );
}