"use client";

import Link from "next/link";

const CATEGORIES = [
  {
    id: 1,
    name: "Sneakers",
    description: "Trendy and versatile sneakers for everyday wear.",
    emoji: "👟",
    bg: "bg-blue-50",
    border: "border-blue-200",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
  {
    id: 2,
    name: "Running Shoes",
    description: "Lightweight and supportive shoes built for performance.",
    emoji: "🏃",
    bg: "bg-green-50",
    border: "border-green-200",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
  },
  {
    id: 3,
    name: "Basketball Shoes",
    description: "High-top shoes with ankle support for the court.",
    emoji: "🏀",
    bg: "bg-orange-50",
    border: "border-orange-200",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600",
  },
  {
    id: 4,
    name: "Casual Shoes",
    description: "Comfortable everyday shoes for a relaxed look.",
    emoji: "🥿",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600",
  },
  {
    id: 5,
    name: "Formal Shoes",
    description: "Elegant shoes perfect for work and special occasions.",
    emoji: "👞",
    bg: "bg-gray-100",
    border: "border-gray-300",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600",
  },
  {
    id: 6,
    name: "Sandals",
    description: "Breezy and stylish sandals for warm weather.",
    emoji: "🩴",
    bg: "bg-red-50",
    border: "border-red-200",
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600",
  },
];

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-10">
        <h1 className="text-4xl font-bold">Shoe Categories</h1>
        <p className="text-gray-500 mt-2">
          Browse our collection by category and find your perfect pair.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className={`${cat.bg} ${cat.border} border rounded-2xl overflow-hidden hover:shadow-lg transition group`}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{cat.emoji}</span>
                <h2 className="text-xl font-bold">{cat.name}</h2>
              </div>
              <p className="text-gray-500 text-sm">{cat.description}</p>
              <span className="inline-block mt-4 text-sm font-semibold underline">
                View Shoes →
              </span>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}
