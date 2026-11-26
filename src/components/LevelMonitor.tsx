import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell,
} from "recharts";
import { Trophy, Flame, Star, Target, Zap, Medal } from "lucide-react";
import { units } from "../data/curriculum";
import { useStore } from "../lib/store";

const LEVELS = [
  { name: "مبتدئ", min: 0, icon: Star, color: "#94a3b8" },
  { name: "نشيط", min: 50, icon: Zap, color: "#7dd3fc" },
  { name: "مجتهد", min: 120, icon: Flame, color: "#f6dd8e" },
  { name: "متقدم", min: 250, icon: Target, color: "#eec65f" },
  { name: "متميز", min: 400, icon: Medal, color: "#d9a83b" },
  { name: "أسطورة الإمتياز", min: 550, icon: Trophy, color: "#f6dd8e" },
];

const GOLD_PALETTE = ["#f6dd8e", "#eec65f", "#d9a83b", "#c99b34", "#b9862a", "#a4741f", "#8f6419"];

export default function LevelMonitor() {
  const { doneLessons } = useStore();

  const perUnit = useMemo(
    () =>
      units.map((u) => {
        const done = u.lessons.filter((l) => doneLessons.includes(l.id)).length;
        return {
          name: u.title.length > 12 ? u.title.slice(0, 12) + "…" : u.title,
          full: u.title,
          done,
          total: u.lessons.length,
          pct: Math.round((done / u.lessons.length) * 100),
        };
      }),
    [doneLessons]
  );

  const points = doneLessons.length * 10;
  const levelIdx = LEVELS.reduce((acc, l, i) => (points >= l.min ? i : acc), 0);
  const level = LEVELS[levelIdx];
  const next = LEVELS[levelIdx + 1];
  const toNext = next ? Math.min(100, Math.round(((points - level.min) / (next.min - level.min)) * 100)) : 100;

  const totalLessons = units.reduce((a, u) => a + u.lessons.length, 0);
  const examsDone = doneLessons.filter((id) => id.endsWith("l8") || id.endsWith("l10") || id.endsWith("l11") || id.endsWith("l6") || id.endsWith("l5")).length;

  const stats = [
    { icon: Star, label: "نقاط التفوق", value: points, suffix: " نقطة" },
    { icon: Flame, label: "دروس مكتملة", value: doneLessons.length, suffix: ` / ${totalLessons}` },
    { icon: Target, label: "اختبارات منجزة", value: examsDone, suffix: "" },
    { icon: Zap, label: "معدل الإنجاز", value: Math.round((doneLessons.length / totalLessons) * 100), suffix: "%" },
  ];

  return (
    <section className="anim-fade-up">
      <h2 className="font-black text-xl mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-[#eec65f]" /> مراقبة المستوى
      </h2>

      {/* بطاقة المستوى الحالي */}
      <div className="glass-strong rounded-3xl p-6 mb-4 relative overflow-hidden card-hover">
        <div className="absolute -top-14 -left-14 w-48 h-48 rounded-full bg-[#d9a83b1c] blur-3xl" />
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#16275a] to-[#0a1430] gold-border flex items-center justify-center">
              <level.icon className="w-9 h-9" style={{ color: level.color }} />
            </div>
            <div className="absolute -bottom-2 -right-2 btn-gold text-[10px] rounded-full px-2.5 py-0.5 tabular">
              مسـتوى {levelIdx + 1}
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-black text-2xl text-gold-gradient">{level.name}</div>
            <div className="text-xs text-white/50 mb-2">
              {next ? `${next.min - points} نقطة للوصول إلى «${next.name}»` : "أعلى مستوى في المنصة — أنت أسطورة!"}
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-[#f6dd8e] via-[#d9a83b] to-[#b9862a] transition-all duration-1000"
                style={{ width: `${toNext}%` }}
              />
            </div>
          </div>
          {/* سلم المستويات */}
          <div className="flex gap-1.5">
            {LEVELS.map((l, i) => (
              <div
                key={l.name}
                title={l.name}
                className={`w-3.5 rounded-full transition-all ${i <= levelIdx ? "bg-gradient-to-t from-[#b9862a] to-[#f6dd8e]" : "bg-white/10"}`}
                style={{ height: `${18 + i * 7}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="glass rounded-2xl p-4 card-hover text-center">
            <s.icon className="w-5 h-5 text-[#eec65f] mx-auto mb-2" />
            <div className="font-black text-xl tabular">
              {s.value.toLocaleString("ar-YE")}<span className="text-xs text-white/45">{s.suffix}</span>
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* الرسوم البيانية */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* مخطط شريطي: الدروس المكتملة لكل وحدة */}
        <div className="glass rounded-3xl p-5 card-hover">
          <h3 className="font-bold text-sm mb-4 text-white/80">الدروس المكتملة لكل وحدة</h3>
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perUnit} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#ffffff88", fontSize: 10, fontFamily: "Cairo" }} tickLine={false} axisLine={{ stroke: "#ffffff22" }} interval={0} angle={-18} textAnchor="end" height={48} />
                <YAxis tick={{ fill: "#ffffff55", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "#d9a83b14" }}
                  contentStyle={{ background: "#0a1430", border: "1px solid #d9a83b44", borderRadius: 12, fontFamily: "Cairo", fontSize: 12 }}
                  labelStyle={{ color: "#f6dd8e", fontWeight: 800 }}
                  formatter={(v: any, _n: any, item: any) => [`${v} من ${item?.payload?.total}`, "مكتمل"]}
                  labelFormatter={(_l, payload) => payload?.[0]?.payload?.full ?? ""}
                />
                <Bar dataKey="done" radius={[6, 6, 0, 0]} maxBarSize={26}>
                  {perUnit.map((_, i) => (
                    <Cell key={i} fill={GOLD_PALETTE[i % GOLD_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* مخطط رادار: نسبة الإتقان */}
        <div className="glass rounded-3xl p-5 card-hover">
          <h3 className="font-bold text-sm mb-4 text-white/80">خريطة الإتقان (%)</h3>
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={perUnit} outerRadius="72%">
                <PolarGrid stroke="#ffffff18" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#ffffff88", fontSize: 10, fontFamily: "Cairo" }} />
                <Radar dataKey="pct" stroke="#d9a83b" fill="#d9a83b" fillOpacity={0.35} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ background: "#0a1430", border: "1px solid #d9a83b44", borderRadius: 12, fontFamily: "Cairo", fontSize: 12 }}
                  formatter={(v: any) => [`${v}%`, "الإتقان"]}
                  labelFormatter={(_l, payload) => payload?.[0]?.payload?.full ?? ""}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
