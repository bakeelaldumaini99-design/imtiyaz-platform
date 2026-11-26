import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, PlayCircle, Lock, CheckCircle2, FileText, ClipboardList } from "lucide-react";
import { units } from "../data/curriculum";
import { useStore } from "../lib/store";
import Logo from "../components/Logo";
import MathBackground from "../components/MathBackground";

export default function UnitView() {
  const { unitId } = useParams();
  const unit = units.find((u) => u.id === unitId);
  const { user, subscription, doneLessons } = useStore();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav("/login", { replace: true });
  }, [user, nav]);

  if (!unit || !user) return null;
  const subscribed = subscription?.status === "active";

  return (
    <div className="min-h-screen relative">
      <MathBackground count={12} dim />
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/"><Logo size={40} /></Link>
          <Link to="/dashboard" className="btn-ghost-navy rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> لوحتي
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="anim-fade-up mb-10">
          <div className="text-sm font-bold text-[#eec65f] mb-2">الوحدة {unit.index} · <span dir="ltr" className="font-tajawal">{unit.formula}</span></div>
          <h1 className="text-3xl md:text-4xl font-black">{unit.title}</h1>
          <p className="text-white/55 mt-2">{unit.desc}</p>
        </div>

        <div className="space-y-3">
          {unit.lessons.map((l, i) => {
            const locked = !l.free && !subscribed;
            const done = doneLessons.includes(l.id);
            return (
              <Link
                key={l.id}
                to={`/lesson/${l.id}`}
                className="anim-fade-up glass rounded-2xl px-5 py-4 flex items-center gap-4 card-hover group"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${done ? "bg-green-500/20 text-green-400" : locked ? "bg-white/5 text-white/35" : "btn-gold"}`}>
                  {done ? <CheckCircle2 className="w-5 h-5" /> : locked ? <Lock className="w-5 h-5" /> :
                    l.kind === "exam" ? <ClipboardList className="w-5 h-5" /> : l.kind === "review" ? <FileText className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{l.title}</div>
                  <div className="text-xs text-white/45 mt-0.5 flex items-center gap-2">
                    <span className="tabular">{l.duration}</span>
                    {l.free && <span className="text-[#eec65f] font-bold">· مجاني</span>}
                    {l.kind === "exam" && <span className="text-[#eec65f]">· اختبار</span>}
                    {locked && <span>· للمشتركين</span>}
                  </div>
                </div>
                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg ${locked ? "bg-white/5 text-white/40" : "bg-[#d9a83b1e] text-[#f6dd8e] group-hover:bg-[#d9a83b33]"} transition-colors`}>
                  {locked ? "مقفل" : done ? "إعادة" : "شاهد"}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
