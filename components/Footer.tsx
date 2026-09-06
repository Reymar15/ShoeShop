import Link from "next/link";

const socialLinks = [
  { label: "Facebook", href: "#", icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "Instagram", href: "#", icon: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3h9A4.5 4.5 0 0 1 21 7.5z" },
  { label: "Twitter", href: "#", icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
  { label: "YouTube", href: "#", icon: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-xl font-black mb-3">ShoeShop</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted online shoe store. We offer stylish, comfortable, and high-quality shoes for every occasion and lifestyle.
          </p>
          <div className="flex gap-4 mt-5">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="text-gray-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <p><Link href="/" className="hover:text-white transition">Home</Link></p>
            <p><Link href="/shop" className="hover:text-white transition">Shop</Link></p>
            <p><Link href="/categories" className="hover:text-white transition">Categories</Link></p>
            <p><Link href="/about" className="hover:text-white transition">About</Link></p>
            <p><Link href="/contact" className="hover:text-white transition">Contact</Link></p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <p><Link href="/shop?category=running" className="hover:text-white transition">Running</Link></p>
            <p><Link href="/shop?category=casual" className="hover:text-white transition">Casual</Link></p>
            <p><Link href="/shop?category=formal" className="hover:text-white transition">Formal</Link></p>
            <p><Link href="/shop?category=sports" className="hover:text-white transition">Sports</Link></p>
            <p><Link href="/shop?category=sandals" className="hover:text-white transition">Sandals</Link></p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Contact Us</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <p>📧 support@shoeshop.com</p>
            <p>📞 +63 912 345 6789</p>
            <p>📍 123 Shoe Street, Cebu City, Philippines</p>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-5 text-gray-500 text-sm">
        © {new Date().getFullYear()} ShoeShop. All rights reserved.
      </div>

    </footer>
  );
}
