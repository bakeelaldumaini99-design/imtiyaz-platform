import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, CheckCircle2, FileText, ChevronRight, ChevronLeft, Download, Eye, Lock } from "lucide-react";
import { units } from "../data/curriculum";
import { useStore } from "../lib/store";
import Logo from "../components/Logo";
import SecurePlayer from "../components/SecurePlayer";
import { config } from "../config";

export default function LessonView() {
  const { lessonId } = useParams();
  const { user, subscription, doneLessons, toggleLessonDone } = useStore();
  const nav = useNavigate();

  const found = units
    .map((u) => ({ unit: u, idx: u.lessons.findIndex((l) => l.id === lessonId) }))
    .find((x) => x.idx >= 0);

  useEffect(() => {
    if (!user) nav("/login", { replace: true });
  }, [user, nav]);

  if (!found || !user) return null;
  const { unit, idx } = found;
  const lesson = unit.lessons[idx];
  const prev = unit.lessons[idx - 1];
  const next = unit.lessons[idx + 1];
  const subscribed = subscription?.status === "active";
  const locked = !lesson.free && !subscribed;
  const done = doneLessons.includes(lesson.id);

  return (
    <div className="min-h-screen bg-[#050b1f]">
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/"><Logo size={40} /></Link>
          <Link to={`/unit/${unit.id}`} className="btn-ghost-navy rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> {unit.title}
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="anim-fade-up">
          <div className="text-xs font-bold text-[#eec65f] mb-1">{unit.title} · الدرس {idx + 1}</div>
          <h1 className="text-2xl md:text-3xl font-black">{lesson.title}</h1>
        </div>

        <div className="anim-fade-up" id={`player-${lesson.id}`}>
          <SecurePlayer lessonId={lesson.id} title={lesson.title} locked={locked} />
        </div>

        {locked ? (
          <div className="anim-pop glass-strong rounded-3xl p-8 text-center">
            <Lock className="w-8 h-8 text-[#eec65f] mx-auto mb-3" />
            <h2 className="font-black text-xl mb-2">افتح هذه المحاضرة مع اشتراكك</h2>
            <p className="text-white/55 text-sm mb-6">باقات تبدأ من {Math.min(...[3000, 8000]).toLocaleString("ar-YE")} {config.currency} — تفعيل سريع بعد التحويل بالكريمي</p>
            <Link to="/checkout/monthly" className="btn-gold rounded-2xl px-8 py-3.5 inline-block">عرض الباقات</Link>
          </div>
        ) : (
          <>
            {/* إجراءات الدرس */}
            <div className="flex flex-wrap items-center gap-3 anim-fade-up">
              <button
                onClick={() => toggleLessonDone(lesson.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold flex items-center gap-2 transition-all ${done ? "bg-green-500/20 text-green-400 border border-green-500/30" : "btn-gold"}`}
              >
                <CheckCircle2 className="w-4 h-4" /> {done ? "مكتمل — إلغاء التحديد" : "تحديد الدرس كمكتمل"}
              </button>
              <div className="flex-1" />
              {prev && (
                <Link to={`/lesson/${prev.id}`} className="btn-ghost-navy rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" /> السابق
                </Link>
              )}
              {next && (
                <Link to={`/lesson/${next.id}`} className="btn-ghost-navy rounded-xl px-4 py-2.5 text-sm font-bold flex items-center gap-1">
                  التالي <ChevronLeft className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* ملفات الدرس */}
            <section className="anim-fade-up">
              <h2 className="font-black text-lg mb-4">ملفات الدرس</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { t: `ملخص ${lesson.title}`, k: "ملخص", dl: false },
                  { t: "تمارين وواجبات", k: "تمارين", dl: subscribed },
                  { t: "قوانين رياضية — " + unit.title, k: "قوانين", dl: false },
                ].map((f, i) => (
                  <div key={i} className="glass rounded-2xl p-4 flex items-center gap-3 card-hover">
                    <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{f.t}</div>
                      <div className="text-xs text-white/40">PDF · {f.k} · {f.dl ? "متاح للتنزيل" : "مشاهدة فقط"}</div>
                    </div>
                    <button className="btn-ghost-navy rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> عرض
                    </button>
                    {f.dl && (
                      <button className="btn-ghost-navy rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-white/35 mt-3">الملفات المحمية تحمل علامة مائية باسمك ورقم عضويتك، ولا يمكن مشاركتها.</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
