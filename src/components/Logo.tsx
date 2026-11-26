import { config } from "../config";

export default function Logo({ size = 48, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 96 96" width={size} height={size}>
          <defs>
            <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6dd8e" />
              <stop offset="0.55" stopColor="#d9a83b" />
              <stop offset="1" stopColor="#b9862a" />
            </linearGradient>
          </defs>
          {/* graduation cap */}
          <path d="M48 8 L86 24 L48 40 L10 24 Z" fill="#16275a" stroke="url(#goldG)" strokeWidth="2" />
          <path d="M70 32 v14 c0 6 -10 10 -22 10 s-22 -4 -22 -10 v-14" fill="none" stroke="#16275a" strokeWidth="5" />
          <line x1="86" y1="24" x2="86" y2="44" stroke="url(#goldG)" strokeWidth="2.5" />
          <circle cx="86" cy="47" r="3.4" fill="url(#goldG)" />
          {/* shield */}
          <path
            d="M48 46 C56 50 64 52 72 52 C72 70 62 82 48 88 C34 82 24 70 24 52 C32 52 40 50 48 46 Z"
            fill="rgba(217,168,59,0.08)"
            stroke="url(#goldG)"
            strokeWidth="3"
          />
          {/* امتياز monogram */}
          <text x="48" y="72" textAnchor="middle" fontSize="24" fontWeight="800" fill="url(#goldG)" fontFamily="Cairo, sans-serif">
            إ
          </text>
          <path d="M30 56 l4 -3 M66 56 l-4 -3" stroke="#f6dd8e" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 rounded-full anim-pulse-ring pointer-events-none" />
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="font-black text-xl md:text-2xl">
            <span className="text-gold-gradient">{config.platformName}</span>{" "}
            <span className="text-white/90">{config.platformSuffix}</span>
          </div>
          <div className="text-[11px] md:text-xs text-white/55 font-medium">{config.teacherName}</div>
        </div>
      )}
    </div>
  );
}
