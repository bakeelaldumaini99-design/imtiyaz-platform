import { useEffect, useRef, useState } from "react";
import { config } from "../config";
import { useStore } from "../lib/store";

declare global {
  interface Window {
    google?: any;
  }
}

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(decodeURIComponent(escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))));
  } catch {
    return null;
  }
}

const DEMO_ACCOUNTS = [
  { name: "أحمد الحميري", email: "ahmed.student@gmail.com" },
  { name: "سارة المطري", email: "sara.student@gmail.com" },
  { name: "شاجع الدميني", email: "shaje.dumaini@gmail.com" },
];

function avatarFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f1d42&color=eec65f&bold=true`;
}

/**
 * زر «الدخول بحساب جوجل».
 * - إذا تم ضبط config.googleClientId يعمل الدخول الحقيقي عبر Google Identity Services.
 * - بدونه يظهر محاكاة كاملة لواجهة اختيار حساب جوجل (وضع تجريبي).
 */
export default function GoogleAuth({ onDone }: { onDone?: () => void }) {
  const { loginWithGoogle } = useStore();
  const realBtn = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const hasClientId = Boolean(config.googleClientId);

  useEffect(() => {
    if (!hasClientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: (resp: { credential: string }) => {
          const payload = decodeJwt(resp.credential);
          if (payload) {
            loginWithGoogle({
              name: payload.name,
              email: payload.email,
              picture: payload.picture || avatarFor(payload.name),
            });
            onDone?.();
          }
        },
      });
      if (realBtn.current) {
        window.google?.accounts.id.renderButton(realBtn.current, {
          theme: "filled_black",
          size: "large",
          shape: "pill",
          width: 320,
          text: "continue_with",
          locale: "ar",
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [hasClientId]);

  const pickDemo = (acc: (typeof DEMO_ACCOUNTS)[number]) => {
    setLoadingEmail(acc.email);
    setTimeout(() => {
      loginWithGoogle({ name: acc.name, email: acc.email, picture: avatarFor(acc.name) });
      setLoadingEmail(null);
      setPickerOpen(false);
      onDone?.();
    }, 900);
  };

  return (
    <div className="w-full">
      {hasClientId ? (
        <div ref={realBtn} className="flex justify-center" dir="ltr" />
      ) : (
        <>
          <button
            onClick={() => setPickerOpen(true)}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white text-[#1f1f1f] font-bold py-3.5 px-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <GoogleG />
            <span>المتابعة بحساب جوجل</span>
          </button>
          <p className="text-[11px] text-white/40 text-center mt-2">
            وضع تجريبي — ضع Google Client ID في <code className="text-gold-400">src/config.ts</code> لتفعيل الدخول الحقيقي
          </p>
        </>
      )}

      {/* محاكاة نافذة اختيار حساب جوجل */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPickerOpen(false)}>
          <div className="anim-pop w-full max-w-sm rounded-2xl bg-white text-[#1f1f1f] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="pt-6 pb-4 px-6 text-center border-b border-gray-200">
              <div className="flex justify-center mb-3"><GoogleG size={30} /></div>
              <h3 className="font-bold text-lg">تسجيل الدخول باستخدام حساب Google</h3>
              <p className="text-sm text-gray-500 mt-1">
                للمتابعة إلى: <span className="text-[#b9862a] font-semibold">منصة الإمتياز</span>
              </p>
            </div>
            <div className="py-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => pickDemo(acc)}
                  className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors text-right"
                >
                  <img src={avatarFor(acc.name)} alt="" className="w-9 h-9 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{acc.name}</div>
                    <div className="text-xs text-gray-500 truncate" dir="ltr">{acc.email}</div>
                  </div>
                  {loadingEmail === acc.email && (
                    <div className="w-5 h-5 border-2 border-[#b9862a] border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              ))}
              <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors text-right border-t border-gray-200">
                <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">+</div>
                <span className="text-sm font-semibold text-gray-600">استخدام حساب آخر</span>
              </button>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-[11px] text-gray-400 border-t border-gray-200">
              لمتابعة تسجيل الدخول، ستشارك Google اسمك وبريدك الإلكتروني وصورتك مع منصة الإمتياز.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}
