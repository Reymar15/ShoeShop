"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const inp = "w-full border-2 border-gray-100 focus:border-black rounded-xl px-4 py-3 text-sm focus:outline-none transition bg-gray-50 focus:bg-white";

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl font-black mb-3">Get in Touch</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Have a question or concern? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">

        {/* Contact Info */}
        <div className="space-y-4">
          {[
            { icon: "📧", label: "Email", value: "support@shoeshop.com" },
            { icon: "📞", label: "Phone", value: "+63 912 345 6789" },
            { icon: "📍", label: "Address", value: "123 Shoe Street, Cebu City, Philippines" },
            { icon: "🕐", label: "Hours", value: "Mon–Sat, 9AM – 6PM" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl mb-4">✅</div>
              <h2 className="text-xl font-black mb-2">Message Sent!</h2>
              <p className="text-gray-400 text-sm mb-6">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition">
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Juan Dela Cruz" className={inp} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email <span className="text-red-400">*</span></label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="juan@email.com" className={inp} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Subject <span className="text-red-400">*</span></label>
                  <input type="text" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Message <span className="text-red-400">*</span></label>
                  <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your message here…" rows={5} className={`${inp} resize-none`} />
                </div>
                <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 active:scale-[0.99] transition">
                  Send Message →
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </main>
  );
}
