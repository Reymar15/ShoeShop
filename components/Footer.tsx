export default function Footer() {
  return (
    <footer className="border-t mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-xl font-bold">
            ShoeShop
          </h2>

          <p className="text-gray-500 mt-3">
            Your trusted online shoe store.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Quick Links
          </h3>

          <div className="mt-3 space-y-2 text-gray-500">
            <p>Home</p>
            <p>Shop</p>
            <p>Track Order</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            Contact
          </h3>

          <p className="text-gray-500 mt-3">
            support@shoeshop.com
          </p>
        </div>

      </div>

      <div className="border-t text-center py-5 text-gray-500">
        © 2026 ShoeShop
      </div>

    </footer>
  );
}