/** أشكال هندسية رياضية متحركة (مضلعات، دوائر، قطع مكافئ) تزيّن الخلفية */
export default function GeoDecor({ variant = "hero" }: { variant?: "hero" | "soft" }) {
  const op = variant === "hero" ? 1 : 0.5;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden style={{ opacity: op }}>
      {/* مثلث دوّار */}
      <svg
        className="absolute top-[12%] left-[6%] w-28 h-28"
        style={{ animation: "spin-slow 26s linear infinite" }}
        viewBox="0 0 100 100"
      >
        <polygon points="50,8 92,86 8,86" fill="none" stroke="#d9a83b" strokeOpacity="0.35" strokeWidth="1.5" />
        <polygon points="50,26 76,76 24,76" fill="none" stroke="#f6dd8e" strokeOpacity="0.2" strokeWidth="1" />
      </svg>

      {/* سداسي */}
      <svg
        className="absolute bottom-[16%] right-[7%] w-32 h-32"
        style={{ animation: "spin-slow 34s linear infinite reverse" }}
        viewBox="0 0 100 100"
      >
        <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" fill="rgba(217,168,59,0.05)" stroke="#eec65f" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="14" fill="none" stroke="#d9a83b" strokeOpacity="0.4" strokeWidth="1" />
      </svg>

      {/* دائرة بنصف قطر متحرك */}
      <svg
        className="absolute top-[55%] left-[14%] w-20 h-20"
        style={{ animation: "float-y 9s ease-in-out infinite" }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f6dd8e" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="8 6" />
        <line x1="50" y1="50" x2="50" y2="10" stroke="#d9a83b" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill="#d9a83b" />
      </svg>

      {/* قطع مكافئ */}
      <svg
        className="absolute top-[22%] right-[16%] w-36 h-24 hidden md:block"
        style={{ animation: "float-y 11s ease-in-out infinite reverse" }}
        viewBox="0 0 160 100"
      >
        <path d="M10 10 Q 80 190 150 10" fill="none" stroke="#eec65f" strokeOpacity="0.35" strokeWidth="2" />
        <line x1="0" y1="90" x2="160" y2="90" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
      </svg>

      {/* موجة جيبية */}
      <svg
        className="absolute bottom-[8%] left-[30%] w-52 h-20 hidden md:block"
        style={{ animation: "float-y 13s ease-in-out infinite" }}
        viewBox="0 0 220 80"
      >
        <path d="M0 40 Q 20 5, 40 40 T 80 40 T 120 40 T 160 40 T 200 40" fill="none" stroke="#d9a83b" strokeOpacity="0.35" strokeWidth="2" />
      </svg>

      {/* شبكة نقاط */}
      <svg className="absolute top-[70%] right-[22%] w-28 h-28 opacity-30" viewBox="0 0 100 100">
        {Array.from({ length: 25 }, (_, i) => (
          <circle key={i} cx={10 + (i % 5) * 20} cy={10 + Math.floor(i / 5) * 20} r="1.6" fill="#eec65f" />
        ))}
      </svg>
    </div>
  );
}
