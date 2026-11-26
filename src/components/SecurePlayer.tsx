import { useEffect, useRef, useState } from "react";
import { Play, Pause, Maximize, Settings, Gauge, Lock } from "lucide-react";
import { useStore } from "../lib/store";

const QUALITIES = ["1080p", "720p", "480p", "360p", "240p", "تلقائي"];
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * مشغل فيديو آمن (هيكل جاهز للربط مع Bunny/Cloudflare Stream):
 * - علامة مائية متحركة باسم الطالب ورقم عضويته
 * - منع قائمة الزر الأيمن وزر التنزيل
 * - اختيار الجودة وسرعة التشغيل
 * - حفظ آخر موضع مشاهدة محليًا
 */
export default function SecurePlayer({ lessonId, title, locked }: { lessonId: string; title: string; locked: boolean }) {
  const { user } = useStore();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(`imtiyaz_pos_${lessonId}`);
    return saved ? Number(saved) : 0;
  });
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState("تلقائي");
  const [menu, setMenu] = useState<"none" | "quality" | "speed">("none");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing && !locked) {
      timer.current = setInterval(() => {
        setProgress((p) => {
          const next = Math.min(100, p + 0.05 * speed);
          localStorage.setItem(`imtiyaz_pos_${lessonId}`, String(next));
          return next;
        });
      }, 100);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, lessonId, locked]);

  useEffect(() => {
    if (progress >= 100) setPlaying(false);
  }, [progress]);

  const fmt = (pct: number) => {
    const total = 24 * 60; // مدة افتراضية
    const cur = Math.floor((pct / 100) * total);
    return `${String(Math.floor(cur / 60)).padStart(2, "0")}:${String(cur % 60).padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#d9a83b33] shadow-2xl group select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* خلفية المشغل */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1430] via-[#0f1d42] to-[#050b1f]">
        <div className="absolute inset-0 opacity-[0.08] font-tajawal text-7xl font-black flex flex-wrap gap-10 p-8 content-center justify-center">
          {["∫", "π", "z=a+bi", "Σ", "f′(x)", "√", "∞", "θ"].map((s, i) => (
            <span key={i} className="text-[#eec65f]">{s}</span>
          ))}
        </div>
      </div>

      {/* العلامة المائية المتحركة */}
      {user && !locked && (
        <div className="watermark-float absolute z-20 pointer-events-none text-[13px] font-bold text-white/35 bg-black/25 px-3 py-1 rounded-lg">
          {user.name} · {user.memberId}
        </div>
      )}

      {locked ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/55 backdrop-blur-[6px]">
          <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center">
            <Lock className="w-7 h-7 text-[#eec65f]" />
          </div>
          <p className="font-bold text-lg">هذه المحاضرة خاصة بالمشتركين</p>
          <p className="text-white/55 text-sm">فعّل اشتراكك لمشاهدة المحتوى الكامل بجودة عالية</p>
        </div>
      ) : (
        <>
          {/* زر التشغيل المركزي */}
          {!playing && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full btn-gold flex items-center justify-center anim-pulse-ring">
                <Play className="w-9 h-9 -mr-1" fill="currentColor" />
              </div>
            </button>
          )}
          {playing && <button className="absolute inset-0 z-10" onClick={() => setPlaying(false)} />}

          {/* شريط الحالة أثناء التشغيل */}
          {playing && (
            <div className="absolute top-4 right-4 z-20 glass px-3 py-1.5 rounded-lg text-xs font-bold text-[#f6dd8e]">
              بث آمن · HLS · {quality}
            </div>
          )}

          {/* شريط التحكم */}
          <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/85 to-transparent px-4 pb-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={(e) => {
                setProgress(Number(e.target.value));
                localStorage.setItem(`imtiyaz_pos_${lessonId}`, e.target.value);
              }}
              className="w-full h-1.5 accent-[#d9a83b] cursor-pointer"
              dir="ltr"
            />
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => setPlaying(!playing)} className="text-white hover:text-[#eec65f] transition-colors">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <span className="text-xs text-white/70 tabular" dir="ltr">
                {fmt(progress)} / {fmt(100)}
              </span>
              <div className="flex-1" />

              {/* السرعة */}
              <div className="relative">
                <button
                  onClick={() => setMenu(menu === "speed" ? "none" : "speed")}
                  className="flex items-center gap-1 text-xs text-white/80 hover:text-[#eec65f] px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  <Gauge className="w-4 h-4" /> {speed}x
                </button>
                {menu === "speed" && (
                  <div className="absolute bottom-9 left-0 glass-strong rounded-xl overflow-hidden anim-pop">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSpeed(s); setMenu("none"); }}
                        className={`block w-full px-5 py-1.5 text-xs text-right hover:bg-white/10 ${s === speed ? "text-[#eec65f] font-bold" : "text-white/80"}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* الجودة */}
              <div className="relative">
                <button
                  onClick={() => setMenu(menu === "quality" ? "none" : "quality")}
                  className="flex items-center gap-1 text-xs text-white/80 hover:text-[#eec65f] px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" /> {quality}
                </button>
                {menu === "quality" && (
                  <div className="absolute bottom-9 left-0 glass-strong rounded-xl overflow-hidden anim-pop">
                    {QUALITIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => { setQuality(q); setMenu("none"); }}
                        className={`block w-full px-5 py-1.5 text-xs text-right hover:bg-white/10 ${q === quality ? "text-[#eec65f] font-bold" : "text-white/80"}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById(`player-${lessonId}`);
                  if (el?.requestFullscreen) el.requestFullscreen();
                }}
                className="text-white hover:text-[#eec65f] transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}

      <div className="absolute top-4 left-4 z-20 glass px-3 py-1 rounded-lg text-xs font-bold text-white/70">
        {title}
      </div>
    </div>
  );
}
