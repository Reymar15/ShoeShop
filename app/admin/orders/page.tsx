"use client";

import { useEffect, useState } from "react";
import { getOrders, saveOrders } from "@/lib/store";
import type { Order } from "@/lib/store";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES: Record<string, string> = {
  Pending:    "bg-yellow-50 text-yellow-600 border-yellow-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-200",
  Delivered:  "bg-green-50 text-green-600 border-green-200",
  Cancelled:  "bg-red-50 text-red-500 border-red-200",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-yellow-400", Processing: "bg-blue-500",
  Shipped: "bg-purple-500", Delivered: "bg-green-500", Cancelled: "bg-red-400",
};

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[status] ?? STATUS_STYLES.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? "bg-gray-400"}`} />
      {status}
    </span>
  );
}

function OrderDrawer({ order, onClose, onStatusUpdate }: {
  order: Order; onClose: () => void; onStatusUpdate: (id: string, status: string) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [saveMsg, setSaveMsg] = useState("");
  const currentIdx = STEPS.indexOf(order.status);

  function handleSave() {
    if (selectedStatus === order.status) return;
    onStatusUpdate(order.id, selectedStatus);
    setSaveMsg("Status updated successfully!");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  const address = [order.address, order.city, order.province, order.postal_code].filter(Boolean).join(", ");

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order Details</p>
            <p className="font-black text-lg font-mono">#{order.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Progress */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Order Progress</p>
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const isDone = i < currentIdx, isCurrent = i === currentIdx, isPending = i > currentIdx;
                return (
                  <div key={step} className="flex gap-3 relative">
                    {i < STEPS.length - 1 && <div className={`absolute left-[15px] top-8 w-0.5 h-8 ${isDone ? "bg-green-400" : "bg-gray-100"}`} />}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center z-10 border-2 ${isDone ? "bg-green-500 border-green-500" : isCurrent ? "bg-black border-black" : "bg-white border-gray-200"}`}>
                      {isDone ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        : isCurrent ? <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        : <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />}
                    </div>
                    <div className={`pb-6 flex-1 pt-1 ${isPending ? "opacity-40" : ""}`}>
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-sm ${isCurrent ? "text-black" : isDone ? "text-green-600" : "text-gray-400"}`}>{step}</p>
                        {isCurrent && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Current</span>}
                        {isDone    && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">✓ Done</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Information</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Order ID", order.id], ["Date", formatDate(order.created_at)], ["Payment", order.payment_method], ["Total", `₱${order.total_amount.toLocaleString()}`]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-gray-400 mb-0.5">{l}</p><p className="font-bold text-xs">{v}</p></div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Information</p>
            <div className="space-y-2 text-sm">
              {[["Name", order.customer_name], ["Contact", order.customer_phone], ["Email", order.customer_email]].map(([l, v]) => v ? (
                <div key={l} className="flex justify-between gap-4"><span className="text-gray-400 shrink-0">{l}</span><span className="font-semibold text-right">{v}</span></div>
              ) : null)}
              {address && <div><p className="text-gray-400 mb-1">Delivery Address</p><p className="font-semibold">{address}</p></div>}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordered Items</p>
            <div className="space-y-3">
              {order.order_items.map((item, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{item.product_name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.size  && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Size {item.size}</span>}
                      {item.color && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.color}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">₱{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <p className="font-black text-sm shrink-0">₱{item.subtotal.toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 font-black">
                <span>Total</span><span>₱{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Update Order Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setSelectedStatus(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-sm font-semibold ${selectedStatus === s ? "border-black bg-black text-white" : "border-gray-100 hover:border-gray-300 bg-white text-gray-700"}`}>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedStatus === s ? "bg-white" : STATUS_DOT[s]}`} />
                  {s}
                </button>
              ))}
            </div>
            {saveMsg && <p className="text-xs text-green-600 font-semibold text-center">{saveMsg}</p>}
            <button onClick={handleSave} disabled={selectedStatus === order.status}
              className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition disabled:opacity-40">
              {selectedStatus === order.status ? "No Changes" : "Save Status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders,        setOrders]        = useState<Order[]>([]);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [toast,         setToast]         = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { setOrders(getOrders()); }, []);

  function updateStatus(id: string, newStatus: string) {
    const updated = orders.map((o) => o.id === id ? { ...o, status: newStatus } : o);
    saveOrders(updated);
    setOrders(updated);
    setSelectedOrder((prev) => prev?.id === id ? { ...prev, status: newStatus } : prev);
    setToast(`✓ Order updated to "${newStatus}"`);
    setTimeout(() => setToast(""), 3000);
  }

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (o.id.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q))
      && (!statusFilter || o.status === statusFilter);
  });

  const counts = STATUSES.reduce((acc, s) => { acc[s] = orders.filter((o) => o.status === s).length; return acc; }, {} as Record<string, number>);
  const deliveredRevenue = orders.filter((o) => o.status === "Delivered").reduce((s, o) => s + o.total_amount, 0);

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold text-white ${toast.startsWith("✓") ? "bg-green-500" : "bg-red-500"}`}>
          {toast}
        </div>
      )}

      {selectedOrder && <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={updateStatus} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Order Management</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} total orders · ₱{deliveredRevenue.toLocaleString()} delivered revenue</p>
        </div>
        <button onClick={() => setOrders(getOrders())} className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold hover:border-black transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStatusFilter("")} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${!statusFilter ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"}`}>
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition flex items-center gap-1.5 ${statusFilter === s ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"}`}>
            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />{s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Order ID, name, or email…" className="w-full border border-gray-100 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-black" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || statusFilter) && <button onClick={() => { setSearch(""); setStatusFilter(""); }} className="text-sm text-gray-400 hover:text-black font-semibold px-2">Clear</button>}
      </div>

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
                <th className="text-center px-6 py-4">Update</th>
                <th className="text-center px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-2">📦</p><p className="font-semibold">No orders found</p>
                </td></tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-6 py-4 font-mono font-black text-xs text-gray-700">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{order.payment_method}</td>
                  <td className="px-6 py-4 text-right font-black">₱{order.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs border-2 border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-black font-semibold">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSelectedOrder(order)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition mx-auto text-gray-400 hover:text-black">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {orders.length} orders · Click any row to view full details
          </div>
        )}
      </div>
    </div>
  );
}
