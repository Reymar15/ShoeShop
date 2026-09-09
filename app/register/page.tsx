"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function RegisterPage() {
  const { signup, user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  function field(key: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email.";
    if (form.phone.trim() && !/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "At least 6 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const err = signup(form.fullName.trim(), form.email.trim(), form.phone.trim(), form.password);
    if (err) { setErrors({ email: err }); setLoading(false); return; }
    router.push("/");
  }

  const inp = (key: string) =>
    `w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition bg-gray-50 focus:bg-white ${errors[key] ? "border-red-300" : "border-gray-100 focus:border-black"}`;

  const EyeOff = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>;
  const EyeOn  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">

        {/* Left — dark panel */}
        <div className="hidden md:flex flex-col justify-between bg-gray-900 text-white p-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">👟</div>
            <span className="text-xl font-black">ShoeShop</span>
          </Link>
          <div>
            <h2 className="text-3xl font-black leading-tight mb-4">
              Join thousands<br />of happy shoppers.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create your free account and get access to exclusive deals, order tracking, and a personalized shopping experience.
            </p>
          </div>
          <div className="space-y-3">
            {["✓  Free account, no credit card needed", "✓  Track your orders in real time", "✓  Exclusive member discounts"].map(t => (
              <p key={t} className="text-gray-400 text-sm">{t}</p>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 md:hidden mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-base">👟</div>
              <span className="font-black text-lg">ShoeShop</span>
            </div>
            <h1 className="text-2xl font-black">Create account</h1>
            <p className="text-gray-400 text-sm mt-1">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Full Name <span className="text-red-400">*</span></label>
              <input type="text" value={form.fullName} onChange={e => field("fullName", e.target.value)} placeholder="Juan Dela Cruz" className={inp("fullName")} />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email Address <span className="text-red-400">*</span></label>
              <input type="email" value={form.email} onChange={e => field("email", e.target.value)} placeholder="juan@email.com" className={inp("email")} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Phone <span className="text-gray-300 font-normal normal-case">(optional)</span>
              </label>
              <input type="tel" value={form.phone} onChange={e => field("phone", e.target.value)} placeholder="09XX XXX XXXX" className={inp("phone")} />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => field("password", e.target.value)} placeholder="Min. 6 chars" className={`${inp("password")} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
                    {showPassword ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Confirm <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => field("confirmPassword", e.target.value)} placeholder="Re-enter" className={`${inp("confirmPassword")} pr-10`} />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
                    {showConfirm ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-50 mt-1">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-black font-bold hover:underline">Sign in</Link>
          </p>
        </div>

      </div>
    </main>
  );
}
