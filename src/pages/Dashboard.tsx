import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, LogOut, Crown, CalendarDays, TrendingUp, PlayCircle,
  Bell, CreditCard, CheckCircle2, Lock, ChevronLeft, GraduationCap,
} from "lucide-react";
import { useStore } from "../lib/store";
import { units } from "../data/curriculum";
import { config } from "../config";
import Logo from "../components/Logo";
import LevelMonitor from "../components/LevelMonitor";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout, subscription, daysLeft, doneLessons, db } = useStore();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav("/login", { replace: true });
  }, [user, nav]);

  if (!user) return null;

  const totalLessons = units.reduce((a, u) => a + u.lessons.length, 0);
  const progressPct = Math.round((doneLessons.length / totalLessons) * 100);
  const myPayments = db.payments.filter((p) => p.userId === user.id);

  const statusLabel: Record<string, { t: string; c: string }> = {
    pending: { t: "بانتظار المراجعة", c: "text-yellow-300" },
    approved: { t: "تم الدفع والتأكيد", c: "text-green-400" },
    rejected: { t: "مرفوض", c: "text-red-400" },
    cancelled: { t: "ملغى", c: "text-white/40" },
  };

  return (
    <div className="min-h-screen bg-[#050b1f]">
      {/* هيدر */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/"><Logo size={40} /></Link>
          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link to="/admin" className="btn-ghost-navy rounded-xl px-4 py-2 text-sm font-bold">لوحة الإدارة</Link>
            )}
            <img src={user.picture} alt="" className="w-9 h-9 rounded-full border-2 border-[#d9a83b66]" />
            <button onClick={() => { logout(); nav("/"); }} className="text-white/50 hover:text-red-400 transition-colors" title="تسجيل الخروج">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
        {/* ترحيب */}
        <div className="anim-fade-up">
          <h1 className="text-2xl md:text-3xl font-black">أهلًا بعودتك، <span className="text-gold-gradient">{user.name}</span></h1>
          <p className="text-white/50 text-sm mt-1">رقم العضوية: <span className="text-[#eec65f] font-bold tabular" dir="ltr">{user.memberId}</span></p>
        </div>

        {/* بطاقات الحالة */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-3xl p-5 card-hover anim-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${subscription?.status === "active" ? "btn-gold" : "bg-white/10"}`}>
                <Crown className="w-5 h-5" />
              </div>
              <div className="text-sm text-white/55">حالة الاشتراك</div>
            </div>
            {subscription ? (
              <>
                <div className={`font-black ${subscription.status === "active" ? "text-green-400" : "text-red-400"}`}>
                  {subscription.status === "active" ? "نشط" : "منتهي"} — {subscription.packName}
                </div>
                <div className="text-xs text-white/45 mt-1 flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {subscription.status === "active" ? `متبقي ${daysLeft} يوم` : "جدّد اشتراكك لاستئناف المشاهدة"}
                </div>
              </>
            ) : (
              <>
                <div className="font-black text-white/85">غير مشترك</div>
                <Link to="/dashboard#packs" onClick={() => nav("/checkout/monthly")} className="text-xs text-[#eec65f] font-bold mt-1 inline-block">فعّل اشتراكك الآن ←</Link>
              </>
            )}
          </div>

          <div className="glass rounded-3xl p-5 card-hover anim-fade-up" style={{ animationDelay: "60ms" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-[#eec65f]" /></div>
              <div className="text-sm text-white/55">تقدمك الدراسي</div>
            </div>
            <div className="font-black text-xl tabular">{progressPct}%</div>
            <div className="h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-l from-[#f6dd8e] to-[#b9862a] transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="glass rounded-3xl p-5 card-hover anim-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-[#eec65f]" /></div>
              <div className="text-sm text-white/55">دروس مكتملة</div>
            </div>
            <div className="font-black text-xl tabular">{doneLessons.length} <span className="text-sm text-white/45">/ {totalLessons}</span></div>
          </div>

          <div className="glass rounded-3xl p-5 card-hover anim-fade-up" style={{ animationDelay: "180ms" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center"><Bell className="w-5 h-5 text-[#eec65f]" /></div>
              <div className="text-sm text-white/55">الإشعارات</div>
            </div>
            <div className="text-sm text-white/75 leading-relaxed line-clamp-2">{db.notices[0]?.text ?? "لا إشعارات جديدة"}</div>
          </div>
        </div>

        {/* مراقبة المستوى */}
        <LevelMonitor />

        {/* طلبات الدفع الخاصة بي */}
        {myPayments.length > 0 && (
          <section className="anim-fade-up">
            <h2 className="font-black text-xl mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#eec65f]" /> سجل المدفوعات</h2>
            <div className="glass rounded-3xl overflow-hidden">
              {myPayments.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-[140px]">
                    <div className="font-bold text-sm">{p.packName}</div>
                    <div className="text-xs text-white/40 tabular">{new Date(p.createdAt).toLocaleDateString("ar-YE")}</div>
                  </div>
                  <div className="text-sm font-bold tabular">{p.amount.toLocaleString("ar-YE")} {config.currency}</div>
                  <div className="text-xs text-white/50 tabular" dir="ltr">#{p.transferNo}</div>
                  <span className={`text-xs font-bold glass px-3 py-1 rounded-full ${statusLabel[p.status].c}`}>{statusLabel[p.status].t}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* الوحدات */}
        <section className="anim-fade-up">
          <h2 className="font-black text-xl mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-[#eec65f]" /> وحدات المنهج</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((u) => {
              const done = u.lessons.filter((l) => doneLessons.includes(l.id)).length;
              const pct = Math.round((done / u.lessons.length) * 100);
              return (
                <Link key={u.id} to={`/unit/${u.id}`} className="glass rounded-3xl p-5 card-hover group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-[#eec65f] font-bold mb-1">الوحدة {u.index}</div>
                      <h3 className="font-black">{u.title}</h3>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-white/30 group-hover:text-[#eec65f] group-hover:-translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/45 mb-2">
                    <PlayCircle className="w-3.5 h-3.5" /> {u.lessons.length} دروس · {done} مكتمل
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-l from-[#f6dd8e] to-[#b9862a]" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* دعوة للاشتراك */}
        {subscription?.status !== "active" && (
          <section className="anim-pop glass-strong rounded-[2rem] p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute -top-16 left-1/4 w-56 h-56 rounded-full bg-[#d9a83b1e] blur-3xl" />
            <Lock className="w-9 h-9 text-[#eec65f] mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2">فعّل اشتراكك وافتح كل المحتوى</h2>
            <p className="text-white/55 text-sm mb-6">الدفع عبر الكريمي جوال — والتفعيل فور تأكيد الإدارة</p>
            <Link to="/checkout/monthly" className="btn-gold rounded-2xl px-8 py-3.5 inline-flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" /> عرض الباقات والاشتراك
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
