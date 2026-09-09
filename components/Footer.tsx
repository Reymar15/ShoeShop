import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div className="sm:col-span-2 md:col-span-1">
          <h2 className="text-lg font-black mb-3">ShoeShop</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Your trusted online shoe store. Stylish, comfortable, and high-quality shoes for every occasion.
          </p>
          <div className="flex gap-3 mt-5">
            {["Facebook", "Instagram", "Twitter"].map((s) => (
              <a key={s} href="#" aria-label={s}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-xs font-bold text-gray-400 hover:text-white">
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-4 text-gray-300">Shop</h3>
          <div className="space-y-2.5 text-gray-400 text-sm">
            {[["All Shoes", "/shop"], ["Sneakers", "/shop?category=1"], ["Running", "/shop?category=2"], ["Formal", "/shop?category=5"], ["Sandals", "/shop?category=6"]].map(([l, h]) => (
              <p key={l}><Link href={h} className="hover:text-white transition">{l}</Link></p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-4 text-gray-300">Company</h3>
          <div className="space-y-2.5 text-gray-400 text-sm">
            {[["Home", "/"], ["About", "/about"], ["Contact", "/contact"], ["Track Order", "/track-order"]].map(([l, h]) => (
              <p key={l}><Link href={h} className="hover:text-white transition">{l}</Link></p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-4 text-gray-300">Contact</h3>
          <div className="space-y-2.5 text-gray-400 text-sm">
            <p>support@shoeshop.com</p>
            <p>+63 912 345 6789</p>
            <p>Cebu City, Philippines</p>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-500 text-xs">
        <p>© {new Date().getFullYear()} ShoeShop. All rights reserved.</p>
        <p>Made with ❤️ in the Philippines</p>
      </div>
    </footer>
  );
}
