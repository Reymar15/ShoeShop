"use client";

import { useEffect, useState, Fragment } from "react";

type Order = {
  id: string;
  customer: string;
  contact?: string;
  address?: string;
  total: number;
  status: string;
  date: string;
  payment: string;
  items?: { name: string; quantity: number; price: number; size?: string }[];
};

const DEMO_ORDERS: Order[] = [
  { id: "ORD-001", customer: "Juan Dela Cruz",  contact: "09171234567", address: "123 Rizal St, Cebu City",       total: 7995,  status: "Pending",    date: "Jan 15, 2025", payment: "Cash on Delivery", items: [{ name: "Nike Air Max", quantity: 1, price: 7995, size: "42" }] },
  { id: "ORD-002", customer: "Maria Santos",    contact: "09281234567", address: "456 Mabini Ave, Mandaue City",  total: 12500, status: "Shipped",    date: "Jan 14, 2025", payment: "GCash",            items: [{ name: "Adidas Ultraboost", quantity: 2, price: 6250, size: "40" }] },
  { id: "ORD-003", customer: "Mark Reyes",      contact: "09391234567", address: "789 Osmena Blvd, Lapu-Lapu",   total: 4999,  status: "Delivered",  date: "Jan 13, 2025", payment: "Bank Transfer",    items: [{ name: "Puma RS-X", quantity: 1, price: 4999, size: "41" }] },
  { id: "ORD-004", customer: "Ana Gonzales",    contact: "09501234567", address: "321 Colon St, Cebu City",       total: 8750,  status: "Processing", date: "Jan 12, 2025", payment: "Cash on Delivery", items: [{ name: "New Balance 574", quantity: 1, price: 8750, size: "38" }] },
  { id: "ORD-005", customer: "Carlo Mendoza",   contact: "09611234567", address: "654 Jakosalem St, Cebu City",   total: 15200, status: "Delivered",  date: "Jan 11, 2025", payment: "GCash",            items: [{ name: "Jordan 1 Retro", quantity: 1, price: 15200, size: "43" }] },
];

const ALL_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES: Record<string, string> = {
  Pending:    "bg-yellow-50 text-yellow-600 border-yellow-100",
  Processing: "bg-blue-50 text-blue-600 border-blue-100",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-100",
  Delivered:  "bg-green-50 text-green-600 border-green-100",
  Cancelled:  "bg-red-50 text-red-500 border-red-100",
};

export default function AdminOrdersPage() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("last_order");
    if (saved) {
      const o = JSON.parse(saved);
      setOrders([
        {
          id:       o.id,
          customer: o.customer.name,
          contact:  o.customer.contact,
          address:  o.customer.address,
          total:    o.total,
          status:   "Processing",
          date:     o.date,
          payment:  o.payment,
          items:    o.items?.map((i: { name: string; quantity: number; price: number; size?: string }) => ({
            name: i.name, quantity: i.quantity, price: i.price, size: i.size,
          })),
        },
        ...DEMO_ORDERS,
      ]);
    } else {
      setOrders(DEMO_ORDERS);
    }
  }, []);

  function updateStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    const matchFilter = !filter || o.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = orders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black">Orders</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} total orders · ₱{totalRevenue.toLocaleString()} delivered revenue</p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
            !filter ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"
          }`}
        >
          All ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "" : s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              filter === s ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"
            }`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or customer..."
            className="w-full border border-gray-100 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-6 py-4">Order ID</th>
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Payment</th>
                <th className="text-right px-6 py-4">Total</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-2">📦</p>
                    <p className="font-semibold">No orders found</p>
                  </td>
                </tr>
              ) : filtered.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition cursor-pointer"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td className="px-6 py-4 font-mono font-black text-xs">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{order.customer}</p>
                      {order.contact && <p className="text-xs text-gray-400">{order.contact}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{order.date}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{order.payment}</td>
                    <td className="px-6 py-4 text-right font-black">₱{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status] ?? STATUS_STYLES.Pending}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black"
                      >
                        {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expanded === order.id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</p>
                            <p className="text-sm font-semibold">{order.address || "—"}</p>
                          </div>
                          {order.items && order.items.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Items Ordered</p>
                              <div className="space-y-1.5">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      {item.name}
                                      {item.size && <span className="text-gray-400"> · Size {item.size}</span>}
                                      <span className="text-gray-400"> × {item.quantity}</span>
                                    </span>
                                    <span className="font-bold">₱{(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {orders.length} orders
          </div>
        )}
      </div>

    </div>
  );
}
