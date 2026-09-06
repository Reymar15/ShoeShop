import Link from "next/link";

const values = [
  {
    title: "Quality pairs",
    description:
      "We curate comfortable, dependable shoes for everyday wear, sport, work, and special occasions.",
  },
  {
    title: "A pair for every day",
    description:
      "Browse sneakers, running shoes, basketball shoes, casual shoes, formal shoes, and sandals in one place.",
  },
  {
    title: "Easy shopping",
    description:
      "Clear product details, sizes, colors, and stock information help you choose with confidence.",
  },
];

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
          About ShoeShop
        </p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">
          The right shoes for every step.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          ShoeShop is an online store made to help you find stylish, comfortable,
          and reliable footwear without the hassle. Whether you are heading to the
          court, the office, a run, or a relaxed weekend, there is a pair for you.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-8 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Shop shoes
        </Link>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <article key={value.title} className="rounded-2xl border p-6">
            <h2 className="text-xl font-bold">{value.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {value.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
