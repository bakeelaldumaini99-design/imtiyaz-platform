import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  PlayCircle, GraduationCap, ShieldCheck, CreditCard, Sparkles, ChevronDown,
  Sigma, Hash, Dices, Orbit, Box, TrendingUp, Pi, Blocks, Target, FileBadge,
  LibraryBig, NotebookPen, Timer, Star, MessageCircle, Send, LogIn, LayoutDashboard,
  CheckCircle2, Lock,
} from "lucide-react";
import { config } from "../config";
import { units, extraSections, packs } from "../data/curriculum";
import { useStore } from "../lib/store";
import MathBackground from "../components/MathBackground";
import Logo from "../components/Logo";
import GeoDecor from "../components/GeoDecor";

const iconMap: Record<string, any> = { Sigma, Hash, Dices, Orbit, Box, TrendingUp, Pi, Blocks, Target, FileBadge, LibraryBig, NotebookPen, Timer };

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1800);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref} className="tabular">
      {val.toLocaleString("ar-YE")}{suffix}
    </span>
  );
}

export default function Home() {
  const { user } = useStore();
  const nav = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useReveal();

  const freeLessons = units.flatMap((u) => u.lessons.filter((l) => l.free).map((l) => ({ ...l, unit: u.title })));

  return (
    <div className="relative min-h-screen">
      <MathBackground />

      {/* ======= الهيدر ======= */}
      <header className="fixed top-0 inset-x-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-white/75">
            <a href="#units" className="hover:text-[#eec65f] transition-colors">الوحدات</a>
            <a href="#free" className="hover:text-[#eec65f] transition-colors">محاضرات مجانية</a>
            <a href="#packs" className="hover:text-[#eec65f] transition-colors">الباقات</a>
            <a href="#faq" className="hover:text-[#eec65f] transition-colors">الأسئلة الشائعة</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-gold rounded-xl px-4 md:px-6 py-2.5 text-sm flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> لوحتي
              </Link>
            ) : (
              <Link to="/login" className="btn-gold rounded-xl px-4 md:px-6 py-2.5 text-sm flex items-center gap-2">
                <LogIn className="w-4 h-4" /> تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ======= البطل ======= */}
      <section className="relative pt-32 md:pt-44 pb-20 px-4 md:px-8">
        <GeoDecor variant="hero" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="anim-fade-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-bold text-[#f6dd8e] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              المنهج اليمني · الصف الثالث الثانوي · علمي
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.25]">
              طريقك نحو <span className="text-gold-gradient">التفوق</span>
              <br />
              في الرياضيات يبدأ من هنا
            </h1>
            <p className="mt-6 text-lg text-white/65 leading-relaxed max-w-xl">
              {config.platformName} {config.platformSuffix} تحت إشراف {config.teacherName} —
              محاضرات محمية بجودة عالية، ملفات وملخصات، اختبارات إلكترونية، ومتابعة حقيقية لتقدمك.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <button onClick={() => nav(user ? "/dashboard" : "/login")} className="btn-gold rounded-2xl px-8 py-4 text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> ابدأ التعلم الآن
              </button>
              <a href="#packs" className="btn-ghost-navy rounded-2xl px-8 py-4 text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> اشترك الآن
              </a>
            </div>
            {/* إحصائيات */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: 7, s: "", l: "وحدات تعليمية" },
                { n: 52, s: "+", l: "محاضرة" },
                { n: 100, s: "%", l: "منهج علمي" },
              ].map((st, i) => (
                <div key={i} className="glass rounded-2xl p-4 text-center card-hover">
                  <div className="text-2xl md:text-3xl font-black text-gold-gradient">
                    <Counter to={st.n} suffix={st.s} />
                  </div>
                  <div className="text-xs text-white/55 mt-1">{st.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* البطاقة البصرية */}
          <div className="relative anim-fade-up hidden lg:block" style={{ animationDelay: "0.15s" }}>
            <div className="relative glass-strong rounded-[2rem] p-8 overflow-hidden card-hover">
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#d9a83b22] blur-3xl" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#16275a] to-[#0a1430] gold-border flex items-center justify-center text-3xl font-black text-gold-gradient font-tajawal">
                  ∫
                </div>
                <div>
                  <div className="font-black text-xl">{config.teacherName}</div>
                  <div className="text-white/55 text-sm">معلم الرياضيات — {config.slogan}</div>
                </div>
              </div>
              <div className="space-y-3 font-tajawal text-lg" dir="ltr">
                {["z = a + bi", "P(A ∩ B) = P(A)·P(B|A)", "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C"].map((eq, i) => (
                  <div key={i} className="glass rounded-xl px-5 py-3 text-[#f6dd8e]/90 text-center font-bold tracking-wider anim-fade-up" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                    {eq}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex -space-x-3 space-x-reverse">
                  {["أ", "س", "م", "ن"].map((c, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3472] to-[#0f1d42] border-2 border-[#d9a83b66] flex items-center justify-center text-sm font-black text-[#f6dd8e]">
                      {c}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[#eec65f]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" fill="currentColor" />)}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass-strong rounded-2xl px-5 py-3 flex items-center gap-3 anim-fade-up" style={{ animationDelay: "0.6s" }}>
              <ShieldCheck className="w-6 h-6 text-[#eec65f]" />
              <div className="text-xs"><b>محتوى محمي</b><br /><span className="text-white/55">بث آمن + علامة مائية</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= شريط متحرك ======= */}
      <div className="relative py-4 border-y border-[#d9a83b22] bg-[#0a1430]/60 overflow-hidden">
        <div className="marquee-track gap-12 text-sm font-bold text-white/60">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex gap-12 shrink-0" dir="rtl">
              {["محاضرات محمية", "مشاهدة حسب الاشتراك", "الدفع بالكريمي", "اشتراكات إلكترونية", "اختبارات إلكترونية", "بنك أسئلة", "نماذج وزارية", "متابعة التقدم"].map((t, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d9a83b]" /> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ======= الوحدات ======= */}
      <section id="units" className="relative py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="text-sm font-bold text-[#eec65f] mb-3">المنهج كاملًا</div>
            <h2 className="text-3xl md:text-5xl font-black">الوحدات <span className="text-gold-gradient">السبع</span></h2>
            <p className="text-white/55 mt-4 max-w-xl mx-auto">منهج الرياضيات للصف الثالث الثانوي العلمي وفق الطبعة المعتمدة 2025–2026</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {units.map((u, i) => {
              const Icon = iconMap[u.icon] ?? Sigma;
              return (
                <Link
                  key={u.id}
                  to={`/unit/${u.id}`}
                  className="reveal glass rounded-3xl p-6 card-hover group relative overflow-hidden"
                  style={{ transitionDelay: `${(i % 4) * 60}ms` }}
                >
                  <div className="absolute top-4 left-5 text-5xl font-black text-white/[0.06] group-hover:text-[#d9a83b26] transition-colors tabular">{u.index}</div>
                  <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#16275a] to-[#0a1430] gold-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#eec65f]" />
                  </div>
                  <div className="font-tajawal text-[#eec65f]/80 font-bold text-sm mb-1" dir="ltr">{u.formula}</div>
                  <h3 className="font-black text-lg mb-1">الوحدة {u.index}: {u.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{u.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#f6dd8e] font-bold">
                    <PlayCircle className="w-4 h-4" /> {u.lessons.length} دروس
                  </div>
                </Link>
              );
            })}
            {/* بطاقة الأقسام الإضافية */}
            <div className="reveal glass rounded-3xl p-6 card-hover border-[#d9a83b44]" style={{ transitionDelay: "420ms" }}>
              <div className="w-[52px] h-[52px] rounded-2xl btn-gold flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg mb-3">أقسام إضافية</h3>
              <ul className="space-y-2 text-sm text-white/60">
                {extraSections.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#eec65f]" /> {s.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======= محاضرات مجانية ======= */}
      <section id="free" className="relative py-24 px-4 md:px-8 bg-[#0a1430]/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12 reveal">
            <div>
              <div className="text-sm font-bold text-[#eec65f] mb-3">جرّب قبل الاشتراك</div>
              <h2 className="text-3xl md:text-5xl font-black">محاضرات <span className="text-gold-gradient">مجانية</span></h2>
            </div>
            <Link to={user ? "/dashboard" : "/login"} className="btn-ghost-navy rounded-xl px-6 py-3 font-bold text-sm">
              عرض الكل داخل المنصة
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {freeLessons.map((l, i) => (
              <Link
                key={l.id}
                to={`/lesson/${l.id}`}
                className="reveal glass rounded-3xl overflow-hidden card-hover group"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <div className="relative aspect-video bg-gradient-to-br from-[#16275a] to-[#050b1f] flex items-center justify-center">
                  <span className="absolute top-3 right-3 btn-gold text-[11px] rounded-full px-3 py-1">مجاني</span>
                  <div className="w-14 h-14 rounded-full glass-strong flex items-center justify-center group-hover:scale-125 transition-transform">
                    <PlayCircle className="w-7 h-7 text-[#eec65f]" />
                  </div>
                  <span className="absolute bottom-3 left-3 text-[11px] glass px-2 py-0.5 rounded-md tabular">{l.duration}</span>
                </div>
                <div className="p-5">
                  <div className="text-xs text-[#eec65f] font-bold mb-1">{l.unit}</div>
                  <h3 className="font-bold">{l.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======= الباقات ======= */}
      <section id="packs" className="relative py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="text-sm font-bold text-[#eec65f] mb-3">استثمر في مستقبلك</div>
            <h2 className="text-3xl md:text-5xl font-black">باقات <span className="text-gold-gradient">الاشتراك</span></h2>
            <p className="text-white/55 mt-4">الدفع عبر الكريمي جوال — تفعيل سريع بعد تأكيد الحوالة</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {packs.map((p, i) => (
              <div
                key={p.id}
                className={`reveal rounded-3xl p-6 card-hover relative ${p.popular ? "glass-strong border-2 border-[#d9a83b88] lg:-translate-y-3" : "glass"}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 right-1/2 translate-x-1/2 btn-gold text-xs rounded-full px-4 py-1.5">الأكثر اختيارًا</span>
                )}
                <h3 className="font-black text-lg">{p.name}</h3>
                <div className="text-white/50 text-sm mb-4">{p.tagline}</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-gold-gradient tabular">{p.price.toLocaleString("ar-YE")}</span>
                  <span className="text-white/50 text-sm">{config.currency}</span>
                </div>
                <div className="text-xs text-[#eec65f] font-bold mb-5">{p.days} يومًا</div>
                <ul className="space-y-2.5 mb-6">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-[#eec65f] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => nav(user ? `/checkout/${p.id}` : "/login")}
                  className={`w-full rounded-xl py-3 font-bold text-sm ${p.popular ? "btn-gold" : "btn-ghost-navy"}`}
                >
                  اختر الباقة
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= آراء الطلاب ======= */}
      <section className="relative py-24 px-4 md:px-8 bg-[#0a1430]/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl md:text-5xl font-black">ماذا يقول <span className="text-gold-gradient">طلابنا</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "محمد العريقي", g: "صنعاء", t: "شرح الأستاذ شاجع يوصل المعلومة ببساطة، الوحدات مرتبة والاختبارات ساعدتني أعرف مستواي أول بأول." },
              { n: "نور الهدى السقاف", g: "عدن", t: "أفضل منصة جربتها، الملخصات وملفات القوانين وفرت علي وقت المراجعة كثير. التفعيل بعد التحويل كان سريع." },
              { n: "عبدالله الشرعبي", g: "تعز", t: "كنت ضعيف بالتفاضل والتكامل، بعد متابعة المحاضرات والتمارين صارت أسهل وحدتين عندي. شكرًا أستاذ شاجع." },
            ].map((r, i) => (
              <div key={i} className="reveal glass rounded-3xl p-6 card-hover" style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="flex items-center gap-1 text-[#eec65f] mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4" fill="currentColor" />)}
                </div>
                <p className="text-white/75 leading-relaxed text-sm mb-5">"{r.t}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3472] to-[#0f1d42] gold-border flex items-center justify-center font-black text-[#f6dd8e]">
                    {r.n[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{r.n}</div>
                    <div className="text-xs text-white/45">{r.g}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= الأسئلة الشائعة ======= */}
      <section id="faq" className="relative py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-5xl font-black">الأسئلة <span className="text-gold-gradient">الشائعة</span></h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "كيف أشترك في المنصة؟", a: "سجّل دخولك بحساب جوجل، اختر الباقة المناسبة، حوّل المبلغ عبر تطبيق الكريمي إلى الحساب الظاهر لك، ثم أدخل رقم الحوالة وصورة الإيصال — ويُفعّل اشتراكك فور تأكيد الإدارة." },
              { q: "هل تسجيل الدخول آمن؟", a: "نعم، الدخول يتم عبر حساب جوجل مباشرة دون أن نطلب كلمة مرور منك، ويحصل كل طالب على رقم عضوية خاص به." },
              { q: "هل أستطيع المشاهدة من الجوال؟", a: "نعم، المنصة متجاوبة بالكامل مع الهواتف ويمكن تثبيتها على شاشة الهاتف كتطبيق، مع اختيار جودة الفيديو حسب سرعة الإنترنت." },
              { q: "ماذا يحدث عند انتهاء اشتراكي؟", a: "يتوقف الوصول للمحتوى المدفوع تلقائيًا مع بقاء حسابك وتقدمك الدراسي محفوظًا، وتصلك تنبيهات قبل الانتهاء بثلاثة أيام ويوم واحد." },
              { q: "هل يمكن مشاركة حسابي مع شخص آخر؟", a: "الحساب شخصي ويظهر اسمك ورقم عضويتك كعلامة مائية أثناء المشاهدة، وتستطيع الإدارة إيقاف الحسابات المخالفة." },
            ].map((f, i) => (
              <div key={i} className="reveal glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right font-bold hover:bg-white/5 transition-colors"
                >
                  {f.q}
                  <ChevronDown className={`w-5 h-5 text-[#eec65f] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ${openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-white/60 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= تواصل مع المعلم ======= */}
      <section className="relative py-24 px-4 md:px-8 bg-[#0a1430]/40 overflow-hidden">
        <GeoDecor variant="soft" />
        <div className="max-w-4xl mx-auto relative">
          <div className="reveal glass-strong rounded-[2.5rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* بطاقة المعلم */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[#16275a] to-[#0a1430] gold-border flex items-center justify-center text-5xl font-black text-gold-gradient shadow-[0_0_50px_-10px_rgba(217,168,59,0.5)]">
                  ش
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-[#0a1430]" title="متاح الآن" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <div className="text-sm font-bold text-[#eec65f] mb-1">تواصل مباشر مع المعلم</div>
                <h2 className="text-2xl md:text-3xl font-black mb-2">{config.teacherName}</h2>
                <p className="text-white/55 text-sm mb-5">عندك سؤال في درس؟ استفسار عن الاشتراك؟ راسل الأستاذ مباشرة</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <a
                    href={config.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl px-6 py-3.5 font-bold text-sm flex items-center gap-2 bg-gradient-to-br from-[#2fe372] to-[#128C7E] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(37,211,102,0.7)] transition-all"
                  >
                    <MessageCircle className="w-5 h-5" fill="currentColor" />
                    واتساب
                    <span dir="ltr" className="tabular opacity-90">+967 {config.teacherPhone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}</span>
                  </a>
                  <a href={config.telegram} target="_blank" rel="noreferrer" className="btn-ghost-navy rounded-2xl px-6 py-3.5 font-bold text-sm flex items-center gap-2">
                    <Send className="w-5 h-5" /> تليجرام
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="relative py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto reveal glass-strong rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 right-1/3 w-72 h-72 rounded-full bg-[#d9a83b1e] blur-3xl" />
          <Lock className="w-10 h-10 text-[#eec65f] mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-black mb-4">جاهز تبدأ رحلة <span className="text-gold-gradient">الإمتياز</span>؟</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">سجّل دخولك بحساب جوجل خلال ثوانٍ وابدأ بالمحاضرات المجانية فورًا</p>
          <button onClick={() => nav(user ? "/dashboard" : "/login")} className="btn-gold rounded-2xl px-10 py-4 text-lg">
            {user ? "الدخول إلى لوحتي" : "سجّل بحساب جوجل"}
          </button>
        </div>
      </section>

      {/* ======= الفوتر ======= */}
      <footer className="relative border-t border-[#d9a83b22] bg-[#050b1f] py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <a href={config.whatsapp} target="_blank" rel="noreferrer" className="glass w-11 h-11 rounded-xl flex items-center justify-center hover:border-[#25D366] transition-colors" title="واتساب المعلم">
                <MessageCircle className="w-5 h-5 text-[#2fe372]" />
              </a>
              <a href={config.telegram} target="_blank" rel="noreferrer" className="glass w-11 h-11 rounded-xl flex items-center justify-center hover:border-[#d9a83b88] transition-colors" title="تليجرام">
                <Send className="w-5 h-5 text-[#eec65f]" />
              </a>
            </div>
            <a href={config.whatsapp} target="_blank" rel="noreferrer" className="text-xs text-[#eec65f] font-bold tabular hover:underline" dir="ltr">
              +967 {config.teacherPhone}
            </a>
          </div>
          <p className="text-xs text-white/40 text-center">
            {config.platformName} {config.platformSuffix} · {config.teacherName} · جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
