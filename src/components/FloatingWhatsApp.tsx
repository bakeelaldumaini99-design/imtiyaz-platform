import { MessageCircle } from "lucide-react";
import { config } from "../config";

/** زر واتساب عائم للتواصل المباشر مع المعلم */
export default function FloatingWhatsApp() {
  const text = encodeURIComponent("السلام عليكم أستاذ شاجع، أنا طالب في منصة الإمتياز وأريد الاستفسار عن");
  return (
    <a
      href={`${config.whatsapp}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-[90] group"
      title={`تواصل مع المعلم — ${config.teacherPhone}`}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#2fe372] to-[#128C7E] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] group-hover:scale-110 transition-transform">
        <MessageCircle className="w-7 h-7 text-white" fill="currentColor" />
      </span>
      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap glass-strong rounded-xl px-3 py-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        تواصل مع المعلم · <span dir="ltr" className="tabular">{config.teacherPhone}</span>
      </span>
    </a>
  );
}
