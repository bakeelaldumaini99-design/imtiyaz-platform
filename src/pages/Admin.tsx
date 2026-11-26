import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, Users, CreditCard, Crown, PlayCircle, CheckCircle2, XCircle,
  ArrowRight, Download, Eye, LogOut, Banknote,
} from "lucide-react";
import { useStore, type PaymentStatus } from "../lib/store";
import { units } from "../data/curriculum";
import { config } from "../config";
import Logo from "../components/Logo";

const statusLabel: Record<PaymentStatus, { t: string; cls: string }> = {
  pending: { t: "بانتظار المراجعة", cls: "bg-yellow-400/15 text-yellow-300" },
  approved: { t: "تم الدفع والتأكيد", cls: "bg-green-400/15 text-green-400" },
  rejected: { t: "مرفوض", cls: "bg-red-400/15 text-red-400" },
  cancelled: { t: "ملغى", cls: "bg-white/10 text-white/45" },
};

export default function Admin() {
  const { user, logout, db, setPaymentStatus } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = useState<"overview" | "payments" | "students">("overview");
  const [receiptView, setReceiptView] = useState<string | null>(null);

  useEffect(() => {
    if (!user) nav("/login", { replace: true });
    else if (user.role !== "admin") nav("/dashboard", { replace: true });
  }, [user, nav]);

  const stats = useMemo(() => {
    const students = Object.values(db.users).filter((u) => u.role === "student");
    const active = Object.values(db.subs).filter((s) => new Date(s.endsAt).getTime() > Date.now());
    const approved = db.payments.filter((p) => p.status === "approved");
    return {
      students: students.length,
      activeSubs: active.length,
      lectures: units.reduce((a, u) => a + u.lessons.length, 0),
      revenue: approved.reduce((a, p) => a + p.amount, 0),
      pending: db.payments.filter((p) => p.status === "pending").length,
    };
  }, [db]);

  if (!user || user.role !== "admin") return null;

  const exportCSV = () => {
    const header = "الطالب,رقم العضوية,الباقة,المبلغ,رقم الحوالة,الحالة,التاريخ\n";
    const rows = db.payments
      .map((p) => [p.userName, p.memberId, p.packName, p.amount, p.transferNo, statusLabel[p.status].t, new Date(p.createdAt).toLocaleDateString("ar-YE")].join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "imtiyaz-payments.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#050b1f]">
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/"><Logo size={40} /></Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold glass px-3 py-1.5 rounded-full text-[#eec65f]">وضع الإدارة</span>
            <button onClick={() => { logout(); nav("/"); }} className="text-white/50 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[230px_1fr] gap-8">
        {/* القائمة الجانبية */}
        <aside className="glass rounded-3xl p-4 h-fit lg:sticky lg:top-24 space-y-1">
          {[
            { id: "overview", t: "الرئيسية", icon: LayoutDashboard },
            { id: "payments", t: "طلبات الدفع", icon: CreditCard, badge: stats.pending },
            { id: "students", t: "الطلاب", icon: Users },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setTab(m.id as any)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${tab === m.id ? "bg-[#d9a83b1e] text-[#f6dd8e]" : "text-white/60 hover:bg-white/5"}`}
            >
              <m.icon className="w-4 h-4" /> {m.t}
              {m.badge ? <span className="mr-auto btn-gold text-[10px] rounded-full px-2 py-0.5 tabular">{m.badge}</span> : null}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-white/5">
            {["إدارة الوحدات", "إدارة الفيديوهات", "ملفات PDF", "الاختبارات", "الإشعارات", "أكواد الخصم", "إعدادات الموقع"].map((t) => (
              <div key={t} className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs text-white/35">
                <ArrowRight className="w-3 h-3" /> {t} <span className="mr-auto text-[9px] glass px-2 py-0.5 rounded-full">قريبًا</span>
              </div>
            ))}
          </div>
        </aside>

        {/* المحتوى */}
        <main className="space-y-8 min-w-0">
          {tab === "overview" && (
            <>
              <h1 className="text-2xl font-black anim-fade-up">لوحة تحكم <span className="text-gold-gradient">{config.teacherName}</span></h1>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { t: "الطلاب", v: stats.students, icon: Users, suffix: "" },
                  { t: "الاشتراكات النشطة", v: stats.activeSubs, icon: Crown, suffix: "" },
                  { t: "المحاضرات", v: stats.lectures, icon: PlayCircle, suffix: "" },
                  { t: "الإيرادات", v: stats.revenue, icon: Banknote, suffix: " " + config.currency },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-3xl p-5 card-hover anim-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d9a83b1e] flex items-center justify-center">
                        <s.icon className="w-5 h-5 text-[#eec65f]" />
                      </div>
                      <span className="text-sm text-white/55">{s.t}</span>
                    </div>
                    <div className="text-2xl font-black text-gold-gradient tabular">
                      {s.v.toLocaleString("ar-YE")}{s.suffix}
                    </div>
                  </div>
                ))}
              </div>
              {stats.pending > 0 && (
                <button onClick={() => setTab("payments")} className="anim-pop glass-strong border border-yellow-400/30 rounded-2xl px-5 py-4 w-full text-right flex items-center gap-3 hover:bg-yellow-400/5 transition-colors">
                  <CreditCard className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-bold">لديك {stats.pending} طلب دفع بانتظار المراجعة — اضغط للمراجعة</span>
                </button>
              )}
            </>
          )}

          {tab === "payments" && (
            <>
              <div className="flex items-center justify-between anim-fade-up">
                <h1 className="text-2xl font-black">طلبات <span className="text-gold-gradient">الدفع</span></h1>
                <button onClick={exportCSV} className="btn-ghost-navy rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2">
                  <Download className="w-4 h-4" /> تصدير CSV
                </button>
              </div>
              {db.payments.length === 0 ? (
                <div className="glass rounded-3xl p-12 text-center text-white/45 anim-fade-up">لا توجد طلبات دفع بعد</div>
              ) : (
                <div className="space-y-3">
                  {db.payments.map((p, i) => (
                    <div key={p.id} className="glass rounded-2xl p-5 anim-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-[160px]">
                          <div className="font-bold">{p.userName} <span className="text-xs text-[#eec65f] tabular" dir="ltr">({p.memberId})</span></div>
                          <div className="text-xs text-white/45">{p.packName} · <span className="tabular">{p.amount.toLocaleString("ar-YE")} {config.currency}</span> · حوالة <span className="tabular" dir="ltr">#{p.transferNo}</span></div>
                          <div className="text-[11px] text-white/35 tabular">{new Date(p.createdAt).toLocaleString("ar-YE")}</div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusLabel[p.status].cls}`}>{statusLabel[p.status].t}</span>
                        {p.receipt && (
                          <button onClick={() => setReceiptView(p.receipt!)} className="btn-ghost-navy rounded-lg px-3 py-2 text-xs font-bold flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> الإيصال
                          </button>
                        )}
                        {p.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => setPaymentStatus(p.id, "approved")} className="btn-gold rounded-lg px-4 py-2 text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتفعيل
                            </button>
                            <button onClick={() => setPaymentStatus(p.id, "rejected")} className="rounded-lg px-4 py-2 text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> رفض
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "students" && (
            <>
              <h1 className="text-2xl font-black anim-fade-up">الطلاب <span className="text-gold-gradient">المسجلون</span></h1>
              <div className="glass rounded-3xl overflow-hidden anim-fade-up">
                {Object.values(db.users).filter((u) => u.role === "student").length === 0 ? (
                  <div className="p-12 text-center text-white/45">لا يوجد طلاب مسجلون بعد</div>
                ) : (
                  Object.values(db.users).filter((u) => u.role === "student").map((s) => {
                    const sub = db.subs[s.id];
                    const active = sub && new Date(sub.endsAt).getTime() > Date.now();
                    const total = units.reduce((a, u) => a + u.lessons.length, 0);
                    const done = (db.progress[s.id] ?? []).length;
                    const pct = Math.round((done / total) * 100);
                    return (
                      <div key={s.id} className="flex flex-wrap items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                        <img src={s.picture} alt="" className="w-10 h-10 rounded-full border border-[#d9a83b44]" />
                        <div className="flex-1 min-w-[140px]">
                          <div className="font-bold text-sm">{s.name}</div>
                          <div className="text-xs text-white/40 truncate" dir="ltr">{s.email}</div>
                        </div>
                        {/* مراقبة مستوى الطالب */}
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] text-white/45 mb-1">
                            <span>المستوى</span>
                            <span className="tabular">{pct}% · {done}/{total}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-l from-[#f6dd8e] to-[#b9862a]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <span className="text-xs text-white/50 tabular" dir="ltr">{s.memberId}</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${active ? "bg-green-400/15 text-green-400" : "bg-white/10 text-white/40"}`}>
                          {active ? `نشط — ${sub.packName}` : "غير مشترك"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* عارض الإيصال */}
      {receiptView && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReceiptView(null)}>
          <img src={receiptView} alt="إيصال" className="max-w-full max-h-[85vh] rounded-2xl border border-[#d9a83b44] anim-pop" />
        </div>
      )}
    </div>
  );
}
