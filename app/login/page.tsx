"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const { login, user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setLoading(true);
    const err = login(email.trim(), password);
    if (err) { setError(err); setLoading(false); return; }
    router.push("/");
  }

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
              Step into<br />your style.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover premium shoes for every occasion. Log in to track orders, manage your profile, and shop your favorites.
            </p>
          </div>
          <div className="flex gap-6 text-center">
            {[["500+", "Products"], ["50+", "Brands"], ["10k+", "Customers"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-xl font-black">{n}</p>
                <p className="text-gray-500 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 md:hidden mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-base">👟</div>
              <span className="font-black text-lg">ShoeShop</span>
            </div>
            <h1 className="text-2xl font-black">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email Address</label>
              <input
                type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="juan@email.com" autoComplete="email"
                className="w-full border-2 border-gray-100 focus:border-black rounded-xl px-4 py-3 text-sm focus:outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password" autoComplete="current-password"
                  className="w-full border-2 border-gray-100 focus:border-black rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition bg-gray-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition p-1">
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-50 mt-2">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-black font-bold hover:underline">Create one</Link>
          </p>
        </div>

      </div>
    </main>
  );
}
