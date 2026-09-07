"use client";

import { useEffect, useState, Fragment } from "react";
import { supabase } from "@/lib/supabase";

type OrderItem = {
  id: number;
  order_id: string;
  product_id: string | null;
  product_name: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  payment_method: string;
  subtotal: number | null;
  shipping_fee: number | null;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
};

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered"];

const STATUS_STYLES: Record<string, string> = {
  Pending:    "bg-yellow-50 text-yellow-600 border-yellow-200",
  Processing: "bg-blue-50 text-blue-600 border-blue-200",
  Shipped:    "bg-purple-50 text-purple-600 border-purple-200",
  Delivered:  "bg-green-50 text-green-600 border-green-200",
};

const STATUS_DOT: Record<string, string> = {
  Pending:    "bg-yellow-400",
  Processing: "bg-blue-500",
  Shipped:    "bg-purple-500",
  Delivered:  "bg-green-500",
};

const STATUS_DOT_COLOR: Record<string, string> = {
  Pending:    "text-yellow-400",
  Processing: "text-blue-500",
  Shipped:    "text-purple-500",
  Delivered:  "text-green-500",
};

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];
const STEP_LABELS: Record<string, string> = {
  Pending:    "Order Placed",
  Processing: "Processing",
  Shipped:    "Shipped",
  Delivered:  "Delivered",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[status] ?? STATUS_STYLES.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? "bg-gray-400"}`} />
      {status}
    </span>
  );
}

function ProgressTracker({ status }: { status: string }) {
  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const isDone    = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isPending = i > currentIdx;
        return (
          <div key={step} className="flex gap-3 relative">
            {i < STEPS.length - 1 && (
              <div className={`absolute left-[15px] top-8 w-0.5 h-8 ${isDone ? "bg-green-400" : "bg-gray-100"}`} />
            )}
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center z-10 border-2 transition ${
              isDone    ? "bg-green-500 border-green-500"
              : isCurrent ? "bg-black border-black"
              : "bg-white border-gray-200"
            }`}>
              {isDone ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : isCurrent ? (
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
              )}
            </div>
            <div className={`pb-6 flex-1 pt-1 ${isPending ? "opacity-40" : ""}`}>
              <div className="flex items-center gap-2">
                <p className={`font-bold text-sm ${isCurrent ? "text-black" : isDone ? "text-green-600" : "text-gray-400"}`}>
                  {STEP_LABELS[step]}
                </p>
                {isCurrent && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Current</span>}
                {isDone    && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">✓ Done</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderDrawer({
  order,
  onClose,
  onStatusUpdate,
}: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
}) {
  const [items, setItems]         = useState<OrderItem[]>(order.order_items ?? []);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState("");

  useEffect(() => {
    setSelectedStatus(order.status);
    setSaveMsg("");
    if (!order.order_items || order.order_items.length === 0) {
      fetchItems();
    } else {
      setItems(order.order_items);
    }
  }, [order.id]);

  async function fetchItems() {
    if (!supabase) return;
    setLoadingItems(true);
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);
    if (data) setItems(data);
    setLoadingItems(false);
  }

  async function handleSaveStatus() {
    if (selectedStatus === order.status) return;
    setSaving(true);
    setSaveMsg("");
    await onStatusUpdate(order.id, selectedStatus);
    setSaveMsg("Status updated successfully!");
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  }

  const address = [order.address, order.city, order.province, order.postal_code]
    .filter(Boolean).join(", ");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden">

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order Details</p>
            <p className="font-black text-lg font-mono">#{order.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Order Progress */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Order Progress</p>
            <ProgressTracker status={order.status} />
          </div>

          {/* Order Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Information</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                <p className="font-bold font-mono text-xs">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Date</p>
                <p className="font-semibold text-xs">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
                <p className="font-semibold text-xs">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                <p className="font-black text-sm">₱{Number(order.total_amount).toLocaleString()}</p>
              </div>
              {order.shipping_fee != null && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Shipping Fee</p>
                  <p className="font-semibold text-xs">₱{Number(order.shipping_fee).toLocaleString()}</p>
                </div>
              )}
              {order.subtotal != null && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Subtotal</p>
                  <p className="font-semibold text-xs">₱{Number(order.subtotal).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Information</p>
            <div className="space-y-2 text-sm">
              {[
                ["Name",    order.customer_name],
                ["Contact", order.customer_phone],
                ["Email",   order.customer_email],
              ].map(([label, value]) => value ? (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-gray-400 shrink-0">{label}</span>
                  <span className="font-semibold text-right">{value}</span>
                </div>
              ) : null)}
              {address && (
                <div>
                  <p className="text-gray-400 mb-1">Delivery Address</p>
                  <p className="font-semibold">{address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordered Items</p>
            {loadingItems ? (
              <div className="space-y-3">
                {[1,2].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">No items found.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{item.product_name}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.size  && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Size {item.size}</span>}
                        {item.color && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.color}</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        ₱{Number(item.price).toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-sm">₱{Number(item.subtotal).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-black">
                  <span>Total</span>
                  <span className="text-base">₱{Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Update Status */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Update Order Status</p>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-sm font-semibold ${
                    selectedStatus === s
                      ? "border-black bg-black text-white"
                      : "border-gray-100 hover:border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    selectedStatus === s ? "bg-white" : STATUS_DOT[s]
                  }`} />
                  <span className={selectedStatus === s ? "" : STATUS_DOT_COLOR[s]}>{s}</span>
                </button>
              ))}
            </div>
            {saveMsg && (
              <p className="text-xs text-green-600 font-semibold text-center">{saveMsg}</p>
            )}
            <button
              onClick={handleSaveStatus}
              disabled={saving || selectedStatus === order.status}
              className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {saving ? "Saving…" : selectedStatus === order.status ? "No Changes" : "Save Status"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders,        setOrders]        = useState<Order[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [toast,         setToast]         = useState("");
  const [updating,      setUpdating]      = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, newStatus: string) {
    if (!supabase) return;
    setUpdating(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
      );
      showToast(`✓ Order updated to "${newStatus}"`);
    } else {
      showToast("❌ Failed to update status.");
    }
    setUpdating(null);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const payments = [...new Set(orders.map((o) => o.payment_method).filter(Boolean))];

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch  = o.id.toLowerCase().includes(q)
      || o.customer_name.toLowerCase().includes(q)
      || (o.customer_email ?? "").toLowerCase().includes(q);
    const matchStatus  = !statusFilter  || o.status === statusFilter;
    const matchPayment = !paymentFilter || o.payment_method === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const deliveredRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + Number(o.total_amount), 0);

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold text-white transition-all ${toast.startsWith("✓") ? "bg-green-500" : "bg-red-500"}`}>
          {toast}
        </div>
      )}

      {/* Order Drawer */}
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={updateStatus}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Order Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? "Loading…" : `${orders.length} total orders · ₱${deliveredRevenue.toLocaleString()} delivered revenue`}
          </p>
        </div>
        <button onClick={loadOrders} className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold hover:border-black transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStatusFilter("")} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${!statusFilter ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"}`}>
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition flex items-center gap-1.5 ${statusFilter === s ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"}`}>
            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, name, or email…"
            className="w-full border border-gray-100 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-black" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black">
          <option value="">All Payments</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="GCash">GCash</option>
          <option value="Credit/Debit Card">Credit/Debit Card</option>
          {payments.filter(p => !["Cash on Delivery","GCash","Credit/Debit Card"].includes(p)).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {(search || statusFilter || paymentFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); setPaymentFilter(""); }} className="text-sm text-gray-400 hover:text-black font-semibold px-2">Clear</button>
        )}
      </div>

      {/* Table */}
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
                <th className="text-center px-6 py-4">Update Status</th>
                <th className="text-center px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-3 bg-gray-100 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="font-semibold">No orders found</p>
                </td></tr>
              ) : filtered.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className="hover:bg-gray-50/60 transition cursor-pointer group"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 font-mono font-black text-xs text-gray-700">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{order.customer_name}</p>
                      {order.customer_email && <p className="text-xs text-gray-400">{order.customer_email}</p>}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{order.payment_method}</td>
                    <td className="px-6 py-4 text-right font-black">₱{Number(order.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className="text-xs border-2 border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-black disabled:opacity-50 font-semibold"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {updating === order.id && (
                          <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition mx-auto text-gray-400 hover:text-black"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {orders.length} orders · Click any row to view full details
          </div>
        )}
      </div>

    </div>
  );
}
