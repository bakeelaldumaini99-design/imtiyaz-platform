import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, CheckCircle2, Copy, Upload, Wallet, ShieldCheck, Clock } from "lucide-react";
import { packs } from "../data/curriculum";
import { config } from "../config";
import { useStore } from "../lib/store";
import Logo from "../components/Logo";
import MathBackground from "../components/MathBackground";

export default function Checkout() {
  const { packId } = useParams();
  const { user, subscription, submitPayment, db } = useStore();
  const nav = useNavigate();
  const [selected, setSelected] = useState(packId ?? "monthly");
  const [transferNo, setTransferNo] = useState("");
  const [receipt, setReceipt] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) nav("/login", { replace: true });
  }, [user, nav]);

  if (!user) return null;
  const pack = packs.find((p) => p.id === selected) ?? packs[1];
  const hasPending = db.payments.some((p) => p.userId === user.id && p.status === "pending");

  const onFile = (f?: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setReceipt(reader.result as string);
    reader.readAsDataURL(f);
  };

  const submit = () => {
    if (!transferNo.trim() || !receipt || hasPending) return;
    submitPayment({
      userId: user.id,
      userName: user.name,
      memberId: user.memberId,
      packId: pack.id,
      packName: pack.name,
      amount: pack.price,
      transferNo: transferNo.trim(),
      receipt,
    });
    setDone(true);
  };

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
        {done ? (
          <div className="anim-pop glass-strong rounded-[2rem] p-10 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-black mb-2">تم استلام طلبك بنجاح</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-2">
              طلبك الآن <b className="text-yellow-300">بانتظار المراجعة</b>. ستقوم الإدارة بالتحقق من وصول المبلغ عبر الكريمي،
              ويُفعّل اشتراكك تلقائيًا فور الموافقة.
            </p>
            <p className="text-xs text-white/40 mb-6 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> يمكنك متابعة حالة الطلب من لوحتك الشخصية
            </p>
            <Link to="/dashboard" className="btn-gold rounded-2xl px-8 py-3.5 inline-block">العودة إلى لوحتي</Link>
          </div>
        ) : (
          <>
            <div className="anim-fade-up mb-8">
              <h1 className="text-3xl font-black">إتمام <span className="text-gold-gradient">الاشتراك</span></h1>
              <p className="text-white/55 mt-2 text-sm">الدفع اليدوي عبر تطبيق الكريمي جوال — ثلاث خطوات ويُفعّل اشتراكك</p>
            </div>

            {subscription?.status === "active" && (
              <div className="anim-fade-up glass rounded-2xl px-5 py-4 mb-8 flex items-center gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                لديك اشتراك نشط حاليًا ({subscription.packName}) — الاشتراك الجديد سيحل محله عند التأكيد.
              </div>
            )}

            <div className="grid lg:grid-cols-5 gap-8">
              {/* الخطوة 1: اختيار الباقة */}
              <div className="lg:col-span-3 space-y-8">
                <section className="anim-fade-up">
                  <h2 className="font-black mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full btn-gold text-xs flex items-center justify-center">1</span> اختر الباقة
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {packs.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelected(p.id)}
                        className={`rounded-2xl p-4 text-right transition-all border ${selected === p.id ? "glass-strong border-[#d9a83b] shadow-[0_0_30px_-8px_rgba(217,168,59,0.5)]" : "glass border-transparent hover:border-[#d9a83b44]"}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-sm">{p.name}</span>
                          {selected === p.id && <CheckCircle2 className="w-5 h-5 text-[#eec65f]" />}
                        </div>
                        <div className="text-xs text-white/45 mb-2">{p.days} يومًا · {p.tagline}</div>
                        <div className="font-black text-gold-gradient tabular">{p.price.toLocaleString("ar-YE")} {config.currency}</div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* الخطوة 2: التحويل */}
                <section className="anim-fade-up" style={{ animationDelay: "80ms" }}>
                  <h2 className="font-black mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full btn-gold text-xs flex items-center justify-center">2</span> حوّل عبر الكريمي
                  </h2>
                  <div className="glass rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl btn-gold flex items-center justify-center">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-black">حساب الكريمي الرسمي للمنصة</div>
                        <div className="text-xs text-white/45">الكريمي جوال · خدمة حاسب</div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-xl px-4 py-3">
                        <div className="text-xs text-white/45 mb-1">اسم الحساب</div>
                        <div className="font-bold">{config.kuraimi.accountName}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs text-white/45 mb-1">رقم الحساب</div>
                          <div className="font-bold tabular" dir="ltr">{config.kuraimi.accountNumber}</div>
                        </div>
                        <button
                          onClick={() => { navigator.clipboard?.writeText(config.kuraimi.accountNumber); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                          className="btn-ghost-navy rounded-lg p-2"
                          title="نسخ"
                        >
                          {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 bg-[#d9a83b14] border border-[#d9a83b33] rounded-xl px-4 py-3 text-sm flex items-center justify-between">
                      <span>المبلغ المطلوب تحويله:</span>
                      <b className="text-gold-gradient text-lg tabular">{pack.price.toLocaleString("ar-YE")} {config.currency}</b>
                    </div>
                  </div>
                </section>

                {/* الخطوة 3: تأكيد الحوالة */}
                <section className="anim-fade-up" style={{ animationDelay: "160ms" }}>
                  <h2 className="font-black mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full btn-gold text-xs flex items-center justify-center">3</span> أكّد الحوالة
                  </h2>
                  <div className="glass rounded-3xl p-6 space-y-4">
                    <div>
                      <label className="text-sm font-bold block mb-2">رقم الحوالة / العملية</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={transferNo}
                        onChange={(e) => setTransferNo(e.target.value)}
                        placeholder="مثال: 453201789"
                        className="w-full bg-white/5 border border-[#d9a83b2e] rounded-xl px-4 py-3 outline-none focus:border-[#d9a83b] transition-colors tabular"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-2">صورة إيصال الدفع</label>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                      {receipt ? (
                        <div className="relative rounded-xl overflow-hidden border border-[#d9a83b44]">
                          <img src={receipt} alt="الإيصال" className="w-full max-h-52 object-cover" />
                          <button onClick={() => setReceipt(undefined)} className="absolute top-2 left-2 glass-strong rounded-lg px-3 py-1 text-xs font-bold">تغيير</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="w-full border-2 border-dashed border-[#d9a83b44] rounded-xl py-8 flex flex-col items-center gap-2 text-white/50 hover:border-[#d9a83b] hover:text-[#eec65f] transition-colors"
                        >
                          <Upload className="w-6 h-6" />
                          <span className="text-sm font-bold">اضغط لرفع صورة الإيصال</span>
                        </button>
                      )}
                    </div>
                    {hasPending && (
                      <p className="text-xs text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-3">
                        لديك طلب دفع قيد المراجعة بالفعل — لا يمكن إرسال طلب جديد قبل معالجته.
                      </p>
                    )}
                    <button
                      onClick={submit}
                      disabled={!transferNo.trim() || !receipt || hasPending}
                      className="btn-gold w-full rounded-xl py-3.5 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      إرسال طلب التفعيل
                    </button>
                  </div>
                </section>
              </div>

              {/* ملخص */}
              <aside className="lg:col-span-2">
                <div className="glass-strong rounded-3xl p-6 sticky top-24 anim-fade-up" style={{ animationDelay: "120ms" }}>
                  <h3 className="font-black mb-4">ملخص الطلب</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-white/55">الباقة</span><b>{pack.name}</b></div>
                    <div className="flex justify-between"><span className="text-white/55">المدة</span><b className="tabular">{pack.days} يومًا</b></div>
                    <div className="flex justify-between"><span className="text-white/55">المشترك</span><b>{user.name}</b></div>
                    <div className="h-px bg-[#d9a83b22]" />
                    <div className="flex justify-between text-base"><span className="text-white/55">الإجمالي</span><b className="text-gold-gradient tabular">{pack.price.toLocaleString("ar-YE")} {config.currency}</b></div>
                  </div>
                  <div className="mt-5 flex items-start gap-2 text-[11px] text-white/45 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-[#eec65f] shrink-0 mt-0.5" />
                    يتم التحقق من الحوالة يدويًا من الإدارة قبل التفعيل، ويُمنع تكرار التفعيل لنفس رقم العملية.
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
