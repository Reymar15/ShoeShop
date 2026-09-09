"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type AuthUser = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

type UserContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => string | null;
  signup: (fullName: string, email: string, phone: string, password: string) => string | null;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("shoeshop-user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  function login(email: string, password: string): string | null {
    const accounts: AuthUser[] = JSON.parse(localStorage.getItem("shoeshop-accounts") || "[]");
    const found = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!found) return "Invalid email or password.";
    setUser(found);
    localStorage.setItem("shoeshop-user", JSON.stringify(found));
    return null;
  }

  function signup(fullName: string, email: string, phone: string, password: string): string | null {
    const accounts: AuthUser[] = JSON.parse(localStorage.getItem("shoeshop-accounts") || "[]");
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return "This email is already registered. Please log in instead.";
    }
    const newUser: AuthUser = { fullName, email, phone, password };
    accounts.push(newUser);
    localStorage.setItem("shoeshop-accounts", JSON.stringify(accounts));
    setUser(newUser);
    localStorage.setItem("shoeshop-user", JSON.stringify(newUser));
    return null;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("shoeshop-user");
  }

  return (
    <UserContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
