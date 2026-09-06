"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

const CATEGORIES: Record<number, string> = {
  1: "Sneakers", 2: "Running Shoes", 3: "Basketball Shoes",
  4: "Casual Shoes", 5: "Formal Shoes", 6: "Sandals",
};

const EMPTY_FORM = {
  name: "", brand: "", category_id: "", description: "",
  price: "", stock: "", image_url: "", sizes: "", colors: "", rating: "4.5",
};

type FormData = typeof EMPTY_FORM;

/* ── Small reusable input ── */
function Field({ label, name, value, onChange, type = "text", placeholder = "", required = false, as = "input" }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string; placeholder?: string; required?: boolean; as?: "input" | "textarea" | "select"; children?: React.ReactNode;
}) {
  const cls = "w-full border-2 border-gray-100 focus:border-black rounded-xl px-3 py-2.5 text-sm focus:outline-none transition";
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {as === "textarea"
        ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
        : <input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className={cls} />}
    </div>
  );
}

/* ── Product Form Modal ── */
function ProductModal({ product, onClose, onSave }: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState<FormData>(
    product
      ? {
          name: product.name, brand: product.brand,
          category_id: String(product.category_id ?? ""),
          description: product.description ?? "",
          price: String(product.price), stock: String(product.stock),
          image_url: product.image_url ?? "",
          sizes: product.sizes?.join(", ") ?? "",
          colors: product.colors?.join(", ") ?? "",
          rating: String(product.rating ?? 4.5),
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.brand.trim() || !form.price || !form.stock) {
      setError("Name, Brand, Price, and Stock are required."); return;
    }
    if (!supabase) { setError("Supabase not connected."); return; }
    setSaving(true); setError("");

    const payload = {
      name:        form.name.trim(),
      brand:       form.brand.trim(),
      category_id: form.category_id ? Number(form.category_id) : null,
      description: form.description.trim(),
      price:       Number(form.price),
      stock:       Number(form.stock),
      image_url:   form.image_url.trim() || null,
      sizes:       form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors:      form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      rating:      Number(form.rating) || 4.5,
    };

    const { error: err } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (err) { setError(err.message); return; }
    onSave();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-black">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition">✕</button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Product Name" name="name" value={form.name} onChange={handle} placeholder="e.g. Nike Air Max 270" required />
          </div>
          <Field label="Brand" name="brand" value={form.brand} onChange={handle} placeholder="e.g. Nike" required />
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Category</label>
            <select name="category_id" value={form.category_id} onChange={handle} className="w-full border-2 border-gray-100 focus:border-black rounded-xl px-3 py-2.5 text-sm focus:outline-none transition">
              <option value="">Select Category</option>
              {Object.entries(CATEGORIES).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
          </div>
          <Field label="Price (₱)" name="price" value={form.price} onChange={handle} type="number" placeholder="0.00" required />
          <Field label="Stock" name="stock" value={form.stock} onChange={handle} type="number" placeholder="0" required />
          <Field label="Rating" name="rating" value={form.rating} onChange={handle} type="number" placeholder="4.5" />
          <div className="col-span-2">
            <Field label="Image URL" name="image_url" value={form.image_url} onChange={handle} placeholder="https://..." />
          </div>
          <Field label="Sizes (comma-separated)" name="sizes" value={form.sizes} onChange={handle} placeholder="38, 39, 40, 41, 42" />
          <Field label="Colors (comma-separated)" name="colors" value={form.colors} onChange={handle} placeholder="Black, White, Red" />
          <div className="col-span-2">
            <Field label="Description" name="description" value={form.description} onChange={handle} placeholder="Product description..." as="textarea" />
          </div>
        </div>

        {error && <p className="px-6 pb-2 text-sm text-red-500 font-medium">{error}</p>}

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border-2 border-gray-200 rounded-xl py-3 text-sm font-bold hover:border-black transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50">
            {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Stock Update Modal ── */
function StockModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: () => void }) {
  const [stock,   setStock]   = useState(String(product.stock));
  const [saving,  setSaving]  = useState(false);

  async function handleSave() {
    if (!supabase) return;
    setSaving(true);
    await supabase.from("products").update({ stock: Number(stock) }).eq("id", product.id);
    setSaving(false);
    onSave();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-black mb-1">Update Stock</h2>
        <p className="text-sm text-gray-400 mb-5 line-clamp-1">{product.name}</p>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStock((s) => String(Math.max(0, Number(s) - 1)))} className="w-11 h-11 rounded-xl border-2 border-gray-200 text-xl font-bold hover:border-black transition">−</button>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min={0} className="flex-1 border-2 border-gray-100 focus:border-black rounded-xl px-3 py-2.5 text-center text-xl font-black focus:outline-none" />
          <button onClick={() => setStock((s) => String(Number(s) + 1))} className="w-11 h-11 rounded-xl border-2 border-gray-200 text-xl font-bold hover:border-black transition">+</button>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-gray-200 rounded-xl py-3 text-sm font-bold hover:border-black transition">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50">
            {saving ? "Saving…" : "Update Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ product, onClose, onDelete }: { product: Product; onClose: () => void; onDelete: () => void }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!supabase) return;
    setDeleting(true);
    await supabase.from("products").delete().eq("id", product.id);
    setDeleting(false);
    onDelete();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑️</div>
        <h2 className="text-lg font-black mb-2">Delete Product?</h2>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to delete <span className="font-bold text-gray-700">"{product.name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-gray-200 rounded-xl py-3 text-sm font-bold hover:border-black transition">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-500 text-white rounded-xl py-3 text-sm font-bold hover:bg-red-600 transition disabled:opacity-50">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function InventoryPage() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [modal,       setModal]       = useState<"add" | "edit" | "stock" | "delete" | null>(null);
  const [selected,    setSelected]    = useState<Product | null>(null);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("products").select("*").order("id");
    setProducts(data || []);
    setLoading(false);
  }

  function openModal(type: "add" | "edit" | "stock" | "delete", product?: Product) {
    setSelected(product ?? null);
    setModal(type);
  }
  function closeModal() { setModal(null); setSelected(null); }
  function afterSave()  { closeModal(); loadProducts(); }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const matchCat    = !category    || String(p.category_id) === category;
    const matchStock  = !stockFilter
      || (stockFilter === "out"  && p.stock === 0)
      || (stockFilter === "low"  && p.stock > 0 && p.stock <= 5)
      || (stockFilter === "ok"   && p.stock > 5);
    return matchSearch && matchCat && matchStock;
  });

  const totalStock    = products.reduce((s, p) => s + p.stock, 0);
  const outOfStockCnt = products.filter((p) => p.stock === 0).length;
  const lowStockCnt   = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const lowStockList  = products.filter((p) => p.stock > 0 && p.stock <= 5);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Inventory</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} products · {totalStock} total units</p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition"
        >
          <span className="text-lg leading-none">+</span> Add Product
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-5 text-center cursor-pointer hover:shadow-sm transition" onClick={() => setStockFilter("")}>
          <p className="text-3xl font-black text-blue-700">{loading ? "—" : products.length}</p>
          <p className="text-xs font-bold text-blue-500 mt-1 uppercase tracking-wider">Total Products</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-5 text-center cursor-pointer hover:shadow-sm transition" onClick={() => setStockFilter("low")}>
          <p className="text-3xl font-black text-orange-600">{loading ? "—" : lowStockCnt}</p>
          <p className="text-xs font-bold text-orange-400 mt-1 uppercase tracking-wider">Low Stock</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-5 text-center cursor-pointer hover:shadow-sm transition" onClick={() => setStockFilter("out")}>
          <p className="text-3xl font-black text-red-500">{loading ? "—" : outOfStockCnt}</p>
          <p className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wider">Out of Stock</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {!loading && lowStockList.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚠️</span>
            <h3 className="font-black text-orange-700 text-sm">Low Stock Alert — {lowStockList.length} product{lowStockList.length > 1 ? "s" : ""} need restocking</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockList.map((p) => (
              <button
                key={p.id}
                onClick={() => openModal("stock", p)}
                className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs font-semibold hover:border-orange-400 transition"
              >
                <span className="text-orange-500 font-black">{p.stock} left</span>
                <span className="text-gray-600">{p.name}</span>
                <span className="text-orange-400">→ Restock</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full border border-gray-100 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-black" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black">
          <option value="">All Categories</option>
          {Object.entries(CATEGORIES).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black">
          <option value="">All Stock</option>
          <option value="ok">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        {(search || category || stockFilter) && (
          <button onClick={() => { setSearch(""); setCategory(""); setStockFilter(""); }} className="text-sm text-gray-400 hover:text-black px-3 font-semibold">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Brand</th>
                <th className="text-right px-6 py-4">Price</th>
                <th className="text-center px-6 py-4">Stock</th>
                <th className="text-center px-6 py-4">Sold</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-xl" /><div className="h-3 bg-gray-100 rounded w-32" /></div></td>
                      {Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="h-3 bg-gray-100 rounded" /></td>)}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                    <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                      <p className="text-4xl mb-2">👟</p>
                      <p className="font-semibold">No products found</p>
                    </td></tr>
                  )
                : filtered.map((p) => {
                    const isOut = p.stock === 0;
                    const isLow = p.stock > 0 && p.stock <= 5;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                              <img src={p.image_url || "https://placehold.co/80"} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold line-clamp-1 max-w-[160px]">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{p.category_id ? CATEGORIES[p.category_id] : "—"}</td>
                        <td className="px-6 py-4 text-gray-500">{p.brand}</td>
                        <td className="px-6 py-4 text-right font-black">₱{Number(p.price).toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openModal("stock", p)}
                            className={`font-black text-base hover:underline transition ${isOut ? "text-red-500" : isLow ? "text-orange-500" : "text-gray-800"}`}
                          >
                            {p.stock}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-400">{p.sold_quantity}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            isOut ? "bg-red-50 text-red-500 border-red-100"
                            : isLow ? "bg-orange-50 text-orange-500 border-orange-100"
                            : "bg-green-50 text-green-600 border-green-100"
                          }`}>
                            {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Available"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openModal("stock", p)} title="Update Stock" className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center text-sm">📦</button>
                            <button onClick={() => openModal("edit",  p)} title="Edit Product" className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition flex items-center justify-center text-sm">✏️</button>
                            <button onClick={() => openModal("delete",p)} title="Delete Product" className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition flex items-center justify-center text-sm">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {products.length} products
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === "add"    && <ProductModal product={null}     onClose={closeModal} onSave={afterSave} />}
      {modal === "edit"   && selected && <ProductModal product={selected} onClose={closeModal} onSave={afterSave} />}
      {modal === "stock"  && selected && <StockModal   product={selected} onClose={closeModal} onSave={afterSave} />}
      {modal === "delete" && selected && <DeleteModal  product={selected} onClose={closeModal} onDelete={afterSave} />}

    </div>
  );
}
