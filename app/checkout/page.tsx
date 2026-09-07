"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

const PAYMENT_METHODS = [
  { id: "cod",   label: "Cash on Delivery", desc: "Pay when your order arrives.",      icon: "💵" },
  { id: "gcash", label: "GCash",            desc: "Send payment via GCash number.",    icon: "📱" },
  { id: "bank",  label: "Bank Transfer",    desc: "Transfer to our bank account.",     icon: "🏦" },
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", contact: "", address: "", city: "", province: "", postalCode: "", payment: "cod" });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Full name is required.";
    if (!form.email.trim())   e.email   = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (!form.contact.trim()) e.contact = "Contact number is required.";
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.contact.trim()))
      e.contact = "Enter a valid contact number.";
    if (!form.address.trim()) e.address = "Delivery address is required.";
    if (!form.city.trim())    e.city    = "City is required.";
    if (!form.province.trim()) e.province = "Province is required.";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required.";
    else if (!/^\d{4}$/.test(form.postalCode.trim()))
      e.postalCode = "Enter a valid 4-digit postal code.";
    return e;
  }

  async function handlePlaceOrder() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setPlacing(true);

    const paymentLabel = PAYMENT_METHODS.find((p) => p.id === form.payment)!.label;
    let savedOrderId = `ORD-${Date.now()}`;

    /* ── Save to Supabase ── */
    if (supabase) {
      const { data: orderRow, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name:  form.name.trim(),
          customer_email: form.email.trim().toLowerCase(),
          customer_phone: form.contact.trim(),
          address:        form.address.trim(),
          city:           form.city.trim(),
          province:       form.province.trim(),
          postal_code:    form.postalCode.trim(),
          payment_method: paymentLabel,
          total_amount:   cartTotal,
          subtotal:       cartTotal,
          shipping_fee:   0,
          status:         "Pending",
        })
        .select()
        .single();

      if (orderErr || !orderRow) {
        console.error("Order insert error:", orderErr?.message);
        setErrors({ submit: "We could not place your order. Please try again." });
        setPlacing(false);
        return;
      }

      savedOrderId = orderRow.id;
      const items = cart.map((item) => ({
        order_id:     savedOrderId,
        product_id:   String(item.id),
        product_name: item.name,
        size:         item.size  || null,
        color:        item.color || null,
        price:        item.price,
        quantity:     item.quantity,
        subtotal:     item.price * item.quantity,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(items);
      if (itemsError) {
        console.error("Order items insert error:", itemsError.message);
        setErrors({ submit: "Your order was saved, but its items could not be saved. Please contact support." });
        setPlacing(false);
        return;
      }
    }

    /* ── Save to localStorage for order-success page ── */
    localStorage.setItem("last_order", JSON.stringify({
      id:       savedOrderId,
      date:     new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }),
      customer: {
        name: form.name,
        email: form.email,
        contact: form.contact,
        address: form.address,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
      },
      payment:  paymentLabel,
      items:    cart,
      total:    cartTotal,
    }));

    await new Promise((r) => setTimeout(r, 800));
    clearCart();
    router.push("/order-success");
  }

  function field(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-2xl font-black mb-2">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">Add items before checking out.</p>
          <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition">Shop Now</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/cart" className="text-gray-400 hover:text-black transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black">Checkout</h1>
            <p className="text-gray-400 text-xs mt-0.5">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">

            {/* Customer Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-black text-white rounded-full text-xs flex items-center justify-center font-black">1</span>
                Customer Information
              </h2>
              <div className="space-y-4">
                {[
                  { key: "name",    label: "Full Name",       type: "text", placeholder: "e.g. Juan Dela Cruz" },
                  { key: "email",   label: "Email Address",   type: "email", placeholder: "e.g. juan@email.com" },
                  { key: "contact", label: "Contact Number",  type: "tel",  placeholder: "e.g. 09XX XXX XXXX" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                      {label} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => field(key as keyof typeof form, e.target.value)}
                      placeholder={placeholder}
                      className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors[key] ? "border-red-300 bg-red-50" : "border-gray-100 focus:border-black"}`}
                    />
                    {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => field("address", e.target.value)}
                    placeholder="House No., Street, Barangay, City, Province"
                    rows={3}
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none ${errors.address ? "border-red-300 bg-red-50" : "border-gray-100 focus:border-black"}`}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => field("city", e.target.value)}
                    placeholder="e.g. Cebu City"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.city ? "border-red-300 bg-red-50" : "border-gray-100 focus:border-black"}`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Province <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.province}
                      onChange={(e) => field("province", e.target.value)}
                      placeholder="e.g. Cebu"
                      className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.province ? "border-red-300 bg-red-50" : "border-gray-100 focus:border-black"}`}
                    />
                    {errors.province && <p className="text-red-400 text-xs mt-1">{errors.province}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Postal Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.postalCode}
                      onChange={(e) => field("postalCode", e.target.value)}
                      placeholder="e.g. 6000"
                      className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.postalCode ? "border-red-300 bg-red-50" : "border-gray-100 focus:border-black"}`}
                    />
                    {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-black text-white rounded-full text-xs flex items-center justify-center font-black">2</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${form.payment === method.id ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300"}`}>
                    <input type="radio" name="payment" value={method.id} checked={form.payment === method.id} onChange={() => field("payment", method.id)} className="accent-black w-4 h-4 shrink-0" />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-bold text-sm">{method.label}</p>
                      <p className="text-xs text-gray-400">{method.desc}</p>
                    </div>
                    {form.payment === method.id && <span className="ml-auto text-xs bg-black text-white px-2.5 py-1 rounded-full font-semibold">Selected</span>}
                  </label>
                ))}
              </div>
              {form.payment === "gcash" && <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">📱 Send payment to <span className="font-black">0912 345 6789</span> (ShoeShop). Use your order ID as reference.</div>}
              {form.payment === "bank"  && <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">🏦 BDO Savings · Account Name: <span className="font-black">ShoeShop PH</span> · Account No: <span className="font-black">1234 5678 9012</span></div>}
              {form.payment === "cod"   && <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-700">💵 Prepare the exact amount upon delivery. Our rider will collect payment.</div>}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-black mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-black text-white rounded-full text-xs flex items-center justify-center font-black">3</span>
                Order Summary
              </h2>
              <div className="space-y-4 mb-5">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img src={item.image || "https://placehold.co/100"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-snug line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.size && `Size ${item.size}`}{item.size && item.color && " · "}{item.color}{" · "}Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black shrink-0">₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <hr className="border-gray-100 mb-4" />
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-500"><span>Subtotal ({totalItems} items)</span><span>₱{cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-600 font-bold">FREE</span></div>
              </div>
              <hr className="border-gray-100 mb-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-lg">Total</span>
                <span className="font-black text-2xl">₱{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className={`w-full py-4 rounded-2xl font-black text-base transition flex items-center justify-center gap-2 ${placing ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 active:scale-[0.99]"}`}
              >
                {placing ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Placing Order…</>) : "Place Order →"}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">🔒 Your information is safe with us</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
