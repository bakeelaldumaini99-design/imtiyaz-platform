import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useStore } from "../lib/store";
import { config } from "../config";
import MathBackground from "../components/MathBackground";
import Logo from "../components/Logo";
import GoogleAuth from "../components/GoogleAuth";

export default function Login() {
  const { user } = useStore();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
  }, [user, nav]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <MathBackground count={16} dim />

      <Link to="/" className="fixed top-5 right-5 z-50 btn-ghost-navy rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2">
        <ArrowRight className="w-4 h-4" /> الرئيسية
      </Link>

      <div className="w-full max-w-md anim-pop">
        <div className="glass-strong rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-64 h-64 rounded-full bg-[#d9a83b1c] blur-3xl pointer-events-none" />

          <div className="flex justify-center mb-8">
            <Logo size={64} withText={false} />
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-center">
            أهلًا بك في <span className="text-gold-gradient">{config.platformName}</span>
          </h1>
          <p className="text-white/55 text-center text-sm mt-3 mb-8 leading-relaxed">
            سجّل دخولك بحساب جوجل للوصول إلى المحاضرات والاختبارات ومتابعة تقدمك
          </p>

          <GoogleAuth />

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-[#d9a83b22]" />
            <span className="text-xs text-white/40">دخول آمن عبر Google</span>
            <div className="flex-1 h-px bg-[#d9a83b22]" />
          </div>

          <div className="space-y-3">
            {[
              "لا نطلب كلمة مرور — المصادقة تتم عبر جوجل مباشرة",
              "تحصل على رقم عضوية خاص بك فور التسجيل",
              "بياناتك محمية ولا تُشارك مع أي جهة",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/65">
                <ShieldCheck className="w-4 h-4 text-[#eec65f] shrink-0" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 glass rounded-2xl p-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#eec65f] shrink-0" />
            <p className="text-xs text-white/60 leading-relaxed">
              جديد هنا؟ سيتم إنشاء حسابك تلقائيًا عند أول تسجيل دخول، ويمكنك تجربة المحاضرات المجانية قبل الاشتراك.
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/35 mt-6">
          بتسجيل الدخول أنت توافق على شروط الاستخدام وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
}
