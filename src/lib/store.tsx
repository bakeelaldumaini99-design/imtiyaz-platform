import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { config } from "../config";
import { packs } from "../data/curriculum";

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  memberId: string;
  role: "student" | "admin";
  provider: "google";
}

export interface Subscription {
  packId: string;
  packName: string;
  startedAt: string; // ISO
  endsAt: string; // ISO
  status: "active" | "expired";
}

export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  memberId: string;
  packId: string;
  packName: string;
  amount: number;
  transferNo: string;
  receipt?: string; // data URL
  status: PaymentStatus;
  createdAt: string;
}

export interface Notice {
  id: string;
  text: string;
  date: string;
}

interface DB {
  users: Record<string, User>;
  subs: Record<string, Subscription>;
  payments: PaymentRequest[];
  notices: Notice[];
  progress: Record<string, string[]>; // userId -> completed lesson ids
}

const DB_KEY = "imtiyaz_db_v2";
const SESSION_KEY = "imtiyaz_session_v2";

const emptyDB: DB = { users: {}, subs: {}, payments: [], notices: [
  { id: "n1", text: "أهلًا بك في منصة الإمتياز — ابدأ بالمحاضرات المجانية ثم فعّل اشتراكك", date: new Date().toISOString() },
], progress: {} };

function loadDB(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return { ...emptyDB, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return emptyDB;
}

interface StoreCtx {
  user: User | null;
  db: DB;
  loginWithGoogle: (profile: { name: string; email: string; picture: string }) => void;
  logout: () => void;
  subscription: Subscription | null;
  daysLeft: number;
  submitPayment: (p: Omit<PaymentRequest, "id" | "status" | "createdAt">) => void;
  setPaymentStatus: (id: string, s: PaymentStatus) => void;
  toggleLessonDone: (lessonId: string) => void;
  doneLessons: string[];
  grantSubscription: (userId: string, packId: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

let memberCounter = Math.floor(1000 + Math.random() * 9000);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(loadDB);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const loginWithGoogle: StoreCtx["loginWithGoogle"] = (profile) => {
    const role: User["role"] = config.adminEmails.includes(profile.email.toLowerCase())
      ? "admin"
      : "student";
    setDb((prev) => {
      const existing = Object.values(prev.users).find(
        (u) => u.email.toLowerCase() === profile.email.toLowerCase()
      );
      if (existing) {
        const updated = { ...existing, name: profile.name, picture: profile.picture, role };
        setUser(updated);
        return { ...prev, users: { ...prev.users, [updated.id]: updated } };
      }
      memberCounter += 1;
      const nu: User = {
        id: "u_" + Date.now().toString(36),
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        memberId: "IMT-" + memberCounter,
        role,
        provider: "google",
      };
      setUser(nu);
      return { ...prev, users: { ...prev.users, [nu.id]: nu } };
    });
  };

  const logout = () => setUser(null);

  const subscription = useMemo<Subscription | null>(() => {
    if (!user) return null;
    const s = db.subs[user.id];
    if (!s) return null;
    const expired = new Date(s.endsAt).getTime() < Date.now();
    return { ...s, status: expired ? "expired" : "active" };
  }, [db.subs, user]);

  const daysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.endsAt).getTime() - Date.now()) / 86400000))
    : 0;

  const submitPayment: StoreCtx["submitPayment"] = (p) => {
    setDb((prev) => ({
      ...prev,
      payments: [
        {
          ...p,
          id: "pay_" + Date.now().toString(36),
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        ...prev.payments,
      ],
    }));
  };

  const grantSubscription: StoreCtx["grantSubscription"] = (userId, packId) => {
    const pack = packs.find((pk) => pk.id === packId);
    if (!pack) return;
    const start = new Date();
    const end = new Date(start.getTime() + pack.days * 86400000);
    setDb((prev) => ({
      ...prev,
      subs: {
        ...prev.subs,
        [userId]: {
          packId,
          packName: pack.name,
          startedAt: start.toISOString(),
          endsAt: end.toISOString(),
          status: "active",
        },
      },
    }));
  };

  const setPaymentStatus: StoreCtx["setPaymentStatus"] = (id, s) => {
    setDb((prev) => {
      const payments = prev.payments.map((p) => (p.id === id ? { ...p, status: s } : p));
      const target = payments.find((p) => p.id === id);
      let subs = prev.subs;
      if (target && s === "approved") {
        const pack = packs.find((pk) => pk.id === target.packId);
        if (pack) {
          const start = new Date();
          const end = new Date(start.getTime() + pack.days * 86400000);
          subs = {
            ...prev.subs,
            [target.userId]: {
              packId: pack.id,
              packName: pack.name,
              startedAt: start.toISOString(),
              endsAt: end.toISOString(),
              status: "active",
            },
          };
        }
      }
      return { ...prev, payments, subs };
    });
  };

  const toggleLessonDone: StoreCtx["toggleLessonDone"] = (lessonId) => {
    if (!user) return;
    setDb((prev) => {
      const list = prev.progress[user.id] ?? [];
      const next = list.includes(lessonId)
        ? list.filter((l) => l !== lessonId)
        : [...list, lessonId];
      return { ...prev, progress: { ...prev.progress, [user.id]: next } };
    });
  };

  const doneLessons = user ? db.progress[user.id] ?? [] : [];

  return (
    <Ctx.Provider
      value={{
        user,
        db,
        loginWithGoogle,
        logout,
        subscription,
        daysLeft,
        submitPayment,
        setPaymentStatus,
        toggleLessonDone,
        doneLessons,
        grantSubscription,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
